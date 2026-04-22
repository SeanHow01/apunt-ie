'use client';

import type { LenderType } from '@/lib/loans';

type Props = {
  amountCents: number;
  termMonths: number;
  aprBps: number;
  lenderType: LenderType | '';
  label: string;
  onAmountChange: (cents: number) => void;
  onTermChange: (months: number) => void;
  onAprChange: (bps: number) => void;
  onLenderTypeChange: (t: LenderType | '') => void;
  onLabelChange: (s: string) => void;
  compact?: boolean;
};

const LENDER_OPTIONS: { value: LenderType; label: string }[] = [
  { value: 'credit_union', label: 'Credit Union' },
  { value: 'bank', label: 'Bank' },
  { value: 'hire_purchase', label: 'Hire Purchase' },
  { value: 'bnpl', label: 'BNPL' },
  { value: 'other', label: 'Other' },
];

function formatTerm(months: number): string {
  if (months <= 0) return '—';
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem} month${rem !== 1 ? 's' : ''}`;
  if (rem === 0) return `${years} year${years !== 1 ? 's' : ''}`;
  return `${years} year${years !== 1 ? 's' : ''} ${rem} month${rem !== 1 ? 's' : ''}`;
}

const inputStyle: React.CSSProperties = {
  border: '1px solid var(--rule)',
  padding: '10px 12px',
  background: 'var(--surface)',
  color: 'var(--ink)',
  fontFamily: 'Inter, system-ui, sans-serif',
  borderRadius: '2px',
  width: '100%',
  fontSize: '0.875rem',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  color: 'var(--ink)',
  display: 'block',
  marginBottom: '6px',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '0.875rem',
  fontWeight: 500,
};

const sliderStyle: React.CSSProperties = {
  width: '100%',
  accentColor: 'var(--accent)',
  marginTop: '8px',
  cursor: 'pointer',
};

export function LoanInputs({
  amountCents,
  termMonths,
  aprBps,
  lenderType,
  label,
  onAmountChange,
  onTermChange,
  onAprChange,
  onLenderTypeChange,
  onLabelChange,
  compact = false,
}: Props) {
  const amountEuros = amountCents / 100;
  const aprPct = aprBps / 100;

  const gap = compact ? 'gap-4' : 'gap-6';

  return (
    <div className={`flex flex-col ${gap}`}>
      {/* Loan amount */}
      <div>
        <label style={labelStyle}>Loan amount</label>
        <p
          className="tabular-nums font-sans text-base font-semibold mb-2"
          style={{ color: 'var(--ink)' }}
        >
          {new Intl.NumberFormat('en-IE', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0,
          }).format(amountEuros)}
        </p>
        <input
          type="number"
          min={500}
          max={100000}
          step={100}
          value={amountEuros}
          onChange={(e) => {
            const v = Math.max(500, Math.min(100000, Number(e.target.value) || 500));
            onAmountChange(Math.round(v * 100));
          }}
          style={inputStyle}
          aria-label="Loan amount in euros"
        />
        <input
          type="range"
          min={500}
          max={100000}
          step={100}
          value={amountEuros}
          onChange={(e) => onAmountChange(Math.round(Number(e.target.value) * 100))}
          style={sliderStyle}
          aria-label="Loan amount slider"
        />
      </div>

      {/* Term */}
      <div>
        <label style={labelStyle}>Term (months)</label>
        <input
          type="number"
          min={3}
          max={420}
          step={1}
          value={termMonths}
          onChange={(e) => {
            const v = Math.max(3, Math.min(420, Number(e.target.value) || 3));
            onTermChange(v);
          }}
          style={inputStyle}
          aria-label="Loan term in months"
        />
        <input
          type="range"
          min={3}
          max={420}
          step={1}
          value={termMonths}
          onChange={(e) => onTermChange(Number(e.target.value))}
          style={sliderStyle}
          aria-label="Term slider"
        />
        <p
          className="font-sans text-xs mt-1"
          style={{ color: 'var(--ink-2)' }}
        >
          {formatTerm(termMonths)}
        </p>
      </div>

      {/* APR */}
      <div>
        <label style={labelStyle}>APR</label>
        <input
          type="number"
          min={0}
          max={30}
          step={0.1}
          value={aprPct}
          onChange={(e) => {
            const v = Math.max(0, Math.min(30, parseFloat(e.target.value) || 0));
            onAprChange(Math.round(v * 100));
          }}
          style={inputStyle}
          aria-label="Annual percentage rate"
        />
        <input
          type="range"
          min={0}
          max={30}
          step={0.1}
          value={aprPct}
          onChange={(e) => onAprChange(Math.round(parseFloat(e.target.value) * 100))}
          style={sliderStyle}
          aria-label="APR slider"
        />
        <p
          className="font-sans text-xs mt-1 tabular-nums"
          style={{ color: 'var(--ink-2)' }}
        >
          {aprPct.toFixed(1)}%
        </p>
      </div>

      {/* Lender type */}
      <div>
        <span
          style={labelStyle}
          id="lender-type-label"
        >
          Lender type
        </span>
        <div
          className="flex flex-wrap gap-2 mt-1"
          role="group"
          aria-labelledby="lender-type-label"
        >
          {LENDER_OPTIONS.map((opt) => {
            const selected = lenderType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  onLenderTypeChange(selected ? '' : opt.value)
                }
                style={{
                  border: selected ? 'none' : '1px solid var(--rule)',
                  backgroundColor: selected ? 'var(--ink)' : 'transparent',
                  color: selected ? 'var(--bg)' : 'var(--ink-2)',
                  borderRadius: '2px',
                  padding: '5px 12px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.15s, color 0.15s',
                  lineHeight: '1.4',
                }}
                aria-pressed={selected}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Label */}
      <div>
        <label style={labelStyle}>Label (optional)</label>
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="e.g. Car loan from BOI"
          style={inputStyle}
          aria-label="Loan label"
        />
      </div>
    </div>
  );
}
