'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const cardStyle: React.CSSProperties = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--rule)',
  padding: '32px',
  borderRadius: '2px',
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);

    try {
      const supabase = createClient();
      const origin = window.location.origin;
      await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/auth/callback?next=/reset-password`,
      });
    } catch {
      // Intentionally swallowed — we always show the same message to prevent
      // user enumeration (an attacker must not be able to confirm whether an
      // email address is registered).
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <main
        className="min-h-screen flex items-center justify-center px-6 py-16"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        <div className="w-full max-w-sm" style={cardStyle}>
          <h1
            className="font-display"
            style={{ fontSize: '1.75rem', lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '0 0 0.75rem' }}
          >
            Check your email
          </h1>
          <p className="font-sans" style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', lineHeight: 1.55, margin: '0 0 1.5rem' }}>
            If an account exists for this email, you&rsquo;ll receive a password reset link shortly.
          </p>
          <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
            The link expires in 1 hour. Check your spam folder if you don&rsquo;t see it within a few minutes.
          </p>
          <Link
            href="/sign-in"
            className="font-sans"
            style={{ fontSize: '0.875rem', color: 'var(--ink-2)', textDecoration: 'underline', textUnderlineOffset: 2 }}
          >
            ← Back to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="w-full max-w-sm" style={cardStyle}>
        <h1
          className="font-display text-3xl leading-tight mb-2"
          style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
        >
          Reset your password
        </h1>
        <p className="font-sans mb-8" style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
          Enter your email address and we&rsquo;ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6">
            <Input
              id="email"
              type="email"
              label="Email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button variant="primary" type="submit" disabled={loading || !email.trim()} className="w-full mb-6">
            {loading ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>

        <p className="font-sans text-sm text-center" style={{ color: 'var(--ink-2)' }}>
          <Link href="/sign-in" className="underline underline-offset-2" style={{ color: 'var(--ink-2)' }}>
            ← Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
