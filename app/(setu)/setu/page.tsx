import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { modules } from '@/content/modules/index'
import { STATUS_CONFIG, COLOR_VARS } from '@/lib/setu/saf-types'
import type { SafApplication } from '@/lib/setu/saf-types'

const RECOMMENDED_MODULE_IDS = ['payslip', 'loans', 'rent']

function FundCard({
  title, description, badge, primaryHref, primaryLabel, secondaryHref, secondaryLabel, tag,
}: {
  title: string
  description: string
  badge?: React.ReactNode
  primaryHref: string
  primaryLabel: string
  secondaryHref?: string
  secondaryLabel?: string
  tag?: string
}) {
  return (
    <div
      style={{
        border: '1px solid var(--rule)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: 'var(--paper)',
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.625rem',
      }}
    >
      {tag && (
        <span
          className="font-mono uppercase"
          style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)' }}
        >
          {tag}
        </span>
      )}
      <p className="font-display" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', margin: 0 }}>
        {title}
      </p>
      {badge}
      <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', lineHeight: 1.5, margin: 0, flexGrow: 1 }}>
        {description}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
        <Link
          href={primaryHref}
          className="font-sans font-semibold"
          style={{
            fontSize: '0.8125rem',
            color: 'var(--setu-accent)',
            textDecoration: 'none',
            border: '1px solid var(--setu-primary-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.375rem 0.75rem',
          }}
        >
          {primaryLabel}
        </Link>
        {secondaryHref && secondaryLabel && (
          <Link
            href={secondaryHref}
            className="font-sans"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--ink-2)',
              textDecoration: 'none',
              border: '1px solid var(--rule)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.375rem 0.75rem',
            }}
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: SafApplication['status'] }) {
  const cfg = STATUS_CONFIG[status]
  const col = COLOR_VARS[cfg.color]
  return (
    <span
      className="font-mono"
      style={{
        fontSize: '0.6875rem',
        letterSpacing: '0.06em',
        padding: '2px 8px',
        borderRadius: '99px',
        backgroundColor: col.bg,
        color: col.text,
        border: `1px solid ${col.border}`,
        alignSelf: 'flex-start',
      }}
    >
      {cfg.label}
    </span>
  )
}

