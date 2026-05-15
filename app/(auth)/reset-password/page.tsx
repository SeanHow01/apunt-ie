'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import {
  validatePassword,
  getPasswordStrength,
  PASSWORD_REQUIREMENTS,
} from '@/lib/auth/password-validation';

const STRENGTH_COLORS = {
  weak: 'oklch(55% 0.20 25)',
  fair: 'oklch(70% 0.18 85)',
  strong: 'oklch(55% 0.18 145)',
} as const;

const cardStyle: React.CSSProperties = {
  backgroundColor: 'var(--paper)',
  border: '1px solid var(--rule)',
  padding: '32px',
  borderRadius: '2px',
};

function PasswordField({
  id,
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  error,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  error?: string;
}) {
  const [show, setShow] = useState(false);
  const errorId = `${id}-error`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label htmlFor={id} className="font-sans" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--ink)' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete="new-password"
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className="font-sans focus-ring"
          style={{
            width: '100%',
            border: `1px solid ${error ? 'var(--accent)' : 'var(--rule)'}`,
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
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="font-sans"
          style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--ink-3)', fontSize: '0.8125rem', padding: 0, lineHeight: 1,
          }}
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="font-sans" style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 500, margin: 0 }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validation = validatePassword(password);
  const strength = getPasswordStrength(validation);
  const canSubmit = !loading && validation.isValid && confirmPassword.length > 0 && password === confirmPassword;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    setConfirmError(null);

    if (!validation.isValid) return;

    if (password !== confirmPassword) {
      setConfirmError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setServerError(error.message ?? 'Could not update your password. Please try again.');
        return;
      }
      router.push('/home?message=Password+updated+successfully');
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
      <div className="w-full max-w-sm" style={cardStyle}>
        <h1
          className="font-display text-3xl leading-tight mb-2"
          style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
        >
          Choose a new password
        </h1>
        <p className="font-sans mb-8" style={{ fontSize: '0.9375rem', color: 'var(--ink-2)', lineHeight: 1.5 }}>
          Your new password must meet all security requirements.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* New password with strength indicator */}
          <div className="mb-5">
            <PasswordField
              id="password"
              label="New password"
              value={password}
              onChange={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />

            {/* Strength bar */}
            {password.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ height: 4, background: 'var(--rule)', borderRadius: 2 }}>
                  <div style={{
                    height: '100%', borderRadius: 2,
                    width: strength === 'weak' ? '33%' : strength === 'fair' ? '66%' : '100%',
                    background: STRENGTH_COLORS[strength],
                    transition: 'width 0.2s ease, background 0.2s ease',
                  }} />
                </div>
              </div>
            )}

            {/* Requirements checklist */}
            {(passwordFocused || password.length > 0) && (
              <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
                {PASSWORD_REQUIREMENTS.map(({ key, label }) => (
                  <li
                    key={key}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2,
                      color: validation[key] ? 'oklch(55% 0.18 145)' : 'var(--ink-3)',
                      fontSize: '0.75rem', fontFamily: 'var(--font-sans)',
                    }}
                  >
                    <span style={{ width: '1ch', flexShrink: 0 }}>{validation[key] ? '✓' : '○'}</span>
                    {label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm password */}
          <div className="mb-6">
            <PasswordField
              id="confirmPassword"
              label="Confirm new password"
              value={confirmPassword}
              onChange={(v) => { setConfirmPassword(v); setConfirmError(null); }}
              error={confirmError ?? undefined}
            />
          </div>

          {serverError && (
            <p
              className="font-sans text-sm mb-5"
              role="alert"
              style={{ color: 'var(--accent)' }}
            >
              {serverError}
            </p>
          )}

          <Button variant="primary" type="submit" disabled={!canSubmit} className="w-full">
            {loading ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </div>
    </main>
  );
}
