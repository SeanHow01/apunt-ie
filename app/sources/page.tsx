import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPage } from '@/components/layout/EditorialPage';
import { primarySources } from '@/lib/sources';

export const metadata: Metadata = {
  title: 'Sources — Punt',
  description:
    "The authoritative sources behind Punt's content, calculators, and financial information.",
};

export default function SourcesPage() {
  return (
    <EditorialPage
      title="Sources"
      deck="Punt’s content, calculators, and explanations are built on authoritative Irish government and regulatory sources. Where we state a number, rate, or rule, it comes from one of the following."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {primarySources.map((source, idx) => (
          <div
            key={idx}
            style={{
              borderTop: '1px solid var(--rule)',
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
                  color: 'var(--ink)',
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
                  color: 'var(--accent)',
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
                color: 'var(--ink-2)',
                marginBottom: '0.875rem',
              }}
            >
              {source.description}
            </p>

            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8125rem',
                color: 'var(--ink-3)',
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
                color: 'var(--ink-2)',
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
          borderTop: '1px solid var(--rule)',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9375rem',
            lineHeight: 1.65,
            color: 'var(--ink-3)',
            fontStyle: 'italic',
          }}
        >
          All rates are reviewed periodically. If you spot something out of date,{' '}
          <Link href="/contact" style={{ color: 'var(--accent)' }}>
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
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            How we calculate things &rarr;
          </Link>
        </p>
      </div>

    </EditorialPage>
  );
}
