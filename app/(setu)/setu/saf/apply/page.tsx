'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { REASON_LABELS, DOCUMENT_TYPE_LABELS } from '@/lib/setu/saf-types'
import type { SafReason, DocumentType } from '@/lib/setu/saf-types'
import { submitApplication, uploadDocument } from '@/lib/setu/saf-actions'

// ── Helpers ───────────────────────────────────────────────────────────────────

const STEPS = ['Eligibility', 'Your situation', 'Finances', 'Documents', 'Declaration']
const REQUIRED_DOCS: { type: DocumentType; label: string; required: boolean }[] = [
  { type: 'bank_statement', label: 'Bank statements — all accounts, last 3 months', required: true },
  { type: 'susi_letter', label: 'SUSI Award Letter', required: true },
  { type: 'evidence_of_difficulty', label: 'Evidence of financial difficulty', required: true },
  { type: 'receipt_invoice', label: 'Receipts or invoices (if applicable)', required: false },
]

function fieldStyle(error?: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '0.5rem 0.75rem',
    border: `1px solid ${error ? 'var(--accent)' : 'var(--rule)'}`,
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--paper)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9375rem',
    outline: 'none',
  }
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="font-sans" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)', display: 'block', marginBottom: '0.375rem' }}>
      {children}{required && <span style={{ color: 'var(--accent)', marginLeft: '2px' }}>*</span>}
    </label>
  )
}

function Field({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '1.25rem' }}>{children}</div>
}

