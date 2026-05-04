'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { calcNet, formatEuro } from '@/lib/tax';

const PAYE_CUTOFF = 44_000;
const USC_BAND2_CEILING = 27_382;
const USC_BAND3_CEILING = 70_044;

type BandCrossing = {
  band: string;
  description: string;
  impact: string;
};

function detectBandCrossings(currentSalary: number, newSalary: number): BandCrossing[] {
  const crossings: BandCrossing[] = [];

  if (currentSalary < PAYE_CUTOFF && newSalary >= PAYE_CUTOFF) {
    crossings.push({
      band: 'Standard rate band',
      description: `You cross the €${PAYE_CUTOFF.toLocaleString()} standard rate cutoff`,
      impact: 'Every euro above €44,000 is taxed at 40% income tax instead of 20%. Your marginal income tax rate doubles.',
    });
  }

  if (currentSalary < USC_BAND2_CEILING && newSalary >= USC_BAND2_CEILING) {
    crossings.push({
      band: 'USC Band 3 (4%)',
      description: `You cross the €${USC_BAND2_CEILING.toLocaleString()} USC Band 2 ceiling`,
      impact: 'The USC rate on income above €27,382 increases from 2% to 4%.',
    });
  }

  if (currentSalary < USC_BAND3_CEILING && newSalary >= USC_BAND3_CEILING) {
    crossings.push({
      band: 'USC Band 4 (8%)',
      description: `You cross the €${USC_BAND3_CEILING.toLocaleString()} USC Band 3 ceiling`,
      impact: 'The USC rate on income above €70,044 increases from 4% to 8%.',
    });
  }

  return crossings;
}

function marginalRate(gross: number): number {
  let paye: number;
  if (gross < PAYE_CUTOFF) paye = 0.2;
  else paye = 0.4;

  let usc: number;
  if (gross <= 12_012) usc = 0.005;
  else if (gross <= USC_BAND2_CEILING) usc = 0.02;
  else if (gross <= USC_BAND3_CEILING) usc = 0.04;
  else usc = 0.08;

  const prsi = 0.041;
  return paye + usc + prsi;
}

