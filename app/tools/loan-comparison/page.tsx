'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LoanInputs } from '@/components/tools/LoanInputs';
import { LoanResults } from '@/components/tools/LoanResults';
import { SavedLoansDropdown } from '@/components/tools/SavedLoansDropdown';
import { ComparisonSummary } from '@/components/tools/ComparisonSummary';
import { Button } from '@/components/ui/Button';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { calculateLoan, compareLoans } from '@/lib/loans';
import type { LenderType, LoanInput } from '@/lib/loans';
import { createClient } from '@/lib/supabase/client';

type PanelState = {
  amountCents: number;
  termMonths: number;
  aprBps: number;
  lenderType: LenderType | '';
  label: string;
};

const defaultA: PanelState = {
  amountCents: 500000,
  termMonths: 36,
  aprBps: 900,
  lenderType: '',
  label: '',
};

const defaultB: PanelState = {
  amountCents: 500000,
  termMonths: 60,
  aprBps: 900,
  lenderType: '',
  label: '',
};

function usePanelState(initial: PanelState) {
  const [amountCents, setAmountCents] = useState(initial.amountCents);
  const [termMonths, setTermMonths] = useState(initial.termMonths);
  const [aprBps, setAprBps] = useState(initial.aprBps);
  const [lenderType, setLenderType] = useState<LenderType | ''>(initial.lenderType);
  const [label, setLabel] = useState(initial.label);

  function loadSaved(saved: PanelState) {
    setAmountCents(saved.amountCents);
    setTermMonths(saved.termMonths);
    setAprBps(saved.aprBps);
    setLenderType(saved.lenderType);
    setLabel(saved.label);
  }

  const state: PanelState = { amountCents, termMonths, aprBps, lenderType, label };

  const props = {
    amountCents,
    termMonths,
    aprBps,
    lenderType,
    label,
    onAmountChange: setAmountCents,
    onTermChange: setTermMonths,
    onAprChange: setAprBps,
    onLenderTypeChange: setLenderType,
    onLabelChange: setLabel,
    loadSaved,
  };

  return { state, props };
}

interface SavePanelButtonProps {
  userId: string;
  panel: PanelState;
  panelName: string;
}

function SavePanelButton({ userId, panel, panelName }: SavePanelButtonProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const supabase = createClient();
      await supabase.from('saved_loans').insert({
        user_id: userId,
        label: panel.label || panelName,
        amount_cents: panel.amountCents,
        term_months: panel.termMonths,
        apr_bps: panel.aprBps,
        lender_type: panel.lenderType || 'other',
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
      <Button variant="secondary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save this'}
      </Button>
      {saved && (
        <span style={{ fontSize: '0.8125rem', color: 'var(--accent)' }}>Saved!</span>
      )}
    </div>
  );
}

interface LoanPanelProps {
  heading: string;
  userId: string | null;
  inputProps: {
    amountCents: number;
    termMonths: number;
    aprBps: number;
    lenderType: LenderType | '';
    label: string;
    onAmountChange: (v: number) => void;
    onTermChange: (v: number) => void;
    onAprChange: (v: number) => void;
    onLenderTypeChange: (v: LenderType | '') => void;
    onLabelChange: (v: string) => void;
    loadSaved: (s: PanelState) => void;
  };
  panelState: PanelState;
}

function LoanPanel({ heading, userId, inputProps, panelState }: LoanPanelProps) {
  const output = calculateLoan({
    principalCents: panelState.amountCents,
    termMonths: panelState.termMonths,
    aprBps: panelState.aprBps,
  });

  const { loadSaved, ...loanInputProps } = inputProps;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Eyebrow>{heading}</Eyebrow>

      {userId && (
        <SavedLoansDropdown
          userId={userId}
          onSelect={(saved) =>
            loadSaved({
              amountCents: saved.amountCents,
              termMonths: saved.termMonths,
              aprBps: saved.aprBps,
              lenderType: saved.lenderType,
              label: saved.label,
            })
          }
        />
      )}

      <LoanInputs compact {...loanInputProps} />

      <LoanResults compact output={output} principalCents={panelState.amountCents} />

      {userId && (
        <SavePanelButton userId={userId} panel={panelState} panelName={heading} />
      )}
    </div>
  );
}

