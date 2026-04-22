'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LoanInputs } from '@/components/tools/LoanInputs';
import { LoanResults } from '@/components/tools/LoanResults';
import { AmortisationBars } from '@/components/tools/AmortisationBars';
import { Button } from '@/components/ui/Button';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { calculateLoan } from '@/lib/loans';
import type { LenderType } from '@/lib/loans';
import { createClient } from '@/lib/supabase/client';

export default function LoanCalculatorPage() {
  const [amountCents, setAmountCents] = useState(500000);
  const [termMonths, setTermMonths] = useState(36);
  const [aprBps, setAprBps] = useState(900);
  const [lenderType, setLenderType] = useState<LenderType | ''>('');
  const [label, setLabel] = useState('');

  const [userId, setUserId] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveLabel, setSaveLabel] = useState('');
  const [saveLenderType, setSaveLenderType] = useState<LenderType | ''>('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const output = calculateLoan({
    principalCents: amountCents,
    termMonths,
    aprBps,
  });

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const supabase = createClient();
      await supabase.from('saved_loans').insert({
        user_id: userId,
        label: saveLabel || label || 'My loan',
        amount_cents: amountCents,
        term_months: termMonths,
        apr_bps: aprBps,
        lender_type: saveLenderType || lenderType || 'other',
      });
      setSaveSuccess(true);
      setShowSaveDialog(false);
      setSaveLabel('');
      setSaveLenderType('');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Back link */}
      <Link
        href="/home"
        style={{
          fontSize: '0.8125rem',
          color: 'var(--ink-2)',
          textDecoration: 'none',
          display: 'inline-block',
          marginBottom: '1.25rem',
        }}
      >
        ← Back to home
      </Link>

      {/* Eyebrow */}
      <Eyebrow>Tool</Eyebrow>

      {/* Heading */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '0.25rem 0 0.5rem',
          color: 'var(--ink)',
        }}
      >
        Loan calculator
      </h1>

      {/* Subhead */}
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: '1.125rem',
          color: 'var(--ink-2)',
          margin: '0 0 1rem',
        }}
      >
        Work out what a loan actually costs.
      </p>

      {/* Regulatory disclaimer */}
      <p
        style={{
          fontSize: '0.8125rem',
          fontStyle: 'italic',
          color: 'var(--ink-2)',
          margin: '0 0 1.5rem',
          lineHeight: 1.6,
        }}
      >
        Punt provides financial education, not financial advice. For regulated advice, consult an
        authorised financial advisor or contact{' '}
        <a
          href="https://mabs.ie"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent)' }}
        >
          MABS (mabs.ie)
        </a>{' '}
        for free money advice.
      </p>

      <Rule />

      {/* Shared panel — inputs left, results right */}
      <div
        style={{
          border: '1px solid var(--rule)',
          borderRadius: '8px',
          backgroundColor: 'var(--surface)',
          overflow: 'hidden',
          marginTop: '2rem',
        }}
      >
        <div className="flex flex-col lg:grid lg:grid-cols-12">

          {/* Left: 5/12 — inputs + save + compare */}
          <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col gap-6">
            <LoanInputs
              amountCents={amountCents}
              termMonths={termMonths}
              aprBps={aprBps}
              lenderType={lenderType}
              label={label}
              onAmountChange={setAmountCents}
              onTermChange={setTermMonths}
              onAprChange={setAprBps}
              onLenderTypeChange={setLenderType}
              onLabelChange={setLabel}
            />

            {/* Save / sign-in section */}
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--rule)' }}>
              {userId !== null ? (
                <div>
                  {!showSaveDialog ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <Button variant="secondary" onClick={() => setShowSaveDialog(true)}>
                        Save this calculation
                      </Button>
                      {saveSuccess && (
                        <span style={{ fontSize: '0.875rem', color: 'var(--accent)' }}>Saved!</span>
                      )}
                      <Link
                        href="/tools/loan-comparison"
                        style={{
                          fontSize: '0.9375rem',
                          color: 'var(--accent)',
                          textDecoration: 'none',
                        }}
                      >
                        Compare two loans →
                      </Link>
                    </div>
                  ) : (
                    <div
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--rule)',
                        borderRadius: '0.5rem',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.875rem',
                      }}
                    >
                      <p
                        style={{
                          fontWeight: 600,
                          fontSize: '0.9375rem',
                          color: 'var(--ink)',
                          margin: 0,
                        }}
                      >
                        Save this calculation
                      </p>

                      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--ink-2)' }}>Label</span>
                        <input
                          type="text"
                          value={saveLabel}
                          onChange={(e) => setSaveLabel(e.target.value)}
                          placeholder={label || 'My loan'}
                          style={{
                            padding: '0.5rem 0.75rem',
                            border: '1px solid var(--rule)',
                            borderRadius: '0.375rem',
                            background: 'var(--bg)',
                            color: 'var(--ink)',
                            fontSize: '0.9375rem',
                            outline: 'none',
                          }}
                        />
                      </label>

                      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--ink-2)' }}>Lender type</span>
                        <select
                          value={saveLenderType}
                          onChange={(e) => setSaveLenderType(e.target.value as LenderType | '')}
                          style={{
                            padding: '0.5rem 0.75rem',
                            border: '1px solid var(--rule)',
                            borderRadius: '0.375rem',
                            background: 'var(--bg)',
                            color: 'var(--ink)',
                            fontSize: '0.9375rem',
                            outline: 'none',
                          }}
                        >
                          <option value="">{lenderType || 'Select…'}</option>
                          <option value="bank">Bank</option>
                          <option value="credit_union">Credit union</option>
                          <option value="online">Online lender</option>
                          <option value="other">Other</option>
                        </select>
                      </label>

                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Button onClick={handleSave} disabled={saving}>
                          {saving ? 'Saving…' : 'Save'}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setShowSaveDialog(false);
                            setSaveLabel('');
                            setSaveLenderType('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {!showSaveDialog && (
                    <div style={{ marginTop: '1rem' }}>
                      <Link
                        href="/tools/loan-comparison"
                        style={{
                          fontSize: '0.9375rem',
                          color: 'var(--accent)',
                          textDecoration: 'none',
                        }}
                      >
                        Compare two loans →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <p
                  style={{
                    fontSize: '0.9375rem',
                    color: 'var(--ink-2)',
                    margin: 0,
                  }}
                >
                  Sign in to save and compare loans.
                </p>
              )}
            </div>
          </div>

          {/* Right: 7/12 — results + amortisation bars */}
          <div
            className="lg:col-span-7 p-6 lg:p-8"
            style={{ borderTop: '1px solid var(--rule)' }}
          >
            <LoanResults output={output} principalCents={amountCents} />
            <div style={{ marginTop: '1.5rem' }}>
              <AmortisationBars breakdown={output.breakdown} termMonths={termMonths} />
            </div>
          </div>

        </div>
      </div>

      {/* Footer disclaimer */}
      <p
        style={{
          fontFamily: 'var(--font-sans)',
          fontStyle: 'italic',
          fontSize: '0.8125rem',
          color: 'var(--ink-2)',
          marginTop: '2rem',
          lineHeight: 1.6,
        }}
      >
        A guide, not financial advice. Actual rates and terms vary by lender. Always check the
        lender's official quote before signing.
      </p>
    </main>
  );
}