export default async function SetuHubPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in?redirect=/setu')

  const admin = createAdminClient()
  const [{ data: profile }, { data: progressRows }, { data: safApps }] = await Promise.all([
    supabase.from('profiles').select('first_name, institution_name').eq('id', user.id).single(),
    supabase.from('user_progress').select('module_id, completed').eq('user_id', user.id),
    admin.from('saf_applications')
      .select('id, reference_number, status, amount_requested, submitted_at')
      .eq('user_id', user.id)
      .eq('institution', 'SETU')
      .neq('status', 'draft')
      .order('submitted_at', { ascending: false })
      .limit(1),
  ])

  const completedIds = new Set((progressRows ?? []).filter(r => r.completed).map(r => r.module_id))
  const recommendedModules = RECOMMENDED_MODULE_IDS.map(id => modules.find(m => m.id === id)).filter(Boolean)
  const doneCount = RECOMMENDED_MODULE_IDS.filter(id => completedIds.has(id)).length
  const activeApp = safApps?.[0] ?? null
  const safIsActive = activeApp && activeApp.status !== 'draft'

  const name = profile?.first_name?.toUpperCase() ?? 'STUDENT'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Greeting */}
      <div>
        <p className="font-mono uppercase" style={{ fontSize: '0.625rem', letterSpacing: '0.18em', color: 'var(--ink-3)', margin: '0 0 0.25rem' }}>
          SETU STUDENT HUB
        </p>
        <h1 className="font-display italic" style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>
          Welcome back, {profile?.first_name ?? 'there'}.
        </h1>
        {profile?.institution_name && (
          <p className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)', marginTop: '0.375rem' }}>
            {profile.institution_name}
          </p>
        )}
      </div>

      {/* Fund cards */}
      <section aria-labelledby="funds-heading">
        <p id="funds-heading" className="font-mono uppercase" style={{ fontSize: '0.625rem', letterSpacing: '0.18em', color: 'var(--ink-3)', marginBottom: '0.875rem' }}>
          YOUR SETU FINANCIAL SUPPORTS
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          <FundCard
            title="Student Assistance Fund"
            description={safIsActive ? 'Your application is being processed.' : 'Apply for emergency financial support — rent, transport, childcare, course materials.'}
            badge={activeApp ? <StatusBadge status={activeApp.status} /> : undefined}
            primaryHref={safIsActive ? `/setu/saf/${activeApp!.reference_number}` : '/setu/saf/apply'}
            primaryLabel={safIsActive ? 'Track application →' : 'Apply now →'}
            secondaryHref="/setu/saf"
            secondaryLabel="About SAF"
            tag="SAF · OPENS OCTOBER"
          />
          <FundCard
            title="Sports Bursary"
            description="Athletic and academic support for SETU student-athletes. Opens September each year through the Sports Clubs & Societies portal."
            primaryHref="https://www.setu.ie/current-students/clubs-and-societies/sport-scholarships/sports-scholarships-waterford-campus"
            primaryLabel="More info →"
            tag="SPORTS BURSARY"
          />
          <FundCard
            title="HEAR Access Supports"
            description="Financial supports for HEAR-eligible students. Contact the Access Office for your personalised support plan."
            primaryHref="mailto:accessoffice@setu.ie"
            primaryLabel="accessoffice@setu.ie →"
            tag="HEAR / ACCESS"
          />
          <FundCard
            title="Accommodation Assistance"
            description="For Traveller, Roma and care-experienced students. Deadline 17 October. Contact Student Services."
            primaryHref="mailto:studentservices@setu.ie"
            primaryLabel="Student Services →"
            tag="ACCOMMODATION"
          />
          <div
            style={{
              border: '1px solid var(--rule)',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--paper)',
              padding: '1.25rem',
              gridColumn: 'span 2',
            }}
          >
            <span className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)' }}>
              1916 BURSARY · EXTERNAL · €1,500–€5,000/YEAR
            </span>
            <p className="font-display" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', margin: '0.375rem 0 0.375rem' }}>
              1916 Bursary
            </p>
            <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', lineHeight: 1.5, margin: '0 0 0.75rem' }}>
              For socioeconomically disadvantaged students. Applications open each September. Worth €1,500–€5,000 per year.
            </p>
            <Link href="https://www.1916bursary.ie" className="font-sans font-semibold" style={{ fontSize: '0.8125rem', color: 'var(--setu-accent)', textDecoration: 'none' }}>
              1916bursary.ie →
            </Link>
          </div>
        </div>
      </section>

      {/* Module nudge */}
      <section aria-labelledby="modules-heading">
        <p id="modules-heading" className="font-mono uppercase" style={{ fontSize: '0.625rem', letterSpacing: '0.18em', color: 'var(--ink-3)', marginBottom: '0.875rem' }}>
          YOUR MODULES
        </p>
        <div
          style={{
            border: '1px solid var(--rule)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--paper)',
            padding: '1.25rem',
          }}
        >
          <p className="font-sans" style={{ fontSize: '0.9375rem', color: 'var(--ink)', margin: '0 0 0.375rem', fontWeight: 500 }}>
            Punt recommends completing these modules before applying for the SAF.
          </p>
          <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', margin: '0 0 1rem', lineHeight: 1.5 }}>
            They help you describe your financial situation clearly and understand your deductions.
          </p>

          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ height: '4px', borderRadius: '2px', backgroundColor: 'var(--rule)', flexGrow: 1, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(doneCount / RECOMMENDED_MODULE_IDS.length) * 100}%`, backgroundColor: 'var(--setu-primary)', transition: 'width 300ms' }} />
            </div>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--ink-2)', whiteSpace: 'nowrap' }}>
              {doneCount} of {RECOMMENDED_MODULE_IDS.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {recommendedModules.map((mod) => {
              if (!mod) return null
              const done = completedIds.has(mod.id)
              return (
                <Link
                  key={mod.id}
                  href={`/lessons/${mod.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.625rem 0.875rem',
                    border: '1px solid var(--rule)',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    backgroundColor: done ? 'oklch(0.97 0.02 145)' : 'transparent',
                  }}
                >
                  <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink)' }}>{mod.title}</span>
                  {done
                    ? <span style={{ fontSize: '0.75rem', color: 'oklch(0.40 0.12 145)' }}>✓ Done</span>
                    : <span className="font-sans" style={{ fontSize: '0.75rem', color: 'var(--setu-accent)' }}>Start →</span>
                  }
                </Link>
              )
            })}
          </div>
          <p className="font-sans" style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.75rem', fontStyle: 'italic' }}>
            Module completion is not required to apply. Complete them when you can — they&rsquo;re useful beyond the SAF.
          </p>
        </div>
      </section>

      {/* Quick links */}
      <section aria-labelledby="links-heading">
        <p id="links-heading" className="font-mono uppercase" style={{ fontSize: '0.625rem', letterSpacing: '0.18em', color: 'var(--ink-3)', marginBottom: '0.75rem' }}>
          QUICK LINKS
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {[
            { label: 'Irish Financial Calendar — SETU dates', href: '/setu/calendar' },
            { label: 'MABS: 0818 07 2050', href: 'tel:+35318072000' },
            { label: 'SETU Student Services: studentservices@setu.ie', href: 'mailto:studentservices@setu.ie' },
          ].map(({ label, href }) => (
            <Link key={href} href={href} className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--setu-accent)', textDecoration: 'none' }}>
              → {label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
