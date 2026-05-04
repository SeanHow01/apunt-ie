import Link from 'next/link';

type Props = {
  slug: string;
  title: string;
  category?: string | null;
  publishedAt?: string | null;
  readingMinutes?: number | null;
  summary?: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function NewsCard({ slug, title, category, publishedAt, readingMinutes, summary }: Props) {
  const metaParts = [
    publishedAt ? formatDate(publishedAt) : null,
    readingMinutes ? `${readingMinutes} min` : null,
    category ?? null,
  ].filter(Boolean);

  return (
    <Link href={`/news/${slug}`} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
      <article
        style={{
          border: '1px solid var(--rule)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem 1.125rem',
          height: '100%',
        }}
      >
        {/* Mono dateline */}
        <p
          className="font-mono uppercase"
          style={{ fontSize: '0.5625rem', color: 'var(--ink-3)', letterSpacing: '0.12em', margin: '0 0 0.4rem' }}
        >
          {metaParts.join(' · ')}
        </p>

        {/* Serif headline */}
        <h3
          className="font-display"
          style={{ fontSize: '1.0625rem', lineHeight: 1.3, letterSpacing: '-0.01em', color: 'var(--ink)', margin: summary ? '0 0 0.375rem' : 0 }}
        >
          {title}
        </h3>

        {/* Summary */}
        {summary && (
          <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', lineHeight: 1.5, margin: 0 }}>
            {summary}
          </p>
        )}
      </article>
    </Link>
  );
}
