import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Check your email — Punt',
  description: 'Confirm your email address to activate your Punt account.',
};

type PageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function ConfirmEmailPage({ searchParams }: PageProps) {
  const { email } = await searchParams;

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div
        className="w-full max-w-sm"
        style={{
          backgroundColor: 'var(--paper)',
          border: '1px solid var(--rule)',
          padding: '32px',
          borderRadius: '2px',
        }}
      >
        {/* Mail glyph */}
        <div
          aria-hidden="true"
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: 'var(--setu-primary-light)',
            border: '1px solid var(--setu-primary-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            marginBottom: '1.25rem',
          }}
        >
          ✉
        </div>

        <h1
          className="font-display"
          style={{
            fontSize: '1.75rem',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
            margin: '0 0 0.75rem',
          }}
        >
          Check your email
        </h1>

        <p
          className="font-sans"
          style={{
            fontSize: '0.9375rem',
            color: 'var(--ink-2)',
            lineHeight: 1.55,
            margin: '0 0 1.25rem',
          }}
        >
          We&rsquo;ve sent a confirmation link to{' '}
          {email ? (
            <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{email}</strong>
          ) : (
            <span style={{ color: 'var(--ink)', fontWeight: 600 }}>your email address</span>
          )}
          . Click the link to activate your account. Check your spam folder if it doesn&rsquo;t
          arrive within a minute.
        </p>

        <div
          style={{
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--rule)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <p
            className="font-sans"
            style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', margin: 0 }}
          >
            Wrong email?{' '}
            <Link
              href="/sign-up"
              className="underline underline-offset-2"
              style={{ color: 'var(--ink-2)' }}
            >
              Sign up again
            </Link>
          </p>
          <p
            className="font-sans"
            style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', margin: 0 }}
          >
            Already confirmed?{' '}
            <Link
              href="/sign-in"
              className="underline underline-offset-2"
              style={{ color: 'var(--ink-2)' }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
