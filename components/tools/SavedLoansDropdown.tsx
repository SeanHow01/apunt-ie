'use client';

import { useEffect, useState } from 'react';
import type { LenderType } from '@/lib/loans';
import { createClient } from '@/lib/supabase/client';

type SavedLoan = {
  id: string;
  label: string;
  amount_cents: number;
  term_months: number;
  apr_bps: number;
  lender_type: LenderType | null;
};

type SelectedLoan = {
  label: string;
  amountCents: number;
  termMonths: number;
  aprBps: number;
  lenderType: LenderType | '';
};

type Props = {
  userId: string | null;
  onSelect: (loan: SelectedLoan) => void;
};

export function SavedLoansDropdown({ userId, onSelect }: Props) {
  const [loans, setLoans] = useState<SavedLoan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    setLoading(true);

    const supabase = createClient();
    supabase
      .from('saved_loans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data) {
          setLoans(data as SavedLoan[]);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (!userId) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    const loan = loans.find((l) => l.id === id);
    if (!loan) return;

    onSelect({
      label: loan.label ?? '',
      amountCents: loan.amount_cents,
      termMonths: loan.term_months,
      aprBps: loan.apr_bps,
      lenderType: loan.lender_type ?? '',
    });

    // Reset select back to placeholder after selection
    e.target.value = '';
  };

  return (
    <div>
      <label
        htmlFor="saved-loans-select"
        style={{
          color: 'var(--ink)',
          display: 'block',
          marginBottom: '6px',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        Load a saved loan
      </label>
      <select
        id="saved-loans-select"
        onChange={handleChange}
        disabled={loading || loans.length === 0}
        defaultValue=""
        style={{
          border: '1px solid var(--rule)',
          padding: '10px 12px',
          background: 'var(--surface)',
          color: 'var(--ink)',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.875rem',
          borderRadius: '2px',
          width: '100%',
          cursor: loans.length === 0 ? 'default' : 'pointer',
          appearance: 'auto',
          outline: 'none',
        }}
        aria-label="Load a saved loan"
      >
        <option value="" disabled>
          {loading
            ? 'Loading...'
            : loans.length === 0
            ? 'No saved loans'
            : 'Load a saved loan...'}
        </option>
        {loans.map((loan) => (
          <option key={loan.id} value={loan.id}>
            {loan.label || 'Untitled loan'}
            {loan.lender_type ? ` — ${loan.lender_type.replace('_', ' ')}` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
