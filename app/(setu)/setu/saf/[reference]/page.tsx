import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { STATUS_CONFIG, COLOR_VARS, REASON_LABELS } from '@/lib/setu/saf-types'
import type { SafApplication, SafDocument, SafAuditEntry } from '@/lib/setu/saf-types'
import SafInfoUpload from './SafInfoUpload'

const TIMELINE_STATUSES = ['submitted', 'submitted', 'under_review', 'approved'] as const

function StatusBadge({ status }: { status: SafApplication['status'] }) {
  const cfg = STATUS_CONFIG[status]
  const col = COLOR_VARS[cfg.color]
  return (
    <span className="font-mono" style={{ fontSize: '0.8125rem', padding: '4px 12px', borderRadius: '99px', backgroundColor: col.bg, color: col.text, border: `1px solid ${col.border}` }}>
      {cfg.label}
    </span>
  )
}

function ScanBadge({ status }: { status: SafDocument['scan_status'] }) {
  const map: Record<string, { label: string; color: string }> = {
    clean: { label: '✓ Verified', color: 'oklch(0.40 0.12 145)' },
    pending: { label: 'Pending', color: 'var(--ink-3)' },
    scanning: { label: 'Scanning…', color: 'var(--ink-3)' },
    rejected: { label: 'Rejected', color: 'var(--accent)' },
    error: { label: 'Error', color: 'var(--accent)' },
  }
  const s = map[status] ?? map.pending
  return <span className="font-mono" style={{ fontSize: '0.75rem', color: s.color }}>{s.label}</span>
}

