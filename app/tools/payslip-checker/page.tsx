'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { calcNet, formatEuro } from '@/lib/tax';

type TaxBasis = 'cumulative' | 'week1' | 'emergency';

type LineStatus = 'ok' | 'warn' | 'alert';

const STATUS_COLOUR: Record<LineStatus, string> = {
  ok: '#2E7D52',
  warn: '#E65100',
  alert: 'var(--accent)',
};

const STATUS_LABEL: Record<LineStatus, string> = {
  ok: 'Looks right',
  warn: 'Worth checking',
  alert: 'Possible issue',
};

/** Returns a status based on how far actual is from expected. */
function checkLine(actual: number, expected: number): LineStatus {
  if (expected === 0) return actual === 0 ? 'ok' : 'warn';
  const ratio = actual / expected;
  if (ratio > 1.2 || ratio < 0.8) return 'alert';
  if (ratio > 1.05 || ratio < 0.9) return 'warn';
  return 'ok';
}

function pctDiff(actual: number, expected: number): string {
  if (expected === 0) return '—';
  const d = ((actual - expected) / expected) * 100;
  const sign = d > 0 ? '+' : '';
  return `${sign}${d.toFixed(0)}%`;
}

export default function PayslipCheckerPage() {
  const [annualGross, setAnnualGross] = useState(42_000);
  const [monthlyPaye, setMonthlyPaye] = useState('');
  const [monthlyUsc, setMonthlyUsc] = useState('');
  const [monthlyPrsi, setMonthlyPrsi] = useState('');
  const [basis, setBasis] = useState<TaxBasis>('cumulative');

  const expected = useMemo(() => {
    const annual = calcNet(annualGross);
    return {
      paye: Math.round(annual.paye / 12),
      usc: Math.round(annual.usc / 12),
      prsi: Math.round(annual.prsi / 12),
      net: Math.round(annual.net / 12),
    };
  }, [annualGross]);

  const actual = useMemo(() => ({
    paye: monthlyPaye === '' ? null : Math.max(0, parseInt(monthlyPaye, 10) || 0),
    usc: monthlyUsc === '' ? null : Math.max(0, parseInt(monthlyUsc, 10) || 0),
    prsi: monthlyPrsi === '' ? null : Math.max(0, parseInt(monthlyPrsi, 10) || 0),
  }), [monthlyPaye, monthlyUsc, monthlyPrsi]);

  const hasPayslipData = actual.paye !== null || actual.usc !== null || actual.prsi !== null;

  const lineStatuses = useMemo(() => ({
    paye: actual.paye !== null ? checkLine(actual.paye, expected.paye) : null,
    usc: actual.usc !== null ? checkLine(actual.usc, expected.usc) : null,
    prsi: actual.prsi !== null ? checkLine(actual.prsi, expected.prsi) : null,
  }), [actual, expected]);

  const isOnEmergencyTax = basis === 'week1' || basis === 'emergency'
    || (actual.paye !== null && checkLine(actual.paye, expected.paye) === 'alert' && actual.paye > expected.paye);

  const overallStatus: LineStatus | null = useMemo(() => {
    if (!hasPayslipData) return null;
    const statuses = [lineStatuses.paye, lineStatuses.usc, lineStatuses.prsi].filter(Boolean) as LineStatus[];
    if (statuses.includes('alert')) return 'alert';
    if (statuses.includes('warn')) return 'warn';
    return 'ok';
  }, [lineStatuses, hasPayslipData]);

  const actualTotal = [actual.paye ?? 0, actual.usc ?? 0, actual.prsi ?? 0].reduce((a, b) => a + b, 0);
  const expectedTotal = expected.paye + expected.usc + expected.prsi;

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">

      {/* Back */}
      <div className="mb-5">
        <Link
          href="/home"
          style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', textDecoration: 'none' }}
        >
          &larr; Back to home
        </Link>
      </div>

      <div className="mb-1">
        <Eyebrow>Tool</Eyebrow>
      </div>

      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '0.25rem 0 0.5rem',
          color: 'var(--ink)',
        }}
      >
        Payslip line checker
      </h1>

      <p
        style={{
          fontStyle: 'italic',
          fontSize: '1.125rem',
          color: 'var(--ink-2)',
          margin: '0 0 1rem',
        }}
      >
        Check whether your PAYE, USC, and PRSI deductions look right — and spot emergency tax.
      </p>

      <p
        style={{
          fontSize: '0.8125rem',
          fontStyle: 'italic',
          color: 'var(--ink-2)',
          margin: '0 0 1.5rem',
          lineHeight: 1.6,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Uses Budget 2026 standard rates for a single PAYE worker with no additional credits.
        Results are estimates — your actual deductions depend on your personal tax credits.
      </p>

      <Rule />

      {/* Input card */}
      <div
        style={{
          border: '1px solid var(--rule)',
          borderRadius: '8px',
          backgroundColor: 'var(--surface)',
          padding: '1.75rem',
          marginTop: '2rem',
        }}
      >
        {/* Step 1: salary */}
        <p
          className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'var(--ink-2)' }}
        >
          Step 1 — Your annual gross salary
        </p>

        <div className="mb-6">
          <div className="flex items-baseline justify-between mb-1.5">
            <label htmlFor="ps-annual-gross" className="font-sans text-sm font-medium" style={{ color: 'var(--ink)' }}>
              Annual gross
            </label>
            <span className="font-sans text-sm tabular-nums font-semibold" style={{ color: 'var(--accent)' }}>
              {formatEuro(annualGross)}
            </span>
          </div>
          <input
            type="range"
            min={10_000}
            max={120_000}
            step={500}
            id="ps-annual-gross"
            value={annualGross}
            onChange={(e) => setAnnualGross(parseInt(e.target.value, 10))}
            className="w-full"
            style={{ accentColor: 'var(--accent)' }}
          />
          <div className="flex justify-between font-sans text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
            <span>€10,000</span>
            <span>€120,000</span>
          </div>
          <p className="font-sans text-xs mt-1.5" style={{ color: 'var(--ink-2)' }}>
            Expected monthly deductions: PAYE {formatEuro(expected.paye)} · USC {formatEuro(expected.usc)} · PRSI {formatEuro(expected.prsi)}
          </p>
        </div>

        <Rule className="mb-6" />

        {/* Step 2: payslip figures */}
        <p
          className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'var(--ink-2)' }}
        >
          Step 2 — Your monthly deductions (from payslip)
        </p>

        <div className="flex flex-col gap-4 mb-6">
          {(
            [
              { key: 'paye', id: 'ps-paye', label: 'PAYE (income tax)', value: monthlyPaye, setter: setMonthlyPaye, hint: 'Look for "PAYE" or "Income Tax" on your payslip.' },
              { key: 'usc',  id: 'ps-usc',  label: 'USC (Universal Social Charge)', value: monthlyUsc,   setter: setMonthlyUsc,   hint: 'Usually labelled "USC" on your payslip.' },
              { key: 'prsi', id: 'ps-prsi', label: 'PRSI (employee contribution)', value: monthlyPrsi,  setter: setMonthlyPrsi,  hint: 'Look for "PRSI Emp" or "Employee PRSI".' },
            ] as const
          ).map(({ key, id, label, value, setter, hint }) => (
            <div key={key}>
              <label
                htmlFor={id}
                className="font-sans text-sm font-medium block mb-1"
                style={{ color: 'var(--ink)' }}
              >
                {label}
              </label>
              <p className="font-sans text-xs mb-1.5" style={{ color: 'var(--ink-2)' }}>{hint}</p>
              <div style={{ position: 'relative' }}>
                <span
                  className="font-sans text-sm"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--ink-2)',
                  }}
                >
                  €
                </span>
                <input
                  id={id}
                  type="number"
                  min={0}
                  max={10_000}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={String(expected[key as 'paye' | 'usc' | 'prsi'])}
                  className="font-sans text-sm w-full"
                  style={{
                    padding: '0.5rem 0.75rem 0.5rem 1.75rem',
                    border: '1px solid var(--rule)',
                    borderRadius: '2px',
                    backgroundColor: 'var(--bg)',
                    color: 'var(--ink)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <Rule className="mb-6" />

        {/* Step 3: tax basis */}
        <p
          className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--ink-2)' }}
        >
          Step 3 — Tax basis shown on payslip
        </p>

        <div className="flex flex-col gap-2">
          {(
            [
              { value: 'cumulative', label: 'Cumulative', desc: 'Normal — your credits are applied correctly.' },
              { value: 'week1', label: 'Week 1 / Month 1', desc: 'Emergency mode — credits applied per period only.' },
              { value: 'emergency', label: 'Emergency', desc: 'Emergency tax — no credits applied.' },
            ] as const
          ).map(({ value, label, desc }) => (
            <label
              key={value}
              className="flex items-start gap-3 cursor-pointer"
              style={{
                padding: '0.75rem',
                border: `1px solid ${basis === value ? 'var(--accent)' : 'var(--rule)'}`,
                borderRadius: '4px',
                backgroundColor: basis === value ? 'color-mix(in srgb, var(--accent) 5%, transparent)' : 'var(--bg)',
              }}
            >
              <input
                type="radio"
                name="basis"
                value={value}
                checked={basis === value}
                onChange={() => setBasis(value)}
                style={{ marginTop: '2px', accentColor: 'var(--accent)', flexShrink: 0 }}
              />
              <span>
                <span className="font-sans text-sm font-medium block" style={{ color: 'var(--ink)' }}>
                  {label}
                </span>
                <span className="font-sans text-xs" style={{ color: 'var(--ink-2)' }}>
                  {desc}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Results */}
      {hasPayslipData && (
        <div
          style={{
            border: `2px solid ${overallStatus === 'ok' ? '#2E7D52' : overallStatus === 'warn' ? '#E65100' : 'var(--accent)'}`,
            borderRadius: '8px',
            padding: '1.75rem',
            marginTop: '1.5rem',
          }}
        >
          {/* Emergency tax banner */}
          {isOnEmergencyTax && (
            <div
              style={{
                border: '1px solid var(--accent)',
                borderRadius: '4px',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                backgroundColor: 'color-mix(in srgb, var(--accent) 6%, transparent)',
              }}
            >
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: 'var(--accent)' }}
              >
                Emergency tax detected
              </p>
              <p className="font-sans text-sm" style={{ color: 'var(--ink)', lineHeight: 1.6 }}>
                Your payslip shows signs of emergency tax — either from the tax basis you selected
                or because your PAYE deduction is significantly higher than expected.
                Emergency tax is always refundable once you register the job with Revenue.
              </p>
              <Link
                href="/tools/emergency-tax"
                className="font-sans text-sm"
                style={{ color: 'var(--accent)', textDecoration: 'none', display: 'inline-block', marginTop: '0.625rem' }}
              >
                Use the emergency tax diagnostic →
              </Link>
            </div>
          )}

          <p
            className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--ink-2)' }}
          >
            Deduction breakdown
          </p>

          {/* Line-by-line table */}
          <div
            className="font-sans text-sm"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
          >
            {/* Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                gap: '0.75rem',
                paddingBottom: '0.5rem',
                borderBottom: '1px solid var(--rule)',
              }}
            >
              <span className="font-semibold text-xs uppercase tracking-widest" style={{ color: 'var(--ink-2)' }}>Deduction</span>
              <span className="font-semibold text-xs uppercase tracking-widest tabular-nums" style={{ color: 'var(--ink-2)', textAlign: 'right' }}>Expected</span>
              <span className="font-semibold text-xs uppercase tracking-widest tabular-nums" style={{ color: 'var(--ink-2)', textAlign: 'right' }}>Yours</span>
              <span className="font-semibold text-xs uppercase tracking-widest" style={{ color: 'var(--ink-2)', textAlign: 'right' }}>Status</span>
            </div>

            {(
              [
                { key: 'paye', label: 'PAYE' },
                { key: 'usc', label: 'USC' },
                { key: 'prsi', label: 'PRSI' },
              ] as const
            ).map(({ key, label }) => {
              const act = actual[key];
              const exp = expected[key];
              const status = lineStatuses[key];
              if (act === null) return null;
              return (
                <div
                  key={key}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto auto',
                    gap: '0.75rem',
                    alignItems: 'center',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid var(--rule)',
                  }}
                >
                  <span style={{ color: 'var(--ink)' }}>{label}</span>
                  <span className="tabular-nums" style={{ color: 'var(--ink-2)', textAlign: 'right' }}>
                    {formatEuro(exp)}<span style={{ fontSize: '0.75rem' }}>/mo</span>
                  </span>
                  <span className="tabular-nums font-medium" style={{ color: 'var(--ink)', textAlign: 'right' }}>
                    {formatEuro(act)}<span className="font-normal" style={{ fontSize: '0.75rem' }}>/mo</span>
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.125rem' }}>
                    <span
                      className="font-sans text-xs font-semibold"
                      style={{ color: status ? STATUS_COLOUR[status] : 'var(--ink-2)' }}
                    >
                      {status ? STATUS_LABEL[status] : '—'}
                    </span>
                    <span className="font-sans text-xs tabular-nums" style={{ color: 'var(--ink-2)' }}>
                      {pctDiff(act, exp)}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Total */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                gap: '0.75rem',
                alignItems: 'center',
                paddingTop: '0.25rem',
              }}
            >
              <span className="font-semibold" style={{ color: 'var(--ink)' }}>Total</span>
              <span className="tabular-nums" style={{ color: 'var(--ink-2)', textAlign: 'right' }}>
                {formatEuro(expectedTotal)}<span style={{ fontSize: '0.75rem' }}>/mo</span>
              </span>
              <span className="tabular-nums font-semibold" style={{ color: 'var(--ink)', textAlign: 'right' }}>
                {formatEuro(actualTotal)}<span className="font-normal" style={{ fontSize: '0.75rem' }}>/mo</span>
              </span>
              <span
                className="font-sans text-xs tabular-nums"
                style={{ color: 'var(--ink-2)', textAlign: 'right' }}
              >
                {pctDiff(actualTotal, expectedTotal)}
              </span>
            </div>
          </div>

          {/* Interpretation note */}
          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.875rem 1rem',
              border: '1px solid var(--rule)',
              borderRadius: '4px',
              backgroundColor: 'var(--bg)',
            }}
          >
            <p className="font-sans text-xs" style={{ color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: 'var(--ink)' }}>Tolerances: </strong>
              Within 5% is normal (rounding, timing). 5–20% difference is worth querying with payroll.
              Over 20% suggests a configuration issue — check your tax credits on Revenue myAccount.
            </p>
          </div>
        </div>
      )}

      {!hasPayslipData && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1.25rem',
            border: '1px dashed var(--rule)',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          <p className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>
            Enter your payslip figures above to see the comparison.
          </p>
        </div>
      )}

      {/* Context */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          border: '1px solid var(--rule)',
          borderRadius: '4px',
        }}
      >
        <p
          className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: 'var(--ink-2)' }}
        >
          What these deductions are
        </p>
        <ul
          className="font-sans text-xs"
          style={{
            color: 'var(--ink-2)',
            paddingLeft: '1.125rem',
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.375rem',
            lineHeight: 1.6,
          }}
        >
          <li>
            <strong style={{ color: 'var(--ink)' }}>PAYE</strong> — Income tax collected at source.
            20% on income up to €44,000; 40% above. Reduced by your tax credits (typically €4,000/yr standard).
          </li>
          <li>
            <strong style={{ color: 'var(--ink)' }}>USC</strong> — Universal Social Charge.
            Applies on income over €13,000, in bands from 0.5% to 8%.
          </li>
          <li>
            <strong style={{ color: 'var(--ink)' }}>PRSI</strong> — Pay Related Social Insurance.
            4.1% on all income (employee contribution). Funds your entitlement to Jobseeker&apos;s, State Pension, etc.
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-4 mt-5">
        <Link
          href="/tools/emergency-tax"
          className="font-sans text-sm"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          Emergency tax diagnostic →
        </Link>
        <a
          href="https://www.revenue.ie/en/jobs-and-pensions/tax-credits/index.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm"
          style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
        >
          Revenue: check your credits →
        </a>
        <Link
          href="/lessons/payslip"
          className="font-sans text-sm"
          style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
        >
          Payslip lesson →
        </Link>
      </div>

    </main>
  );
}
