'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { formatEuro } from '@/lib/tax';
import {
  calcBuyVsRent,
  STAMP_DUTY_RATE_BELOW,
  STAMP_DUTY_RATE_ABOVE,
  STAMP_DUTY_THRESHOLD,
  type YearlySnapshot,
} from '@/lib/calculations/buy-vs-rent';

// ── Defaults ──────────────────────────────────────────────────────────────────

const DEFAULTS: {
  propertyPrice: number;
  depositPct: number;
  mortgageRatePct: number;
  mortgageTermYears: number;
  propertyGrowthPct: number;
  maintenancePct: number;
  monthlyRent: number;
  rentIncreasePct: number;
  investmentReturnPct: number;
  years: number;
} = {
  propertyPrice: 350_000,
  depositPct: 10,
  mortgageRatePct: 4,
  mortgageTermYears: 30,
  propertyGrowthPct: 3,
  maintenancePct: 1,
  monthlyRent: 1_400,
  rentIncreasePct: 2,
  investmentReturnPct: 5,
  years: 25,
};

// ── SVG chart ─────────────────────────────────────────────────────────────────

const SVG_W = 600;
const SVG_H = 240;
const PAD = { top: 16, right: 16, bottom: 32, left: 72 };
const CHART_W = SVG_W - PAD.left - PAD.right;
const CHART_H = SVG_H - PAD.top - PAD.bottom;

