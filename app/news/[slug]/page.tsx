import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { marked } from 'marked';
import { createClient } from '@/lib/supabase/server';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Rule } from '@/components/ui/Rule';
import { ARTICLE_DISCLAIMER, MODULE_OPTIONS } from '@/lib/constants';
import { ShareButton } from './ShareButton';
import type { Json } from '@/types/database.types';

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content_md: string;
  category: string;
  article_type: string;
  related_module_ids: string[] | null;
  sources: Json | null;
  status: string;
  reading_minutes: number | null;
  published_at: string | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type Source = {
  title?: string;
  url?: string;
  publication?: string;
  date?: string;
};

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
};

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://punt.ie';

// Category → module mapping for the "Related module" card.
// Articles whose category matches a key get a curated module suggestion.
// Categories with no entry (e.g. "News") show no card.
const categoryToModule: Record<string, { slug: string; title: string; description: string }> = {
  Tax: {
    slug: 'payslip',
    title: 'Your payslip, line by line',
    description: 'Understand exactly where your money goes before it reaches you.',
  },
  Pensions: {
    slug: 'auto-enrolment',
    title: 'Auto-enrolment, plainly',
    description: "How Ireland's automatic pension scheme works — and what it means for your first job.",
  },
  Rent: {
    slug: 'rent',
    title: 'Renting in Ireland, plainly',
    description: 'Deposits, leases, notice periods, and your rights.',
  },
  Loans: {
    slug: 'loans',
    title: 'Loans and credit, plainly',
    description: 'APR, credit unions, moneylenders — how borrowing actually works.',
  },
  Mortgages: {
    slug: 'help-to-buy',
    title: 'Help to Buy, plainly',
    description: "The first-time buyer's tax rebate, and how it actually works.",
  },
  Grants: {
    slug: 'susi',
    title: 'SUSI grants, without the headache',
    description: 'The student grant — who qualifies, what it covers, how to apply.',
  },
  Investing: {
    slug: 'investing',
    title: 'Your first €50 invested',
    description: 'A calm introduction to saving and investing. No stock tips.',
  },
  Budget: {
    slug: 'payslip',
    title: 'Your payslip, line by line',
    description: 'Budget changes flow through to your take-home pay — here\'s how to read it.',
  },
  Economy: {
    slug: 'loans',
    title: 'Loans and credit, plainly',
    description: 'When rates change, your borrowing costs change. Here\'s how.',
  },
};

