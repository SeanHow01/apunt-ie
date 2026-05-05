'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { encryptIban } from './encryption'
import { sendApplicationConfirmed, sendInfoRequested, sendDecision } from './email'
import type { SafStatus, SafApplication } from './saf-types'

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return { supabase, user }
}

async function isStaff(userId: string): Promise<boolean> {
  const admin = createAdminClient()
  const { data } = await admin
    .from('saf_staff_users')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()
  return !!data
}

async function appendAudit(
  applicationId: string,
  actorId: string | null,
  actorType: 'student' | 'staff' | 'system',
  action: string,
  fromStatus?: string | null,
  toStatus?: string | null,
  metadata?: Record<string, unknown>
) {
  const admin = createAdminClient()
  await admin.from('saf_audit_log').insert({
    application_id: applicationId,
    actor_id: actorId,
    actor_type: actorType,
    action,
    from_status: fromStatus ?? null,
    to_status: toStatus ?? null,
    metadata: metadata ?? {},
  })
}

// ── Student actions ───────────────────────────────────────────────────────────

export async function submitApplication(formData: FormData): Promise<{ reference: string } | { error: string }> {
  const { supabase, user } = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }

  const reasonCategory = formData.get('reason_category') as string
  const circumstances = formData.get('circumstances') as string
  const amountStr = formData.get('amount_requested') as string
  const iban = formData.get('iban') as string
  const bankName = formData.get('bank_name') as string

  if (!reasonCategory || !circumstances || !amountStr) return { error: 'Missing required fields' }

  const amount = parseFloat(amountStr)
  if (isNaN(amount) || amount <= 0) return { error: 'Invalid amount' }

  // Encrypt IBAN
  let ibanEncrypted: string | null = null
  let ibanLastFour: string | null = null
  if (iban?.trim()) {
    try {
      const enc = await encryptIban(iban.trim())
      ibanEncrypted = enc.encrypted
      ibanLastFour = enc.lastFour
    } catch {
      return { error: 'Invalid IBAN format' }
    }
  }

  // Generate reference number via DB function
  const admin = createAdminClient()
  const { data: refData, error: refErr } = await admin.rpc('generate_saf_reference')
  if (refErr || !refData) return { error: 'Could not generate reference number' }
  const reference = refData as string

  // Parse income/expenses from form
  const monthlyIncome = {
    susi: parseFloat((formData.get('income_susi') as string) ?? '0') || 0,
    part_time: parseFloat((formData.get('income_part_time') as string) ?? '0') || 0,
    family: parseFloat((formData.get('income_family') as string) ?? '0') || 0,
    other: parseFloat((formData.get('income_other') as string) ?? '0') || 0,
  }
  const monthlyExpenses = {
    rent: parseFloat((formData.get('expense_rent') as string) ?? '0') || 0,
    food: parseFloat((formData.get('expense_food') as string) ?? '0') || 0,
    transport: parseFloat((formData.get('expense_transport') as string) ?? '0') || 0,
    childcare: parseFloat((formData.get('expense_childcare') as string) ?? '0') || 0,
    other: parseFloat((formData.get('expense_other') as string) ?? '0') || 0,
  }

  const { data: app, error: insertErr } = await admin
    .from('saf_applications')
    .insert({
      reference_number: reference,
      user_id: user.id,
      institution: 'SETU',
      campus: formData.get('campus') as string || null,
      course: formData.get('course') as string || null,
      year_of_study: formData.get('year_of_study') as string || null,
      study_type: (formData.get('study_type') as 'full_time' | 'part_time') || null,
      status: 'submitted',
      reason_category: reasonCategory,
      reason_other: formData.get('reason_other') as string || null,
      circumstances,
      amount_requested: amount,
      monthly_income: monthlyIncome,
      monthly_expenses: monthlyExpenses,
      iban_encrypted: ibanEncrypted,
      iban_last_four: ibanLastFour,
      bank_name: bankName || null,
      submitted_at: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (insertErr || !app) return { error: insertErr?.message ?? 'Failed to submit application' }

  await appendAudit(app.id, user.id, 'student', 'application_submitted', 'draft', 'submitted')

  // Send confirmation email (best-effort)
  const { data: profile } = await supabase.from('profiles').select('first_name').eq('id', user.id).single()
  void sendApplicationConfirmed(user.email!, { reference_number: reference, amount_requested: amount })
    .catch((e: unknown) => console.error('[email] sendApplicationConfirmed failed', e))

  console.log('[SAF] submitted', reference, 'for', profile?.first_name ?? user.email)
  return { reference }
}

export async function saveDraft(
  applicationId: string | null,
  data: Partial<SafApplication> & { userId: string }
): Promise<{ id: string } | { error: string }> {
  const admin = createAdminClient()
  const { userId, ...rest } = data

  if (applicationId) {
    const { error } = await admin
      .from('saf_applications')
      .update({ ...rest, status: 'draft' })
      .eq('id', applicationId)
      .eq('user_id', userId)
    if (error) return { error: error.message }
    return { id: applicationId }
  }

  // Generate reference for new draft
  const { data: ref } = await admin.rpc('generate_saf_reference')
  const { data: app, error } = await admin
    .from('saf_applications')
    .insert({ ...rest, user_id: userId, reference_number: ref as string, status: 'draft', institution: 'SETU' })
    .select('id')
    .single()

  if (error || !app) return { error: error?.message ?? 'Failed to save draft' }
  return { id: app.id }
}

export async function uploadDocument(
  applicationId: string,
  formData: FormData
): Promise<{ docId: string } | { error: string }> {
  const { supabase, user } = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }

  const file = formData.get('file') as File | null
  const docType = formData.get('document_type') as string

  if (!file) return { error: 'No file provided' }

  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
  if (!ALLOWED_TYPES.includes(file.type)) return { error: 'File type not allowed. PDF, JPG or PNG only.' }
  if (file.size > 10 * 1024 * 1024) return { error: 'File too large. Maximum 10 MB.' }

  const ext = file.name.split('.').pop() ?? 'bin'
  const filePath = `${user.id}/${applicationId}/${docType}/${Date.now()}.${ext}`

  const { error: uploadErr } = await supabase.storage
    .from('saf-documents')
    .upload(filePath, file, { contentType: file.type, upsert: false })

  if (uploadErr) return { error: uploadErr.message }

  const admin = createAdminClient()
  const { data: doc, error: insertErr } = await admin
    .from('saf_documents')
    .insert({
      application_id: applicationId,
      document_type: docType,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      scan_status: 'pending',
    })
    .select('id')
    .single()

  if (insertErr || !doc) return { error: insertErr?.message ?? 'Failed to record document' }

  // Kick off simulated scan (non-blocking)
  void simulateVirusScan(doc.id).catch((e: unknown) => console.error('[scan]', e))

  return { docId: doc.id }
}

