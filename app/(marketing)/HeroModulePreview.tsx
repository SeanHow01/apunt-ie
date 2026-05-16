'use client';

import { useState } from 'react';

/* ─────────────────────────────────────────────────────────────────────────
 * HeroModulePreview
 * Interactive payslip walkthrough on the marketing landing page. Mirrors
 * the actual payslip module's 5 steps + a final recap, matched to the
 * 6-step pip count in the chrome. Clicking "Next →" advances and (at the
 * end) restarts so the preview can be cycled indefinitely.
 *
 * Visual treatment is unchanged from the original Server-Component render;
 * only the static markup has been promoted to a Client Component with
 * useState to make the navigation work.
 * ─────────────────────────────────────────────────────────────────────────*/

type LedgerRowKey = 'gross' | 'paye' | 'usc' | 'prsi';

type Step = {
  label: string;
  body: string;
  /** Which ledger row, if any, gets the primary (highlighted) treatment. */
  highlight: LedgerRowKey | 'net' | null;
};

const STEPS: Step[] = [
  {
    label: 'Gross pay',
    body:
      'This is what the job pays before anyone takes a cut. Your salary, written on your contract, divided by twelve.',
    highlight: 'gross',
  },
  {
    label: 'PAYE',
    body:
      'Pay As You Earn is income tax, collected by your employer on behalf of Revenue. 20% on the first €44,000, then 40% above that.',
    highlight: 'paye',
  },
  {
    label: 'USC',
    body:
      'The Universal Social Charge is a separate tax on income. It starts at 0.5% and rises to 8% on earnings above €70,044.',
    highlight: 'usc',
  },
  {
    label: 'PRSI',
    body:
      'Pay Related Social Insurance is 4.1% of your gross pay. It funds your state pension, maternity benefit, and illness benefit.',
    highlight: 'prsi',
  },
  {
    label: 'Net pay',
    body:
      'This is what lands in your account. Everything else on the payslip is an explanation of how you got here from gross.',
    highlight: 'net',
  },
  {
    label: 'Recap',
    body:
      'Gross minus PAYE, USC, and PRSI. That gap — about a fifth on a starter salary — is where money goes before you see it.',
    highlight: null,
  },
];

const LEDGER_ROWS: { key: LedgerRowKey; label: string; value: string }[] = [
  { key: 'gross', label: 'GROSS', value: '€2,917' },
  { key: 'paye', label: 'PAYE', value: '−€432' },
  { key: 'usc', label: 'USC', value: '−€68' },
  { key: 'prsi', label: 'PRSI', value: '−€120' },
];

export function HeroModulePreview() {
  const [currentStep, setCurrentStep] = useState(0);
  const isLast = currentStep === STEPS.length - 1;
  const step = STEPS[currentStep];

  // At the end, "Next" wraps back to step 0 so the preview can keep cycling.
  function handleNext() {
    setCurrentStep((s) => (s >= STEPS.length - 1 ? 0 : s + 1));
  }

  return (
    <div
      role="region"
      aria-label="Payslip module preview"
      style={{
        background: 'var(--paper)',
        border: '1px solid var(--rule)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.5rem',
        boxShadow:
          '0 12px 48px oklch(0.20 0 0 / 0.09), 0 2px 6px oklch(0.20 0 0 / 0.04)',
        userSelect: 'none',
        maxWidth: '440px',
      }}
    >
      {/* Module chrome */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <span className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--ink-3)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
          Module 01 · 3 min
        </span>
        <span style={{ display: 'flex', gap: '5px' }} aria-hidden="true">
          {STEPS.map((_, i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: i === currentStep ? 'var(--accent)' : 'var(--rule)',
              }}
            />
          ))}
        </span>
      </div>

      {/* Step label */}
      <p className="font-mono" style={{ fontSize: '0.6875rem', color: 'var(--accent)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 0.25rem' }}>
        Step {currentStep + 1} — {step.label}
      </p>

      {/* Module title */}
      <h3 className="font-display" style={{ fontSize: '1.1875rem', lineHeight: 1.2, letterSpacing: '-0.01em', color: 'var(--ink)', margin: '0 0 0.625rem' }}>
        Your payslip, line by line
      </h3>

      {/* Step body */}
      <p
        className="font-sans"
        style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--ink-2)', margin: '0 0 1.125rem' }}
        aria-live="polite"
      >
        {step.body}
      </p>

      {/* Ledger */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 0.875rem', marginBottom: '1rem' }}>
        {LEDGER_ROWS.map(({ key, label, value }, i) => {
          const primary = step.highlight === key;
          return (
            <div
              key={label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '0.25rem 0',
                borderBottom: i < LEDGER_ROWS.length - 1 ? '1px solid var(--rule)' : 'none',
              }}
            >
              <span className="font-mono" style={{ fontSize: '0.625rem', color: 'var(--ink-3)', letterSpacing: '0.08em' }}>{label}</span>
              <span className="font-mono" style={{ fontSize: '0.75rem', color: primary ? 'var(--ink)' : 'var(--ink-2)' }}>{value}</span>
            </div>
          );
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '0.5rem', marginTop: '0.125rem' }}>
          <span className="font-mono" style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.08em' }}>NET</span>
          <span className="font-mono" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)' }}>€2,297</span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '2px', background: 'var(--rule)', borderRadius: '1px', marginBottom: '0.875rem' }} aria-hidden="true">
        <div
          style={{
            width: `${((currentStep + 1) / STEPS.length) * 100}%`,
            height: '100%',
            background: 'var(--accent)',
            borderRadius: '1px',
            transition: 'width 0.2s ease',
          }}
        />
      </div>

      {/* Nav strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          className="font-mono"
          style={{ fontSize: '0.625rem', color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          aria-live="polite"
        >
          {currentStep + 1} of {STEPS.length}
        </span>
        <button
          type="button"
          onClick={handleNext}
          className="font-sans"
          aria-label={isLast ? 'Restart payslip preview' : `Go to step ${currentStep + 2}`}
          style={{
            fontSize: '0.8125rem',
            color: 'var(--accent)',
            fontWeight: 500,
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {isLast ? 'Restart ↻' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
