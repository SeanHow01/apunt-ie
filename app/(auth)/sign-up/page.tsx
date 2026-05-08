'use client';

import { useState, type FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const INSTITUTIONS = [
  'UCD',
  'TCD',
  'UCC',
  'University of Galway',
  'Maynooth University',
  'DCU',
  'UL',
  'TU Dublin',
  'MTU',
  'ATU',
  'SETU',
  'TUS',
  'Other',
] as const;

const signUpSchema = z.object({
  firstName: z.string().min(1, 'Name is required.'),
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  institution: z.string().min(1, 'Select your institution.'),
});

type FormErrors = Partial<Record<keyof z.infer<typeof signUpSchema>, string>>;

function mapAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('user already registered') || lower.includes('already registered')) {
    return 'That email is already registered. Try signing in.';
  }
  if (lower.includes('password should be at least')) {
    return 'Password must be at least 8 characters.';
  }
  return 'Something went wrong. Please try again.';
}

const cardStyle: React.CSSProperties = {
  backgroundColor: 'var(--surface)',
  border: '1px solid var(--rule)',
  padding: '32px',
  borderRadius: '2px',
};

function VerificationPending({ email, onResend, resendStatus }: {
  email: string;
  onResend: () => void;
  resendStatus: 'idle' | 'sending' | 'sent';
}) {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="w-full max-w-sm" style={cardStyle}>
        <div
          style={{
            width: 48, height: 48, borderRadius: '50%',
            backgroundColor: 'var(--setu-primary-light)',
            border: '1px solid var(--setu-primary-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', marginBottom: '1.25rem',
          }}
        >
          ✉
        </div>

        <h1
          className="font-display"
          style={{ fontSize: '1.75rem', lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--ink)', margin: '0 0 0.75rem' }}
        >
          Check your email
        </h1>

        <p className="font-sans" style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', lineHeight: 1.55, margin: '0 0 0.5rem' }}>
          We&rsquo;ve sent a verification link to{' '}
          <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>{email}</strong>.
          Click the link in the email to activate your account.
        </p>

        <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', lineHeight: 1.5, margin: '0 0 1.5rem' }}>
          The link expires in 24 hours. Check your spam folder if you don&rsquo;t see it within a few minutes.
        </p>

        {resendStatus === 'sent' ? (
          <p
            className="font-sans"
            role="status"
            style={{ fontSize: '0.875rem', color: 'oklch(0.40 0.12 145)', marginBottom: '1.5rem', fontWeight: 500 }}
          >
            ✓ Email resent. Check your inbox again.
          </p>
        ) : (
          <button
            onClick={onResend}
            disabled={resendStatus === 'sending'}
            className="font-sans"
            style={{
              display: 'block', width: '100%',
              padding: '10px 16px', marginBottom: '1.5rem',
              fontSize: '0.9375rem', fontWeight: 500,
              border: '1px solid var(--rule)', borderRadius: '2px',
              backgroundColor: 'var(--paper)', color: 'var(--ink)',
              cursor: resendStatus === 'sending' ? 'wait' : 'pointer',
              opacity: resendStatus === 'sending' ? 0.6 : 1,
            }}
          >
            {resendStatus === 'sending' ? 'Sending…' : 'Resend verification email'}
          </button>
        )}

        <p className="font-sans text-sm text-center" style={{ color: 'var(--ink-2)' }}>
          Already verified?{' '}
          <Link href="/sign-in" className="underline underline-offset-2" style={{ color: 'var(--ink)' }}>
            Sign in.
          </Link>
        </p>
      </div>
    </main>
  );
}

function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cohortId = searchParams.get('cohort') ?? null;
  const institutionParam = searchParams.get('institution') ?? '';

  const [screen, setScreen] = useState<'form' | 'pending'>('form');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState(
    INSTITUTIONS.includes(institutionParam as (typeof INSTITUTIONS)[number])
      ? institutionParam
      : ''
  );
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleResend() {
    if (resendStatus === 'sending' || !submittedEmail) return;
    setResendStatus('sending');
    try {
      const supabase = createClient();
      await supabase.auth.resend({ type: 'signup', email: submittedEmail });
      setResendStatus('sent');
    } catch {
      setResendStatus('idle');
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    const parsed = signUpSchema.safeParse({ firstName, email, password, institution });
    if (!parsed.success) {
      const errors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormErrors;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      const { data, error: authError } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
      });

      if (authError) {
        setServerError(mapAuthError(authError.message));
        return;
      }

      const userId = data.user?.id;
      if (userId) {
        await supabase.from('profiles').insert({
          id: userId,
          first_name: parsed.data.firstName,
          institution_name: parsed.data.institution,
          institution_id: null,
          cohort_id: cohortId ?? null,
          theme: 'punt',
        });
      }

      // If no session was returned, email verification is required
      if (!data.session) {
        setSubmittedEmail(parsed.data.email);
        setScreen('pending');
      } else {
        router.push('/home');
      }
    } catch {
      setServerError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (screen === 'pending') {
    return (
      <VerificationPending
        email={submittedEmail}
        onResend={handleResend}
        resendStatus={resendStatus}
      />
    );
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-16"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="w-full max-w-sm" style={cardStyle}>
        <h1
          className="font-display text-3xl leading-tight mb-8"
          style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
        >
          Create an account
        </h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          aria-describedby={serverError ? 'signup-error' : undefined}
        >
          {/* First name */}
          <div className="mb-5">
            <Input
              id="firstName"
              type="text"
              label="First name"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={fieldErrors.firstName}
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <Input
              id="email"
              type="email"
              label="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <Input
              id="password"
              type="password"
              label="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
            />
          </div>

          {/* Institution */}
          <div className="mb-6">
            <label
              htmlFor="institution"
              className="font-sans"
              style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)', display: 'block', marginBottom: '6px' }}
            >
              Institution
            </label>
            <select
              id="institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="font-sans"
              style={{
                width: '100%',
                border: `1px solid ${fieldErrors.institution ? 'var(--accent)' : 'var(--rule)'}`,
                padding: '10px 12px',
                background: 'var(--surface)',
                color: 'var(--ink)',
                fontSize: '1rem',
                outline: 'none',
                borderRadius: '2px',
                appearance: 'none',
              }}
            >
              <option value="">Select your college or university</option>
              {INSTITUTIONS.map((inst) => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
            {fieldErrors.institution && (
              <p className="font-sans text-sm mt-1" style={{ color: 'var(--accent)' }}>
                {fieldErrors.institution}
              </p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <p
              id="signup-error"
              className="font-sans text-sm mb-5"
              role="alert"
              style={{ color: 'var(--accent)' }}
            >
              {serverError}
            </p>
          )}

          <Button variant="primary" type="submit" disabled={loading} className="w-full mb-6">
            {loading ? 'Creating account…' : 'Create an account'}
          </Button>
        </form>

        <p className="font-sans text-sm text-center" style={{ color: 'var(--ink-2)' }}>
          Already have an account?{' '}
          <Link href="/sign-in" className="underline underline-offset-2" style={{ color: 'var(--ink)' }}>
            Sign in.
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUpForm />
    </Suspense>
  );
}
