'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <Input
              id="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Error */}
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
