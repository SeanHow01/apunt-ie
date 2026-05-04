import Link from 'next/link';

export const metadata = { title: 'Privacy Policy — Punt' };

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: '42rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', textDecoration: 'none' }}>
          ← Punt
        </Link>
      </nav>

      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: '0.5rem',
          color: 'var(--ink)',
        }}
      >
        Privacy Policy
      </h1>
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--ink-2)', marginBottom: '2rem' }}>
        Last updated: April 2026
      </p>

      <div
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          lineHeight: 1.75,
          color: 'var(--ink)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <p>
          Punt (apunt.ie) is operated by Seán Howlin, trading as Punt (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;). This policy explains what data we collect, why we collect it, and
          how we handle it.
        </p>

        <div>
          <h2
            style={{
              fontSize: '1.375rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              color: 'var(--ink)',
              marginBottom: '0.75rem',
            }}
          >
            What we collect
          </h2>
          <p>
            <strong>Account data:</strong> When you create an account, we collect your email
            address and password (stored securely by Supabase). You may optionally provide your
            first name and institution.
          </p>
          <p style={{ marginTop: '0.875rem' }}>
            <strong>Usage data:</strong> We store your module progress (which steps you&rsquo;ve
            completed) and any calculations you choose to save. This is used to provide the
            service — showing your progress and saved calculations when you return.
          </p>
          <p style={{ marginTop: '0.875rem' }}>
            <strong>Survey responses:</strong> If you complete the Punt financial literacy
            survey, your responses are stored anonymously. If you optionally provide your email
            at the end of the survey, it is stored separately from your responses and is not
            linked to them.
          </p>
          <p style={{ marginTop: '0.875rem' }}>
            <strong>Analytics:</strong> We use basic analytics to understand how the site is
            used (pages visited, time spent). No personally identifiable information is collected
            for analytics purposes.
          </p>
        </div>

        <div>
          <h2
            style={{
              fontSize: '1.375rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              color: 'var(--ink)',
              marginBottom: '0.75rem',
            }}
          >
            Why we collect it
          </h2>
          <p>
            We collect account data to provide the service (lawful basis: contract). We collect
            usage and analytics data to improve the platform (lawful basis: legitimate
            interests). We collect survey emails only with your consent, to send you the
            published research report.
          </p>
        </div>

        <div>
          <h2
            style={{
              fontSize: '1.375rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              color: 'var(--ink)',
              marginBottom: '0.75rem',
            }}
          >
            Who we share it with
          </h2>
          <p>
            We do not sell your data. We do not share your data with advertisers or third
            parties for marketing purposes.
          </p>
          <p style={{ marginTop: '0.875rem' }}>We use the following processors to operate the service:</p>
          <ul
            style={{
              paddingLeft: '1.25rem',
              marginTop: '0.625rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.375rem',
            }}
          >
            <li>
              <strong>Supabase</strong> (database and authentication) — EU data hosting
            </li>
            <li>
              <strong>Vercel</strong> (website hosting) — EU data centres available
            </li>
          </ul>
          <p style={{ marginTop: '0.875rem' }}>
            Both processors operate under GDPR-compliant data processing agreements.
          </p>
        </div>

        <div>
          <h2
            style={{
              fontSize: '1.375rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              color: 'var(--ink)',
              marginBottom: '0.75rem',
            }}
          >
            How long we keep it
          </h2>
          <p>
            Account and usage data: retained while your account is active, and for 24 months
            after your last login.
          </p>
          <p style={{ marginTop: '0.875rem' }}>
            Survey emails: deleted after the research report is sent.
          </p>
          <p style={{ marginTop: '0.875rem' }}>
            Analytics data: aggregated and anonymised after 12 months.
          </p>
        </div>

        <div>
          <h2
            style={{
              fontSize: '1.375rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              color: 'var(--ink)',
              marginBottom: '0.75rem',
            }}
          >
            Your rights
          </h2>
          <p>
            Under GDPR, you have the right to access, correct, or delete your personal data at
            any time. To exercise these rights, email{' '}
            <a href="mailto:hello@apunt.ie" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              hello@apunt.ie
            </a>
            . We will respond within 30 days.
          </p>
          <p style={{ marginTop: '0.875rem' }}>
            You also have the right to lodge a complaint with the{' '}
            <a
              href="https://www.dataprotection.ie"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}
            >
              Data Protection Commission
            </a>
            {' '}(dataprotection.ie).
          </p>
        </div>

        <div>
          <h2
            style={{
              fontSize: '1.375rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              color: 'var(--ink)',
              marginBottom: '0.75rem',
            }}
          >
            Contact
          </h2>
          <p>
            <a href="mailto:hello@apunt.ie" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              hello@apunt.ie
            </a>
          </p>
          <p style={{ marginTop: '0.5rem' }}>
            Seán Howlin<br />
            apunt.ie
          </p>
        </div>

      </div>
    </main>
  );
}
