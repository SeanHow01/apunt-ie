import { EditorialPage } from '@/components/layout/EditorialPage';

export const metadata = { title: 'Terms — Punt' };

export default function TermsPage() {
  return (
    <EditorialPage title="Terms of use" lastUpdated="April 2026">
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', lineHeight: 1.7, color: 'var(--ink)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p
          style={{
            border: '1px solid var(--accent)',
            borderRadius: '4px',
            padding: '0.875rem 1rem',
            backgroundColor: 'oklch(0.60 0.19 27 / 0.06)',
            fontSize: '0.9375rem',
          }}
        >
          <strong>Note:</strong> These are placeholder terms. Full terms of service are required before Punt launches at scale. Contact{' '}
          <a href="mailto:admin@apunt.ie" style={{ color: 'var(--accent)' }}>admin@apunt.ie</a>{' '}
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
      </div>
    </EditorialPage>
  );
}
