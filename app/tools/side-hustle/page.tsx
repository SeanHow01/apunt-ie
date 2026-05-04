'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { formatEuro } from '@/lib/tax';
import {
  calcSideHustle,
  FORM_11_THRESHOLD,
  CLASS_S_PRSI_RATE,
} from '@/lib/calculations/side-hustle';

export default function SideHustlePage() {
  const [payeSalary, setPayeSalary] = useState(40_000);
  const [sideIncome, setSideIncome] = useState(8_000);

  const result = useMemo(
    () => calcSideHustle({ payeSalary, sideIncome }),
    [payeSalary, sideIncome],
  );

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
        Side hustle tax calculator
      </h1>

      <p
        style={{
          fontStyle: 'italic',
          fontSize: '1.125rem',
          color: 'var(--ink-2)',
          margin: '0 0 1rem',
        }}
      >
        How much of your freelance or self-employed income goes to Revenue?
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
        Estimate only. Does not account for allowable business expenses (which reduce
        taxable income). Consult Revenue.ie or a tax adviser for your specific situation.
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
              Your income
            </p>

            {/* PAYE salary */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label
                  className="font-sans text-sm font-medium"
                  style={{ color: 'var(--ink)' }}
                >
                  PAYE salary
                </label>
                <span
                  className="font-sans text-sm tabular-nums font-semibold"
                  style={{ color: 'var(--accent)' }}
                >
                  {formatEuro(payeSalary)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={120_000}
                step={1_000}
                value={payeSalary}
                onChange={(e) => setPayeSalary(parseInt(e.target.value, 10))}
                className="w-full"
                style={{ accentColor: 'var(--accent)' }}
              />
              <div
                className="flex justify-between font-sans text-xs mt-0.5"
                style={{ color: 'var(--ink-2)' }}
              >
                <span>€0</span>
                <span>€120,000</span>
              </div>
              <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                Your gross annual salary from employment (PAYE taxed by employer).
              </p>
            </div>

            {/* Side income */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label
                  className="font-sans text-sm font-medium"
                  style={{ color: 'var(--ink)' }}
                >
                  Side hustle income
                </label>
                <span
                  className="font-sans text-sm tabular-nums font-semibold"
                  style={{ color: 'var(--accent)' }}
                >
                  {formatEuro(sideIncome)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50_000}
                step={500}
                value={sideIncome}
                onChange={(e) => setSideIncome(parseInt(e.target.value, 10))}
                className="w-full"
                style={{ accentColor: 'var(--accent)' }}
              />
              <div
                className="flex justify-between font-sans text-xs mt-0.5"
                style={{ color: 'var(--ink-2)' }}
              >
                <span>€0</span>
                <span>€50,000</span>
              </div>
              <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                Gross income from freelance, consultancy, rental, or other non-PAYE sources.
                Enter gross (before any expenses or tax).
              </p>
            </div>

            {/* Rates info */}
            <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '1.25rem' }}>
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: 'var(--ink-2)' }}
              >
                Rates applied
              </p>
              <div
                className="font-sans text-xs"
                style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink-2)' }}>Marginal income tax</span>
                  <span className="font-medium" style={{ color: 'var(--ink)' }}>
                    {Math.round(result.marginalPayeRate * 100)}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink-2)' }}>Marginal USC</span>
                  <span className="font-medium" style={{ color: 'var(--ink)' }}>
                    {(result.marginalUscRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink-2)' }}>Class S PRSI</span>
                  <span className="font-medium" style={{ color: 'var(--ink)' }}>
                    {Math.round(CLASS_S_PRSI_RATE * 100)}%
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderTop: '1px solid var(--rule)',
                    paddingTop: '0.375rem',
                    marginTop: '0.125rem',
                  }}
                >
                  <span style={{ color: 'var(--ink)' }}>Combined marginal</span>
                  <span className="font-semibold" style={{ color: 'var(--accent)' }}>
                    {(result.effectiveSideRatePct).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Results ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-8 p-6 lg:p-8">

            {/* Hero: side income net */}
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
                  Side income take-home
                </p>
                <p
                  className="font-display tabular-nums leading-none"
                  style={{
                    fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatEuro(result.sideIncomeNetTakeHome)}
                </p>
                <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                  from {formatEuro(sideIncome)} gross
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
                  Tax on side income
                </p>
                <p
                  className="font-display tabular-nums leading-none"
                  style={{
                    fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
                    color: 'var(--accent)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatEuro(result.totalAdditionalTax)}
                </p>
                <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                  effective rate {result.effectiveSideRatePct.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Tax breakdown */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: 'var(--ink-2)' }}
              >
                Tax breakdown on side income
              </p>
              <div
                className="font-sans text-sm"
                style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                {[
                  { label: `Income tax (${Math.round(result.marginalPayeRate * 100)}% marginal)`, value: result.additionalPaye },
                  { label: `USC (${(result.marginalUscRate * 100).toFixed(1)}% marginal)`, value: result.additionalUsc },
                  { label: `Class S PRSI (${Math.round(CLASS_S_PRSI_RATE * 100)}%)`, value: result.classSPrsi },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem 0',
                      borderBottom: '1px solid var(--rule)',
                    }}
                  >
                    <span style={{ color: 'var(--ink-2)' }}>{label}</span>
                    <span className="tabular-nums font-medium" style={{ color: 'var(--ink)' }}>
                      {formatEuro(value)}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0',
                    fontWeight: 600,
                  }}
                >
                  <span style={{ color: 'var(--ink)' }}>Total additional tax</span>
                  <span className="tabular-nums" style={{ color: 'var(--accent)' }}>
                    {formatEuro(result.totalAdditionalTax)}
                  </span>
                </div>
              </div>
            </div>

            {/* Form 11 alert */}
            {result.requiresForm11 ? (
              <div
                style={{
                  border: '1px solid var(--accent)',
                  borderRadius: '4px',
                  padding: '0.875rem 1rem',
                  marginBottom: '1.5rem',
                  backgroundColor: 'color-mix(in srgb, var(--accent) 6%, transparent)',
                }}
              >
                <p
                  className="font-sans text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: 'var(--accent)' }}
                >
                  Form 11 required
                </p>
                <p
                  className="font-sans text-sm"
                  style={{ color: 'var(--ink)', lineHeight: 1.6 }}
                >
                  You must file a self-assessed income tax return (Form 11) by{' '}
                  <strong>31 October</strong> (or 12 November via ROS).
                  {result.form11Reasons.map((r) => ` ${r}.`).join('')}
                </p>
                <p
                  className="font-sans text-xs mt-2"
                  style={{ color: 'var(--ink-2)' }}
                >
                  Preliminary tax due (90% of liability):{' '}
                  <strong>{formatEuro(result.preliminaryTax)}</strong> — payable by 31 October.
                </p>
              </div>
            ) : (
              sideIncome > 0 && (
                <div
                  style={{
                    border: '1px solid var(--rule)',
                    borderRadius: '4px',
                    padding: '0.875rem 1rem',
                    marginBottom: '1.5rem',
                  }}
                >
                  <p
                    className="font-sans text-sm"
                    style={{ color: 'var(--ink)', lineHeight: 1.6 }}
                  >
                    <strong>No Form 11 required yet.</strong> Your side income is below the{' '}
                    {formatEuro(FORM_11_THRESHOLD)} threshold. You still owe the tax — consider
                    setting it aside now and declaring via the simpler Form 12.
                  </p>
                </div>
              )
            )}

            {/* Total picture */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: 'var(--ink-2)' }}
              >
                Full-year picture
              </p>
              <div
                className="font-sans text-sm"
                style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--rule)' }}>
                  <span style={{ color: 'var(--ink-2)' }}>PAYE salary (net)</span>
                  <span className="tabular-nums" style={{ color: 'var(--ink)' }}>{formatEuro(result.payeOnlyNet)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid var(--rule)' }}>
                  <span style={{ color: 'var(--ink-2)' }}>Side income (net after tax)</span>
                  <span className="tabular-nums" style={{ color: 'var(--ink)' }}>{formatEuro(result.sideIncomeNetTakeHome)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontWeight: 600 }}>
                  <span style={{ color: 'var(--ink)' }}>Total net take-home</span>
                  <span className="tabular-nums" style={{ color: 'var(--ink)' }}>
                    {formatEuro(result.payeOnlyNet + result.sideIncomeNetTakeHome)}
                  </span>
                </div>
              </div>
            </div>

            <Rule className="mb-5" />

            {/* Educational notes */}
            <div>
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--ink-2)' }}
              >
                How it works
              </p>
              <ul
                className="font-sans text-xs leading-relaxed"
                style={{
                  color: 'var(--ink-2)',
                  paddingLeft: '1.125rem',
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.375rem',
                }}
              >
                <li>
                  <strong>Income tax:</strong> Side income is added to your PAYE salary to
                  determine your marginal rate. If your salary already exceeds €44,000, all
                  side income is taxed at 40%.
                </li>
                <li>
                  <strong>USC:</strong> Applied on total gross income at the marginal rate for
                  each band. Side income pushes you into higher bands faster.
                </li>
                <li>
                  <strong>Class S PRSI (4%):</strong> Self-employed workers pay PRSI at 4% on
                  non-PAYE income. This is lower than the Class A employee rate (4.1%), but
                  there&rsquo;s no employer matching contribution, and entitlements differ.
                </li>
                <li>
                  <strong>Expenses reduce your tax bill:</strong> This calculator uses gross
                  side income. If you have legitimate business expenses (equipment, software,
                  professional fees), these reduce your taxable income before tax is applied.
                </li>
                <li>
                  <strong>Preliminary tax:</strong> Self-assessed workers must pay 90% of
                  their expected tax liability by 31 October. Set aside this amount as you
                  earn throughout the year.
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* CTA */}
      <p className="font-sans text-sm mt-6" style={{ color: 'var(--ink-2)' }}>
        Check Revenue&rsquo;s guide:{' '}
        <a
          href="https://www.revenue.ie/en/self-assessment-and-self-employment/index.aspx"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          Self-assessment and self-employment &rarr;
        </a>
      </p>

    </main>
  );
}