export async function simulateVirusScan(docId: string): Promise<void> {
  await new Promise(r => setTimeout(r, 1500))
  const admin = createAdminClient()
  await admin
    .from('saf_documents')
    .update({ scan_status: 'clean', scan_completed_at: new Date().toISOString() })
    .eq('id', docId)
  console.log('[scan] document', docId, 'marked clean')
}

// ── Staff actions ─────────────────────────────────────────────────────────────

export async function updateStatus(
  applicationId: string,
  newStatus: SafStatus,
  note?: string,
  awardAmount?: number
): Promise<void | { error: string }> {
  const { user } = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }
  if (!(await isStaff(user.id))) return { error: 'Not authorised' }

  const admin = createAdminClient()
  const { data: app } = await admin
    .from('saf_applications')
    .select('status, user_id, reference_number, amount_requested')
    .eq('id', applicationId)
    .single()
  if (!app) return { error: 'Application not found' }

  const updates: Record<string, unknown> = { status: newStatus }
  if (newStatus === 'awaiting_info' && note) {
    updates.info_requested_at = new Date().toISOString()
    updates.info_requested_note = note
  }
  if (newStatus === 'approved' || newStatus === 'rejected') {
    updates.decided_at = new Date().toISOString()
    updates.decided_by = user.id
    if (newStatus === 'approved' && awardAmount != null) updates.amount_awarded = awardAmount
  }

  await admin.from('saf_applications').update(updates).eq('id', applicationId)
  await appendAudit(applicationId, user.id, 'staff', `status_changed_to_${newStatus}`, app.status, newStatus)

  // Get student email
  const { data: authUser } = await admin.auth.admin.getUserById(app.user_id)
  const studentEmail = authUser?.user?.email
  if (!studentEmail) return

  const appShape = {
    reference_number: app.reference_number,
    amount_requested: app.amount_requested,
    amount_awarded: newStatus === 'approved' ? (awardAmount ?? null) : null,
    status: newStatus,
    info_requested_note: note ?? null,
  } as SafApplication

  if (newStatus === 'awaiting_info') {
    void sendInfoRequested(studentEmail, appShape).catch((e: unknown) => console.error('[email]', e))
  } else if (newStatus === 'approved' || newStatus === 'rejected') {
    void sendDecision(studentEmail, appShape).catch((e: unknown) => console.error('[email]', e))
  }
}

export async function addStaffNote(applicationId: string, note: string): Promise<void | { error: string }> {
  const { user } = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }
  if (!(await isStaff(user.id))) return { error: 'Not authorised' }

  const admin = createAdminClient()
  await admin.from('saf_staff_notes').insert({ application_id: applicationId, staff_user_id: user.id, note })
}

export async function setAwardAmount(applicationId: string, amount: number): Promise<void | { error: string }> {
  const { user } = await getCurrentUser()
  if (!user) return { error: 'Not authenticated' }
  if (!(await isStaff(user.id))) return { error: 'Not authorised' }

  const admin = createAdminClient()
  await admin.from('saf_applications').update({ amount_awarded: amount }).eq('id', applicationId)
}

export async function exportCsv(institution: string): Promise<string> {
  const { user } = await getCurrentUser()
  if (!user || !(await isStaff(user.id))) return ''

  const admin = createAdminClient()
  const { data } = await admin
    .from('saf_applications')
    .select('reference_number, submitted_at, status, course, year_of_study, reason_category, amount_requested, amount_awarded, bank_name, iban_last_four, decided_at')
    .eq('institution', institution)
    .neq('status', 'draft')
    .order('submitted_at', { ascending: false })

  if (!data?.length) return 'No data'

  const header = 'Reference,Submitted,Status,Course,Year,Reason,Amount Requested,Amount Awarded,Bank,IBAN (masked),Decided'
  const rows = data.map(r =>
    [
      r.reference_number,
      r.submitted_at ? new Date(r.submitted_at).toLocaleDateString('en-IE') : '',
      r.status,
      r.course ?? '',
      r.year_of_study ?? '',
      r.reason_category ?? '',
      r.amount_requested ?? '',
      r.amount_awarded ?? '',
      r.bank_name ?? '',
      r.iban_last_four ? `IE**${r.iban_last_four}` : '',
      r.decided_at ? new Date(r.decided_at).toLocaleDateString('en-IE') : '',
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
  )

  return [header, ...rows].join('\n')
}
