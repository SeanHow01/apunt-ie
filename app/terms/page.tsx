import Link from 'next/link';

export const metadata = { title: 'Terms — Punt' };

export default function TermsPage() {
  return (
    <main style={{ maxWidth: '42rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: '#666', textDecoration: 'none' }}>
          ← Punt
        </Link>
      </nav>

      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: '1.5rem',
          color: '#1A1A1A',
        }}
      >
        Terms of use
      </h1>

      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', lineHeight: 1.7, color: '#1A1A1A', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p
          style={{
            border: '1px solid #E94F37',
            borderRadius: '4px',
            padding: '0.875rem 1rem',
            backgroundColor: 'rgba(233, 79, 55, 0.05)',
            fontSize: '0.9375rem',
          }}
        >
          <strong>Note:</strong> These are placeholder terms. Full terms of service are required before Punt launches at scale. Contact{' '}
          <a href="mailto:hello@apunt.ie" style={{ color: '#E94F37' }}>hello@apunt.ie</a>{' '}
          for the current institutional agreement.
        </p>

        <p>
          Punt is an educational platform. The content provided is for educational purposes only and does not constitute financial advice. Punt is not authorised by the Central Bank of Ireland to provide financial advice.
        </p>

        <p>
          By using Punt, you agree to use it for lawful purposes only. You may not share your account credentials or attempt to access data belonging to other users.
        </p>

        <p>
          Punt reserves the right to suspend or terminate accounts that violate these terms.
        </p>

        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          Last updated: April 2026.
        </p>
      </div>
    </main>
  );
}
