'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { formatEuro } from '@/lib/tax';
import {
  calcETF,
  calcInvestmentTrust,
  ETF_EXIT_TAX_RATE,
  CGT_RATE,
  CGT_ANNUAL_EXEMPTION,
  DEEMED_DISPOSAL_CYCLE,
} from '@/lib/calculations/etf';

const DEFAULT_INITIAL = 5000;
const DEFAULT_GROWTH = 7;
const DEFAULT_YEARS = 20;

const MIN_INITIAL = 500;
const MAX_INITIAL = 100000;
const MIN_GROWTH = 1;
const MAX_GROWTH = 15;
const MIN_YEARS = 5;
const MAX_YEARS = 35;

function pctLabel(rate: number) {
  return `${(rate * 100).toFixed(0)}%`;
}

export default function ETFCalculatorPage() {
  const [initial, setInitial] = useState(DEFAULT_INITIAL);
  const [growth, setGrowth] = useState(DEFAULT_GROWTH);
  const [years, setYears] = useState(DEFAULT_YEARS);

  const etf = calcETF(initial, growth, years);
  const trust = calcInvestmentTrust(initial, growth, years);

  const difference = etf.netAfterTax - trust.netAfterTax;
  const betterVehicle = difference >= 0 ? 'etf' : 'trust';

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
          fontFamily: 'Instrument Serif, serif',
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '0.25rem 0 0.5rem',
          color: 'var(--ink)',
        }}
      >
        ETF vs investment trust calculator
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
        How Ireland&rsquo;s 41% exit tax and 8-year deemed disposal rule affect your returns.
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
        Illustrative only. Tax rules are complex — consult a tax professional or{' '}
        <a
          href="https://www.revenue.ie"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent)' }}
        >
          Revenue.ie
        </a>{' '}
        for your specific situation.
      </p>

      <Rule />

      {/* Main panel */}
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

          {/* ── Left: inputs ──────────────────────────────────────── */}
          <div className="lg:col-span-4 p-6 lg:p-8 flex flex-col gap-6">

            {/* Initial investment */}
            <div>
              <label
                className="font-sans text-sm font-medium block mb-2"
                style={{ color: 'var(--ink)' }}
              >
                Initial investment
              </label>
              <p
                className="font-display tabular-nums text-2xl mb-2"
                style={{
                  fontFamily: 'Instrument Serif, serif',
                  color: 'var(--ink)',
                  letterSpacing: '-0.02em',
                }}
              >
                {formatEuro(initial)}
              </p>
              <input
                type="range"
                min={MIN_INITIAL}
                max={MAX_INITIAL}
                step={500}
                value={initial}
                onChange={(e) => setInitial(parseInt(e.target.value, 10))}
                className="w-full max-w-sm mb-1"
                style={{ accentColor: 'var(--accent)' }}
              />
              <div
                className="flex justify-between font-sans text-xs max-w-sm"
                style={{ color: 'var(--ink-2)' }}
              >
                <span>{formatEuro(MIN_INITIAL)}</span>
                <span>{formatEuro(MAX_INITIAL)}</span>
              </div>
            </div>

            {/* Annual growth rate */}
            <div>
              <label
                className="font-sans text-sm font-medium block mb-2"
                style={{ color: 'var(--ink)' }}
              >
                Annual growth rate: {growth}%
              </label>
              <input
                type="range"
                min={MIN_GROWTH}
                max={MAX_GROWTH}
                step={0.5}
                value={growth}
                onChange={(e) => setGrowth(parseFloat(e.target.value))}
                className="w-full max-w-sm mb-1"
                style={{ accentColor: 'var(--accent)' }}
              />
              <div
                className="flex justify-between font-sans text-xs max-w-sm"
                style={{ color: 'var(--ink-2)' }}
              >
                <span>{MIN_GROWTH}%</span>
                <span>{MAX_GROWTH}%</span>
              </div>
              <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                Global equities have averaged ~7–8% historically. This is not a prediction.
              </p>
            </div>

            {/* Holding period */}
            <div>
              <label
                className="font-sans text-sm font-medium block mb-2"
                style={{ color: 'var(--ink)' }}
              >
                Holding period: {years} years
              </label>
              <input
                type="range"
                min={MIN_YEARS}
                max={MAX_YEARS}
                step={1}
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value, 10))}
                className="w-full max-w-sm mb-1"
                style={{ accentColor: 'var(--accent)' }}
              />
              <div
                className="flex justify-between font-sans text-xs max-w-sm"
                style={{ color: 'var(--ink-2)' }}
              >
                <span>{MIN_YEARS} yr</span>
                <span>{MAX_YEARS} yr</span>
              </div>
              {etf.deemedDisposals.length > 0 && (
                <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                  {etf.deemedDisposals.length} deemed disposal
                  {etf.deemedDisposals.length === 1 ? '' : 's'} at year
                  {etf.deemedDisposals.length === 1 ? '' : 's'}{' '}
                  {etf.deemedDisposals.map((d) => d.year).join(', ')}.
                </p>
              )}
            </div>

            {/* Tax rate info box */}
            <div
              style={{
                borderTop: '1px solid var(--rule)',
                paddingTop: '1.25rem',
              }}
            >
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--ink-2)' }}
              >
                Tax rates used
              </p>
              <div
                className="font-sans text-sm"
                style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}
              >
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}
                >
                  <span style={{ color: 'var(--ink-2)' }}>UCITS ETF exit tax</span>
                  <span className="font-medium" style={{ color: 'var(--ink)' }}>
                    {pctLabel(ETF_EXIT_TAX_RATE)}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}
                >
                  <span style={{ color: 'var(--ink-2)' }}>CGT rate (shares)</span>
                  <span className="font-medium" style={{ color: 'var(--ink)' }}>
                    {pctLabel(CGT_RATE)}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}
                >
                  <span style={{ color: 'var(--ink-2)' }}>CGT annual exemption</span>
                  <span className="font-medium" style={{ color: 'var(--ink)' }}>
                    {formatEuro(CGT_ANNUAL_EXEMPTION)}
                  </span>
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}
                >
                  <span style={{ color: 'var(--ink-2)' }}>Deemed disposal cycle</span>
                  <span className="font-medium" style={{ color: 'var(--ink)' }}>
                    every {DEEMED_DISPOSAL_CYCLE} years
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: results ─────────────────────────────────────── */}
          <div className="lg:col-span-8 p-6 lg:p-8">

            {/* Side-by-side comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6">

              {/* UCITS ETF */}
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
                  UCITS ETF
                </p>
                <p
                  className="font-display tabular-nums leading-none mb-0.5"
                  style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatEuro(etf.netAfterTax)}
                </p>
                <p
                  className="font-sans text-xs mb-4"
                  style={{ color: 'var(--ink-2)' }}
                >
                  net after all tax
                </p>

                <div
                  className="font-sans text-sm"
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-2)' }}>Final value</span>
                    <span className="tabular-nums" style={{ color: 'var(--ink)' }}>
                      {formatEuro(etf.finalValue)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-2)' }}>Total gain</span>
                    <span className="tabular-nums" style={{ color: 'var(--ink)' }}>
                      {formatEuro(etf.totalGrossGain)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-2)' }}>Total tax paid</span>
                    <span
                      className="tabular-nums font-medium"
                      style={{ color: 'var(--accent)' }}
                    >
                      {formatEuro(etf.totalTaxPaid)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-2)' }}>Effective rate</span>
                    <span className="tabular-nums" style={{ color: 'var(--ink)' }}>
                      {etf.effectiveTaxRatePct}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Investment trust */}
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
                  Investment trust
                </p>
                <p
                  className="font-display tabular-nums leading-none mb-0.5"
                  style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatEuro(trust.netAfterTax)}
                </p>
                <p
                  className="font-sans text-xs mb-4"
                  style={{ color: 'var(--ink-2)' }}
                >
                  net after tax
                </p>

                <div
                  className="font-sans text-sm"
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-2)' }}>Final value</span>
                    <span className="tabular-nums" style={{ color: 'var(--ink)' }}>
                      {formatEuro(trust.finalValue)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-2)' }}>Total gain</span>
                    <span className="tabular-nums" style={{ color: 'var(--ink)' }}>
                      {formatEuro(trust.totalGrossGain)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-2)' }}>Tax paid</span>
                    <span
                      className="tabular-nums font-medium"
                      style={{ color: 'var(--accent)' }}
                    >
                      {formatEuro(trust.taxPaid)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--ink-2)' }}>Effective rate</span>
                    <span className="tabular-nums" style={{ color: 'var(--ink)' }}>
                      {trust.effectiveTaxRatePct}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Difference callout */}
            <div
              style={{
                borderRadius: '4px',
                padding: '0.875rem 1rem',
                marginBottom: '1.5rem',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--rule)',
              }}
            >
              <p className="font-sans text-sm" style={{ color: 'var(--ink)', lineHeight: 1.6 }}>
                {betterVehicle === 'trust' ? (
                  <>
                    With these assumptions, the investment trust leaves you{' '}
                    <strong>{formatEuro(Math.abs(difference))}</strong> better off than the
                    UCITS ETF over {years} years — mainly because the 33% CGT rate is lower
                    than the 41% exit tax, and there are no deemed disposal events along the way.
                  </>
                ) : (
                  <>
                    With these assumptions, the UCITS ETF leaves you{' '}
                    <strong>{formatEuro(Math.abs(difference))}</strong> ahead of the investment
                    trust after {years} years. This can happen when the deemed disposal events
                    fall near the end of the period or the holding period is short.
                  </>
                )}
              </p>
            </div>

            <Rule className="mb-5" />

            {/* Deemed disposal timeline */}
            {etf.deemedDisposals.length > 0 && (
              <div>
                <p
                  className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--ink-2)' }}
                >
                  Deemed disposal events (ETF)
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {etf.deemedDisposals.map((event) => (
                    <div
                      key={event.year}
                      style={{
                        border: '1px solid var(--rule)',
                        borderRadius: '4px',
                        padding: '0.75rem 1rem',
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto',
                        gap: '0 1rem',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        className="font-display italic"
                        style={{
                          fontFamily: 'Instrument Serif, serif',
                          fontSize: '1.25rem',
                          color: 'var(--accent)',
                        }}
                      >
                        Yr {event.year}
                      </span>
                      <div>
                        <p
                          className="font-sans text-xs"
                          style={{ color: 'var(--ink-2)', margin: 0 }}
                        >
                          Portfolio value{' '}
                          <span className="font-medium tabular-nums" style={{ color: 'var(--ink)' }}>
                            {formatEuro(event.portfolioValue)}
                          </span>
                          {' · '}gain since last event{' '}
                          <span className="font-medium tabular-nums" style={{ color: 'var(--ink)' }}>
                            {formatEuro(event.gainSinceLastEvent)}
                          </span>
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p
                          className="font-sans text-xs font-semibold"
                          style={{ color: 'var(--accent)', margin: 0 }}
                        >
                          Tax due
                        </p>
                        <p
                          className="font-sans text-sm font-medium tabular-nums"
                          style={{ color: 'var(--ink)', margin: 0 }}
                        >
                          {formatEuro(event.taxDue)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Final exit */}
                  <div
                    style={{
                      border: '1px solid var(--rule)',
                      borderRadius: '4px',
                      padding: '0.75rem 1rem',
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: '0 1rem',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      className="font-display italic"
                      style={{
                        fontFamily: 'Instrument Serif, serif',
                        fontSize: '1.25rem',
                        color: 'var(--ink-2)',
                      }}
                    >
                      Yr {years}
                    </span>
                    <p
                      className="font-sans text-xs"
                      style={{ color: 'var(--ink-2)', margin: 0 }}
                    >
                      Final sale &mdash; exit tax on remaining gain
                    </p>
                    <div style={{ textAlign: 'right' }}>
                      <p
                        className="font-sans text-xs font-semibold"
                        style={{ color: 'var(--accent)', margin: 0 }}
                      >
                        Tax due
                      </p>
                      <p
                        className="font-sans text-sm font-medium tabular-nums"
                        style={{ color: 'var(--ink)', margin: 0 }}
                      >
                        {formatEuro(etf.finalExitTax)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                  <strong>UCITS ETF:</strong> Most mainstream index funds (Vanguard,
                  iShares, SPDR) sold through brokers to Irish residents. 41% exit tax,
                  8-year deemed disposal rule, no CGT exemption.
                </li>
                <li>
                  <strong>Investment trust:</strong> A listed company (e.g. Scottish
                  Mortgage, Ruffer). Taxed as CGT at 33% on disposal. One{' '}
                  {formatEuro(CGT_ANNUAL_EXEMPTION)} exemption in year of sale.
                </li>
                <li>
                  Assumes lump-sum investment, no ongoing contributions, and growth-only
                  (no dividends distributed). Deemed disposal taxes are paid separately
                  and not deducted from the portfolio.
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Learn more */}
      <p className="font-sans text-sm mt-6" style={{ color: 'var(--ink-2)' }}>
        Want to understand ETF investing in Ireland?{' '}
        <Link
          href="/lessons/investing"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          Read the investing lesson &rarr;
        </Link>
      </p>

    </main>
  );
}
