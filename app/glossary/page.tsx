'use client';

import { useState } from 'react';
import Link from 'next/link';
import { glossaryTerms, getGlossaryLetters, groupByLetter } from '@/lib/glossary';
import { GlossaryCard } from '@/components/ui/GlossaryCard';

const letters = getGlossaryLetters();
const grouped = groupByLetter();
const termCount = glossaryTerms.length;

export default function GlossaryPage() {
  const [query, setQuery] = useState('');

  const trimmed = query.trim().toLowerCase();

  const filteredTerms = trimmed
    ? glossaryTerms.filter(
        (t) =>
          t.term.toLowerCase().includes(trimmed) ||
          t.definition.toLowerCase().includes(trimmed)
      )
    : null;

  return (
    <main style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

      <nav style={{ marginBottom: '2rem' }}>
        <Link
          href="/"
          className="font-sans"
          style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', textDecoration: 'none' }}
        >
          &larr; Punt
        </Link>
      </nav>

      <h1
        className="font-display"
        style={{
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: '0.625rem',
          color: 'var(--ink)',
        }}
      >
        Glossary
      </h1>

      <p
        className="font-sans"
        style={{
          fontSize: '1rem',
          lineHeight: 1.7,
          color: 'var(--ink-2)',
          marginBottom: '1.5rem',
        }}
      >
        {termCount} financial terms explained in plain English. Irish-specific where it
        matters.
      </p>

      {/* Search input */}
      <div className="flex flex-col gap-1.5" style={{ marginBottom: '2rem' }}>
        <label
          htmlFor="glossary-search"
          className="font-sans"
          style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)', display: 'block' }}
        >
          Search terms
        </label>
        <input
          id="glossary-search"
          type="search"
          placeholder="e.g. PAYE, deemed disposal..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="font-sans"
          style={{
            width: '100%',
            border: '1px solid var(--rule)',
            padding: '10px 12px',
            background: 'var(--paper)',
            color: 'var(--ink)',
            fontSize: '1rem',
            outline: 'none',
            borderRadius: 'var(--radius-sm)',
          }}
        />
      </div>

      {/* Alphabet jump-links — hidden when filtering */}
      {!trimmed && (
        <nav
          aria-label="Jump to letter"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.25rem',
            marginBottom: '2.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--rule)',
          }}
        >
          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => {
            const hasTerms = letters.includes(letter);
            return (
              <a
                key={letter}
                href={hasTerms ? `#letter-${letter}` : undefined}
                aria-disabled={!hasTerms}
                className="font-sans"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  borderRadius: '2px',
                  color: hasTerms ? 'var(--accent)' : 'var(--rule)',
                  cursor: hasTerms ? 'pointer' : 'default',
                }}
              >
                {letter}
              </a>
            );
          })}
        </nav>
      )}

      {/* Filtered results */}
      {filteredTerms && (
        <div>
          {filteredTerms.length === 0 ? (
            <p className="font-sans" style={{ fontSize: '0.9375rem', color: 'var(--ink-3)' }}>
              No terms match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <div>
              <p
                className="font-mono uppercase"
                style={{ fontSize: '0.5625rem', letterSpacing: '0.12em', color: 'var(--ink-3)', marginBottom: '0.75rem' }}
              >
                {filteredTerms.length} result{filteredTerms.length !== 1 ? 's' : ''}
              </p>
              {filteredTerms.map((item) => {
                const termId = `term-${item.term.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
                return (
                  <div key={item.term}>
                    <GlossaryCard
                      id={termId}
                      term={item.term}
                      definition={item.definition}
                      seeAlso={item.seeAlso}
                    />
                    {item.learnMore && (
                      <p style={{ margin: '0.25rem 0 0' }}>
                        <Link
                          href={item.learnMore.href}
                          className="font-sans"
                          style={{ fontSize: '0.8125rem', color: 'var(--accent)', textDecoration: 'none' }}
                        >
                          {item.learnMore.label} &rarr;
                        </Link>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Terms grouped by letter — shown when not filtering */}
      {!filteredTerms && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {letters.map((letter) => {
            const terms = grouped.get(letter) ?? [];
            return (
              <section key={letter} id={`letter-${letter}`}>
                {/* Letter heading */}
                <h2
                  className="font-display"
                  style={{
                    fontSize: '2rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    color: 'var(--accent)',
                    marginBottom: '0.5rem',
                  }}
                >
                  {letter}
                </h2>

                <div>
                  {terms.map((item) => {
                    const termId = `term-${item.term.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`;
                    return (
                      <div key={item.term}>
                        <GlossaryCard
                          id={termId}
                          term={item.term}
                          definition={item.definition}
                          seeAlso={item.seeAlso}
                        />
                        {item.learnMore && (
                          <p style={{ margin: '0 0 0.5rem' }}>
                            <Link
                              href={item.learnMore.href}
                              className="font-sans"
                              style={{ fontSize: '0.8125rem', color: 'var(--accent)', textDecoration: 'none' }}
                            >
                              {item.learnMore.label} &rarr;
                            </Link>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--rule)',
        }}
      >
        <p
          className="font-sans"
          style={{
            fontSize: '0.875rem',
            lineHeight: 1.65,
            color: 'var(--ink-3)',
            fontStyle: 'italic',
          }}
        >
          These definitions are for educational purposes. Irish tax law is complex —
          always verify with{' '}
          <a
            href="https://www.revenue.ie"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent)' }}
          >
            Revenue.ie
          </a>{' '}
          or a qualified professional for your specific situation.
        </p>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <Link
            href="/sources"
            className="font-sans"
            style={{
              fontSize: '0.875rem',
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            Our sources &rarr;
          </Link>
          <Link
            href="/methodology"
            className="font-sans"
            style={{
              fontSize: '0.875rem',
              color: 'var(--accent)',
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
