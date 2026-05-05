import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { STATUS_CONFIG, COLOR_VARS, REASON_LABELS, DOCUMENT_TYPE_LABELS } from '@/lib/setu/saf-types'
import type { SafApplication, SafDocument, SafStaffNote, SafAuditEntry } from '@/lib/setu/saf-types'
import StaffActionsPanel from './StaffActionsPanel'

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid var(--rule)', alignItems: 'flex-start' }}>
      <span className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', minWidth: '10rem', flexShrink: 0 }}>{label}</span>
      <span className={mono ? 'font-mono' : 'font-sans'} style={{ fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.5 }}>{value}</span>
    </div>
  )
}

function AmountRow({ label, value }: { label: string; value: number | null }) {
  return <Row label={label} value={value != null ? `€${value.toFixed(2)}` : '—'} mono />
}

export default async function StaffApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const [{ data: appRaw }, { data: docs }, { data: notes }, { data: audit }] = await Promise.all([
    admin.from('saf_applications').select('*').eq('id', id).single(),
    admin.from('saf_documents').select('*').eq('application_id', id).order('uploaded_at'),
    admin.from('saf_staff_notes').select('*').eq('application_id', id).order('created_at', { ascending: false }),
    admin.from('saf_audit_log').select('*').eq('application_id', id).order('created_at', { ascending: true }),
  ])

  const app = appRaw as SafApplication | null
  if (!app) notFound()

  const statusCfg = STATUS_CONFIG[app.status]
  const col = COLOR_VARS[statusCfg.color]

  const income = (app.monthly_income ?? {}) as unknown as Record<string, number>
  const expenses = (app.monthly_expenses ?? {}) as unknown as Record<string, number>
  const totalIncome = Object.values(income).reduce((s, v) => s + (v || 0), 0)
  const totalExpenses = Object.values(expenses).reduce((s, v) => s + (v || 0), 0)
  const shortfall = totalExpenses - totalIncome

  // Get signed URLs for documents
  const docsWithUrls = await Promise.all(
    (docs as SafDocument[] ?? []).map(async doc => {
      const { data } = await admin.storage.from('saf-documents').createSignedUrl(doc.file_path, 3600)
      return { ...doc, signedUrl: data?.signedUrl ?? null }
    })
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link href="/setu/admin" className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)', textDecoration: 'none' }}>← All applications</Link>
        <span className="font-mono" style={{ fontSize: '0.875rem', color: 'var(--ink-3)' }}>{app.reference_number}</span>
        <span className="font-mono" style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: '99px', backgroundColor: col.bg, color: col.text, border: `1px solid ${col.border}` }}>
          {statusCfg.label}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 320px', gap: '1.5rem', alignItems: 'flex-start' }}>

        {/* Left — application data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Personal */}
          <section>
            <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', marginBottom: '0.5rem' }}>PERSONAL DETAILS</p>
            <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--paper)', padding: '0 1rem' }}>
              <Row label="Campus" value={app.campus ?? '—'} />
              <Row label="Course" value={app.course ?? '—'} />
              <Row label="Year" value={app.year_of_study ?? '—'} />
              <Row label="Study type" value={app.study_type === 'full_time' ? 'Full-time' : app.study_type === 'part_time' ? 'Part-time' : '—'} />
              <Row label="Submitted" value={app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'} />
            </div>
          </section>

          {/* Circumstances */}
          <section>
            <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', marginBottom: '0.5rem' }}>REASON & CIRCUMSTANCES</p>
            <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--paper)', padding: '0.875rem 1rem' }}>
              <p className="font-sans font-semibold" style={{ fontSize: '0.875rem', color: 'var(--ink)', margin: '0 0 0.625rem' }}>
                {app.reason_category ? REASON_LABELS[app.reason_category] : '—'}
              </p>
              <p className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.6, margin: 0 }}>
                {app.circumstances ?? '—'}
              </p>
            </div>
          </section>

          {/* Finances */}
          <section>
            <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', marginBottom: '0.5rem' }}>FINANCES</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--paper)', padding: '0 1rem' }}>
                <p className="font-mono uppercase" style={{ fontSize: '0.5rem', letterSpacing: '0.12em', color: 'var(--ink-3)', padding: '0.5rem 0', borderBottom: '1px solid var(--rule)', margin: 0 }}>MONTHLY INCOME</p>
                {Object.entries(income as Record<string, number>).map(([k, v]) => (
                  <Row key={k} label={k.replace(/_/g, ' ')} value={`€${(v || 0).toFixed(2)}`} mono />
                ))}
                <div style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', fontWeight: 700 }}>
                  <span className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', minWidth: '10rem' }}>Total</span>
                  <span className="font-mono" style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>€{totalIncome.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--paper)', padding: '0 1rem' }}>
                <p className="font-mono uppercase" style={{ fontSize: '0.5rem', letterSpacing: '0.12em', color: 'var(--ink-3)', padding: '0.5rem 0', borderBottom: '1px solid var(--rule)', margin: 0 }}>MONTHLY EXPENSES</p>
                {Object.entries(expenses as Record<string, number>).map(([k, v]) => (
                  <Row key={k} label={k.replace(/_/g, ' ')} value={`€${(v || 0).toFixed(2)}`} mono />
                ))}
                <div style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', fontWeight: 700 }}>
                  <span className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', minWidth: '10rem' }}>Total</span>
                  <span className="font-mono" style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>€{totalExpenses.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: shortfall > 0 ? 'oklch(0.97 0.04 20)' : 'var(--paper)', padding: '0.625rem 1rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)' }}>Monthly shortfall</span>
              <span className="font-mono font-semibold" style={{ fontSize: '0.9375rem', color: shortfall > 0 ? 'oklch(0.40 0.12 20)' : 'oklch(0.40 0.12 145)' }}>
                {shortfall > 0 ? '-' : '+'}€{Math.abs(shortfall).toFixed(2)}
              </span>
            </div>
          </section>

          {/* Payment */}
          <section>
            <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', marginBottom: '0.5rem' }}>PAYMENT DETAILS</p>
            <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--paper)', padding: '0 1rem' }}>
              <Row label="Bank" value={app.bank_name ?? '—'} />
              <Row label="IBAN" value={app.iban_last_four ? `IE**${app.iban_last_four}` : '—'} mono />
              <AmountRow label="Amount requested" value={app.amount_requested} />
              {app.amount_awarded != null && <AmountRow label="Amount awarded" value={app.amount_awarded} />}
            </div>
          </section>

          {/* Documents */}
          {docsWithUrls.length > 0 && (
            <section>
              <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', marginBottom: '0.5rem' }}>DOCUMENTS ({docsWithUrls.length})</p>
              <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--paper)', overflow: 'hidden' }}>
                {docsWithUrls.map((doc, i) => (
                  <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 1rem', borderTop: i > 0 ? '1px solid var(--rule)' : 'none', gap: '1rem' }}>
                    <div>
                      <p className="font-sans" style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ink)' }}>{doc.file_name}</p>
                      <p className="font-mono" style={{ margin: '0.125rem 0 0', fontSize: '0.6875rem', color: 'var(--ink-3)' }}>
                        {DOCUMENT_TYPE_LABELS[doc.document_type]} · {(doc.file_size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      <span className="font-mono" style={{ fontSize: '0.6875rem', color: doc.scan_status === 'clean' ? 'oklch(0.40 0.12 145)' : 'var(--ink-3)' }}>
                        {doc.scan_status === 'clean' ? '✓ Clean' : doc.scan_status}
                      </span>
                      {doc.signedUrl && (
                        <a href={doc.signedUrl} target="_blank" rel="noopener noreferrer" className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--setu-accent)', textDecoration: 'none' }}>
                          Download →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Audit log */}
          {(audit?.length ?? 0) > 0 && (
            <section>
              <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', marginBottom: '0.5rem' }}>AUDIT LOG</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                {(audit as SafAuditEntry[]).map(entry => (
                  <div key={entry.id} style={{ display: 'flex', gap: '1rem' }}>
                    <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-3)', minWidth: '8rem', flexShrink: 0 }}>
                      {new Date(entry.created_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)' }}>
                      {entry.action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                      {entry.to_status && ` → ${STATUS_CONFIG[entry.to_status as SafApplication['status']]?.label ?? entry.to_status}`}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right — staff actions */}
        <div style={{ position: 'sticky', top: '1rem' }}>
          <StaffActionsPanel
            applicationId={app.id}
            currentStatus={app.status}
            notes={notes as SafStaffNote[] ?? []}
          />
        </div>
      </div>
    </div>
  )
}
