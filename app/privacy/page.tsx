import Link from 'next/link';

export const metadata = { title: 'Privacy — Punt' };

export default function PrivacyPage() {
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
        Privacy
      </h1>

      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', lineHeight: 1.7, color: '#1A1A1A', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p
          style={{
            border: '1px solid #E94F37',
            borderRadius: '4px',
            padding: '0.875rem 1rem',
            backgroundColor: 'rgba(233, 79, 55, 0.05)',
            fontSize: '0.9375rem',
            color: '#1A1A1A',
          }}
        >
          <strong>Note:</strong> This is a placeholder. A full privacy policy is required before Punt processes personal data at scale. If you are an institutional partner or reviewing for procurement, please contact{' '}
          <a href="mailto:hello@apunt.ie" style={{ color: '#E94F37' }}>hello@apunt.ie</a>{' '}
          for the current data processing agreement.
        </p>

        <p>
          Punt collects the minimum data necessary to operate: your email address (for authentication), your first name and institution (if you choose to provide them), and your lesson progress. We do not sell your data or use it for advertising.
        </p>

        <p>
          All data is processed under GDPR. You have the right to access, correct, or delete your data at any time. To exercise these rights, email{' '}
          <a href="mailto:hello@apunt.ie" style={{ color: '#E94F37', textDecoration: 'none' }}>hello@apunt.ie</a>.
        </p>

        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          Last updated: April 2026. This policy will be replaced with a full legal document before the platform launches at scale.
        </p>
      </div>
    </main>
  );
}