export default function PayRisePage() {
  const [currentSalary, setCurrentSalary] = useState(38_000);
  const [riseType, setRiseType] = useState<'percent' | 'amount'>('percent');
  const [risePct, setRisePct] = useState(5);
  const [riseAmount, setRiseAmount] = useState(3_000);

  const newSalary = useMemo(() => {
    if (riseType === 'percent') {
      return Math.round(currentSalary * (1 + risePct / 100));
    }
    return currentSalary + riseAmount;
  }, [currentSalary, riseType, risePct, riseAmount]);

  const current = useMemo(() => calcNet(currentSalary), [currentSalary]);
  const next = useMemo(() => calcNet(newSalary), [newSalary]);

  const grossIncrease = newSalary - currentSalary;
  const netIncrease = next.net - current.net;
  const effectiveTakeHomeRate = grossIncrease > 0
    ? Math.round((netIncrease / grossIncrease) * 1000) / 10
    : 0;

  const monthlyNetIncrease = Math.round(netIncrease / 12);

  const crossings = detectBandCrossings(currentSalary, newSalary);

  const currentMarginalRate = Math.round(marginalRate(currentSalary) * 1000) / 10;
  const newMarginalRate = Math.round(marginalRate(newSalary) * 1000) / 10;

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">

      {/* Back link */}
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
        Pay rise calculator
      </h1>

      <p
        style={{
          fontStyle: 'italic',
          fontSize: '1.125rem',
          color: 'var(--ink-2)',
          margin: '0 0 1rem',
        }}
      >
        See how much of your raise you actually take home — and when you cross a tax band.
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
        Budget 2026 rates. Single PAYE worker, standard credits.
      </p>

      <Rule />

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

          {/* ── Inputs ──────────────────────────────────────────────────── */}
          <div
            className="lg:col-span-4 p-6 lg:p-8 flex flex-col gap-6"
            style={{ borderRight: '1px solid var(--rule)' }}
          >
            <p
              className="font-sans text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--ink-2)' }}
            >
              Your salary
            </p>

            {/* Current salary */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label
                  className="font-sans text-sm font-medium"
                  style={{ color: 'var(--ink)' }}
                >
                  Current salary
                </label>
                <span
                  className="font-sans text-sm tabular-nums font-semibold"
                  style={{ color: 'var(--accent)' }}
                >
                  {formatEuro(currentSalary)}
                </span>
              </div>
              <input
                type="range"
                min={15_000}
                max={120_000}
                step={1_000}
                value={currentSalary}
                onChange={(e) => setCurrentSalary(parseInt(e.target.value, 10))}
                className="w-full"
                style={{ accentColor: 'var(--accent)' }}
              />
              <div
                className="flex justify-between font-sans text-xs mt-0.5"
                style={{ color: 'var(--ink-2)' }}
              >
                <span>€15,000</span>
                <span>€120,000</span>
              </div>
            </div>

            {/* Rise type toggle */}
            <div>
              <p
                className="font-sans text-sm font-medium mb-2"
                style={{ color: 'var(--ink)' }}
              >
                Pay rise as
              </p>
              <div className="flex gap-2">
                {(['percent', 'amount'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setRiseType(t)}
                    className="font-sans text-sm"
                    style={{
                      padding: '0.375rem 0.875rem',
                      border: '1px solid var(--rule)',
                      borderRadius: '2px',
                      backgroundColor: riseType === t ? 'var(--accent)' : 'var(--bg)',
                      color: riseType === t ? 'var(--accent-ink)' : 'var(--ink)',
                      cursor: 'pointer',
                    }}
                  >
                    {t === 'percent' ? '% increase' : '€ amount'}
                  </button>
                ))}
              </div>
            </div>

            {/* Rise input */}
            {riseType === 'percent' ? (
              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label
                    className="font-sans text-sm font-medium"
                    style={{ color: 'var(--ink)' }}
                  >
                    Percentage increase
                  </label>
                  <span
                    className="font-sans text-sm tabular-nums font-semibold"
                    style={{ color: 'var(--accent)' }}
                  >
                    {risePct}%
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={0.5}
                  value={risePct}
                  onChange={(e) => setRisePct(parseFloat(e.target.value))}
                  className="w-full"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <div
                  className="flex justify-between font-sans text-xs mt-0.5"
                  style={{ color: 'var(--ink-2)' }}
                >
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label
                    className="font-sans text-sm font-medium"
                    style={{ color: 'var(--ink)' }}
                  >
                    Additional amount
                  </label>
                  <span
                    className="font-sans text-sm tabular-nums font-semibold"
                    style={{ color: 'var(--accent)' }}
                  >
                    {formatEuro(riseAmount)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={30_000}
                  step={500}
                  value={riseAmount}
                  onChange={(e) => setRiseAmount(parseInt(e.target.value, 10))}
                  className="w-full"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <div
                  className="flex justify-between font-sans text-xs mt-0.5"
                  style={{ color: 'var(--ink-2)' }}
                >
                  <span>€500</span>
                  <span>€30,000</span>
                </div>
              </div>
            )}

            {/* New salary display */}
            <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '1.25rem' }}>
              <p className="font-sans text-xs" style={{ color: 'var(--ink-2)', marginBottom: '0.25rem' }}>
                New salary
              </p>
              <p
                className="font-display tabular-nums"
                style={{
                  fontSize: '1.5rem',
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                }}
              >
                {formatEuro(newSalary)}
              </p>
              <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
                +{formatEuro(grossIncrease)} gross ({risePct}{riseType === 'percent' ? '%' : ''})
              </p>
            </div>
          </div>

          {/* ── Results ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-8 p-6 lg:p-8">

            {/* Hero result */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                style={{
                  border: '1px solid var(--rule)',
                  borderRadius: '4px',
                  padding: '1rem',
                }}
              >
                <p
                  className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--ink-2)' }}
                >
                  Extra take-home / year
                </p>
                <p
                  className="font-display tabular-nums leading-none"
                  style={{
                    fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  +{formatEuro(netIncrease)}
                </p>
                <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                  or +{formatEuro(monthlyNetIncrease)}/month
                </p>
              </div>

              <div
                style={{
                  border: '1px solid var(--rule)',
                  borderRadius: '4px',
                  padding: '1rem',
                }}
              >
                <p
                  className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--ink-2)' }}
                >
                  Take-home rate on rise
                </p>
                <p
                  className="font-display tabular-nums leading-none"
                  style={{
                    fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                    color: crossings.length > 0 ? 'var(--accent)' : 'var(--ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {effectiveTakeHomeRate.toFixed(1)}%
                </p>
                <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                  of the gross {formatEuro(grossIncrease)} rise you keep
                </p>
              </div>
            </div>

            {/* Before / after table */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: 'var(--ink-2)' }}
              >
                Before vs after
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table
                  className="font-sans text-xs w-full"
                  style={{ borderCollapse: 'collapse', minWidth: '300px' }}
                >
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                      {['', 'Current', 'After rise', 'Change'].map((col) => (
                        <th
                          key={col}
                          style={{
                            padding: '0.375rem 0.5rem',
                            color: 'var(--ink-2)',
                            fontWeight: 600,
                            textAlign: col === '' ? 'left' : 'right',
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Gross salary', cur: current.gross, nxt: next.gross },
                      { label: 'Income tax (PAYE)', cur: current.paye, nxt: next.paye },
                      { label: 'USC', cur: current.usc, nxt: next.usc },
                      { label: 'PRSI (4.1%)', cur: current.prsi, nxt: next.prsi },
                      { label: 'Net take-home', cur: current.net, nxt: next.net },
                    ].map(({ label, cur, nxt }) => {
                      const change = nxt - cur;
                      const isNet = label === 'Net take-home';
                      return (
                        <tr
                          key={label}
                          style={{
                            borderBottom: '1px solid var(--rule)',
                            fontWeight: isNet ? 600 : 400,
                          }}
                        >
                          <td
                            style={{
                              padding: '0.375rem 0.5rem',
                              color: 'var(--ink)',
                            }}
                          >
                            {label}
                          </td>
                          <td
                            className="tabular-nums"
                            style={{
                              padding: '0.375rem 0.5rem',
                              color: 'var(--ink)',
                              textAlign: 'right',
                            }}
                          >
                            {formatEuro(cur)}
                          </td>
                          <td
                            className="tabular-nums"
                            style={{
                              padding: '0.375rem 0.5rem',
                              color: 'var(--ink)',
                              textAlign: 'right',
                            }}
                          >
                            {formatEuro(nxt)}
                          </td>
                          <td
                            className="tabular-nums"
                            style={{
                              padding: '0.375rem 0.5rem',
                              color: isNet ? 'var(--ink)' : 'var(--ink-2)',
                              textAlign: 'right',
                            }}
                          >
                            {change >= 0 ? '+' : ''}{formatEuro(change)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Marginal rate comparison */}
            <div
              style={{
                border: '1px solid var(--rule)',
                borderRadius: '4px',
                padding: '0.875rem 1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div
                className="font-sans text-xs"
                style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}
              >
                <div>
                  <span style={{ color: 'var(--ink-2)' }}>Marginal rate (current)</span>
                  <span
                    className="font-semibold tabular-nums ml-2"
                    style={{ color: 'var(--ink)' }}
                  >
                    {currentMarginalRate}%
                  </span>
                </div>
                <div>
                  <span style={{ color: 'var(--ink-2)' }}>Marginal rate (after rise)</span>
                  <span
                    className="font-semibold tabular-nums ml-2"
                    style={{
                      color: newMarginalRate > currentMarginalRate ? 'var(--accent)' : 'var(--ink)',
                    }}
                  >
                    {newMarginalRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Band crossing alerts */}
            {crossings.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p
                  className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--accent)' }}
                >
                  Tax band crossings
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {crossings.map((c) => (
                    <div
                      key={c.band}
                      style={{
                        border: '1px solid var(--accent)',
                        borderRadius: '4px',
                        padding: '0.875rem 1rem',
                        backgroundColor: 'color-mix(in srgb, var(--accent) 5%, transparent)',
                      }}
                    >
                      <p
                        className="font-sans text-xs font-semibold mb-0.5"
                        style={{ color: 'var(--accent)' }}
                      >
                        {c.band} — {c.description}
                      </p>
                      <p
                        className="font-sans text-xs"
                        style={{ color: 'var(--ink)', lineHeight: 1.55 }}
                      >
                        {c.impact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Rule className="mb-5" />

            {/* Tip */}
            <div>
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--ink-2)' }}
              >
                How to reduce the tax on your rise
              </p>
              <ul
                className="font-sans text-xs leading-relaxed"
                style={{
                  color: 'var(--ink-2)',
                  paddingLeft: '1.125rem',
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <li>
                  <strong>Increase pension contributions:</strong> Contributions reduce your
                  taxable income for PAYE. If you&rsquo;re crossing into the 40% band, directing
                  some of the rise into pension reduces the amount taxed at 40%.
                </li>
                <li>
                  <strong>Salary sacrifice schemes:</strong> Bike to Work and TaxSaver
                  commuter tickets are paid from gross salary and avoid income tax, USC, and PRSI.
                </li>
                <li>
                  <strong>Ask for non-cash benefits:</strong> Some benefits (e.g. employer
                  health insurance contributions) are taxed differently or attract lower effective
                  rates than a cash salary increase.
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      <p className="font-sans text-sm mt-6" style={{ color: 'var(--ink-2)' }}>
        See your full take-home breakdown:{' '}
        <Link
          href="/calculator"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          Take-home pay calculator &rarr;
        </Link>
      </p>

    </main>
  );
}
