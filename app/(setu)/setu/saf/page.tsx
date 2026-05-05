import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { STATUS_CONFIG, COLOR_VARS } from '@/lib/setu/saf-types'
import type { SafApplication } from '@/lib/setu/saf-types'

function StatusBadge({ status }: { status: SafApplication['status'] }) {
  const cfg = STATUS_CONFIG[status]
  const col = COLOR_VARS[cfg.color]
  return (
    <span className="font-mono" style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '99px', backgroundColor: col.bg, color: col.text, border: `1px solid ${col.border}` }}>
      {cfg.label}
    </span>
  )
}

export default async function SafOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in?redirect=/setu/saf')

  const admin = createAdminClient()

  // Check for existing application
  const { data: apps } = await admin
    .from('saf_applications')
    .select('id, reference_number, status, amount_requested, submitted_at')
    .eq('user_id', user.id)
    .eq('institution', 'SETU')
    .order('created_at', { ascending: false })
    .limit(2)

  const draft = apps?.find(a => a.status === 'draft')
  const active = apps?.find(a => a.status !== 'draft')

  // If active application, redirect to tracking
  if (active) redirect(`/setu/saf/${active.reference_number}`)

  return (
    <div style={{ maxWidth: '640px' }}>
      <p className="font-mono uppercase" style={{ fontSize: '0.625rem', letterSpacing: '0.18em', color: 'var(--ink-3)', marginBottom: '0.75rem' }}>
        SETU · STUDENT ASSISTANCE FUND
      </p>
      <h1 className="font-display italic" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '0 0 0.5rem' }}>
        Student Assistance Fund
      </h1>
      <p className="font-sans" style={{ fontSize: 'var(--step-lead)', color: 'var(--ink-2)', lineHeight: 1.45, margin: '0 0 2rem' }}>
        Emergency financial support for SETU students facing major, unexpected hardship.
      </p>

      {/* Draft banner */}
      {draft && (
        <div style={{ backgroundColor: 'oklch(0.97 0.04 80)', border: '1px solid oklch(0.82 0.09 80)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <p className="font-sans" style={{ margin: 0, fontSize: '0.9375rem', color: 'oklch(0.40 0.12 60)' }}>
            You have a draft application saved.
          </p>
          <Link
            href="/setu/saf/apply"
            className="font-sans font-semibold"
            style={{ fontSize: '0.875rem', color: 'oklch(0.35 0.12 60)', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Continue →
          </Link>
        </div>
      )}

      {/* What it covers */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 className="font-sans font-semibold" style={{ fontSize: '1rem', color: 'var(--ink)', margin: '0 0 0.75rem', letterSpacing: '-0.01em' }}>
          What it covers
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { label: 'Covered', items: ['Rent / accommodation costs', 'Transport', 'Childcare', 'Books and course materials', 'Medical costs', 'Bereavement travel'] },
            { label: 'Not covered', items: ['Tuition fees', 'Registration fees', 'Examination fees'] },
          ].map(({ label, items }) => (
            <div key={label} style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', padding: '0.875rem', backgroundColor: 'var(--paper)' }}>
              <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', margin: '0 0 0.5rem' }}>{label}</p>
              <ul style={{ margin: 0, paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {items.map(i => <li key={i} className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', lineHeight: 1.4 }}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ marginBottom: '2rem' }}>
        <h2 className="font-sans font-semibold" style={{ fontSize: '1rem', color: 'var(--ink)', margin: '0 0 0.75rem', letterSpacing: '-0.01em' }}>
          Timeline and key dates
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { date: 'October', text: 'SAF opens — first-come-first-served', urgent: true },
            { date: 'Oct–Feb', text: 'Applications accepted (while funds last)' },
            { date: '27 February', text: 'Deadline for full-time students', urgent: true },
            { date: 'Mid-February', text: 'Deadline for part-time students', urgent: true },
            { date: '6–8 weeks', text: 'Typical processing time from submission' },
          ].map(({ date, text, urgent }) => (
            <div key={date} style={{ display: 'flex', gap: '0.875rem', alignItems: 'flex-start' }}>
              <span className="font-mono" style={{ fontSize: '0.75rem', color: urgent ? 'var(--accent)' : 'var(--ink-3)', minWidth: '5.5rem', flexShrink: 0, paddingTop: '0.125rem' }}>{date}</span>
              <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)' }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Typical awards */}
      <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', padding: '0.875rem 1rem', backgroundColor: 'var(--paper)', marginBottom: '2rem' }}>
        <p className="font-sans" style={{ margin: 0, fontSize: '0.875rem', color: 'var(--ink-2)' }}>
          Most awards are between <strong style={{ color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>€100</strong> and <strong style={{ color: 'var(--ink)', fontFamily: 'var(--font-mono)' }}>€2,000</strong>, assessed individually based on your circumstances and the remaining fund balance.
        </p>
      </div>

      {/* Apply CTA */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        <Link
          href="/setu/saf/apply"
          className="font-sans font-semibold"
          style={{
            fontSize: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--setu-primary)',
            color: 'oklch(0.97 0.01 245)',
            textDecoration: 'none',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Start your application →
        </Link>
      </div>

      {/* MABS */}
      <div style={{ border: '1px solid var(--setu-primary-border)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', backgroundColor: 'var(--setu-primary-light)' }}>
        <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--setu-primary)', margin: '0 0 0.25rem' }}>NEED IMMEDIATE HELP?</p>
        <p className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)', margin: '0 0 0.5rem' }}>
          MABS provides free, confidential money advice — no appointment needed.
        </p>
        <a href="tel:+35318072000" className="font-mono font-semibold" style={{ fontSize: '1rem', color: 'var(--setu-primary)', textDecoration: 'none' }}>
          0818 07 2050
        </a>
        <span className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', marginLeft: '0.5rem' }}>· mabs.ie</span>
      </div>
    </div>
  )
}
