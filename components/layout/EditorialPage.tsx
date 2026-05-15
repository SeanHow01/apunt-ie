import type { ReactNode } from 'react';
import { BackLink } from '@/components/ui/BackLink';

/**
 * EditorialPage — the canonical wrapper for every secondary editorial / info
 * surface (about, privacy, terms, methodology, sources, accessibility,
 * contact). Renders the masthead chrome (back-link, eyebrow, title, deck)
 * inherited from the homepage and a constrained article column for body.
 *
 * Body content is unchanged — only the shell. Do not introduce inline padding
 * or per-page max-width overrides inside `children`.
 */
export function EditorialPage({
  eyebrow,
  title,
  deck,
  lastUpdated,
  children,
  backHref = '/home',
}: {
  eyebrow?: string;
  title: string;
  deck?: string;
  lastUpdated?: string;
  children: ReactNode;
  backHref?: string;
}) {
  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--ink)' }}
    >
      <div
        className="mx-auto px-6"
        style={{ maxWidth: '720px', paddingTop: '3rem', paddingBottom: '5rem' }}
      >
        {/* Masthead chrome */}
        <nav style={{ marginBottom: '3rem' }}>
          <BackLink href={backHref} />
        </nav>

        <header style={{ marginBottom: '3rem' }}>
          {lastUpdated && (
            <p
              className="font-mono uppercase"
              style={{
                fontSize: '0.625rem',
                letterSpacing: '0.14em',
                color: 'var(--ink-3)',
                margin: '0 0 0.875rem',
              }}
            >
              Updated {lastUpdated}
            </p>
          )}

          {eyebrow && (
            <p
              className="font-mono uppercase"
              style={{
                fontSize: '0.6875rem',
                letterSpacing: '0.18em',
                color: 'var(--ink-3)',
                margin: '0 0 1.25rem',
              }}
            >
              {eyebrow}
            </p>
          )}

          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.25rem, 5.5vw, 3.25rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--ink)',
              margin: 0,
              fontWeight: 500,
            }}
          >
            {title}
          </h1>

          {deck && (
            <p
              className="font-display italic"
              style={{
                fontSize: '1.1875rem',
                lineHeight: 1.45,
                letterSpacing: '-0.01em',
                color: 'var(--ink-2)',
                marginTop: '1rem',
                marginBottom: 0,
              }}
            >
              {deck}
            </p>
          )}
        </header>

        <article>{children}</article>
      </div>
    </main>
  );
}
