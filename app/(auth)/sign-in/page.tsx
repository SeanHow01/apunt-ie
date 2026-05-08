'use client';

import { useState, type FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function mapError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('user not found') || lower.includes('invalid login credentials')) {
    return "That email isn't registered, or the password is incorrect.";
  }
  return "Couldn't sign you in. Please check your details and try again.";
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlMessage = searchParams.get('message');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [unverified, setUnverified] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleResend() {
    if (resendStatus === 'sending' || !email) return;
    setResendStatus('sending');
    try {
      const supabase = createClient();
      await supabase.auth.resend({ type: 'signup', email });
      setResendStatus('sent');
    } catch {
      setResendStatus('idle');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setUnverified(false);
    setResendStatus('idle');
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        if (authError.message.toLowerCase().includes('email not confirmed')) {
          setUnverified(true);
          return;
        }
        setError(mapError(authError.message));
        return;
      }

      router.push('/home');
    } catch {
      setError("Couldn't sign you in. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div
        className="w-full max-w-sm"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--rule)',
          padding: '32px',
          borderRadius: '2px',
        }}
      >
        <h1
          className="font-display text-3xl leading-tight mb-8"
          style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
        >
          Sign in
        </h1>

        {/* URL message (e.g. from expired verification link) */}
        {urlMessage && (
          <p
            className="font-sans text-sm mb-6"
            role="alert"
            style={{ color: 'var(--ink-2)', border: '1px solid var(--rule)', borderRadius: '2px', padding: '10px 12px', lineHeight: 1.5 }}
          >
            {urlMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate aria-describedby={error ? 'signin-error' : undefined}>
          {/* Email */}
          <div className="mb-5">
            <Input
              id="email"
              type="email"
              label="Email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setUnverified(false); }}
            />
          </div>

          {/* Password with show/hide */}
          <div className="mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="password" className="font-sans" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-sans focus-ring"
                style={{
                  width: '100%',
                  border: '1px solid var(--rule)',
                  padding: '10px 44px 10px 12px',
                  background: 'var(--paper)',
                  color: 'var(--ink)',
                  fontSize: '1rem',
                  outline: 'none',
                  borderRadius: 'var(--radius-sm)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="font-sans"
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--ink-3)', fontSize: '0.8125rem', padding: 0, lineHeight: 1,
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Unverified email error */}
          {unverified && (
            <div
              role="alert"
              className="mb-5"
              style={{
                border: '1px solid oklch(0.82 0.09 80)',
                borderRadius: '2px',
                padding: '12px 14px',
                backgroundColor: 'oklch(0.97 0.04 80)',
              }}
            >
              <p className="font-sans" style={{ fontSize: '0.875rem', color: 'oklch(0.35 0.12 60)', margin: '0 0 8px', lineHeight: 1.5 }}>
                Please verify your email address before signing in. Check your inbox for the verification link.
              </p>
              {resendStatus === 'sent' ? (
                <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'oklch(0.40 0.12 145)', fontWeight: 500, margin: 0 }}>
                  ✓ Verification email resent.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendStatus === 'sending'}
                  className="font-sans"
                  style={{
                    fontSize: '0.8125rem', fontWeight: 500,
                    color: 'oklch(0.35 0.12 60)',
                    background: 'none', border: 'none',
                    padding: 0, cursor: 'pointer', textDecoration: 'underline',
                    opacity: resendStatus === 'sending' ? 0.6 : 1,
                  }}
                >
                  {resendStatus === 'sending' ? 'Sending…' : 'Resend verification email'}
                </button>
              )}
            </div>
          )}

          {/* General error */}
          {error && (
            <p
              id="signin-error"
              className="font-sans text-sm mb-5"
              role="alert"
              style={{ color: 'var(--accent)' }}
            >
              {error}
            </p>
          )}

          <Button variant="primary" type="submit" disabled={loading} className="w-full mb-3">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        {/* Forgot password */}
        <a
          href="/forgot-password"
          className="font-sans"
          style={{
            fontSize: '0.8125rem', color: 'var(--ink-2)',
            textDecoration: 'underline', textDecorationColor: 'var(--rule)',
            textUnderlineOffset: '2px', display: 'block',
            textAlign: 'center', marginBottom: '1.25rem',
          }}
        >
          Forgot your password?
        </a>

        {/* Sign up link */}
        <p className="font-sans text-sm text-center" style={{ color: 'var(--ink-2)' }}>
          Don&rsquo;t have an account?{' '}
          <Link href="/sign-up" className="underline underline-offset-2" style={{ color: 'var(--ink)' }}>
            Create one.
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