export default function LoanComparisonPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  const { state: panelA, props: propsA } = usePanelState(defaultA);
  const { state: panelB, props: propsB } = usePanelState(defaultB);

  const outputA = calculateLoan({
    principalCents: panelA.amountCents,
    termMonths: panelA.termMonths,
    aprBps: panelA.aprBps,
  });

  const outputB = calculateLoan({
    principalCents: panelB.amountCents,
    termMonths: panelB.termMonths,
    aprBps: panelB.aprBps,
  });

  const bothValid =
    outputA.totalRepaidCents > 0 && outputB.totalRepaidCents > 0;

  const comparison = bothValid ? compareLoans(outputA, outputB) : null;

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 pt-10 md:pt-14 pb-8">
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
        Compare two loans
      </h1>

      {/* Italic subhead */}
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: '1.125rem',
          color: 'var(--ink-2)',
          margin: '0 0 1rem',
        }}
      >
        See how different terms and rates change the total cost.
      </p>

      {/* Context paragraph */}
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: '0.9375rem',
          color: 'var(--ink)',
          margin: '0 0 1rem',
          lineHeight: 1.65,
        }}
      >
        A lower monthly payment isn't always cheaper overall. A longer term usually means smaller
        monthly payments but more interest paid in total. This tool compares the numbers — the right
        choice depends on your full picture, which this tool can't see.
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

      {/* Mobile: stacked, hidden on sm+ */}
      <div className="sm:hidden" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <LoanPanel heading="Loan A" userId={userId} inputProps={propsA} panelState={panelA} />
        {comparison && (
          <ComparisonSummary
            comparison={comparison}
            labelA={panelA.label}
            labelB={panelB.label}
            outputA={outputA}
            outputB={outputB}
          />
        )}
        <LoanPanel heading="Loan B" userId={userId} inputProps={propsB} panelState={panelB} />
      </div>

      {/* Tablet (sm–lg): two panels side-by-side, summary below */}
      <div className="hidden sm:block lg:hidden">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          <LoanPanel heading="Loan A" userId={userId} inputProps={propsA} panelState={panelA} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '2.5rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.25rem', color: 'var(--ink-2)', userSelect: 'none' }}>
              vs.
            </span>
          </div>
          <LoanPanel heading="Loan B" userId={userId} inputProps={propsB} panelState={panelB} />
        </div>
        {comparison && (
          <div style={{ marginTop: '2rem' }}>
            <Rule />
            <ComparisonSummary
              comparison={comparison}
              labelA={panelA.label}
              labelB={panelB.label}
              outputA={outputA}
              outputB={outputB}
            />
          </div>
        )}
      </div>

      {/* Desktop (lg+): three-column — Panel A | Comparison | Panel B */}
      <div
        className="hidden lg:grid lg:items-start"
        style={{ gridTemplateColumns: '4fr 3fr 4fr', gap: '2rem', alignItems: 'start' }}
      >
        <LoanPanel heading="Loan A" userId={userId} inputProps={propsA} panelState={panelA} />

        {/* Middle: comparison summary or placeholder */}
        <div style={{ paddingTop: '0.5rem' }}>
          {comparison ? (
            <ComparisonSummary
              comparison={comparison}
              labelA={panelA.label}
              labelB={panelB.label}
              outputA={outputA}
              outputB={outputB}
            />
          ) : (
            <p
              className="font-sans text-sm italic text-center"
              style={{ color: 'var(--ink-2)', marginTop: '4rem' }}
            >
              Enter both loans<br />to compare
            </p>
          )}
        </div>

        <LoanPanel heading="Loan B" userId={userId} inputProps={propsB} panelState={panelB} />
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
        lender's official quote before signing. This is a comparison of the numbers you entered,
        not a recommendation.
      </p>
    </main>
  );
}