function toPoints(
  snapshots: YearlySnapshot[],
  key: 'buyNetPosition' | 'rentNetPosition',
  minY: number,
  maxY: number,
): string {
  return snapshots
    .map((s) => {
      const x = PAD.left + ((s.year - 1) / Math.max(snapshots.length - 1, 1)) * CHART_W;
      const y = PAD.top + CHART_H - ((s[key] - minY) / (maxY - minY)) * CHART_H;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function NetChart({
  snapshots,
  breakevenYear,
  years,
}: {
  snapshots: YearlySnapshot[];
  breakevenYear: number | null;
  years: number;
}) {
  if (snapshots.length === 0) return null;

  const allValues = snapshots.flatMap((s) => [s.buyNetPosition, s.rentNetPosition]);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const padding = (rawMax - rawMin) * 0.1 || 10_000;
  const minY = rawMin - padding;
  const maxY = rawMax + padding;

  const buyPoints = toPoints(snapshots, 'buyNetPosition', minY, maxY);
  const rentPoints = toPoints(snapshots, 'rentNetPosition', minY, maxY);

  // Zero line Y coordinate
  const zeroY = minY <= 0 && maxY >= 0
    ? PAD.top + CHART_H - ((0 - minY) / (maxY - minY)) * CHART_H
    : null;

  // Breakeven line X coordinate
  const breakevenX = breakevenYear !== null
    ? PAD.left + ((breakevenYear - 1) / Math.max(snapshots.length - 1, 1)) * CHART_W
    : null;

  // Y-axis labels (3 ticks)
  const yTicks = [minY, (minY + maxY) / 2, maxY];

  // X-axis labels
  const xTicks = [1, Math.round(years / 2), years];

  return (
    <svg
      viewBox={`0 0 ${SVG_W} ${SVG_H}`}
      style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
      aria-label="Buy vs rent net position over time"
      role="img"
    >
      {/* Zero line */}
      {zeroY !== null && (
        <line
          x1={PAD.left}
          y1={zeroY}
          x2={PAD.left + CHART_W}
          y2={zeroY}
          stroke="var(--rule)"
          strokeWidth={1}
          strokeDasharray="4 3"
        />
      )}

      {/* Breakeven vertical line */}
      {breakevenX !== null && (
        <line
          x1={breakevenX}
          y1={PAD.top}
          x2={breakevenX}
          y2={PAD.top + CHART_H}
          stroke="var(--accent)"
          strokeWidth={1}
          strokeDasharray="4 3"
          opacity={0.6}
        />
      )}

      {/* Rent line */}
      <polyline
        points={rentPoints}
        fill="none"
        stroke="var(--ink-2)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Buy line */}
      <polyline
        points={buyPoints}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Y-axis ticks */}
      {yTicks.map((val, i) => {
        const ty = PAD.top + CHART_H - ((val - minY) / (maxY - minY)) * CHART_H;
        const label = val >= 0
          ? `€${Math.round(val / 1000)}k`
          : `-€${Math.round(Math.abs(val) / 1000)}k`;
        return (
          <g key={i}>
            <line
              x1={PAD.left - 4}
              y1={ty}
              x2={PAD.left}
              y2={ty}
              stroke="var(--rule)"
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={ty + 4}
              textAnchor="end"
              style={{
                fontSize: '11px',
                fill: 'var(--ink-2)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* X-axis ticks */}
      {xTicks.map((yr) => {
        const tx = PAD.left + ((yr - 1) / Math.max(snapshots.length - 1, 1)) * CHART_W;
        const ty = PAD.top + CHART_H;
        return (
          <g key={yr}>
            <line
              x1={tx}
              y1={ty}
              x2={tx}
              y2={ty + 4}
              stroke="var(--rule)"
              strokeWidth={1}
            />
            <text
              x={tx}
              y={ty + 16}
              textAnchor="middle"
              style={{
                fontSize: '11px',
                fill: 'var(--ink-2)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Yr {yr}
            </text>
          </g>
        );
      })}

      {/* Breakeven label */}
      {breakevenX !== null && breakevenYear !== null && (
        <text
          x={breakevenX + 5}
          y={PAD.top + 14}
          style={{
            fontSize: '10px',
            fill: 'var(--accent)',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
          }}
        >
          Yr {breakevenYear}
        </text>
      )}
    </svg>
  );
}

// ── Slider helper ─────────────────────────────────────────────────────────────

function SliderRow({
  label,
  value,
  displayValue,
  min,
  max,
  step,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  displayValue: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="font-sans text-sm font-medium" style={{ color: 'var(--ink)' }}>
          {label}
        </label>
        <span
          className="font-sans text-sm tabular-nums font-semibold"
          style={{ color: 'var(--accent)' }}
        >
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
        style={{ accentColor: 'var(--accent)' }}
      />
      {hint && (
        <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
          {hint}
        </p>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BuyVsRentPage() {
  const [propertyPrice, setPropertyPrice] = useState(DEFAULTS.propertyPrice);
  const [depositPct, setDepositPct] = useState(DEFAULTS.depositPct);
  const [mortgageRatePct, setMortgageRatePct] = useState(DEFAULTS.mortgageRatePct);
  const [mortgageTermYears, setMortgageTermYears] = useState(DEFAULTS.mortgageTermYears);
  const [propertyGrowthPct, setPropertyGrowthPct] = useState(DEFAULTS.propertyGrowthPct);
  const [maintenancePct, setMaintenancePct] = useState(DEFAULTS.maintenancePct);
  const [monthlyRent, setMonthlyRent] = useState(DEFAULTS.monthlyRent);
  const [rentIncreasePct, setRentIncreasePct] = useState(DEFAULTS.rentIncreasePct);
  const [investmentReturnPct, setInvestmentReturnPct] = useState(DEFAULTS.investmentReturnPct);
  const [years, setYears] = useState(DEFAULTS.years);

  const result = useMemo(
    () =>
      calcBuyVsRent({
        propertyPrice,
        depositPct,
        mortgageRatePct,
        mortgageTermYears,
        propertyGrowthPct,
        maintenancePct,
        monthlyRent,
        rentIncreasePct,
        investmentReturnPct,
        years,
      }),
    [
      propertyPrice,
      depositPct,
      mortgageRatePct,
      mortgageTermYears,
      propertyGrowthPct,
      maintenancePct,
      monthlyRent,
      rentIncreasePct,
      investmentReturnPct,
      years,
    ],
  );

  const lastSnapshot = result.snapshots[result.snapshots.length - 1];
  const buyFinal = lastSnapshot?.buyNetPosition ?? 0;
  const rentFinal = lastSnapshot?.rentNetPosition ?? 0;
  const buyingWins = buyFinal >= rentFinal;

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">

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
        Buy vs rent calculator
      </h1>

      <p
        style={{
          fontStyle: 'italic',
          fontSize: '1.125rem',
          color: 'var(--ink-2)',
          margin: '0 0 1rem',
        }}
      >
        Is buying always better? See how Irish property rules and opportunity cost stack up.
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
        Illustrative only — does not constitute financial advice. Property and investment
        returns are not guaranteed. Consult a financial adviser before making major decisions.
      </p>

      <Rule />

      {/* ── Main panel ─────────────────────────────────────────────────────── */}
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

          {/* ── Left: inputs ──────────────────────────────────────────────── */}
          <div
            className="lg:col-span-4 p-6 lg:p-8 flex flex-col gap-5"
            style={{ borderRight: '1px solid var(--rule)' }}
          >
            <p
              className="font-sans text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--ink-2)' }}
            >
              Your scenario
            </p>

            {/* Property */}
            <SliderRow
              label="Property price"
              value={propertyPrice}
              displayValue={formatEuro(propertyPrice)}
              min={150_000}
              max={750_000}
              step={10_000}
              onChange={(v) => setPropertyPrice(v)}
            />

            <SliderRow
              label="Deposit"
              value={depositPct}
              displayValue={`${depositPct}%`}
              min={10}
              max={40}
              step={5}
              onChange={(v) => setDepositPct(v)}
              hint={
                depositPct < 20
                  ? 'Central Bank rules: first-time buyers need at least 10% deposit'
                  : 'Central Bank rules: second+ buyers need at least 20% deposit'
              }
            />

            <SliderRow
              label="Mortgage rate"
              value={mortgageRatePct}
              displayValue={`${mortgageRatePct.toFixed(1)}%`}
              min={2}
              max={7}
              step={0.1}
              onChange={(v) => setMortgageRatePct(v)}
            />

            <SliderRow
              label="Mortgage term"
              value={mortgageTermYears}
              displayValue={`${mortgageTermYears} yr`}
              min={10}
              max={35}
              step={5}
              onChange={(v) => setMortgageTermYears(v)}
            />

            <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '1.25rem' }}>
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: 'var(--ink-2)' }}
              >
                Growth assumptions
              </p>
              <div className="flex flex-col gap-4">
                <SliderRow
                  label="Property growth p.a."
                  value={propertyGrowthPct}
                  displayValue={`${propertyGrowthPct.toFixed(1)}%`}
                  min={0}
                  max={6}
                  step={0.5}
                  onChange={(v) => setPropertyGrowthPct(v)}
                />

                <SliderRow
                  label="Annual maintenance"
                  value={maintenancePct}
                  displayValue={`${maintenancePct.toFixed(1)}%`}
                  min={0.5}
                  max={2}
                  step={0.25}
                  onChange={(v) => setMaintenancePct(v)}
                  hint="% of property value per year (repairs, insurance, upkeep)"
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '1.25rem' }}>
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: 'var(--ink-2)' }}
              >
                Rent alternative
              </p>
              <div className="flex flex-col gap-4">
                <SliderRow
                  label="Monthly rent"
                  value={monthlyRent}
                  displayValue={formatEuro(monthlyRent)}
                  min={600}
                  max={3_000}
                  step={50}
                  onChange={(v) => setMonthlyRent(v)}
                />

                <SliderRow
                  label="Rent increase p.a."
                  value={rentIncreasePct}
                  displayValue={`${rentIncreasePct.toFixed(1)}%`}
                  min={0}
                  max={5}
                  step={0.5}
                  onChange={(v) => setRentIncreasePct(v)}
                />

                <SliderRow
                  label="Investment return p.a."
                  value={investmentReturnPct}
                  displayValue={`${investmentReturnPct.toFixed(1)}%`}
                  min={2}
                  max={10}
                  step={0.5}
                  onChange={(v) => setInvestmentReturnPct(v)}
                  hint="Return if renter invests the equivalent of the buyer's upfront costs"
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '1.25rem' }}>
              <SliderRow
                label="Comparison period"
                value={years}
                displayValue={`${years} yr`}
                min={5}
                max={30}
                step={1}
                onChange={(v) => setYears(v)}
              />
            </div>
          </div>

          {/* ── Right: results ─────────────────────────────────────────────── */}
          <div className="lg:col-span-8 p-6 lg:p-8">

            {/* Cost breakdown */}
            <div className="grid grid-cols-2 gap-4 mb-6">

              {/* Upfront costs */}
              <div
                style={{
                  border: '1px solid var(--rule)',
                  borderRadius: '4px',
                  padding: '1rem',
                }}
              >
                <p
                  className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--ink-2)' }}
                >
                  Upfront costs (buy)
                </p>
                <p
                  className="font-display tabular-nums leading-none mb-0.5"
                  style={{
                    fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatEuro(result.upfrontCosts)}
                </p>
                <p className="font-sans text-xs mb-3" style={{ color: 'var(--ink-2)' }}>
                  total to get the keys
                </p>
                <div
                  className="font-sans text-xs"
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-2)' }}>Deposit ({depositPct}%)</span>
                    <span className="tabular-nums" style={{ color: 'var(--ink)' }}>
                      {formatEuro(result.deposit)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-2)' }}>
                      Stamp duty ({STAMP_DUTY_RATE_BELOW * 100}%
                      {propertyPrice > STAMP_DUTY_THRESHOLD
                        ? `/${STAMP_DUTY_RATE_ABOVE * 100}%`
                        : ''}
                      )
                    </span>
                    <span className="tabular-nums" style={{ color: 'var(--ink)' }}>
                      {formatEuro(result.stampDuty)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-2)' }}>Legal fees (est.)</span>
                    <span className="tabular-nums" style={{ color: 'var(--ink)' }}>
                      {formatEuro(result.legalFees)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Monthly payments */}
              <div
                style={{
                  border: '1px solid var(--rule)',
                  borderRadius: '4px',
                  padding: '1rem',
                }}
              >
                <p
                  className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--ink-2)' }}
                >
                  Monthly payments (buy)
                </p>
                <p
                  className="font-display tabular-nums leading-none mb-0.5"
                  style={{
                    fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatEuro(result.monthlyMortgagePayment)}
                </p>
                <p className="font-sans text-xs mb-3" style={{ color: 'var(--ink-2)' }}>
                  mortgage repayment /month
                </p>
                <div
                  className="font-sans text-xs"
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-2)' }}>Loan amount</span>
                    <span className="tabular-nums" style={{ color: 'var(--ink)' }}>
                      {formatEuro(result.mortgagePrincipal)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-2)' }}>vs. monthly rent</span>
                    <span
                      className="tabular-nums font-medium"
                      style={{
                        color:
                          result.monthlyMortgagePayment > monthlyRent
                            ? 'var(--accent)'
                            : 'var(--ink)',
                      }}
                    >
                      {formatEuro(monthlyRent)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-2)' }}>Difference</span>
                    <span
                      className="tabular-nums font-medium"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      {result.monthlyMortgagePayment >= monthlyRent ? '+' : '-'}
                      {formatEuro(Math.abs(result.monthlyMortgagePayment - monthlyRent))} /mo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Breakeven callout */}
            <div
              style={{
                borderRadius: '4px',
                padding: '0.875rem 1rem',
                marginBottom: '1.5rem',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--rule)',
              }}
            >
              {result.breakevenYear !== null ? (
                <p
                  className="font-sans text-sm"
                  style={{ color: 'var(--ink)', lineHeight: 1.6 }}
                >
                  With these assumptions, buying becomes financially ahead of renting at{' '}
                  <strong>year {result.breakevenYear}</strong>. After that point, the
                  buyer&rsquo;s net position (equity minus all costs) exceeds what the renter
                  would have accumulated by investing the equivalent deposit.
                </p>
              ) : buyingWins ? (
                <p
                  className="font-sans text-sm"
                  style={{ color: 'var(--ink)', lineHeight: 1.6 }}
                >
                  Buying is ahead from the start with these numbers — likely because the monthly
                  mortgage cost is similar to or below rent, and property growth is strong.
                </p>
              ) : (
                <p
                  className="font-sans text-sm"
                  style={{ color: 'var(--ink)', lineHeight: 1.6 }}
                >
                  Renting comes out ahead for the full {years}-year period with these
                  assumptions. Try increasing property growth or reducing the investment
                  return to see when buying breaks even.
                </p>
              )}
            </div>

            {/* Chart */}
            <div style={{ marginBottom: '0.5rem' }}>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1.5">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '1.5rem',
                      height: '2px',
                      backgroundColor: 'var(--accent)',
                      borderRadius: '1px',
                    }}
                  />
                  <span
                    className="font-sans text-xs font-medium"
                    style={{ color: 'var(--ink-2)' }}
                  >
                    Buy net position
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '1.5rem',
                      height: '2px',
                      backgroundColor: 'var(--ink-2)',
                      borderRadius: '1px',
                    }}
                  />
                  <span
                    className="font-sans text-xs font-medium"
                    style={{ color: 'var(--ink-2)' }}
                  >
                    Rent net position
                  </span>
                </div>
              </div>
              <div
                style={{
                  border: '1px solid var(--rule)',
                  borderRadius: '4px',
                  padding: '0.75rem',
                  backgroundColor: 'var(--bg)',
                }}
              >
                <NetChart
                  snapshots={result.snapshots}
                  breakevenYear={result.breakevenYear}
                  years={years}
                />
              </div>
              <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                Net position = total assets minus total cash outlays from the decision.
                {result.breakevenYear !== null && (
                  <> Dashed vertical line marks year {result.breakevenYear} (breakeven).</>
                )}
              </p>
            </div>

            <Rule className="my-5" />

            {/* Year-by-year table — last 5 snapshots at visible milestone years */}
            <div>
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: 'var(--ink-2)' }}
              >
                Key milestones
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table
                  className="font-sans text-xs w-full"
                  style={{ borderCollapse: 'collapse', minWidth: '380px' }}
                >
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                      {['Year', 'Buy equity', 'Buy net', 'Rent invested', 'Rent net', 'Ahead'].map(
                        (col) => (
                          <th
                            key={col}
                            style={{
                              padding: '0.375rem 0.5rem',
                              color: 'var(--ink-2)',
                              fontWeight: 600,
                              textAlign: col === 'Year' ? 'left' : 'right',
                            }}
                          >
                            {col}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {result.snapshots
                      .filter((s) => {
                        const milestones = [5, 10, 15, 20, 25, 30];
                        return milestones.includes(s.year) || s.year === years;
                      })
                      .filter((s, i, arr) => arr.findIndex((x) => x.year === s.year) === i)
                      .slice(0, 6)
                      .map((s) => {
                        const buyingAhead = s.buyNetPosition >= s.rentNetPosition;
                        return (
                          <tr
                            key={s.year}
                            style={{ borderBottom: '1px solid var(--rule)' }}
                          >
                            <td
                              style={{
                                padding: '0.375rem 0.5rem',
                                color: 'var(--ink)',
                                fontWeight: 500,
                              }}
                            >
                              {s.year}
                            </td>
                            <td
                              className="tabular-nums"
                              style={{
                                padding: '0.375rem 0.5rem',
                                color: 'var(--ink)',
                                textAlign: 'right',
                              }}
                            >
                              {formatEuro(s.buyEquity)}
                            </td>
                            <td
                              className="tabular-nums"
                              style={{
                                padding: '0.375rem 0.5rem',
                                color: s.buyNetPosition >= 0 ? 'var(--ink)' : 'var(--accent)',
                                textAlign: 'right',
                              }}
                            >
                              {formatEuro(s.buyNetPosition)}
                            </td>
                            <td
                              className="tabular-nums"
                              style={{
                                padding: '0.375rem 0.5rem',
                                color: 'var(--ink)',
                                textAlign: 'right',
                              }}
                            >
                              {formatEuro(s.rentInvestedCapital)}
                            </td>
                            <td
                              className="tabular-nums"
                              style={{
                                padding: '0.375rem 0.5rem',
                                color: s.rentNetPosition >= 0 ? 'var(--ink)' : 'var(--accent)',
                                textAlign: 'right',
                              }}
                            >
                              {formatEuro(s.rentNetPosition)}
                            </td>
                            <td
                              style={{
                                padding: '0.375rem 0.5rem',
                                color: buyingAhead ? 'var(--ink)' : 'var(--ink-2)',
                                fontWeight: 500,
                                textAlign: 'right',
                              }}
                            >
                              {buyingAhead ? 'Buy' : 'Rent'}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Educational notes */}
            <div
              style={{
                marginTop: '1.5rem',
                paddingTop: '1.25rem',
                borderTop: '1px solid var(--rule)',
              }}
            >
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--ink-2)' }}
              >
                What this models
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
                  <strong>Buy net position:</strong> property equity minus all cash outlays
                  (deposit + stamp duty + legal fees + all mortgage payments + annual
                  maintenance).
                </li>
                <li>
                  <strong>Rent net position:</strong> what the buyer&rsquo;s upfront costs
                  would grow to if invested at the stated return rate, minus total rent paid.
                </li>
                <li>
                  Stamp duty uses Irish residential rates: {STAMP_DUTY_RATE_BELOW * 100}% on
                  the first €{(STAMP_DUTY_THRESHOLD / 1_000_000).toFixed(0)}m,{' '}
                  {STAMP_DUTY_RATE_ABOVE * 100}% above.
                </li>
                <li>
                  Central Bank LTV rules: 10% minimum deposit for first-time buyers, 20% for
                  subsequent buyers. LTI limit of 4× gross income is not modelled here.
                </li>
                <li>
                  Does not model: mortgage interest relief, Help to Buy, rent tax credit,
                  property taxes (LPT), agent fees on sale, or rental income.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Learn more */}
      <p className="font-sans text-sm mt-6" style={{ color: 'var(--ink-2)' }}>
        Want to understand mortgages and renting in Ireland?{' '}
        <Link
          href="/lessons/rent-or-buy"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          Read the rent or buy lesson &rarr;
        </Link>
      </p>

    </main>
  );
}
