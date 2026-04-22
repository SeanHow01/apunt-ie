'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

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

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
          institution_id: null, // reserved for future SSO/lookup integration
          theme: 'punt',
        });
      }

      router.push('/home');
    } catch {
      setServerError('Something went wrong. Please try again.');
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
            fontFamily: 'Instrument Serif, serif',
          }}
        >
          Create an account
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          {/* First name */}
          <div className="mb-5">
            <label htmlFor="firstName" style={labelStyle}>
              First name
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={inputStyle}
            />
            {fieldErrors.firstName && (
              <p className="font-sans text-sm mt-1" style={{ color: 'var(--accent)' }}>
                {fieldErrors.firstName}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-5">
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            {fieldErrors.email && (
              <p className="font-sans text-sm mt-1" style={{ color: 'var(--accent)' }}>
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-5">
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
            {fieldErrors.password && (
              <p className="font-sans text-sm mt-1" style={{ color: 'var(--accent)' }}>
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Institution */}
          <div className="mb-6">
            <label htmlFor="institution" style={labelStyle}>
              Institution
            </label>
            <select
              id="institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              style={{ ...inputStyle, appearance: 'none' }}
            >
              <option value="">Select your college or university</option>
              {INSTITUTIONS.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
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
              className="font-sans text-sm mb-5"
              role="alert"
              style={{ color: 'var(--accent)' }}
            >
              {serverError}
            </p>
          )}

          {/* Submit */}
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="w-full mb-6"
          >
            {loading ? 'Creating account...' : 'Create an account'}
          </Button>
        </form>

        {/* Sign in link */}
        <p
          className="font-sans text-sm text-center"
          style={{ color: 'var(--ink-2)' }}
        >
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="underline underline-offset-2"
            style={{ color: 'var(--ink)' }}
          >
            Sign in.
          </Link>
        </p>
      </div>
    </main>
  );
}
