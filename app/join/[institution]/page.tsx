import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getCohort, getAllCohortIds } from '@/lib/cohorts';
import { BookOpen, Calculator, CalendarRange, Flame } from 'lucide-react';

type Props = {
  params: Promise<{ institution: string }>;
};

export async function generateStaticParams() {
  return getAllCohortIds().map((id) => ({ institution: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { institution } = await params;
  const cohort = getCohort(institution);
  return {
    title: `${cohort.name} × Punt — Free financial education`,
    description: cohort.body,
  };
}

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Lessons that actually make sense',
    description: 'Payslips, SUSI, auto-enrolment, loans, rent — six short modules built for Irish students.',
  },
  {
    icon: Calculator,
    title: 'Calculators for your real life',
    description: 'Take-home pay, SUSI estimator, buy vs rent, ETF tax, mortgage — built for Irish rules.',
  },
  {
    icon: CalendarRange,
    title: 'Never miss a deadline',
    description: 'The Irish financial calendar keeps all key tax, grant, and savings dates in one place.',
  },
  {
    icon: Flame,
    title: 'The FiRe Up framework',
    description: 'Financial Resilience — a 6-step framework for building lasting money habits.',
  },
];

export default async function JoinPage({ params }: Props) {
  const { institution } = await params;
  const cohort = getCohort(institution);

  // If already signed in, redirect to home
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/home');

  const signUpHref = `/sign-up?cohort=${encodeURIComponent(cohort.id)}&institution=${encodeURIComponent(cohort.institutionName)}`;

  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--rule)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontSize: '1.375rem',
            color: 'var(--accent)',
            letterSpacing: '-0.02em',
            fontStyle: 'italic',
          }}
        >
          Punt
        </span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link
            href="/sign-in"
            className="font-sans text-sm"
            style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
          >
            Sign in
          </Link>
          <Link
            href={signUpHref}
            className="font-sans text-sm font-medium"
            style={{
              padding: '0.375rem 0.875rem',
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-ink)',
              borderRadius: '2px',
              textDecoration: 'none',
            }}
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          maxWidth: '44rem',
          margin: '0 auto',
          padding: '4rem 1.5rem 2rem',
          width: '100%',
        }}
      >
        {/* Institution badge */}
        {cohort.id !== 'generic' && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 0.75rem',
              border: '1px solid var(--rule)',
              borderRadius: '2px',
              marginBottom: '1.5rem',
            }}
          >
            <span
              className="font-sans text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--ink-2)' }}
            >
              For {cohort.fullName} students
            </span>
          </div>
        )}

        <h1
          style={{
            fontSize: 'clamp(2rem, 6vw, 3.25rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.08,
            color: 'var(--ink)',
            margin: '0 0 1.25rem',
          }}
        >
          {cohort.headline}
        </h1>

        <p
          className="font-sans"
          style={{
            fontSize: '1.125rem',
            lineHeight: 1.65,
            color: 'var(--ink-2)',
            margin: '0 0 2rem',
            maxWidth: '38rem',
          }}
        >
          {cohort.body}
        </p>

        {cohort.partnerNote && (
          <p
            className="font-sans text-sm"
            style={{
              color: 'var(--accent)',
              fontWeight: 500,
              marginBottom: '2rem',
            }}
          >
            ✓ {cohort.partnerNote}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link
            href={signUpHref}
            className="font-sans font-semibold"
            style={{
              display: 'inline-block',
              padding: '0.875rem 1.75rem',
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-ink)',
              borderRadius: '2px',
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
            Get started free &rarr;
          </Link>
          <Link
            href="/sign-in"
            className="font-sans"
            style={{
              display: 'inline-block',
              padding: '0.875rem 1.25rem',
              border: '1px solid var(--rule)',
              color: 'var(--ink-2)',
              borderRadius: '2px',
              textDecoration: 'none',
              fontSize: '1rem',
            }}
          >
            Already have an account
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section
        style={{
          maxWidth: '44rem',
          margin: '0 auto',
          padding: '3rem 1.5rem',
          width: '100%',
        }}
      >
        <div
          style={{
            borderTop: '1px solid var(--rule)',
            paddingTop: '2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
            gap: '1.75rem',
          }}
        >
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <Icon
                size={20}
                strokeWidth={1.5}
                style={{ color: 'var(--accent)', marginBottom: '0.75rem' }}
              />
              <h3
                className="font-sans font-semibold"
                style={{
                  fontSize: '0.9375rem',
                  color: 'var(--ink)',
                  marginBottom: '0.375rem',
                }}
              >
                {title}
              </h3>
              <p
                className="font-sans text-sm"
                style={{ color: 'var(--ink-2)', lineHeight: 1.6 }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        style={{
          maxWidth: '44rem',
          margin: '0 auto',
          padding: '1rem 1.5rem 4rem',
          width: '100%',
        }}
      >
        <div
          style={{
            borderTop: '1px solid var(--rule)',
            paddingTop: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
          }}
        >
          <p
            style={{
              fontSize: '1.5rem',
              color: 'var(--ink)',
              letterSpacing: '-0.01em',
              margin: 0,
            }}
          >
            Ready to start?
          </p>
          <Link
            href={signUpHref}
            className="font-sans font-semibold"
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-ink)',
              borderRadius: '2px',
              textDecoration: 'none',
              fontSize: '0.9375rem',
            }}
          >
            Create a free account &rarr;
          </Link>
          <p className="font-sans text-xs" style={{ color: 'var(--ink-2)' }}>
            No credit card. No newsletter. No financial advice.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--rule)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        {[
          { href: '/about', label: 'About' },
          { href: '/privacy', label: 'Privacy' },
          { href: '/terms', label: 'Terms' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="font-sans text-xs"
            style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
          >
            {label}
          </Link>
        ))}
      </footer>
    </main>
  );
}
