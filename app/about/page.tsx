import Link from 'next/link';

export const metadata = { title: 'About — Punt' };

export default function AboutPage() {
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
        About Punt
      </h1>

      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem', lineHeight: 1.7, color: '#1A1A1A', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p>
          Punt is a financial literacy platform built for Irish third-level students. The name comes from the old Irish pound — a small nod to the history of money in Ireland.
        </p>
        <p>
          The platform is built in partnership with MABS (the Money Advice and Budgeting Service), the government-funded service that provides free, independent money advice to people in Ireland. Punt&rsquo;s curriculum is built around practical, Irish-specific financial knowledge: understanding your payslip, navigating the student grant system, knowing your rights as a renter, and planning for the longer term.
        </p>
        <p>
          The goal is simple: give every student in Ireland access to the financial knowledge that should have been taught in school — plainly, honestly, and without selling anything. Punt is funded through a partnership with the Higher Education Authority and participating institutions, not through advertising or product commissions.
        </p>
        <p style={{ color: '#666', fontSize: '0.9375rem' }}>
          Questions?{' '}
          <Link href="/contact" style={{ color: '#E94F37' }}>Get in touch.</Link>
        </p>
      </div>
    </main>
  );
}
