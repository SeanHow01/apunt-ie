import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Rule } from '@/components/ui/Rule';
import { ARTICLE_CATEGORIES } from '@/lib/constants';

export const revalidate = 300;

type SearchParams = Promise<{ category?: string; page?: string }>;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const ALL_PILLS = [
  { value: 'all', label: 'All' },
  ...ARTICLE_CATEGORIES,
] as const;

const PAGE_SIZE = 20;

export default async function NewsPage({ searchParams }: { searchParams: SearchParams }) {
  const { category, page: pageParam } = await searchParams;
  const category_ = category && category !== 'all' ? category : undefined;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  const supabase = await createClient();
  let query = supabase
    .from('articles')
    .select('id, slug, title, summary, category, reading_minutes, published_at', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (category_) query = query.eq('category', category_);

  const from = (page - 1) * PAGE_SIZE;
  query = query.range(from, from + PAGE_SIZE - 1);

  const { data: articles, count } = await query;

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;
  const activeCategory = category ?? 'all';

  function categoryHref(cat: string): string {
    if (cat === 'all') return '/news';
    return `/news?category=${cat}`;
  }

  function pageHref(p: number): string {
    const params = new URLSearchParams();
    if (category_ ) params.set('category', category_);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return qs ? `/news?${qs}` : '/news';
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Masthead */}
        <div style={{ marginBottom: '2rem' }}>
          <Eyebrow>Punt — Financial News</Eyebrow>
          <h1
            className="font-display"
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: 'clamp(2rem, 5vw, 2.75rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: 'var(--ink)',
              margin: '0.5rem 0 0.375rem',
            }}
          >
            What&rsquo;s happening
          </h1>
          <p
            className="font-display italic"
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.125rem',
              color: 'var(--ink-2)',
              margin: 0,
            }}
          >
            Plain-English explainers on Irish financial news.
          </p>
        </div>

        {/* CTA */}
        <div
          style={{
            border: '1px solid var(--rule)',
            borderRadius: '4px',
            padding: '0.875rem 1.25rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <p className="font-sans text-sm" style={{ color: 'var(--ink-2)', margin: 0 }}>
            Get lessons, track your progress, and save your calculations.
          </p>
          <Link
            href="/sign-up"
            className="font-sans"
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--accent-ink)',
              backgroundColor: 'var(--accent)',
              padding: '0.4375rem 1rem',
              borderRadius: '2px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Want the full Punt app? Sign up free &rarr;
          </Link>
        </div>

        <Rule className="mb-6" />

        {/* Category pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '2rem',
          }}
        >
          {ALL_PILLS.map((cat) => {
            const active = activeCategory === cat.value;
            return (
              <Link
                key={cat.value}
                href={categoryHref(cat.value)}
                style={{
                  border: active ? 'none' : '1px solid var(--rule)',
                  backgroundColor: active ? 'var(--ink)' : 'transparent',
                  color: active ? 'var(--bg)' : 'var(--ink-2)',
                  padding: '4px 14px',
                  borderRadius: '2px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>

        {/* Article list */}
        {!articles || articles.length === 0 ? (
          <p className="font-sans text-base" style={{ color: 'var(--ink-2)' }}>
            No articles yet. Check back soon.
          </p>
        ) : (
          <div>
            {articles.map((article, idx) => (
              <div key={article.id}>
                <article>
                  {/* Meta row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.375rem',
                    }}
                  >
                    {article.published_at && (
                      <span
                        className="font-sans"
                        style={{ fontSize: '0.8125rem', color: 'var(--ink-2)' }}
                      >
                        {formatDate(article.published_at)}
                      </span>
                    )}
                    {article.category && (
                      <Eyebrow>{article.category}</Eyebrow>
                    )}
                    {article.reading_minutes && (
                      <span
                        className="font-sans"
                        style={{ fontSize: '0.8125rem', color: 'var(--ink-2)' }}
                      >
                        {article.reading_minutes} min read
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <Link href={`/news/${article.slug}`} style={{ textDecoration: 'none' }}>
                    <h2
                      className="font-display"
                      style={{
                        fontFamily: 'Instrument Serif, serif',
                        fontSize: 'clamp(1.125rem, 3vw, 1.375rem)',
                        lineHeight: 1.25,
                        color: 'var(--ink)',
                        margin: '0 0 0.375rem',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {article.title}
                    </h2>
                  </Link>

                  {/* Summary */}
                  {article.summary && (
                    <p
                      className="font-sans text-base"
                      style={{
                        color: 'var(--ink-2)',
                        lineHeight: 1.6,
                        margin: '0 0 0.75rem',
                      }}
                    >
                      {article.summary}
                    </p>
                  )}

                  {/* Read link */}
                  <Link
                    href={`/news/${article.slug}`}
                    className="font-sans"
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--accent)',
                      textDecoration: 'none',
                      fontWeight: 500,
                    }}
                  >
                    Read &rarr;
                  </Link>
                </article>

                {idx < articles.length - 1 && (
                  <Rule className="my-6" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '3rem',
              justifyContent: 'center',
            }}
          >
            {page > 1 && (
              <Link
                href={pageHref(page - 1)}
                className="font-sans"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--ink-2)',
                  textDecoration: 'none',
                  border: '1px solid var(--rule)',
                  padding: '6px 14px',
                  borderRadius: '2px',
                }}
              >
                &larr; Previous
              </Link>
            )}
            <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)' }}>
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={pageHref(page + 1)}
                className="font-sans"
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--ink-2)',
                  textDecoration: 'none',
                  border: '1px solid var(--rule)',
                  padding: '6px 14px',
                  borderRadius: '2px',
                }}
              >
                Next &rarr;
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
