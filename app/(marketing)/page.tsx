import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { createClient } from '@/lib/supabase/server';

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
              fontFamily: 'Instrument Serif, serif',
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
          <Link href="/lessons" className="w-full">
            <Button variant="ghost" className="w-full">
              See the modules
            </Button>
          </Link>
        </div>

        {/* Trust line */}
        <p
          className="font-sans text-xs mb-12"
          style={{ color: 'var(--ink-2)', letterSpacing: '0.05em' }}
        >
          Independent · No bank affiliation · Irish system specific
        </p>

        {/* Public tool link */}
        <p className="font-sans text-sm mb-12" style={{ color: 'var(--ink-2)' }}>
          <Link
            href="/tools/loan-calculator"
            className="underline underline-offset-2"
            style={{ color: 'var(--ink)' }}
          >
            Work out what a loan actually costs &rarr;
          </Link>
        </p>

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
                    fontFamily: 'Instrument Serif, serif',
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
                          fontFamily: 'Instrument Serif, serif',
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
