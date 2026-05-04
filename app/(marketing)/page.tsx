import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { createClient } from '@/lib/supabase/server';
import { modules } from '@/content/modules/index';

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

  const tools: { label: string; href: string }[] = [
    { label: 'Take-home pay calculator', href: '/calculator' },
    { label: 'Loan calculator and comparison', href: '/tools/loan-calculator' },
    { label: 'Mortgage calculator', href: '/tools/mortgage-calculator' },
    { label: 'Buy vs rent calculator', href: '/tools/buy-vs-rent' },
    { label: 'ETF vs investment trust', href: '/tools/etf-calculator' },
    { label: 'SUSI eligibility estimator', href: '/tools/susi-estimator' },
    { label: 'Side hustle tax calculator', href: '/tools/side-hustle' },
    { label: 'Irish financial calendar', href: '/calendar' },
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
                Payslips, pensions, rent credits, mortgages — explained for the Irish system. Free, independent, and unaffiliated with any bank or insurer.
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
                  className="font-sans"
                  style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', textDecoration: 'none' }}
                >
                  See the modules →
                </a>
              </div>

              {/* Trust signals */}
              <p
                className="font-mono uppercase"
                style={{ fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--ink-3)', marginTop: '2rem' }}
              >
                Independent · No bank affiliation · Irish system
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
                {modules.length} modules
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

            {/* What you get */}
            <div>
              <p
                className="font-mono uppercase"
                style={{ fontSize: '0.6875rem', color: 'var(--ink-3)', letterSpacing: '0.15em', marginBottom: '1rem', fontWeight: 600 }}
              >
                What you get
              </p>
              {[
                'Bite-sized steps — 3–5 min per module',
                'Plain English — no jargon, no assumed knowledge',
                'Irish-specific — Revenue, SUSI, RTB, Central Bank',
                'Free — no subscription, no paywalls',
                'No advice — we explain; you decide',
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.625rem',
                    padding: '0.625rem 0',
                    borderBottom: '1px solid var(--rule)',
                  }}
                >
                  <span className="font-mono" style={{ fontSize: '0.625rem', color: 'var(--accent)', flexShrink: 0, marginTop: '0.25rem' }}>✓</span>
                  <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}

              <div style={{ marginTop: '2rem' }}>
                <Link href="/sign-up">
                  <Button variant="primary">Start learning &rarr;</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 02 — TOOLS — airy, bg color (full-bleed feel)
          ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: 'var(--bg)', borderBottom: '1px solid var(--rule)' }}>
        <div className="mx-auto px-6 py-16 lg:py-24" style={{ maxWidth: '1280px' }}>

          <SectionMarker n="02" label="Calculate" />

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.375rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: 'var(--ink)',
              margin: '0 0 0.75rem',
              maxWidth: '22ch',
            }}
          >
            Run the numbers yourself.
          </h2>
          <p
            className="font-sans"
            style={{ fontSize: '1rem', color: 'var(--ink-2)', margin: '0 0 2.5rem', maxWidth: '48ch', lineHeight: 1.65 }}
          >
            Free calculators built for the Irish system. No sign-up required.
          </p>

          {/* Tool cards grid */}
          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 290px), 1fr))' }}
          >
            {tools.map(({ label, href }) => (
              <Link key={label} href={href} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    background: 'var(--paper)',
                    border: '1px solid var(--rule)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.875rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                  }}
                >
                  <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.35 }}>
                    {label}
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--accent)', flexShrink: 0 }}>→</span>
                </div>
              </Link>
            ))}
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

          {/* Service links */}
          <div
            style={{
              display: 'flex',
              gap: '1rem 1.5rem',
              flexWrap: 'wrap',
              alignItems: 'baseline',
              borderTop: '1px solid var(--rule)',
              paddingTop: '1.25rem',
            }}
          >
            <span className="font-mono uppercase" style={{ fontSize: '0.6875rem', color: 'var(--ink-3)', letterSpacing: '0.1em' }}>
              Free advice:
            </span>
            {[
              { label: 'MABS', href: 'https://www.mabs.ie' },
              { label: 'CCPC', href: 'https://www.ccpc.ie' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans"
                style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', textDecoration: 'underline' }}
              >
                {label}
              </a>
            ))}
            <span className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-3)' }}>
              0818 07 2000
            </span>
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
