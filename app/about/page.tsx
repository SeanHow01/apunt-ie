import Link from 'next/link';

export const metadata = { title: 'About — Punt' };

export default function AboutPage() {
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
        About Punt
      </h1>

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

        <div>
          <p>
            Punt (apunt.ie) is a free, independent financial education platform for Irish
            third-level students and recent graduates.
          </p>
          <p style={{ marginTop: '0.875rem' }}>
            It was built by Seán Howlin, a 24-year-old from Waterford working in treasury in
            London, because he couldn&rsquo;t find a plain-English Irish resource that explained
            the basics — payslips, pensions, rent, SUSI, mortgages, investing — in a way that
            actually made sense to someone encountering them for the first time.
          </p>
        </div>

        <div>
          <h2
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.375rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              color: 'var(--ink)',
              marginBottom: '0.75rem',
            }}
          >
            What Punt is
          </h2>
          <p>
            Seven modules covering the financial topics most relevant to students and graduates
            in Ireland. Free calculators for take-home pay, pensions, loans, mortgages, and
            investing. A news feed explaining Irish financial events in plain terms, without
            assumed knowledge.
          </p>
          <p style={{ marginTop: '0.875rem' }}>
            Everything is written for the Irish system specifically — PAYE, USC, PRSI, SUSI,
            Help to Buy, auto-enrolment — not adapted from UK or US content.
          </p>
        </div>

        <div>
          <h2
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.375rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              color: 'var(--ink)',
              marginBottom: '0.75rem',
            }}
          >
            What Punt is not
          </h2>
          <p>
            Punt is not financial advice. It explains how things work; it does not tell you
            what to do. For advice tailored to your situation, speak to a financial advisor or
            contact MABS on{' '}
            <a href="tel:0818072000" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              0818 07 2000
            </a>
            .
          </p>
          <p style={{ marginTop: '0.875rem' }}>
            Punt is not affiliated with any bank, lender, or financial institution. It carries
            no affiliate links and earns no commission from any financial product recommendation.
            Independence is the point.
          </p>
        </div>

        <div>
          <h2
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.375rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              color: 'var(--ink)',
              marginBottom: '0.75rem',
            }}
          >
            Editorial approach
          </h2>
          <p>
            Every module and article is written in plain English, in the second person, at a
            level accessible to someone with no financial background. Financial terms are defined
            on first use. Numbers are shown in concrete Irish-system terms. No jargon, no hedging,
            no advice.
          </p>
          <p style={{ marginTop: '0.875rem' }}>
            Sources for all figures, rates, and thresholds are listed at{' '}
            <Link href="/sources" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              apunt.ie/sources
            </Link>
            .
          </p>
        </div>

        <div>
          <h2
            style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: '1.375rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.2,
              color: 'var(--ink)',
              marginBottom: '0.75rem',
            }}
          >
            Get in touch
          </h2>
          <p>
            <a
              href="mailto:hello@apunt.ie"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}
            >
              hello@apunt.ie
            </a>
          </p>
          <p style={{ marginTop: '0.875rem' }}>
            Punt is a side project, built and maintained by one person. Response times may be
            slow but every email is read.
          </p>
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', marginTop: '1rem' }}>
          Last updated: April 2026
        </p>
      </div>
    </main>
  );
}