function StepBar({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '0' }}>
      {STEPS.map((label, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: i < current ? 'var(--setu-primary)' : i === current ? 'var(--setu-primary)' : 'var(--paper)',
              border: `2px solid ${i <= current ? 'var(--setu-primary)' : 'var(--rule)'}`,
              color: i <= current ? 'oklch(0.97 0.01 245)' : 'var(--ink-3)',
              fontSize: '0.75rem', fontWeight: 600, fontFamily: 'var(--font-mono)',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className="font-sans" style={{ fontSize: '0.625rem', color: i === current ? 'var(--setu-primary)' : 'var(--ink-3)', whiteSpace: 'nowrap', display: 'none' }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ flexGrow: 1, height: '2px', backgroundColor: i < current ? 'var(--setu-primary)' : 'var(--rule)', margin: '0 0.25rem', marginBottom: '1rem' }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Step components ───────────────────────────────────────────────────────────

function Step1({ onNext }: { onNext: () => void }) {
  const [checks, setChecks] = useState([false, false, false, false])
  const allChecked = checks.every(Boolean)

  return (
    <div>
      <h2 className="font-display italic" style={{ fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '0 0 0.5rem' }}>
        Eligibility check
      </h2>
      <p className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
        Before applying, confirm all of the following apply to you.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          'I am a current SETU student enrolled in a QQI-accredited programme.',
          'I am experiencing financial hardship due to a major, unexpected change in my circumstances.',
          'I understand the SAF does not cover tuition fees, registration fees, or examination fees.',
          'I agree to provide accurate information and supporting documents. Misrepresentation may result in repayment.',
        ].map((text, i) => (
          <label key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={checks[i]}
              onChange={e => setChecks(prev => { const n = [...prev]; n[i] = e.target.checked; return n })}
              style={{ marginTop: '2px', accentColor: 'var(--setu-primary)', width: '16px', height: '16px', flexShrink: 0 }}
            />
            <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.5 }}>{text}</span>
          </label>
        ))}
      </div>

      {/* MABS card */}
      <div style={{ border: '1px solid var(--setu-primary-border)', borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem', backgroundColor: 'var(--setu-primary-light)', marginBottom: '1.5rem' }}>
        <p className="font-sans" style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
          Need help before applying? MABS offers free, confidential money advice:{' '}
          <a href="tel:+35318072000" className="font-mono font-semibold" style={{ color: 'var(--setu-primary)', textDecoration: 'none' }}>0818 07 2050</a>
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={!allChecked}
        className="font-sans font-semibold"
        style={{
          padding: '0.75rem 1.5rem', fontSize: '1rem',
          backgroundColor: allChecked ? 'var(--setu-primary)' : 'var(--rule)',
          color: allChecked ? 'oklch(0.97 0.01 245)' : 'var(--ink-3)',
          border: 'none', borderRadius: 'var(--radius-md)', cursor: allChecked ? 'pointer' : 'not-allowed',
        }}
      >
        Continue →
      </button>
    </div>
  )
}

type FormData2 = {
  campus: string; course: string; yearOfStudy: string; studyType: string
  reasonCategory: SafReason | ''; reasonOther: string; circumstances: string; amountRequested: string
}

function Step2({ data, onChange, onNext, onBack }: { data: FormData2; onChange: (d: Partial<FormData2>) => void; onNext: () => void; onBack: () => void }) {
  const canContinue = !!data.reasonCategory && data.circumstances.length >= 50 && !!data.amountRequested

  return (
    <div>
      <h2 className="font-display italic" style={{ fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '0 0 1.5rem' }}>Your situation</h2>

      <Field>
        <Label>SETU campus</Label>
        <select value={data.campus} onChange={e => onChange({ campus: e.target.value })} style={fieldStyle()}>
          <option value="">Select campus</option>
          {['Waterford — Main', 'Waterford — Carrickmines', 'Carlow', 'Wexford', 'Kilkenny'].map(c => <option key={c}>{c}</option>)}
        </select>
      </Field>

      <Field>
        <Label>Course</Label>
        <input type="text" value={data.course} onChange={e => onChange({ course: e.target.value })} placeholder="e.g. BSc Business" style={fieldStyle()} />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field>
          <Label>Year of study</Label>
          <select value={data.yearOfStudy} onChange={e => onChange({ yearOfStudy: e.target.value })} style={fieldStyle()}>
            <option value="">Select year</option>
            {['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'].map(y => <option key={y}>{y}</option>)}
          </select>
        </Field>
        <Field>
          <Label>Study type</Label>
          <select value={data.studyType} onChange={e => onChange({ studyType: e.target.value })} style={fieldStyle()}>
            <option value="">Select</option>
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
          </select>
        </Field>
      </div>

      <Field>
        <Label required>Reason for applying</Label>
        <select value={data.reasonCategory} onChange={e => onChange({ reasonCategory: e.target.value as SafReason })} style={fieldStyle()}>
          <option value="">Select reason</option>
          {Object.entries(REASON_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </Field>

      {data.reasonCategory === 'other' && (
        <Field>
          <Label required>Please describe your reason</Label>
          <input type="text" value={data.reasonOther} onChange={e => onChange({ reasonOther: e.target.value })} style={fieldStyle()} />
        </Field>
      )}

      <Field>
        <Label required>Describe your circumstances</Label>
        <textarea
          value={data.circumstances}
          onChange={e => onChange({ circumstances: e.target.value })}
          rows={6}
          placeholder="Please describe the circumstances that have led to your financial difficulty. Be as specific as possible — include dates, amounts, and what happened. Aim for at least a paragraph."
          style={{ ...fieldStyle(), resize: 'vertical', lineHeight: 1.5 }}
        />
        <span className="font-sans" style={{ fontSize: '0.75rem', color: data.circumstances.length >= 50 ? 'oklch(0.40 0.12 145)' : 'var(--ink-3)', marginTop: '0.25rem' }}>
          {data.circumstances.length} characters {data.circumstances.length < 50 ? `(minimum 50)` : '✓'}
        </span>
      </Field>

      <Field>
        <Label required>Amount requested (€)</Label>
        <input
          type="number"
          min="50"
          max="5000"
          value={data.amountRequested}
          onChange={e => onChange({ amountRequested: e.target.value })}
          style={{ ...fieldStyle(), fontFamily: 'var(--font-mono)' }}
          placeholder="0.00"
        />
      </Field>

      <div style={{ border: '1px solid oklch(0.82 0.09 20)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', backgroundColor: 'oklch(0.97 0.04 20)', marginBottom: '1.5rem' }}>
        <p className="font-sans" style={{ margin: 0, fontSize: '0.8125rem', color: 'oklch(0.40 0.12 20)', lineHeight: 1.5 }}>
          <strong>Not covered:</strong> tuition fees, registration fees, examination fees.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={onBack} className="font-sans" style={{ padding: '0.625rem 1.25rem', fontSize: '0.9375rem', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'transparent', color: 'var(--ink-2)', cursor: 'pointer' }}>← Back</button>
        <button onClick={onNext} disabled={!canContinue} className="font-sans font-semibold" style={{ padding: '0.625rem 1.25rem', fontSize: '0.9375rem', backgroundColor: canContinue ? 'var(--setu-primary)' : 'var(--rule)', color: canContinue ? 'oklch(0.97 0.01 245)' : 'var(--ink-3)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: canContinue ? 'pointer' : 'not-allowed' }}>Continue →</button>
      </div>
    </div>
  )
}

type FormData3 = {
  susi: string; partTime: string; family: string; incomeOther: string
  rent: string; food: string; transport: string; childcare: string; expenseOther: string
}

function Step3({ data, onChange, onNext, onBack }: { data: FormData3; onChange: (d: Partial<FormData3>) => void; onNext: () => void; onBack: () => void }) {
  const income = (parseFloat(data.susi) || 0) + (parseFloat(data.partTime) || 0) + (parseFloat(data.family) || 0) + (parseFloat(data.incomeOther) || 0)
  const expenses = (parseFloat(data.rent) || 0) + (parseFloat(data.food) || 0) + (parseFloat(data.transport) || 0) + (parseFloat(data.childcare) || 0) + (parseFloat(data.expenseOther) || 0)
  const shortfall = expenses - income

  const monoInput = (name: keyof FormData3, placeholder = '0') => (
    <input type="number" min="0" value={data[name]} onChange={e => onChange({ [name]: e.target.value })} placeholder={placeholder} style={{ ...fieldStyle(), fontFamily: 'var(--font-mono)', textAlign: 'right' }} />
  )

  return (
    <div>
      <h2 className="font-display italic" style={{ fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '0 0 1.5rem' }}>Your finances</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div>
          <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', marginBottom: '0.875rem' }}>MONTHLY INCOME</p>
          <Field><Label>SUSI grant</Label>{monoInput('susi', '508')}</Field>
          <Field><Label>Part-time employment</Label>{monoInput('partTime')}</Field>
          <Field><Label>Family support</Label>{monoInput('family')}</Field>
          <Field><Label>Other income</Label>{monoInput('incomeOther')}</Field>
        </div>
        <div>
          <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', marginBottom: '0.875rem' }}>MONTHLY EXPENSES</p>
          <Field><Label>Rent / accommodation</Label>{monoInput('rent', '650')}</Field>
          <Field><Label>Food and groceries</Label>{monoInput('food', '180')}</Field>
          <Field><Label>Transport</Label>{monoInput('transport')}</Field>
          <Field><Label>Childcare</Label>{monoInput('childcare')}</Field>
          <Field><Label>Other essential costs</Label>{monoInput('expenseOther')}</Field>
        </div>
      </div>

      {/* Shortfall summary */}
      <div style={{ border: `1px solid ${shortfall > 0 ? 'oklch(0.82 0.09 20)' : 'var(--rule)'}`, borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem', backgroundColor: shortfall > 0 ? 'oklch(0.97 0.04 20)' : 'var(--paper)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)' }}>Monthly shortfall</span>
        <span className="font-mono font-semibold" style={{ fontSize: '1.125rem', color: shortfall > 0 ? 'oklch(0.40 0.12 20)' : 'oklch(0.40 0.12 145)' }}>
          {shortfall > 0 ? '-' : '+'}€{Math.abs(shortfall).toFixed(2)}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={onBack} className="font-sans" style={{ padding: '0.625rem 1.25rem', fontSize: '0.9375rem', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'transparent', color: 'var(--ink-2)', cursor: 'pointer' }}>← Back</button>
        <button onClick={onNext} className="font-sans font-semibold" style={{ padding: '0.625rem 1.25rem', fontSize: '0.9375rem', backgroundColor: 'var(--setu-primary)', color: 'oklch(0.97 0.01 245)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Continue →</button>
      </div>
    </div>
  )
}

type UploadState = { status: 'idle' | 'uploading' | 'scanning' | 'done' | 'error'; fileName?: string; error?: string }

function Step4({ applicationId, uploads, onUploaded, onBack, onNext, iban, onIbanChange, bankName, onBankNameChange }: {
  applicationId: string | null
  uploads: Record<DocumentType, UploadState>
  onUploaded: (type: DocumentType, state: UploadState) => void
  onBack: () => void
  onNext: () => void
  iban: string
  onIbanChange: (v: string) => void
  bankName: string
  onBankNameChange: (v: string) => void
}) {
  const ibanValid = !iban || /^IE\d{2}[A-Z0-9]{18}$/.test(iban.replace(/\s/g, ''))

  async function handleFile(type: DocumentType, file: File) {
    onUploaded(type, { status: 'uploading', fileName: file.name })
    const fd = new FormData()
    fd.append('file', file)
    fd.append('document_type', type)
    // Use a placeholder app id if we don't have one yet
    const appId = applicationId ?? 'pending'
    fd.append('application_id', appId)
    try {
      const result = await uploadDocument(appId, fd)
      if ('error' in result) {
        onUploaded(type, { status: 'error', fileName: file.name, error: result.error })
      } else {
        onUploaded(type, { status: 'scanning', fileName: file.name })
        setTimeout(() => onUploaded(type, { status: 'done', fileName: file.name }), 1600)
      }
    } catch {
      onUploaded(type, { status: 'error', fileName: file.name, error: 'Upload failed' })
    }
  }

  const requiredDone = REQUIRED_DOCS.filter(d => d.required).every(d => uploads[d.type]?.status === 'done')
  const canContinue = requiredDone && !!iban && ibanValid && !!bankName

  return (
    <div>
      <h2 className="font-display italic" style={{ fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '0 0 1.5rem' }}>Documents</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
        {REQUIRED_DOCS.map(({ type, label, required }) => {
          const state = uploads[type] ?? { status: 'idle' }
          return (
            <div key={type} style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem', backgroundColor: 'var(--paper)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div>
                  <p className="font-sans font-semibold" style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ink)' }}>
                    {label}{required && <span style={{ color: 'var(--accent)', marginLeft: '2px' }}>*</span>}
                  </p>
                  {state.fileName && (
                    <p className="font-mono" style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--ink-3)' }}>{state.fileName}</p>
                  )}
                  {state.status === 'error' && (
                    <p className="font-sans" style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--accent)' }}>{state.error}</p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  {state.status === 'done' && <span style={{ fontSize: '0.8125rem', color: 'oklch(0.40 0.12 145)' }}>✓ Verified</span>}
                  {state.status === 'scanning' && <span className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-3)' }}>Scanning…</span>}
                  {state.status === 'uploading' && <span className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-3)' }}>Uploading…</span>}
                  {(state.status === 'idle' || state.status === 'error') && (
                    <label className="font-sans font-semibold" style={{ fontSize: '0.8125rem', color: 'var(--setu-accent)', cursor: 'pointer', border: '1px solid var(--setu-primary-border)', borderRadius: 'var(--radius-sm)', padding: '0.25rem 0.625rem' }}>
                      Browse
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(type, f) }} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Bank details */}
      <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', marginBottom: '0.875rem' }}>BANK DETAILS FOR PAYMENT</p>
      <Field>
        <Label required>IBAN</Label>
        <input
          type="text"
          value={iban}
          onChange={e => onIbanChange(e.target.value.toUpperCase())}
          placeholder="IE29 AIBK 9311 5212 3456 78"
          style={{ ...fieldStyle(!ibanValid && iban.length > 0), fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}
        />
        {!ibanValid && iban.length > 0 && <span className="font-sans" style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.25rem' }}>Enter a valid Irish IBAN (IE + 2 digits + 18 characters)</span>}
      </Field>
      <Field>
        <Label required>Bank name</Label>
        <input type="text" value={bankName} onChange={e => onBankNameChange(e.target.value)} placeholder="e.g. AIB, Bank of Ireland, Revolut" style={fieldStyle()} />
      </Field>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={onBack} className="font-sans" style={{ padding: '0.625rem 1.25rem', fontSize: '0.9375rem', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'transparent', color: 'var(--ink-2)', cursor: 'pointer' }}>← Back</button>
        <button onClick={onNext} disabled={!canContinue} className="font-sans font-semibold" style={{ padding: '0.625rem 1.25rem', fontSize: '0.9375rem', backgroundColor: canContinue ? 'var(--setu-primary)' : 'var(--rule)', color: canContinue ? 'oklch(0.97 0.01 245)' : 'var(--ink-3)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: canContinue ? 'pointer' : 'not-allowed' }}>Continue →</button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function SafApplyPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [consents, setConsents] = useState([false, false, false])
  const [applicationId] = useState<string | null>(null)
  const [uploads, setUploads] = useState<Record<DocumentType, UploadState>>({} as Record<DocumentType, UploadState>)
  const [iban, setIban] = useState('')
  const [bankName, setBankName] = useState('')

  const [form2, setForm2] = useState<FormData2>({
    campus: '', course: '', yearOfStudy: '', studyType: '',
    reasonCategory: '', reasonOther: '', circumstances: '', amountRequested: '',
  })
  const [form3, setForm3] = useState<FormData3>({
    susi: '', partTime: '', family: '', incomeOther: '',
    rent: '', food: '', transport: '', childcare: '', expenseOther: '',
  })

  const updateUploads = useCallback((type: DocumentType, state: UploadState) => {
    setUploads(prev => ({ ...prev, [type]: state }))
  }, [])

  async function handleSubmit() {
    if (!consents.every(Boolean)) return
    setSubmitting(true)
    setSubmitError('')

    const fd = new FormData()
    fd.append('campus', form2.campus)
    fd.append('course', form2.course)
    fd.append('year_of_study', form2.yearOfStudy)
    fd.append('study_type', form2.studyType)
    fd.append('reason_category', form2.reasonCategory)
    fd.append('reason_other', form2.reasonOther)
    fd.append('circumstances', form2.circumstances)
    fd.append('amount_requested', form2.amountRequested)
    fd.append('income_susi', form3.susi)
    fd.append('income_part_time', form3.partTime)
    fd.append('income_family', form3.family)
    fd.append('income_other', form3.incomeOther)
    fd.append('expense_rent', form3.rent)
    fd.append('expense_food', form3.food)
    fd.append('expense_transport', form3.transport)
    fd.append('expense_childcare', form3.childcare)
    fd.append('expense_other', form3.expenseOther)
    fd.append('iban', iban)
    fd.append('bank_name', bankName)

    const result = await submitApplication(fd)
    if ('error' in result) {
      setSubmitError(result.error)
      setSubmitting(false)
    } else {
      router.push(`/setu/saf/${result.reference}`)
    }
  }

  const docCount = Object.values(uploads).filter(u => u?.status === 'done').length

  return (
    <div style={{ maxWidth: '640px' }}>
      <p className="font-mono uppercase" style={{ fontSize: '0.625rem', letterSpacing: '0.18em', color: 'var(--ink-3)', marginBottom: '0.75rem' }}>
        SETU · STUDENT ASSISTANCE FUND · APPLY
      </p>
      <h1 className="font-display italic" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '0 0 1.5rem' }}>
        New application
      </h1>

      <StepBar current={step} />

      {step === 0 && <Step1 onNext={() => setStep(1)} />}

      {step === 1 && (
        <Step2
          data={form2}
          onChange={d => setForm2(p => ({ ...p, ...d }))}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
        />
      )}

      {step === 2 && (
        <Step3
          data={form3}
          onChange={d => setForm3(p => ({ ...p, ...d }))}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <Step4
          applicationId={applicationId}
          uploads={uploads}
          onUploaded={updateUploads}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
          iban={iban}
          onIbanChange={setIban}
          bankName={bankName}
          onBankNameChange={setBankName}
        />
      )}

      {step === 4 && (
        <div>
          <h2 className="font-display italic" style={{ fontSize: '1.5rem', color: 'var(--ink)', letterSpacing: '-0.02em', margin: '0 0 1.5rem' }}>Declaration and submit</h2>

          {/* Summary */}
          <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', padding: '1rem 1.25rem', backgroundColor: 'var(--paper)', marginBottom: '1.5rem' }}>
            <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', marginBottom: '0.5rem' }}>APPLICATION SUMMARY</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {[
                ['Amount requested', `€${parseFloat(form2.amountRequested || '0').toFixed(2)}`],
                ['Reason', form2.reasonCategory ? REASON_LABELS[form2.reasonCategory as SafReason] : '—'],
                ['Documents uploaded', `${docCount} file${docCount !== 1 ? 's' : ''}`],
                ['Bank', bankName || '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)' }}>{k}</span>
                  <span className="font-mono" style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Consents */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              'I declare that the information provided in this application is true and accurate to the best of my knowledge.',
              'I consent to SETU Student Services verifying the information provided with relevant parties.',
              'I understand that providing false information may result in repayment of any award granted.',
            ].map((text, i) => (
              <label key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={consents[i]}
                  onChange={e => setConsents(p => { const n = [...p]; n[i] = e.target.checked; return n })}
                  style={{ marginTop: '2px', accentColor: 'var(--setu-primary)', width: '16px', height: '16px', flexShrink: 0 }}
                />
                <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.5 }}>{text}</span>
              </label>
            ))}
          </div>

          {submitError && (
            <div style={{ border: '1px solid oklch(0.82 0.09 20)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', backgroundColor: 'oklch(0.97 0.04 20)', marginBottom: '1rem' }}>
              <p className="font-sans" style={{ margin: 0, fontSize: '0.875rem', color: 'oklch(0.40 0.12 20)' }}>{submitError}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setStep(3)} className="font-sans" style={{ padding: '0.625rem 1.25rem', fontSize: '0.9375rem', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'transparent', color: 'var(--ink-2)', cursor: 'pointer' }}>← Back</button>
            <button
              onClick={handleSubmit}
              disabled={!consents.every(Boolean) || submitting}
              className="font-sans font-semibold"
              style={{
                padding: '0.75rem 1.5rem', fontSize: '1rem',
                backgroundColor: consents.every(Boolean) && !submitting ? 'var(--setu-primary)' : 'var(--rule)',
                color: consents.every(Boolean) && !submitting ? 'oklch(0.97 0.01 245)' : 'var(--ink-3)',
                border: 'none', borderRadius: 'var(--radius-md)', cursor: consents.every(Boolean) && !submitting ? 'pointer' : 'not-allowed',
              }}
            >
              {submitting ? 'Submitting…' : 'Submit application →'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
