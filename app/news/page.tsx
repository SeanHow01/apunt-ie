import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Rule } from '@/components/ui/Rule';
import { ARTICLE_CATEGORIES } from '@/lib/constants';
import { NewsCategoryFilter } from './NewsCategoryFilter';

export const revalidate = 300;

export default async function NewsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all published articles — client component handles category filtering
  const { data: articles } = await supabase
    .from('articles')
    .select('id, slug, title, summary, category, reading_minutes, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(100);

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Masthead */}
        <div style={{ marginBottom: '2rem' }}>
          <Eyebrow>Punt — Financial News</Eyebrow>
          <h1
            className="font-display"
            style={{
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
              fontSize: '1.125rem',
              color: 'var(--ink-2)',
              margin: 0,
            }}
          >
            Plain-English explainers on Irish financial news.
          </p>
        </div>

        {/* CTA — only shown to unauthenticated visitors */}
        {!user && (
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
        )}

        <Rule className="mb-6" />

        {/* Client-side category filter + article list */}
        <NewsCategoryFilter
          articles={articles ?? []}
          categories={ARTICLE_CATEGORIES}
        />

      </div>
    </main>
  );
}
