import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { marked } from 'marked';
import { createClient } from '@/lib/supabase/server';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Rule } from '@/components/ui/Rule';
import { ARTICLE_DISCLAIMER, MODULE_OPTIONS } from '@/lib/constants';
import { CopyLinkButton } from './CopyLinkButton';
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

async function fetchArticle(slug: string, allowUnpublished: boolean): Promise<Article | null> {
  const supabase = await createClient();
  let query = supabase.from('articles').select('*').eq('slug', slug).single();

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

  const shareUrl = `${baseUrl}/news/${article.slug}`;
  const shareText = `${article.title} | Punt`;

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

        {/* Related modules */}
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

        {/* Social share */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p
            className="font-sans"
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--ink-2)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.75rem',
            }}
          >
            Share
          </p>
          <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans"
              style={shareLinkStyle}
            >
              X / Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans"
              style={shareLinkStyle}
            >
              LinkedIn
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans"
              style={shareLinkStyle}
            >
              WhatsApp
            </a>
            <CopyLinkButton url={shareUrl} />
          </div>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            borderTop: '1px solid var(--rule)',
            marginTop: '3rem',
            paddingTop: '1.5rem',
          }}
        >
          <p className="font-sans italic text-sm" style={{ color: 'var(--ink-2)', margin: 0 }}>
            {ARTICLE_DISCLAIMER}
          </p>
        </div>

      </div>
    </main>
  );
}

const shareLinkStyle: React.CSSProperties = {
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'var(--ink-2)',
  border: '1px solid var(--rule)',
  padding: '4px 12px',
  borderRadius: '2px',
  textDecoration: 'none',
  display: 'inline-block',
};
