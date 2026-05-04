import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { createClient } from '@/lib/supabase/server';
import { modules } from '@/content/modules/index';
import { Spell } from '@/lib/copy';

export const revalidate = 300;

/* ─────────────────────────────────────────────────────────────────────────
 * HeroModulePreview
 * A real product surface: an actual module step rendered with design tokens.
 * Shows the payslip module step 1 (gross pay) as users see it in the app.
 * ─────────────────────────────────────────────────────────────────────────*/
function HeroModulePreview() {
  const ledgerRows = [
    { label: 'GROSS', value: '€2,917', primary: true },
    { label: 'PAYE', value: '−€432', primary: false },
    { label: 'USC', value: '−€68', primary: false },
    { label: 'PRSI', value: '−€120', primary: false },
  ];

  return (
    <div
      aria-hidden="true"
      style={{
        background: 'var(--paper)',
        border: '1px solid var(--rule)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow:
          '0 12px 48px oklch(0.20 0 0 / 0.09), 0 2px 6px oklch(0.20 0 0 / 0.04)',
        userSelect: 'none',
        maxWidth: '440px',
      }}
    >
      {/* Module chrome */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <span className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--ink-3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Module 01 · 3 min
        </span>
        <span style={{ display: 'flex', gap: '5px' }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: i === 0 ? 'var(--accent)' : 'var(--rule)',
              }}
            />
          ))}
        </span>
      </div>

      {/* Step label */}
      <p className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--accent)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>
        Step 1 — Gross pay
      </p>

      {/* Module title */}
      <h3 className="font-display" style={{ fontSize: '1.1875rem', lineHeight: 1.2, letterSpacing: '-0.01em', color: 'var(--ink)', margin: '0 0 0.625rem' }}>
        Your payslip, line by line
      </h3>

      {/* Step body */}
      <p className="font-sans" style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--ink-2)', margin: '0 0 1.125rem' }}>
        This is what the job pays before anyone takes a cut. Your salary, written on your contract, divided by twelve.
      </p>

      {/* Ledger */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 0.875rem', marginBottom: '1rem' }}>
        {ledgerRows.map(({ label, value, primary }, i) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '0.25rem 0',
              borderBottom: i < ledgerRows.length - 1 ? '1px solid var(--rule)' : 'none',
            }}
          >
            <span className="font-mono" style={{ fontSize: '0.625rem', color: 'var(--ink-3)', letterSpacing: '0.08em' }}>{label}</span>
            <span className="font-mono" style={{ fontSize: '0.75rem', color: primary ? 'var(--ink)' : 'var(--ink-2)' }}>{value}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '0.5rem', marginTop: '0.125rem' }}>
          <span className="font-mono" style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.08em' }}>NET</span>
          <span className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)' }}>€2,297</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '2px', background: 'var(--rule)', borderRadius: '1px', marginBottom: '0.875rem' }}>
        <div style={{ width: '16.6%', height: '100%', background: 'var(--accent)', borderRadius: '1px' }} />
      </div>

      {/* Nav strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="font-mono" style={{ fontSize: '0.625rem', color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>1 of 6</span>
        <span className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--accent)', fontWeight: 500 }}>Next →</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * SectionMarker
 * Oversized mono numeral + eyebrow label. Used as a section opener.
 * ─────────────────────────────────────────────────────────────────────────*/
function SectionMarker({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <span
        className="font-mono"
        style={{ fontSize: '2.5rem', lineHeight: 1, fontWeight: 500, color: 'var(--accent)', opacity: 0.25 }}
      >
        {n}
      </span>
      <Eyebrow>{label}</Eyebrow>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * ToolCard
 * Secondary tool pill: label, subtitle, arrow.
 * ─────────────────────────────────────────────────────────────────────────*/
function ToolCard({ label, subtitle, href }: { label: string; subtitle: string; href: string }) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        style={{
          background: 'var(--paper)',
          border: '1px solid var(--rule)',
          borderRadius: 'var(--radius-md)',
          padding: '0.875rem 1rem',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '0.75rem',
          height: '100%',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.3, margin: '0 0 0.25rem' }}>
            {label}
          </p>
          <p className="font-sans" style={{ fontSize: '0.75rem', color: 'var(--ink-3)', lineHeight: 1.4, margin: 0 }}>
            {subtitle}
          </p>
        </div>
        <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--accent)', flexShrink: 0, marginTop: '0.125rem' }}>→</span>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Page
 * ─────────────────────────────────────────────────────────────────────────*/
export default async function LandingPage() {
  const supabase = await createClient();
  const { data: latestArticles } = await supabase
    .from('articles')
    .select('id, slug, title, summary, category, reading_minutes, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3);

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  const leadTool = {
    label: 'Take-home pay calculator',
    subtitle: 'See your real take-home after PAYE, USC, and PRSI — with optional pension.',
    href: '/calculator',
  };

  const secondaryTools: { label: string; subtitle: string; href: string }[] = [
    { label: 'Loan calculator', subtitle: 'Compare APR, total cost, and term across providers.', href: '/tools/loan-calculator' },
    { label: 'Mortgage calculator', subtitle: 'Estimate repayments and stress-test at higher rates.', href: '/tools/mortgage-calculator' },
    { label: 'Buy vs rent', subtitle: 'Break-even analysis for Irish property prices.', href: '/tools/buy-vs-rent' },
    { label: 'ETF vs investment trust', subtitle: 'Model the 8-year deemed disposal and exit tax.', href: '/tools/etf-calculator' },
    { label: 'SUSI estimator', subtitle: 'Estimate your grant based on reckonable income.', href: '/tools/susi-estimator' },
    { label: 'Side hustle tax', subtitle: 'Income tax and PRSI on self-employed earnings.', href: '/tools/side-hustle' },
    { label: 'Financial calendar', subtitle: 'Deadlines, tax dates, and key filing periods.', href: '/calendar' },
  ];

  return (
    <main id="main-content" className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO — asymmetric editorial, two-column on lg
          ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ borderBottom: '1px solid var(--rule)' }}>
        <div
          className="mx-auto px-6"
          style={{ maxWidth: '1280px', paddingTop: '4rem', paddingBottom: '4.5rem' }}
        >
          {/* Two-column grid: left text, right product surface */}
          <div className="grid lg:grid-cols-[1fr_440px] gap-12 lg:gap-16 items-center">
            {/* Left: editorial content */}
            <div>
              {/* Masthead */}
              <p
                className="font-mono uppercase"
                style={{ fontSize: '0.6875rem', letterSpacing: '0.2em', color: 'var(--ink-3)', marginBottom: '3rem', fontWeight: 600 }}
              >
                Punt — apunt.ie
              </p>

              {/* H1 — oversized Fraunces, left-aligned, opinionated */}
              <h1
                className="font-display"
                style={{
                  fontSize: 'clamp(2.625rem, 8vw, 5rem)',
                  lineHeight: 1.02,
                  letterSpacing: '-0.03em',
                  color: 'var(--ink)',
                  margin: '0 0 1.25rem',
                }}
              >
                Your money.
                <br />
                The parts nobody
                <br />
                <em>explains.</em>
              </h1>

              {/* Subhead */}
              <p
                className="font-sans"
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.1875rem)',
                  lineHeight: 1.6,
                  color: 'var(--ink-2)',
                  maxWidth: '44ch',
                  margin: '0 0 2.5rem',
                }}
              >
                Payslips, pensions, rent credits, mortgages — explained for the Irish system.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <Link href="/sign-up">
                  <Button variant="primary" size="lg">
                    Get started — it&apos;s free
                  </Button>
                </Link>
                <a
                  href="#curriculum"
                  className="font-sans hero-text-link"
                  style={{ fontSize: '0.9375rem' }}
                >
                  See the modules →
                </a>
              </div>

              {/* Trust signals */}
              <p
                className="font-mono uppercase"
                style={{ fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--ink-3)', marginTop: '2rem' }}
              >
                Independent · Irish system
              </p>
            </div>

            {/* Right: product surface */}
            <div className="flex justify-center lg:justify-end">
              <HeroModulePreview />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 01 — CURRICULUM — dense, paper bg (contained)
          ═══════════════════════════════════════════════════════════════════ */}
      <section
        id="curriculum"
        style={{ backgroundColor: 'var(--paper)', borderBottom: '1px solid var(--rule)' }}
      >
        <div className="mx-auto px-6 py-16 lg:py-20" style={{ maxWidth: '1280px' }}>

          <SectionMarker n="01" label="Learn" />

          {/* H2 — verb-led */}
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.375rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              margin: '0 0 2.5rem',
              maxWidth: '28ch',
            }}
          >
            Start with what every Irish worker needs to know.
          </h2>

          {/* Two-column body */}
          <div
            className="grid gap-10 lg:gap-16"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))' }}
          >
            {/* Module list */}
            <div>
              <p
                className="font-mono uppercase"
                style={{ fontSize: '0.6875rem', color: 'var(--ink-3)', letterSpacing: '0.15em', marginBottom: '1rem', fontWeight: 600 }}
              >
                {Spell(modules.length)} modules
              </p>
              <div>
                {modules.map((mod, idx) => (
                  <Link
                    key={mod.id}
                    href="/sign-up"
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.75rem',
                      padding: '0.75rem 0',
                      borderBottom: idx < modules.length - 1 ? '1px solid var(--rule)' : 'none',
                      textDecoration: 'none',
                    }}
                  >
                    <span
                      className="font-mono"
                      style={{
                        fontSize: '0.6875rem',
                        color: 'var(--accent)',
                        opacity: 0.55,
                        flexShrink: 0,
                        width: '1.5rem',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p
                        className="font-display"
                        style={{ fontSize: '0.9375rem', lineHeight: 1.25, color: 'var(--ink)', margin: 0 }}
                      >
                        {mod.title}
                      </p>
                      <p
                        className="font-sans"
                        style={{ fontSize: '0.75rem', color: 'var(--ink-3)', marginTop: '0.125rem' }}
                      >
                        {mod.subtitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Editorial aside */}
            <div>
              <p
                className="font-display"
                style={{
                  fontSize: 'var(--step-lead)',
                  fontStyle: 'italic',
                  lineHeight: 'var(--lh-lead)',
                  color: 'var(--ink-2)',
                  maxWidth: '38ch',
                  margin: '0 0 2rem',
                }}
              >
                We don&rsquo;t sell anything. We&rsquo;re not paid by banks. This is a free, plain-English explainer for the Irish system — pensions, payslips, rent credits, mortgages, the lot. You read it; you decide.
              </p>

              <Link href="/sign-up">
                <Button variant="primary">Start learning &rarr;</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 02 — TOOLS — airy, bg color (full-bleed feel)
          ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--rule)' }}>
        <div className="mx-auto px-6 py-20 lg:py-32" style={{ maxWidth: '1280px' }}>

          <SectionMarker n="02" label="Calculate" />

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.75rem, 5vw, 3rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              margin: '0 0 0.75rem',
              maxWidth: '22ch',
            }}
          >
            Run the numbers yourself.
          </h2>
          <p
            className="font-display"
            style={{
              fontSize: 'var(--step-lead)',
              fontStyle: 'italic',
              lineHeight: 'var(--lh-lead)',
              color: 'var(--ink-2)',
              margin: '0 0 2.75rem',
              maxWidth: '44ch',
            }}
          >
            Free calculators built for the Irish system. No sign-up required.
          </p>

          {/* Lead card — full width, instrument feel */}
          <Link href={leadTool.href} style={{ textDecoration: 'none', display: 'block', marginBottom: '0.75rem' }}>
            <div
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--rule)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
              }}
            >
              <div style={{ minWidth: 0 }}>
                {/* Mono metadata row */}
                <p
                  className="font-mono uppercase"
                  style={{ fontSize: '0.5625rem', color: 'var(--ink-3)', letterSpacing: '0.14em', marginBottom: '0.5rem' }}
                >
                  Updated 2026 · 30 sec · No sign-up
                </p>
                {/* Serif title */}
                <h3
                  className="font-display"
                  style={{ fontSize: '1.5rem', lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '0 0 0.375rem' }}
                >
                  {leadTool.label}
                </h3>
                {/* Description */}
                <p className="font-sans" style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', lineHeight: 1.5, margin: 0 }}>
                  {leadTool.subtitle}
                </p>
                {/* Arrow */}
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--accent)', display: 'block', marginTop: '1rem' }}>
                  Open calculator →
                </span>
              </div>
              {/* Mini ledger preview */}
              <div
                aria-hidden="true"
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--rule)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.625rem 0.75rem',
                  flexShrink: 0,
                  width: '128px',
                  display: 'none',
                }}
                className="sm:block"
              >
                {[
                  { label: 'GROSS', value: '€35,000', accent: false },
                  { label: 'PAYE', value: '−€5,200', accent: false },
                  { label: 'USC', value: '−€916', accent: false },
                  { label: 'PRSI', value: '−€1,435', accent: false },
                ].map(({ label, value }, i, arr) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      padding: '0.1875rem 0',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--rule)' : 'none',
                    }}
                  >
                    <span className="font-mono" style={{ fontSize: '0.5625rem', color: 'var(--ink-3)', letterSpacing: '0.06em' }}>{label}</span>
                    <span className="font-mono" style={{ fontSize: '0.5625rem', color: 'var(--ink-2)' }}>{value}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '0.3125rem', marginTop: '0.125rem' }}>
                  <span className="font-mono" style={{ fontSize: '0.5625rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.06em' }}>NET</span>
                  <span className="font-mono" style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--accent)' }}>€27,449</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Secondary tools — top 4 above fold */}
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', marginBottom: '0.75rem' }}
          >
            {secondaryTools.slice(0, 4).map(({ label, subtitle, href }) => (
              <ToolCard key={label} label={label} subtitle={subtitle} href={href} />
            ))}
          </div>

          {/* Bottom 3 + "See all" */}
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))' }}
          >
            {secondaryTools.slice(4).map(({ label, subtitle, href }) => (
              <ToolCard key={label} label={label} subtitle={subtitle} href={href} />
            ))}
            <Link href="/tools" style={{ textDecoration: 'none' }}>
              <div
                style={{
                  border: '1px dashed var(--rule)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.875rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  height: '100%',
                }}
              >
                <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)', lineHeight: 1.3 }}>
                  See all {Spell(secondaryTools.length + 1).toLowerCase()} calculators
                </span>
                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--accent)', flexShrink: 0 }}>→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 03 — NEWS — dense, paper bg (conditional)
          ═══════════════════════════════════════════════════════════════════ */}
      {latestArticles && latestArticles.length > 0 && (
        <section style={{ backgroundColor: 'var(--paper)', borderBottom: '1px solid var(--rule)' }}>
          <div className="mx-auto px-6 py-16 lg:py-20" style={{ maxWidth: '1280px' }}>

            <SectionMarker n="03" label="Read" />

            {/* H2 + all-articles link */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
                marginBottom: '2rem',
              }}
            >
              <h2
                className="font-display"
                style={{
                  fontSize: 'clamp(1.5rem, 4vw, 2.375rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  color: 'var(--ink)',
                  margin: 0,
                }}
              >
                Stay across what changes.
              </h2>
              <Link
                href="/news"
                className="font-sans"
                style={{ fontSize: '0.875rem', color: 'var(--ink-2)', textDecoration: 'none', flexShrink: 0 }}
              >
                All articles →
              </Link>
            </div>

            {/* Article cards — newspaper feel: mono dateline, serif headline */}
            <div
              className="grid gap-4 md:gap-5"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))' }}
            >
              {latestArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <article
                    style={{
                      border: '1px solid var(--rule)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '1.125rem 1.25rem',
                    }}
                  >
                    {/* Mono dateline */}
                    <p
                      className="font-mono uppercase"
                      style={{
                        fontSize: '0.625rem',
                        color: 'var(--ink-3)',
                        letterSpacing: '0.12em',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {article.published_at ? formatDate(article.published_at) : ''}
                      {article.reading_minutes ? ` · ${article.reading_minutes} min` : ''}
                      {article.category ? ` · ${article.category}` : ''}
                    </p>

                    {/* Serif headline */}
                    <h3
                      className="font-display"
                      style={{
                        fontSize: '1.0625rem',
                        lineHeight: 1.3,
                        letterSpacing: '-0.01em',
                        color: 'var(--ink)',
                        margin: 0,
                      }}
                    >
                      {article.title}
                    </h3>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          FOOTER SIGNPOST
          ═══════════════════════════════════════════════════════════════════ */}
      <footer style={{ backgroundColor: 'var(--bg)' }}>
        <div
          className="mx-auto px-6"
          style={{ maxWidth: '1280px', paddingTop: '2.5rem', paddingBottom: '3rem' }}
        >
          {/* Manifesto */}
          <p
            className="font-display"
            style={{
              fontSize: '1.0625rem',
              fontStyle: 'italic',
              color: 'var(--ink-2)',
              maxWidth: '52ch',
              lineHeight: 1.5,
              marginBottom: '1.5rem',
            }}
          >
            Financial education that respects your intelligence. Always free. Always Irish. Always independent.
          </p>

          {/* Row 1 — free-advice signpost (louder, paper bg) */}
          <div
            style={{
              background: 'var(--paper)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--rule)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.75rem 1.25rem',
              flexWrap: 'wrap',
              marginBottom: '0',
            }}
          >
            <span
              className="font-sans"
              style={{ fontSize: '0.875rem', color: 'var(--ink-2)', fontWeight: 500 }}
            >
              Need help right now?
            </span>
            <a
              href="https://www.mabs.ie"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans"
              style={{ fontSize: '0.875rem', color: 'var(--ink)', textDecoration: 'underline' }}
            >
              MABS
            </a>
            <span style={{ display: 'flex', alignItems: 'baseline', gap: '0.375rem' }}>
              <span className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)' }}>—</span>
              <a
                href="tel:+35318072000"
                className="font-mono"
                style={{ fontSize: '0.8125rem', color: 'var(--ink)', textDecoration: 'none', letterSpacing: '0.04em' }}
              >
                0818 07 2000
              </a>
            </span>
            <a
              href="https://www.ccpc.ie"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans"
              style={{ fontSize: '0.875rem', color: 'var(--ink)', textDecoration: 'underline' }}
            >
              CCPC
            </a>
          </div>

          {/* Row 2 — site links (quieter) */}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem 1.25rem',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              borderTop: '1px solid var(--rule)',
              paddingTop: '1rem',
              marginTop: '1rem',
            }}
          >
            {[
              { label: 'Sources', href: '/sources' },
              { label: 'Methodology', href: '/methodology' },
              { label: 'Accessibility', href: '/accessibility' },
              { label: 'Privacy', href: '/privacy' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-sans"
                style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', textDecoration: 'none' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

    </main>
  );
}
