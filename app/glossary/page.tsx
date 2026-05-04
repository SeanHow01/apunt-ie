import type { Metadata } from 'next';
import Link from 'next/link';
import { glossaryTerms, getGlossaryLetters, groupByLetter } from '@/lib/glossary';

export const metadata: Metadata = {
  title: 'Glossary — Punt',
  description:
    'Plain-English definitions for Irish financial and tax terms — PAYE, USC, PRSI, deemed disposal, and more.',
};

export default function GlossaryPage() {
  const letters = getGlossaryLetters();
  const grouped = groupByLetter();
  const termCount = glossaryTerms.length;

  return (
    <main style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

      <nav style={{ marginBottom: '2rem' }}>
        <Link
          href="/"
          style={{ fontSize: '0.8125rem', color: '#666', textDecoration: 'none' }}
        >
          &larr; Punt
        </Link>
      </nav>

      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: '0.625rem',
          color: '#1A1A1A',
        }}
      >
        Glossary
      </h1>

      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: '#555',
          marginBottom: '2rem',
        }}
      >
        {termCount} financial terms explained in plain English. Irish-specific where it
        matters.
      </p>

      {/* Alphabet jump-links */}
      <nav
        aria-label="Jump to letter"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.25rem',
          marginBottom: '2.5rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid #E8E8E8',
        }}
      >
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => {
          const hasTerms = letters.includes(letter);
          return (
            <a
              key={letter}
              href={hasTerms ? `#letter-${letter}` : undefined}
              aria-disabled={!hasTerms}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '2rem',
                height: '2rem',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                borderRadius: '2px',
                color: hasTerms ? '#E94F37' : '#CCC',
                cursor: hasTerms ? 'pointer' : 'default',
              }}
            >
              {letter}
            </a>
          );
        })}
      </nav>

      {/* Terms grouped by letter */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {letters.map((letter) => {
          const terms = grouped.get(letter) ?? [];
          return (
            <section key={letter} id={`letter-${letter}`}>
              {/* Letter heading */}
              <h2
                style={{
                  fontSize: '2rem',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: '#E94F37',
                  marginBottom: '1.25rem',
                }}
              >
                {letter}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {terms.map((item) => (
                  <div
                    key={item.term}
                    id={`term-${item.term.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                  >
                    <h3
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#1A1A1A',
                        marginBottom: '0.375rem',
                      }}
                    >
                      {item.term}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.9375rem',
                        lineHeight: 1.7,
                        color: '#444',
                        margin: 0,
                      }}
                    >
                      {item.definition}
                    </p>

                    {/* See also + learn more */}
                    {(item.seeAlso ?? item.learnMore) && (
                      <div
                        style={{
                          marginTop: '0.5rem',
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '0.5rem 1rem',
                          alignItems: 'baseline',
                        }}
                      >
                        {item.seeAlso && item.seeAlso.length > 0 && (
                          <p
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.8125rem',
                              color: '#777',
                              margin: 0,
                            }}
                          >
                            See also:{' '}
                            {item.seeAlso.map((related, i) => {
                              const anchor = `term-${related.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
                              return (
                                <span key={related}>
                                  {i > 0 && ', '}
                                  <a
                                    href={`#${anchor}`}
                                    style={{ color: '#666', textDecoration: 'underline' }}
                                  >
                                    {related}
                                  </a>
                                </span>
                              );
                            })}
                          </p>
                        )}
                        {item.learnMore && (
                          <Link
                            href={item.learnMore.href}
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '0.8125rem',
                              color: '#E94F37',
                              textDecoration: 'none',
                            }}
                          >
                            {item.learnMore.label} &rarr;
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #E8E8E8',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            lineHeight: 1.65,
            color: '#666',
            fontStyle: 'italic',
          }}
        >
          These definitions are for educational purposes. Irish tax law is complex —
          always verify with{' '}
          <a
            href="https://www.revenue.ie"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#E94F37' }}
          >
            Revenue.ie
          </a>{' '}
          or a qualified professional for your specific situation.
        </p>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link
            href="/sources"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              color: '#E94F37',
              textDecoration: 'none',
            }}
          >
            Our sources &rarr;
          </Link>
          <Link
            href="/methodology"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.875rem',
              color: '#E94F37',
              textDecoration: 'none',
            }}
          >
            Methodology &rarr;
          </Link>
        </div>
      </div>

    </main>
  );
}
