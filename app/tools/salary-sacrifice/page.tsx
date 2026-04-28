'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { formatEuro } from '@/lib/tax';
import {
  calcSacrifice,
  BIKE_TO_WORK_CAP_STANDARD,
  BIKE_TO_WORK_CAP_EBIKE,
  COMMUTER_PRESETS,
  BIKE_CYCLE_YEARS,
} from '@/lib/calculations/salary-sacrifice';

type BikeType = 'standard' | 'ebike';

function StatRow({
  label,
  value,
  highlight,
  sub,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  sub?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: highlight ? 'baseline' : 'center',
        padding: '0.5rem 0',
        borderBottom: '1px solid var(--rule)',
        gap: '1rem',
      }}
    >
      <span className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>
        {label}
      </span>
      <span>
        <span
          className="font-sans tabular-nums"
          style={{
            fontSize: highlight ? '1.125rem' : '0.9375rem',
            fontWeight: highlight ? 700 : 500,
            color: highlight ? 'var(--accent)' : 'var(--ink)',
          }}
        >
          {value}
        </span>
        {sub && (
          <span className="font-sans text-xs ml-1" style={{ color: 'var(--ink-2)' }}>
            {sub}
          </span>
        )}
      </span>
    </div>
  );
}

export default function SalarySacrificePage() {
  const [salary, setSalary] = useState(42_000);

  // Bike-to-Work state
  const [bikeCost, setBikeCost] = useState(1_000);
  const [bikeType, setBikeType] = useState<BikeType>('standard');

  // Tax Saver Commuter state
  const [commuterCost, setCommuterCost] = useState(1_470);

  const bikeCap = bikeType === 'ebike' ? BIKE_TO_WORK_CAP_EBIKE : BIKE_TO_WORK_CAP_STANDARD;
  const effectiveBikeCost = Math.min(bikeCost, bikeCap);

  const bikeResult = useMemo(
    () => calcSacrifice(salary, effectiveBikeCost),
    [salary, effectiveBikeCost],
  );

  const commuterResult = useMemo(
    () => calcSacrifice(salary, commuterCost),
    [salary, commuterCost],
  );

  const combinedSaving = bikeResult.taxSaving + commuterResult.taxSaving;

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
          fontFamily: 'Instrument Serif, serif',
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '0.25rem 0 0.5rem',
          color: 'var(--ink)',
        }}
      >
        Salary sacrifice visualiser
      </h1>

      <p
        style={{
          fontFamily: 'Instrument Serif, serif',
          fontStyle: 'italic',
          fontSize: '1.125rem',
          color: 'var(--ink-2)',
          margin: '0 0 1rem',
        }}
      >
        See how much the Bike-to-Work scheme and Tax Saver Commuter ticket actually save you.
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
        Both schemes reduce your gross salary before tax — so you save PAYE, USC, and PRSI
        on the full sacrificed amount. Figures use Budget 2026 standard rates.
      </p>

      <Rule />

      {/* Salary input */}
      <div
        style={{
          border: '1px solid var(--rule)',
          borderRadius: '8px',
          backgroundColor: 'var(--surface)',
          padding: '1.75rem',
          marginTop: '2rem',
          marginBottom: '1.5rem',
        }}
      >
        <p
          className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'var(--ink-2)' }}
        >
          Your annual gross salary
        </p>

        <div className="flex items-baseline justify-between mb-1.5">
          <label className="font-sans text-sm font-medium" style={{ color: 'var(--ink)' }}>
            Annual gross
          </label>
          <span className="font-sans text-sm tabular-nums font-semibold" style={{ color: 'var(--accent)' }}>
            {formatEuro(salary)}
          </span>
        </div>
        <input
          type="range"
          min={15_000}
          max={120_000}
          step={500}
          value={salary}
          onChange={(e) => setSalary(parseInt(e.target.value, 10))}
          className="w-full"
          style={{ accentColor: 'var(--accent)' }}
        />
        <div className="flex justify-between font-sans text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
          <span>€15,000</span>
          <span>€120,000</span>
        </div>
      </div>

      {/* Two columns on md+ */}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-4">

        {/* ── Bike-to-Work ─────────────────────────────────────────────── */}
        <div
          style={{
            border: '1px solid var(--rule)',
            borderRadius: '8px',
            backgroundColor: 'var(--surface)',
            padding: '1.5rem',
          }}
        >
          <p
            className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--ink-2)' }}
          >
            🚲 Bike-to-Work
          </p>

          {/* Bike type */}
          <div className="flex gap-2 mb-4">
            {(
              [
                { value: 'standard', label: 'Standard / cargo', cap: BIKE_TO_WORK_CAP_STANDARD },
                { value: 'ebike', label: 'E-bike / pedelec', cap: BIKE_TO_WORK_CAP_EBIKE },
              ] as const
            ).map(({ value, label, cap }) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setBikeType(value);
                  if (value === 'standard' && bikeCost > BIKE_TO_WORK_CAP_STANDARD) {
                    setBikeCost(BIKE_TO_WORK_CAP_STANDARD);
                  }
                }}
                className="font-sans text-xs font-medium flex-1"
                style={{
                  padding: '0.4375rem 0.75rem',
                  border: `1px solid ${bikeType === value ? 'var(--accent)' : 'var(--rule)'}`,
                  borderRadius: '2px',
                  backgroundColor: bikeType === value ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'var(--bg)',
                  color: bikeType === value ? 'var(--accent)' : 'var(--ink-2)',
                  cursor: 'pointer',
                }}
              >
                {label}
                <span className="block" style={{ fontSize: '0.625rem', opacity: 0.7, marginTop: '1px' }}>
                  up to {formatEuro(cap)}
                </span>
              </button>
            ))}
          </div>

          {/* Bike cost slider */}
          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-1">
              <label className="font-sans text-sm font-medium" style={{ color: 'var(--ink)' }}>
                Bike / equipment cost
              </label>
              <span className="font-sans text-sm tabular-nums font-semibold" style={{ color: 'var(--accent)' }}>
                {formatEuro(bikeCost)}
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={bikeCap}
              step={50}
              value={Math.min(bikeCost, bikeCap)}
              onChange={(e) => setBikeCost(parseInt(e.target.value, 10))}
              className="w-full"
              style={{ accentColor: 'var(--accent)' }}
            />
            <div className="flex justify-between font-sans text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
              <span>€200</span>
              <span>{formatEuro(bikeCap)} cap</span>
            </div>
          </div>

          {/* Results */}
          <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '0.75rem' }}>
            <StatRow
              label="Bike cost"
              value={`${formatEuro(effectiveBikeCost)}`}
            />
            <StatRow
              label="Tax saving"
              value={`−${formatEuro(bikeResult.taxSaving)}`}
              sub={`(${bikeResult.effectiveDiscountPct}%)`}
            />
            <StatRow
              label="Net cost to you"
              value={formatEuro(bikeResult.netCost)}
              highlight
            />
          </div>

          <p className="font-sans text-xs mt-3" style={{ color: 'var(--ink-2)', lineHeight: 1.5 }}>
            Available once every {BIKE_CYCLE_YEARS} years per employer. Your employer must purchase
            the bike on your behalf — you repay via salary deductions.
          </p>
        </div>

        {/* ── Tax Saver Commuter ───────────────────────────────────────── */}
        <div
          style={{
            border: '1px solid var(--rule)',
            borderRadius: '8px',
            backgroundColor: 'var(--surface)',
            padding: '1.5rem',
          }}
        >
          <p
            className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--ink-2)' }}
          >
            🚌 Tax Saver Commuter
          </p>

          {/* Preset buttons */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {COMMUTER_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setCommuterCost(p.value)}
                className="font-sans text-xs"
                style={{
                  padding: '0.3125rem 0.625rem',
                  border: `1px solid ${commuterCost === p.value ? 'var(--accent)' : 'var(--rule)'}`,
                  borderRadius: '2px',
                  backgroundColor: commuterCost === p.value ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'var(--bg)',
                  color: commuterCost === p.value ? 'var(--accent)' : 'var(--ink-2)',
                  cursor: 'pointer',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Pass cost slider */}
          <div className="mb-4">
            <div className="flex items-baseline justify-between mb-1">
              <label className="font-sans text-sm font-medium" style={{ color: 'var(--ink)' }}>
                Annual pass cost
              </label>
              <span className="font-sans text-sm tabular-nums font-semibold" style={{ color: 'var(--accent)' }}>
                {formatEuro(commuterCost)}
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={3_000}
              step={10}
              value={commuterCost}
              onChange={(e) => setCommuterCost(parseInt(e.target.value, 10))}
              className="w-full"
              style={{ accentColor: 'var(--accent)' }}
            />
            <div className="flex justify-between font-sans text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
              <span>€200</span>
              <span>€3,000</span>
            </div>
          </div>

          {/* Results */}
          <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '0.75rem' }}>
            <StatRow
              label="Annual pass"
              value={formatEuro(commuterCost)}
            />
            <StatRow
              label="Tax saving"
              value={`−${formatEuro(commuterResult.taxSaving)}`}
              sub={`(${commuterResult.effectiveDiscountPct}%)`}
            />
            <StatRow
              label="Net annual cost"
              value={formatEuro(commuterResult.netCost)}
              highlight
            />
          </div>

          <p className="font-sans text-xs mt-3" style={{ color: 'var(--ink-2)', lineHeight: 1.5 }}>
            Monthly saving: <strong style={{ color: 'var(--ink)' }}>{formatEuro(commuterResult.monthlySaving)}</strong>.
            Renewable annually — no limit on how often you use this scheme.
          </p>
        </div>
      </div>

      {/* Combined summary */}
      {combinedSaving > 0 && (
        <div
          style={{
            border: '2px solid var(--accent)',
            borderRadius: '8px',
            padding: '1.25rem 1.5rem',
            marginTop: '1.5rem',
            backgroundColor: 'color-mix(in srgb, var(--accent) 5%, transparent)',
          }}
        >
          <p
            className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--accent)' }}
          >
            Combined tax saving
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <div>
              <p className="font-sans text-xs mb-0.5" style={{ color: 'var(--ink-2)' }}>
                Bike-to-Work
              </p>
              <p className="font-sans text-lg tabular-nums font-bold" style={{ color: 'var(--ink)' }}>
                {formatEuro(bikeResult.taxSaving)}
              </p>
            </div>
            <div>
              <p className="font-sans text-xs mb-0.5" style={{ color: 'var(--ink-2)' }}>
                Tax Saver (annual)
              </p>
              <p className="font-sans text-lg tabular-nums font-bold" style={{ color: 'var(--ink)' }}>
                {formatEuro(commuterResult.taxSaving)}
              </p>
            </div>
            <div>
              <p className="font-sans text-xs mb-0.5" style={{ color: 'var(--accent)' }}>
                Total saved
              </p>
              <p className="font-sans text-2xl tabular-nums font-bold" style={{ color: 'var(--accent)' }}>
                {formatEuro(combinedSaving)}
              </p>
            </div>
          </div>
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
          How salary sacrifice works
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
          <li>Your employer purchases the benefit (bike or commuter pass) directly.</li>
          <li>The cost is deducted from your <strong style={{ color: 'var(--ink)' }}>gross salary</strong> before tax — so you avoid PAYE, USC, and PRSI on that amount.</li>
          <li><strong style={{ color: 'var(--ink)' }}>Bike-to-Work</strong> can only be used once every {BIKE_CYCLE_YEARS} years per employer. Equipment includes helmets, locks, and safety gear.</li>
          <li><strong style={{ color: 'var(--ink)' }}>Tax Saver</strong> tickets must be purchased through a Revenue-approved scheme. Check with your payroll department.</li>
          <li>Both schemes require employer participation — your employer must opt in.</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-4 mt-5">
        <a
          href="https://www.revenue.ie/en/jobs-and-pensions/taxation-of-employer-benefits/bike-to-work-scheme.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          Revenue: Bike-to-Work →
        </a>
        <a
          href="https://www.revenue.ie/en/jobs-and-pensions/taxation-of-employer-benefits/travel-passes-and-tax-saver-commuter-tickets.aspx"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm"
          style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
        >
          Revenue: Tax Saver Commuter →
        </a>
        <Link
          href="/tools/pay-rise"
          className="font-sans text-sm"
          style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
        >
          Pay rise calculator →
        </Link>
      </div>

    </main>
  );
}
