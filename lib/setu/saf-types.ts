export type SafStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'awaiting_info'
  | 'approved'
  | 'rejected'

export type SafReason =
  | 'loss_of_employment'
  | 'bereavement'
  | 'illness'
  | 'accommodation_costs'
  | 'family_income_drop'
  | 'course_costs'
  | 'lone_parent'
  | 'other'

export type DocumentType =
  | 'bank_statement'
  | 'susi_letter'
  | 'evidence_of_difficulty'
  | 'receipt_invoice'
  | 'other'

export type ScanStatus = 'pending' | 'scanning' | 'clean' | 'rejected' | 'error'

export interface MonthlyIncome {
  susi: number
  part_time: number
  family: number
  other: number
}

export interface MonthlyExpenses {
  rent: number
  food: number
  transport: number
  childcare: number
  other: number
}

export interface SafApplication {
  id: string
  reference_number: string
  user_id: string
  institution: string
  campus: string | null
  course: string | null
  year_of_study: string | null
  study_type: 'full_time' | 'part_time' | null
  status: SafStatus
  reason_category: SafReason | null
  reason_other: string | null
  circumstances: string | null
  amount_requested: number | null
  amount_awarded: number | null
  monthly_income: MonthlyIncome
  monthly_expenses: MonthlyExpenses
  iban_last_four: string | null
  bank_name: string | null
  submitted_at: string | null
  decided_at: string | null
  info_requested_at: string | null
  info_requested_note: string | null
  created_at: string
  updated_at: string
}

export interface SafDocument {
  id: string
  application_id: string
  document_type: DocumentType
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  scan_status: ScanStatus
  scan_completed_at: string | null
  uploaded_at: string
}

export interface SafStaffNote {
  id: string
  application_id: string
  staff_user_id: string
  note: string
  created_at: string
}

export interface SafAuditEntry {
  id: string
  application_id: string
  actor_type: 'student' | 'staff' | 'system'
  action: string
  from_status: string | null
  to_status: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface StaffUser {
  id: string
  user_id: string
  institution: string
  role: 'committee' | 'admin'
  display_name: string
}

export const STATUS_CONFIG: Record<SafStatus, {
  label: string
  description: string
  color: 'neutral' | 'info' | 'warning' | 'success' | 'danger'
}> = {
  draft:        { label: 'Draft',               description: 'Not yet submitted',                                        color: 'neutral' },
  submitted:    { label: 'Submitted',            description: 'Awaiting review',                                          color: 'info'    },
  under_review: { label: 'Under review',         description: 'Being assessed by the committee',                          color: 'warning' },
  awaiting_info:{ label: 'Information needed',   description: 'Committee has requested additional information',            color: 'warning' },
  approved:     { label: 'Approved',             description: 'Your application has been approved',                       color: 'success' },
  rejected:     { label: 'Unsuccessful',         description: 'Your application was unsuccessful',                        color: 'danger'  },
}

export const COLOR_VARS: Record<'neutral' | 'info' | 'warning' | 'success' | 'danger', { bg: string; text: string; border: string }> = {
  neutral: { bg: 'oklch(0.96 0 0)',       text: 'var(--ink-2)',  border: 'var(--rule)' },
  info:    { bg: 'oklch(0.94 0.04 245)',  text: 'oklch(0.35 0.10 245)', border: 'oklch(0.80 0.07 245)' },
  warning: { bg: 'oklch(0.97 0.04 80)',   text: 'oklch(0.40 0.12 60)',  border: 'oklch(0.82 0.09 80)'  },
  success: { bg: 'oklch(0.95 0.06 145)',  text: 'oklch(0.35 0.12 145)', border: 'oklch(0.78 0.10 145)' },
  danger:  { bg: 'oklch(0.97 0.04 20)',   text: 'oklch(0.40 0.12 20)',  border: 'oklch(0.82 0.09 20)'  },
}

export const REASON_LABELS: Record<SafReason, string> = {
  loss_of_employment:  'Loss of part-time employment',
  bereavement:         'Bereavement of a family member',
  illness:             'Illness (self or family member)',
  accommodation_costs: 'Unexpected accommodation costs',
  family_income_drop:  'Drop in household income',
  course_costs:        'Unexpected essential course costs',
  lone_parent:         'Single parent / lone carer costs',
  other:               'Other',
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  bank_statement:          'Bank statements — all accounts, last 3 months',
  susi_letter:             'SUSI Award Letter',
  evidence_of_difficulty:  'Evidence of financial difficulty',
  receipt_invoice:         'Receipts or invoices',
  other:                   'Other document',
}
