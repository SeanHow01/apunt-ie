import Link from 'next/link';

export const metadata = { title: 'Contact — Punt' };

export default function ContactPage() {
  return (
    <main style={{ maxWidth: '42rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', textDecoration: 'none' }}>
          ← Punt
        </Link>
      </nav>

      <h1
        style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: '2rem',
          color: 'var(--ink)',
        }}
      >
        Get in touch
      </h1>

      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          lineHeight: 1.75,
          color: 'var(--ink)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.875rem',
        }}
      >
        <p>
          For questions about Punt:{' '}
          <a href="mailto:hello@apunt.ie" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            hello@apunt.ie
          </a>
        </p>
      </div>

      <div
        style={{
          marginTop: '2.5rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--rule)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <p
          style={{
            fontSize: '0.9375rem',
            color: 'var(--ink-2)',
            marginBottom: '1.5rem',
            lineHeight: 1.6,
          }}
        >
          If you need financial advice — not something Punt provides — these free services can
          help:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>
              MABS (Money Advice and Budgeting Service)
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: '0.375rem' }}>
              Free, confidential money advice for people in financial difficulty.
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-2)' }}>
              <a href="tel:0818072000" style={{ color: 'var(--ink-2)' }}>0818 07 2000</a>
              {' '}·{' '}
              <a
                href="https://www.mabs.ie"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'none' }}
              >
                mabs.ie
              </a>
            </p>
          </div>

          <div>
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>
              CCPC (Competition and Consumer Protection Commission)
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: '0.375rem' }}>
              Unbiased consumer financial comparisons and guides.
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              <a
                href="https://www.ccpc.ie"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'none' }}
              >
                ccpc.ie
              </a>
            </p>
          </div>

          <div>
            <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--ink)', marginBottom: '0.25rem' }}>
              Citizens Information
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: '0.375rem' }}>
              Comprehensive guide to Irish financial entitlements and supports.
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              <a
                href="https://www.citizensinformation.ie"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent)', textDecoration: 'none' }}
              >
                citizensinformation.ie
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
