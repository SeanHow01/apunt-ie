import type { Metadata } from 'next';
import Link from 'next/link';
import { primarySources } from '@/lib/sources';

export const metadata: Metadata = {
  title: 'Sources — Punt',
  description:
    "The authoritative sources behind Punt's content, calculators, and financial information.",
};

export default function SourcesPage() {
  return (
    <main style={{ maxWidth: '42rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

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
          marginBottom: '0.75rem',
          color: '#1A1A1A',
        }}
      >
        Sources
      </h1>

      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: '#555',
          marginBottom: '2.5rem',
        }}
      >
        Punt's content, calculators, and explanations are built on authoritative Irish
        government and regulatory sources. Where we state a number, rate, or rule, it
        comes from one of the following.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {primarySources.map((source, idx) => (
          <div
            key={idx}
            style={{
              borderTop: '1px solid #E8E8E8',
              paddingTop: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.75rem',
                marginBottom: '0.5rem',
                flexWrap: 'wrap',
              }}
            >
              <h2
                style={{
                  fontSize: '1.25rem',
                  lineHeight: 1.2,
                  color: '#1A1A1A',
                  margin: 0,
                }}
              >
                {source.name}
              </h2>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  color: '#E94F37',
                  textDecoration: 'none',
                }}
              >
                {source.url.replace('https://', '')} &rarr;
              </a>
            </div>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                lineHeight: 1.65,
                color: '#444',
                marginBottom: '0.875rem',
              }}
            >
              {source.description}
            </p>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8125rem',
                color: '#666',
                marginBottom: '0.375rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
              }}
            >
              Used for
            </p>
            <ul
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                lineHeight: 1.65,
                color: '#444',
                paddingLeft: '1.25rem',
                margin: 0,
              }}
            >
              {source.usedFor.map((use, i) => (
                <li key={i} style={{ marginBottom: '0.2rem' }}>
                  {use}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

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
            fontSize: '0.9375rem',
            lineHeight: 1.65,
            color: '#666',
            fontStyle: 'italic',
          }}
        >
          All rates are reviewed periodically. If you spot something out of date,{' '}
          <Link href="/contact" style={{ color: '#E94F37' }}>
            let us know
          </Link>
          .
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          <Link
            href="/methodology"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9375rem',
              color: '#E94F37',
              textDecoration: 'none',
            }}
          >
            How we calculate things &rarr;
          </Link>
        </p>
      </div>

    </main>
  );
}