async function fetchArticle(slug: string, allowUnpublished: boolean): Promise<Article | null> {
  const supabase = await createClient();
  const query = supabase.from('articles').select('*').eq('slug', slug).single();

  const { data, error } = await query;
  if (error || !data) return null;
  if (!allowUnpublished && data.status !== 'published') return null;
  return data as Article;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function parseSources(raw: Json | null): Source[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (s): s is Source =>
      typeof s === 'object' && s !== null && !Array.isArray(s),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug, false);
  if (!article) return { title: 'Article not found | Punt' };

  return {
    title: `${article.title} | Punt`,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `${baseUrl}/news/${article.slug}`,
      siteName: 'Punt',
      type: 'article',
      publishedTime: article.published_at ?? undefined,
    },
    twitter: {
      card: 'summary',
      title: article.title,
      description: article.summary,
    },
    alternates: {
      canonical: `${baseUrl}/news/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

  const article = await fetchArticle(slug, isPreview);
  if (!article) notFound();

  // Render markdown — content is admin-authored (trusted source), not user-generated
  const htmlContent = marked(article.content_md) as string;

  const sources = parseSources(article.sources);
  const relatedModuleIds = article.related_module_ids ?? [];

  const relatedModules = relatedModuleIds
    .map((id) => MODULE_OPTIONS.find((m) => m.id === id))
    .filter((m): m is (typeof MODULE_OPTIONS)[number] => m !== undefined);

  // Category-based module suggestion (automatic, shown after disclaimer)
  const suggestedModule = categoryToModule[article.category] ?? null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: { '@type': 'Organization', name: 'Punt' },
    publisher: { '@type': 'Organization', name: 'Punt', url: baseUrl },
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '3rem 1.5rem' }}>

        {/* Preview banner */}
        {isPreview && (
          <div
            style={{
              backgroundColor: '#fef08a',
              color: '#713f12',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              marginBottom: '1.5rem',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            Preview mode — this article may not be published yet.
          </div>
        )}

        {/* Breadcrumb */}
        <Link
          href="/news"
          className="font-sans"
          style={{
            fontSize: '0.8125rem',
            color: 'var(--ink-2)',
            textDecoration: 'none',
            display: 'inline-block',
            marginBottom: '1.5rem',
          }}
        >
          &larr; What&rsquo;s happening
        </Link>

        {/* Category eyebrow */}
        {article.category && (
          <div style={{ marginBottom: '0.5rem' }}>
            <Eyebrow>{article.category}</Eyebrow>
          </div>
        )}

        {/* Title */}
        <h1
          className="font-display"
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            color: 'var(--ink)',
            margin: '0 0 0.75rem',
          }}
        >
          {article.title}
        </h1>

        {/* Date + reading time */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1.5rem',
          }}
        >
          {article.published_at && (
            <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)' }}>
              {formatDate(article.published_at)}
            </span>
          )}
          {article.reading_minutes && (
            <span className="font-sans" style={{ fontSize: '0.875rem', color: 'var(--ink-2)' }}>
              {article.reading_minutes} min read
            </span>
          )}
        </div>

        <Rule className="mb-6" />

        {/* Sources */}
        {sources.length > 0 && (
          <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--rule)' }}>
            <p className="font-sans text-sm" style={{ color: 'var(--ink-2)', margin: 0 }}>
              Based on reporting from:{' '}
              {sources.map((s, i) => (
                <span key={i}>
                  {i > 0 && ', '}
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent)', textDecoration: 'underline' }}
                    >
                      {s.title || s.publication || s.url}
                    </a>
                  ) : (
                    <span>{s.title || s.publication}</span>
                  )}
                </span>
              ))}
            </p>
          </div>
        )}

        {/* Article body — content is admin-authored (trusted source), not user-generated */}
        <div
          className="font-sans text-base leading-relaxed article-body"
          style={{ color: 'var(--ink)' }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Inline styles for article body prose */}
        <style>{`
          .article-body h2 {
            font-family: Instrument Serif, serif;
            font-size: 1.375rem;
            line-height: 1.25;
            letter-spacing: -0.01em;
            color: var(--ink);
            margin: 2rem 0 0.75rem;
          }
          .article-body h3 {
            font-family: Instrument Serif, serif;
            font-size: 1.125rem;
            line-height: 1.3;
            color: var(--ink);
            margin: 1.5rem 0 0.5rem;
          }
          .article-body p {
            margin: 0 0 1rem;
            line-height: 1.7;
          }
          .article-body a {
            color: var(--accent);
            text-decoration: underline;
          }
          .article-body ul,
          .article-body ol {
            margin: 0 0 1rem 1.5rem;
            line-height: 1.7;
          }
          .article-body li {
            margin-bottom: 0.25rem;
          }
          .article-body blockquote {
            border-left: 3px solid var(--rule);
            margin: 1.5rem 0;
            padding: 0.25rem 0 0.25rem 1.25rem;
            color: var(--ink-2);
            font-style: italic;
          }
          .article-body code {
            font-family: monospace;
            font-size: 0.875em;
            background: var(--surface);
            padding: 0.125rem 0.375rem;
            border-radius: 3px;
          }
          .article-body hr {
            border: none;
            border-top: 1px solid var(--rule);
            margin: 2rem 0;
          }
        `}</style>

        <Rule className="my-10" />

        {/* Admin-curated related modules (from related_module_ids on the article) */}
        {relatedModules.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h2
              className="font-display"
              style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: '1.25rem',
                color: 'var(--ink)',
                margin: '0 0 0.375rem',
              }}
            >
              Related lessons on Punt
            </h2>
            <p className="font-sans text-sm" style={{ color: 'var(--ink-2)', margin: '0 0 1rem' }}>
              Sign in to access these lessons for free.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {relatedModules.map((mod) => (
                <Link
                  key={mod.id}
                  href={`/lessons/${mod.id}`}
                  className="font-sans"
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                  }}
                >
                  {mod.title} &rarr;
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div
          style={{
            borderTop: '1px solid var(--rule)',
            paddingTop: '1.5rem',
          }}
        >
          <p className="font-sans italic text-sm" style={{ color: 'var(--ink-2)', margin: 0 }}>
            {ARTICLE_DISCLAIMER}
          </p>
        </div>

        {/* Share button — Web Share API on mobile, clipboard copy on desktop */}
        <div style={{ marginTop: '2rem' }}>
          <ShareButton title={article.title} text={article.summary} />
        </div>

        {/* Category-based related module card (automatic, shown when category has a mapping) */}
        {suggestedModule && (
          <div
            style={{
              marginTop: '1.5rem',
              border: '1px solid var(--rule)',
              borderRadius: '4px',
              padding: '1.25rem',
            }}
          >
            <p
              className="font-sans font-semibold uppercase"
              style={{
                fontSize: '0.6875rem',
                letterSpacing: '0.12em',
                color: 'var(--ink-2)',
                marginBottom: '0.75rem',
              }}
            >
              Related module
            </p>

            <h3
              className="font-display"
              style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: '1.25rem',
                lineHeight: 1.25,
                color: 'var(--ink)',
                margin: '0 0 0.375rem',
              }}
            >
              {suggestedModule.title}
            </h3>

            <p
              className="font-sans text-sm leading-relaxed"
              style={{ color: 'var(--ink-2)', margin: '0 0 0.875rem' }}
            >
              {suggestedModule.description}
            </p>

            <Link
              href={`/lessons/${suggestedModule.slug}`}
              className="font-sans text-sm"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}
            >
              Read the module &rarr;
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}