export default async function SafTrackingPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/sign-in?redirect=/setu/saf/${reference}`)

  const admin = createAdminClient()

  // Fetch application — admin client, user_id enforced manually
  const { data: app } = await admin
    .from('saf_applications')
    .select('*')
    .eq('reference_number', reference)
    .eq('user_id', user.id)
    .single() as { data: SafApplication | null }

  if (!app) notFound()

  // Fetch documents and audit log
  const [{ data: docs }, { data: audit }] = await Promise.all([
    admin.from('saf_documents').select('*').eq('application_id', app.id).order('uploaded_at', { ascending: true }),
    admin.from('saf_audit_log').select('*').eq('application_id', app.id).order('created_at', { ascending: true }),
  ])

  const statusCfg = STATUS_CONFIG[app.status]
  const col = COLOR_VARS[statusCfg.color]

  const timelineSteps = [
    { label: 'Submitted', done: !!app.submitted_at },
    { label: 'Documents', done: (docs?.length ?? 0) > 0 },
    { label: 'Under review', done: ['under_review', 'awaiting_info', 'approved', 'rejected'].includes(app.status) },
    { label: 'Decision', done: ['approved', 'rejected'].includes(app.status) },
  ]

  return (
    <div style={{ maxWidth: '680px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <Link href="/setu/saf" className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)', textDecoration: 'none' }}>← Back to SAF</Link>
        <span className="font-mono" style={{ fontSize: '0.875rem', color: 'var(--ink-3)' }}>{app.reference_number}</span>
      </div>

      {/* Timeline */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.75rem', gap: '0' }}>
        {timelineSteps.map((ts, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < timelineSteps.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: ts.done ? 'var(--setu-primary)' : 'var(--paper)',
                border: `2px solid ${ts.done ? 'var(--setu-primary)' : 'var(--rule)'}`,
                color: ts.done ? 'oklch(0.97 0.01 245)' : 'var(--ink-3)',
                fontSize: '0.6875rem', fontWeight: 600,
              }}>
                {ts.done ? '✓' : '○'}
              </div>
              <span className="font-sans" style={{ fontSize: '0.625rem', color: ts.done ? 'var(--setu-primary)' : 'var(--ink-3)', whiteSpace: 'nowrap' }}>{ts.label}</span>
            </div>
            {i < timelineSteps.length - 1 && (
              <div style={{ flexGrow: 1, height: '2px', backgroundColor: ts.done ? 'var(--setu-primary)' : 'var(--rule)', margin: '0 0.25rem', marginBottom: '1rem' }} />
            )}
          </div>
        ))}
      </div>

      {/* Status card */}
      <div style={{ border: `1px solid ${col.border}`, borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: col.bg, marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <StatusBadge status={app.status} />
        </div>
        <p className="font-sans" style={{ margin: 0, fontSize: '0.9375rem', color: col.text, lineHeight: 1.5 }}>
          {statusCfg.description}
          {app.status === 'under_review' && ' The committee meets every 3–4 weeks. You\'ll be notified by email.'}
          {app.status === 'submitted' && ' Your application is in the queue for review.'}
          {app.status === 'approved' && app.amount_awarded && ` Payment of €${app.amount_awarded.toFixed(2)} will be made to the bank account provided within 5–10 working days.`}
        </p>
      </div>

      {/* Awaiting info */}
      {app.status === 'awaiting_info' && app.info_requested_note && (
        <div style={{ border: '1px solid oklch(0.82 0.09 80)', borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: 'oklch(0.97 0.04 80)', marginBottom: '1.75rem' }}>
          <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'oklch(0.40 0.12 60)', margin: '0 0 0.5rem' }}>INFORMATION REQUESTED</p>
          <p className="font-sans" style={{ fontSize: '0.9375rem', color: 'oklch(0.35 0.12 60)', lineHeight: 1.5, margin: '0 0 1rem' }}>{app.info_requested_note}</p>
          <SafInfoUpload applicationId={app.id} />
        </div>
      )}

      {/* Rejected */}
      {app.status === 'rejected' && (
        <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: 'var(--paper)', marginBottom: '1.75rem' }}>
          <p className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)', lineHeight: 1.5, margin: '0 0 0.75rem' }}>
            You may submit a new application with additional information, or contact Student Services to discuss an appeal.
          </p>
          <p className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)', lineHeight: 1.5, margin: 0 }}>
            MABS can also help you understand your options: <a href="tel:+35318072000" className="font-mono" style={{ color: 'var(--ink)', textDecoration: 'none' }}>0818 07 2050</a> or{' '}
            <a href="https://www.mabs.ie" style={{ color: 'var(--setu-accent)' }}>mabs.ie</a>
          </p>
        </div>
      )}

      {/* Application details */}
      <section style={{ marginBottom: '1.75rem' }}>
        <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', marginBottom: '0.75rem' }}>APPLICATION DETAILS</p>
        <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--paper)', overflow: 'hidden' }}>
          {[
            ['Reason', app.reason_category ? REASON_LABELS[app.reason_category] : '—'],
            ['Amount requested', app.amount_requested ? `€${app.amount_requested.toFixed(2)}` : '—'],
            ...(app.amount_awarded ? [['Amount awarded', `€${app.amount_awarded.toFixed(2)}`]] : []),
            ['Submitted', app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'],
            ['Campus', app.campus ?? '—'],
            ['Course', app.course ?? '—'],
          ].map(([k, v], i) => (
            <div key={k} style={{ display: 'flex', gap: '1rem', padding: '0.625rem 1rem', borderTop: i > 0 ? '1px solid var(--rule)' : 'none' }}>
              <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-3)', minWidth: '9rem', flexShrink: 0 }}>{k}</span>
              <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink)', fontFamily: k === 'Amount requested' || k === 'Amount awarded' ? 'var(--font-mono)' : undefined }}>{v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Documents */}
      {(docs?.length ?? 0) > 0 && (
        <section style={{ marginBottom: '1.75rem' }}>
          <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', marginBottom: '0.75rem' }}>
            DOCUMENTS UPLOADED ({docs!.length})
          </p>
          <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--paper)', overflow: 'hidden' }}>
            {(docs as SafDocument[]).map((doc, i) => (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.625rem 1rem', borderTop: i > 0 ? '1px solid var(--rule)' : 'none' }}>
                <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>{doc.file_name}</span>
                <ScanBadge status={doc.scan_status} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Audit timeline */}
      {(audit?.length ?? 0) > 0 && (
        <section style={{ marginBottom: '1.75rem' }}>
          <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', marginBottom: '0.75rem' }}>TIMELINE</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {(audit as SafAuditEntry[]).map(entry => (
              <div key={entry.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-3)', minWidth: '7rem', flexShrink: 0, paddingTop: '0.125rem' }}>
                  {new Date(entry.created_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)' }}>
                  {entry.action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Help */}
      <div style={{ border: '1px solid var(--setu-primary-border)', borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem', backgroundColor: 'var(--setu-primary-light)' }}>
        <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--setu-primary)', margin: '0 0 0.375rem' }}>NEED HELP?</p>
        <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>
          MABS: <a href="tel:+35318072000" className="font-mono" style={{ color: 'var(--setu-primary)', textDecoration: 'none' }}>0818 07 2050</a> · mabs.ie
          {' · '}Student Services: <a href="mailto:studentservices@setu.ie" style={{ color: 'var(--setu-accent)' }}>studentservices@setu.ie</a>
        </p>
      </div>
    </div>
  )
}
