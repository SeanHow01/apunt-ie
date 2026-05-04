'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--rule)',
  padding: '10px 12px',
  background: 'var(--surface)',
  color: 'var(--ink)',
  fontFamily: 'Inter, sans-serif',
  fontSize: '1rem',
  outline: 'none',
  borderRadius: '2px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
  color: 'var(--ink)',
  marginBottom: '6px',
};

function mapError(code: string | undefined, message: string): string {
  if (!code && message.toLowerCase().includes('user not found')) {
    return "That email isn't registered.";
  }
  return "Couldn't sign you in. Please check your details and try again.";
}

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(mapError(authError.code, authError.message));
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
        {/* Heading */}
        <h1
          className="font-display text-3xl leading-tight mb-8"
          style={{
            color: 'var(--ink)',
            letterSpacing: '-0.02em',
          }}
        >
          Sign in
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Error */}
          {error && (
            <p
              className="font-sans text-sm mb-5"
              role="alert"
              style={{ color: 'var(--accent)' }}
            >
              {error}
            </p>
          )}

          {/* Submit */}
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-full mb-6"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {/* Sign up link */}
        <p
          className="font-sans text-sm text-center"
          style={{ color: 'var(--ink-2)' }}
        >
          Don&rsquo;t have an account?{' '}
          <Link
            href="/sign-up"
            className="underline underline-offset-2"
            style={{ color: 'var(--ink)' }}
          >
            Create one.
          </Link>
        </p>
      </div>
    </main>
  );
}
