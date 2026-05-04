import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { createClient } from '@/lib/supabase/server';
import { modules } from '@/content/modules/index';

export const revalidate = 300;

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
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="w-full max-w-lg md:max-w-3xl mx-auto flex flex-col">

        {/* Masthead label */}
        <p
          className="font-sans font-semibold uppercase tracking-[0.2em] text-[10px] mb-12"
          style={{ color: 'var(--ink-2)' }}
        >
          Punt
        </p>

        {/* Hero */}
        <div className="mb-10">
          <h1
            className="font-display text-5xl sm:text-6xl leading-[1.05] mb-4"
            style={{
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
            }}
          >
            Irish finance, in plain English.
          </h1>
          <p
            className="font-sans text-base sm:text-lg leading-relaxed"
            style={{ color: 'var(--ink-2)', maxWidth: '48ch' }}
          >
            Free modules, calculators, and explainers for Irish students and graduates — payslips, pensions, rent, SUSI, mortgages, and investing. No jargon. No advice. No affiliation.
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-3 mt-8 mb-5 max-w-xs">
          <Link href="/sign-up" className="w-full">
            <Button variant="primary" className="w-full">
              Get started — it&apos;s free
            </Button>
          </Link>
          <a href="#whats-inside" className="w-full">
            <Button variant="ghost" className="w-full">
              See the modules
            </Button>
          </a>
        </div>

        {/* Trust line */}
        <p
          className="font-sans text-xs mb-6"
          style={{ color: 'var(--ink-2)', letterSpacing: '0.05em' }}
        >
          Independent · No bank affiliation · Irish system specific
        </p>

        {/* What's inside — modules + tools preview */}
        <div
          id="whats-inside"
          className="mb-12 rounded"
          style={{
            marginTop: '2rem',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--rule)',
            padding: '2rem 1.75rem',
          }}
        >
          <h2
            className="font-display mb-8"
            style={{
              fontSize: 'clamp(1.375rem, 4vw, 1.75rem)',
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
              color: 'var(--ink)',
            }}
          >
            Everything you need to know
          </h2>

          <div className="flex flex-col md:grid md:grid-cols-2 md:gap-10">
            {/* Modules column */}
            <div>
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: 'var(--ink-2)' }}
              >
                Eight modules
              </p>
              <div className="flex flex-col">
                {modules.map((mod, idx) => (
                  <Link
                    key={mod.id}
                    href="/sign-up"
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '0.625rem',
                      padding: '0.625rem 0',
                      borderBottom: idx < modules.length - 1 ? '1px solid var(--rule)' : 'none',
                      textDecoration: 'none',
                    }}
                  >
                    <span
                      className="font-display italic flex-shrink-0"
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--accent)',
                        opacity: 0.5,
                        minWidth: '1rem',
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p
                        className="font-display text-sm leading-snug"
                        style={{ color: 'var(--ink)' }}
                      >
                        {mod.title}
                      </p>
                      <p className="font-sans" style={{ fontSize: '0.75rem', color: 'var(--ink-2)', marginTop: '0.125rem' }}>
                        {mod.subtitle}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Tools column */}
            <div className="mt-8 md:mt-0">
              <Rule className="mb-8 md:hidden" />
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: 'var(--ink-2)' }}
              >
                Free tools
              </p>
              <ul
                className="font-sans text-sm flex flex-col gap-2"
                style={{ color: 'var(--ink-2)', listStyle: 'none', padding: 0, margin: 0 }}
              >
                {[
                  'Take-home pay calculator',
                  'Pension contribution calculator',
                  'Loan calculator and comparison',
                  'Mortgage calculator',
                  'ETF vs investment trust calculator',
                  'SUSI eligibility estimator',
                  'Buy vs rent calculator',
                  'Irish financial calendar',
                ].map((tool) => (
                  <li key={tool} style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--accent)', flexShrink: 0, fontSize: '0.75rem' }}>→</span>
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 pt-6 flex flex-col items-center gap-4" style={{ borderTop: '1px solid var(--rule)' }}>
            <p className="font-sans text-xs text-center" style={{ color: 'var(--ink-2)', letterSpacing: '0.05em' }}>
              All free. No bank affiliation. No advice.
            </p>
            <Link href="/sign-up">
              <Button variant="primary">
                Get started &rarr;
              </Button>
            </Link>
          </div>
        </div>

        {/* News section — only when published articles exist */}
        {latestArticles && latestArticles.length > 0 && (
          <>
            <Rule className="mb-8" />
            <div style={{ marginBottom: '2.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <h2
                  className="font-display"
                  style={{
                    fontSize: 'clamp(1.375rem, 4vw, 1.75rem)',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.15,
                    color: 'var(--ink)',
                    margin: 0,
                  }}
                >
                  What&rsquo;s happening
                </h2>
                <Link
                  href="/news"
                  className="font-sans"
                  style={{ fontSize: '0.875rem', color: 'var(--ink-2)', textDecoration: 'none' }}
                >
                  All news &rarr;
                </Link>
              </div>

              <div className="flex flex-col md:grid md:grid-cols-3 md:gap-6">
                {latestArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <article
                      style={{
                        border: '1px solid var(--rule)',
                        borderRadius: '4px',
                        padding: '1rem 1.125rem',
                        marginBottom: '0.75rem',
                      }}
                      className="md:mb-0"
                    >
                      {article.category && (
                        <div style={{ marginBottom: '0.375rem' }}>
                          <Eyebrow>{article.category}</Eyebrow>
                        </div>
                      )}
                      <h3
                        className="font-display"
                        style={{
                          fontSize: '1.0625rem',
                          lineHeight: 1.3,
                          color: 'var(--ink)',
                          margin: '0 0 0.375rem',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {article.title}
                      </h3>
                      {article.published_at && (
                        <p
                          className="font-sans"
                          style={{ fontSize: '0.75rem', color: 'var(--ink-2)', margin: 0 }}
                        >
                          {formatDate(article.published_at)}
                          {article.reading_minutes ? ` · ${article.reading_minutes} min` : ''}
                        </p>
                      )}
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Divider */}
        <Rule className="mb-10" />

        {/* Footer — service signpost */}
        <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '1.5rem' }}>
          <p className="font-sans text-xs mb-1" style={{ color: 'var(--ink-2)' }}>
            Free money advice:{' '}
            <a
              href="https://www.mabs.ie"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink-2)', textDecoration: 'underline' }}
            >
              MABS
            </a>
            {' '}· 0818 07 2000
          </p>
          <p className="font-sans text-xs" style={{ color: 'var(--ink-2)' }}>
            Consumer financial comparisons:{' '}
            <a
              href="https://www.ccpc.ie"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--ink-2)', textDecoration: 'underline' }}
            >
              CCPC
            </a>
          </p>
        </div>

      </div>
    </main>
  );
}
