'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Rule } from '@/components/ui/Rule';

type Article = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  category: string;
  reading_minutes: number | null;
  published_at: string | null;
};

type CategoryOption = {
  value: string;
  label: string;
};

type Props = {
  articles: Article[];
  categories: readonly CategoryOption[];
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function NewsCategoryFilter({ articles, categories }: Props) {
  const [active, setActive] = useState('all');

  const filtered = active === 'all'
    ? articles
    : articles.filter((a) => a.category === active);

  const countFor = (cat: string) =>
    cat === 'all' ? articles.length : articles.filter((a) => a.category === cat).length;

  const pills = [{ value: 'all', label: 'All' }, ...categories];

  return (
    <>
      {/* Category pills */}
      <div
        role="tablist"
        aria-label="Filter by category"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '2rem',
        }}
      >
        {pills.map((cat) => {
          const isActive = active === cat.value;
          const count = countFor(cat.value);
          if (count === 0 && cat.value !== 'all') return null;
          return (
            <button
              key={cat.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(cat.value)}
              className="font-sans"
              style={{
                border: isActive ? 'none' : '1px solid var(--rule)',
                backgroundColor: isActive ? 'var(--ink)' : 'transparent',
                color: isActive ? 'var(--bg)' : 'var(--ink-2)',
                padding: '4px 14px',
                borderRadius: '2px',
                fontSize: '0.8125rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                transition: 'background-color 0.15s ease, color 0.15s ease',
              }}
            >
              {cat.label}
              <span
                style={{
                  fontSize: '0.6875rem',
                  opacity: isActive ? 0.7 : 0.5,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Article list */}
      {filtered.length === 0 ? (
        <p className="font-sans text-base" style={{ color: 'var(--ink-2)' }}>
          No articles in this category yet.
        </p>
      ) : (
        <div>
          {filtered.map((article, idx) => (
            <div key={article.id}>
              <article>
                {/* Meta row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.375rem',
                    flexWrap: 'wrap',
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
                  {article.category && <Eyebrow>{article.category}</Eyebrow>}
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

              {idx < filtered.length - 1 && <Rule className="my-6" />}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
