import Link from 'next/link';

export const metadata = { title: 'Contact — Punt' };

export default function ContactPage() {
  return (
    <main style={{ maxWidth: '42rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#666', textDecoration: 'none' }}>
          ← Punt
        </Link>
      </nav>

      <h1
        style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          color: '#1A1A1A',
        }}
      >
        Get in touch
      </h1>

      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', lineHeight: 1.7, color: '#1A1A1A', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p>
          Email us at{' '}
          <a
            href="mailto:hello@apunt.ie"
            style={{ color: '#E94F37', textDecoration: 'none' }}
          >
            hello@apunt.ie
          </a>
        </p>
        <p style={{ color: '#666', fontSize: '0.9375rem' }}>
          We aim to respond within two working days. For urgent financial advice, please contact{' '}
          <a
            href="https://mabs.ie"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#E94F37' }}
          >
            MABS
          </a>{' '}
          directly — they provide free, confidential money advice.
        </p>
      </div>
    </main>
  );
}
