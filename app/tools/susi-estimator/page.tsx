'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { formatEuro } from '@/lib/tax';
import {
  calcSUSI,
  SUSI_GRANT_YEAR,
  SUSI_INCOME_YEAR,
  NON_ADJACENT_AMOUNTS,
  ADJACENT_AMOUNTS,
  DEPENDENT_INCREMENT,
  BASE_THRESHOLDS,
} from '@/lib/calculations/susi';

export default function SUSIEstimatorPage() {
  const [householdIncome, setHouseholdIncome] = useState(45_000);
  const [dependents, setDependents] = useState(1);
  const [adjacent, setAdjacent] = useState(false);
  const [fullTime, setFullTime] = useState(true);

  const result = useMemo(
    () => calcSUSI({ householdIncome, dependents, adjacent, fullTime }),
    [householdIncome, dependents, adjacent, fullTime],
  );

  const eligible = result.band !== 'none';

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
        SUSI eligibility estimator
      </h1>

      <p
        style={{
          fontStyle: 'italic',
          fontSize: '1.125rem',
          color: 'var(--ink-2)',
          margin: '0 0 1rem',
        }}
      >
        Find out if you might qualify for the student maintenance grant for {SUSI_GRANT_YEAR}.
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
        Estimate only — based on {SUSI_GRANT_YEAR} thresholds using {SUSI_INCOME_YEAR} income.
        SUSI&rsquo;s actual assessment includes additional factors not modelled here.
        Always verify at{' '}
        <a
          href="https://www.susi.ie"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent)' }}
        >
          susi.ie
        </a>
        .
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
            className="lg:col-span-5 p-6 lg:p-8 flex flex-col gap-6"
            style={{ borderRight: '1px solid var(--rule)' }}
          >
            <p
              className="font-sans text-xs font-semibold uppercase tracking-widest"
              style={{ color: 'var(--ink-2)' }}
            >
              Your situation
            </p>

            {/* Household income */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label
                  className="font-sans text-sm font-medium"
                  style={{ color: 'var(--ink)' }}
                >
                  Total household income ({SUSI_INCOME_YEAR})
                </label>
                <span
                  className="font-sans text-sm tabular-nums font-semibold"
                  style={{ color: 'var(--accent)' }}
                >
                  {formatEuro(householdIncome)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100_000}
                step={1_000}
                value={householdIncome}
                onChange={(e) => setHouseholdIncome(parseInt(e.target.value, 10))}
                className="w-full"
                style={{ accentColor: 'var(--accent)' }}
              />
              <div
                className="flex justify-between font-sans text-xs mt-0.5"
                style={{ color: 'var(--ink-2)' }}
              >
                <span>€0</span>
                <span>€100,000</span>
              </div>
              <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                Combined gross income of all household members (parents/guardians + any
                other dependent income). PRSI contributions are typically deducted first.
              </p>
            </div>

            {/* Dependents */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label
                  className="font-sans text-sm font-medium"
                  style={{ color: 'var(--ink)' }}
                >
                  Dependent household members
                </label>
                <span
                  className="font-sans text-sm tabular-nums font-semibold"
                  style={{ color: 'var(--accent)' }}
                >
                  {dependents}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={1}
                value={dependents}
                onChange={(e) => setDependents(parseInt(e.target.value, 10))}
                className="w-full"
                style={{ accentColor: 'var(--accent)' }}
              />
              <div
                className="flex justify-between font-sans text-xs mt-0.5"
                style={{ color: 'var(--ink-2)' }}
              >
                <span>1 (just you)</span>
                <span>8</span>
              </div>
              <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                Include yourself. Add additional dependent children in the household
                (adds {formatEuro(DEPENDENT_INCREMENT)} to each income threshold).
              </p>
            </div>

            {/* Adjacent / non-adjacent */}
            <div>
              <p
                className="font-sans text-sm font-medium mb-2"
                style={{ color: 'var(--ink)' }}
              >
                Distance from home to college
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { value: false, label: 'Non-adjacent (living away from home / >45 km)' },
                  { value: true, label: 'Adjacent (living at home or within 45 km)' },
                ].map(({ value, label }) => (
                  <label
                    key={String(value)}
                    className="flex items-start gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="adjacent"
                      checked={adjacent === value}
                      onChange={() => setAdjacent(value)}
                      style={{ marginTop: '2px', accentColor: 'var(--accent)' }}
                    />
                    <span
                      className="font-sans text-sm"
                      style={{ color: 'var(--ink)', lineHeight: 1.45 }}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Full-time / part-time */}
            <div>
              <p
                className="font-sans text-sm font-medium mb-2"
                style={{ color: 'var(--ink)' }}
              >
                Course type
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { value: true, label: 'Full-time' },
                  { value: false, label: 'Part-time (reduced grant applies)' },
                ].map(({ value, label }) => (
                  <label
                    key={String(value)}
                    className="flex items-start gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="fullTime"
                      checked={fullTime === value}
                      onChange={() => setFullTime(value)}
                      style={{ marginTop: '2px', accentColor: 'var(--accent)' }}
                    />
                    <span
                      className="font-sans text-sm"
                      style={{ color: 'var(--ink)', lineHeight: 1.45 }}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── Results ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-7 p-6 lg:p-8">

            {/* Eligibility result */}
            <div
              style={{
                border: `2px solid ${eligible ? 'var(--accent)' : 'var(--rule)'}`,
                borderRadius: '4px',
                padding: '1.25rem',
                marginBottom: '1.5rem',
                backgroundColor: eligible ? 'var(--surface)' : 'var(--bg)',
              }}
            >
              {eligible ? (
                <>
                  <p
                    className="font-sans text-xs font-semibold uppercase tracking-widest mb-1"
                    style={{ color: 'var(--accent)' }}
                  >
                    Likely eligible — {result.bandLabel}
                  </p>
                  <p
                    className="font-display tabular-nums leading-none"
                    style={{
                      fontSize: 'clamp(2rem, 5vw, 3rem)',
                      color: 'var(--ink)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {formatEuro(result.estimatedGrant)}
                  </p>
                  <p
                    className="font-sans text-sm mt-1"
                    style={{ color: 'var(--ink-2)' }}
                  >
                    estimated annual maintenance grant
                    {!fullTime ? ' (part-time rate)' : ''}
                  </p>
                  {result.incomeHeadroom > 0 && (
                    <p
                      className="font-sans text-xs mt-2"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      Your household income is{' '}
                      <strong>{formatEuro(result.incomeHeadroom)}</strong> below the{' '}
                      {result.bandLabel.toLowerCase()} threshold.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p
                    className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
                    style={{ color: 'var(--ink-2)' }}
                  >
                    Likely not eligible
                  </p>
                  <p
                    className="font-sans text-sm"
                    style={{ color: 'var(--ink)', lineHeight: 1.6 }}
                  >
                    With {dependents} dependent{dependents !== 1 ? 's' : ''} and an income of{' '}
                    {formatEuro(householdIncome)}, your household is above the estimated upper
                    threshold of{' '}
                    <strong>
                      {formatEuro(result.effectiveThreshold)}
                    </strong>
                    . You would need to reduce income by{' '}
                    <strong>
                      {formatEuro(Math.abs(result.incomeHeadroom))}
                    </strong>{' '}
                    to qualify for a partial grant.
                  </p>
                </>
              )}
            </div>

            {/* Threshold table */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: 'var(--ink-2)' }}
              >
                {SUSI_GRANT_YEAR} income thresholds for {dependents} dependent
                {dependents !== 1 ? 's' : ''}
              </p>
              <div style={{ overflowX: 'auto' }}>
                <table
                  className="font-sans text-xs w-full"
                  style={{ borderCollapse: 'collapse', minWidth: '320px' }}
                >
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--rule)' }}>
                      <th
                        style={{
                          padding: '0.375rem 0.5rem',
                          color: 'var(--ink-2)',
                          fontWeight: 600,
                          textAlign: 'left',
                        }}
                      >
                        Band
                      </th>
                      <th
                        style={{
                          padding: '0.375rem 0.5rem',
                          color: 'var(--ink-2)',
                          fontWeight: 600,
                          textAlign: 'right',
                        }}
                      >
                        Income up to
                      </th>
                      <th
                        style={{
                          padding: '0.375rem 0.5rem',
                          color: 'var(--ink-2)',
                          fontWeight: 600,
                          textAlign: 'right',
                        }}
                      >
                        Non-adj.
                      </th>
                      <th
                        style={{
                          padding: '0.375rem 0.5rem',
                          color: 'var(--ink-2)',
                          fontWeight: 600,
                          textAlign: 'right',
                        }}
                      >
                        Adjacent
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        band: 'Special rate',
                        threshold: BASE_THRESHOLDS.specialRate + Math.max(0, dependents - 1) * DEPENDENT_INCREMENT,
                        nonAdj: NON_ADJACENT_AMOUNTS.specialRate,
                        adj: ADJACENT_AMOUNTS.specialRate,
                        key: 'special',
                      },
                      {
                        band: 'Standard rate',
                        threshold: BASE_THRESHOLDS.standardRate + Math.max(0, dependents - 1) * DEPENDENT_INCREMENT,
                        nonAdj: NON_ADJACENT_AMOUNTS.standardRate,
                        adj: ADJACENT_AMOUNTS.standardRate,
                        key: 'standard',
                      },
                      {
                        band: 'Partial (75%)',
                        threshold: BASE_THRESHOLDS.partialRate75 + Math.max(0, dependents - 1) * DEPENDENT_INCREMENT,
                        nonAdj: NON_ADJACENT_AMOUNTS.partialRate75,
                        adj: ADJACENT_AMOUNTS.partialRate75,
                        key: 'partial75',
                      },
                      {
                        band: 'Partial (50%)',
                        threshold: BASE_THRESHOLDS.partialRate50 + Math.max(0, dependents - 1) * DEPENDENT_INCREMENT,
                        nonAdj: NON_ADJACENT_AMOUNTS.partialRate50,
                        adj: ADJACENT_AMOUNTS.partialRate50,
                        key: 'partial50',
                      },
                      {
                        band: 'Partial (25%)',
                        threshold: BASE_THRESHOLDS.partialRate25 + Math.max(0, dependents - 1) * DEPENDENT_INCREMENT,
                        nonAdj: NON_ADJACENT_AMOUNTS.partialRate25,
                        adj: ADJACENT_AMOUNTS.partialRate25,
                        key: 'partial25',
                      },
                    ].map((row) => (
                      <tr
                        key={row.key}
                        style={{
                          borderBottom: '1px solid var(--rule)',
                          backgroundColor:
                            result.band === row.key ? 'color-mix(in srgb, var(--accent) 8%, transparent)' : 'transparent',
                        }}
                      >
                        <td
                          style={{
                            padding: '0.375rem 0.5rem',
                            color: result.band === row.key ? 'var(--accent)' : 'var(--ink)',
                            fontWeight: result.band === row.key ? 600 : 400,
                          }}
                        >
                          {row.band}
                          {result.band === row.key && ' ←'}
                        </td>
                        <td
                          className="tabular-nums"
                          style={{
                            padding: '0.375rem 0.5rem',
                            color: 'var(--ink)',
                            textAlign: 'right',
                          }}
                        >
                          {formatEuro(row.threshold)}
                        </td>
                        <td
                          className="tabular-nums"
                          style={{
                            padding: '0.375rem 0.5rem',
                            color: !adjacent ? 'var(--ink)' : 'var(--ink-2)',
                            textAlign: 'right',
                            fontWeight: !adjacent ? 500 : 400,
                          }}
                        >
                          {formatEuro(row.nonAdj)}
                        </td>
                        <td
                          className="tabular-nums"
                          style={{
                            padding: '0.375rem 0.5rem',
                            color: adjacent ? 'var(--ink)' : 'var(--ink-2)',
                            textAlign: 'right',
                            fontWeight: adjacent ? 500 : 400,
                          }}
                        >
                          {formatEuro(row.adj)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        colSpan={4}
                        style={{
                          padding: '0.375rem 0.5rem',
                          color: 'var(--ink-2)',
                          fontStyle: 'italic',
                        }}
                      >
                        Above {formatEuro(BASE_THRESHOLDS.upperLimit + Math.max(0, dependents - 1) * DEPENDENT_INCREMENT)}: no grant
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* What to do next */}
            {eligible && (
              <div
                style={{
                  borderTop: '1px solid var(--rule)',
                  paddingTop: '1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                <p
                  className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--ink-2)' }}
                >
                  Next steps
                </p>
                <ol
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
                    Applications typically open in <strong>May each year</strong>. Register at{' '}
                    <a
                      href="https://www.susi.ie"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent)' }}
                    >
                      susi.ie
                    </a>{' '}
                    now so you&rsquo;re notified when the portal opens.
                  </li>
                  <li>
                    Gather your household&rsquo;s <strong>2024 income details</strong>: P60s,
                    Revenue statements, social welfare letters, or business income statements.
                  </li>
                  <li>
                    Have your <strong>CAO offer letter</strong> or course confirmation from
                    your college to hand.
                  </li>
                  <li>
                    Submit your application as early as possible — processing takes 6–8 weeks
                    and late applications may miss the October term deadline.
                  </li>
                </ol>
              </div>
            )}

            {/* Notes */}
            <div
              style={{
                paddingTop: eligible ? '0' : '1.25rem',
                borderTop: eligible ? 'none' : '1px solid var(--rule)',
              }}
            >
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--ink-2)' }}
              >
                What this doesn&rsquo;t model
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
                  <strong>Fee contributions:</strong> SUSI may also contribute to college
                  registration fees (up to {formatEuro(6_270)}) for eligible students.
                </li>
                <li>
                  <strong>Income disregards:</strong> Certain income (e.g. child benefit,
                  carer&rsquo;s allowance, some social welfare) is excluded from reckonable
                  income — your actual threshold may be more generous.
                </li>
                <li>
                  <strong>Siblings in college:</strong> If multiple family members attend
                  college, each can apply independently.
                </li>
                <li>
                  <strong>Mature students:</strong> Independent mature students are assessed
                  on their own income, not parents&rsquo;.
                </li>
                <li>
                  <strong>PLC and other courses:</strong> Grant amounts and eligibility may
                  differ for Post-Leaving Certificate and other approved courses.
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-6 flex flex-wrap gap-4">
        <a
          href="https://www.susi.ie"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          Apply at susi.ie &rarr;
        </a>
        <Link
          href="/calculator"
          className="font-sans text-sm"
          style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
        >
          Take-home pay calculator &rarr;
        </Link>
      </div>

    </main>
  );
}
