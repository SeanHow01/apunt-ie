'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { formatEuro } from '@/lib/tax';
import {
  getCounties,
  getLocalAreas,
  checkRPZ,
  calcMaxRPZIncrease,
  RPZ_CAP_PCT,
  RPZ_LAST_UPDATED,
} from '@/lib/rpz-data';

export default function RPZCheckerPage() {
  const counties = useMemo(() => getCounties(), []);

  const [county, setCounty] = useState('');
  const [localArea, setLocalArea] = useState('');
  const [currentRent, setCurrentRent] = useState(1_400);
  const [monthsSinceReview, setMonthsSinceReview] = useState(12);

  const localAreas = useMemo(() => (county ? getLocalAreas(county) : []), [county]);
  const hasSubAreas = localAreas.some((a) => a.localArea !== null);

  const rpzStatus = useMemo(() => {
    if (!county) return null;
    return checkRPZ(county, hasSubAreas ? localArea || null : null);
  }, [county, localArea, hasSubAreas]);

  const increase = useMemo(() => {
    if (!rpzStatus?.isRPZ || monthsSinceReview < 12) return null;
    return calcMaxRPZIncrease(currentRent, monthsSinceReview);
  }, [rpzStatus, currentRent, monthsSinceReview]);

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
        Rent Pressure Zone checker
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
        Is your rental property in an RPZ — and how much can your landlord increase the rent?
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
        Data last updated {RPZ_LAST_UPDATED}. Always verify at{' '}
        <a
          href="https://www.rtb.ie/rent-pressure-zones"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--accent)' }}
        >
          rtb.ie
        </a>{' '}
        — RPZ designations are reviewed annually.
      </p>

      <Rule />

      <div
        style={{
          border: '1px solid var(--rule)',
          borderRadius: '8px',
          backgroundColor: 'var(--surface)',
          padding: '1.75rem',
          marginTop: '2rem',
        }}
      >

        {/* Step 1: Location */}
        <p
          className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: 'var(--ink-2)' }}
        >
          Step 1 — Your location
        </p>

        <div className="flex flex-col gap-4 mb-6">
          {/* County */}
          <div>
            <label
              htmlFor="rpz-county"
              className="font-sans text-sm font-medium block mb-1.5"
              style={{ color: 'var(--ink)' }}
            >
              County
            </label>
            <select
              id="rpz-county"
              value={county}
              onChange={(e) => { setCounty(e.target.value); setLocalArea(''); }}
              className="font-sans text-sm w-full"
              style={{
                padding: '0.5rem 0.75rem',
                border: '1px solid var(--rule)',
                borderRadius: '2px',
                backgroundColor: 'var(--bg)',
                color: 'var(--ink)',
                appearance: 'none',
              }}
            >
              <option value="">Select county…</option>
              {counties.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Local area — only show when county has sub-areas */}
          {county && hasSubAreas && (
            <div>
              <label
                htmlFor="rpz-local-area"
                className="font-sans text-sm font-medium block mb-1.5"
                style={{ color: 'var(--ink)' }}
              >
                Local electoral area
              </label>
              <select
                id="rpz-local-area"
                value={localArea}
                onChange={(e) => setLocalArea(e.target.value)}
                className="font-sans text-sm w-full"
                style={{
                  padding: '0.5rem 0.75rem',
                  border: '1px solid var(--rule)',
                  borderRadius: '2px',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--ink)',
                  appearance: 'none',
                }}
              >
                <option value="">Select area…</option>
                {localAreas
                  .filter((a) => a.localArea !== null)
                  .map((a) => (
                    <option key={a.localArea!} value={a.localArea!}>
                      {a.localArea}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* RPZ Status result */}
        {rpzStatus && (county && (!hasSubAreas || localArea)) && (
          <div
            style={{
              border: `2px solid ${rpzStatus.isRPZ ? 'var(--accent)' : 'var(--rule)'}`,
              borderRadius: '4px',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              backgroundColor: rpzStatus.isRPZ
                ? 'color-mix(in srgb, var(--accent) 6%, transparent)'
                : 'var(--bg)',
            }}
          >
            <p
              className="font-sans text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: rpzStatus.isRPZ ? 'var(--accent)' : 'var(--ink-2)' }}
            >
              {rpzStatus.isRPZ ? 'In a Rent Pressure Zone' : 'Not in a Rent Pressure Zone'}
            </p>
            {rpzStatus.isRPZ ? (
              <p className="font-sans text-sm" style={{ color: 'var(--ink)', lineHeight: 1.6 }}>
                {county}{localArea ? ` (${localArea})` : ''} is{' '}
                {rpzStatus.wholeCounty ? 'fully' : ''} designated as an RPZ. Rent increases
                are capped at{' '}
                <strong>{RPZ_CAP_PCT}% per annum</strong>, or the HICP inflation rate —
                whichever is lower.
              </p>
            ) : (
              <p className="font-sans text-sm" style={{ color: 'var(--ink)', lineHeight: 1.6 }}>
                {county}{localArea ? ` (${localArea})` : ''} is not currently designated as an
                RPZ. Normal market conditions apply — there is no statutory cap on rent
                increases, but a minimum 90-day notice period still applies.
                {rpzStatus.notes && ` ${rpzStatus.notes}.`}
              </p>
            )}
          </div>
        )}

        {/* Step 2: Rent increase calculator (only show in RPZ) */}
        {rpzStatus?.isRPZ && (
          <>
            <Rule className="mb-6" />

            <p
              className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: 'var(--ink-2)' }}
            >
              Step 2 — Maximum allowable increase
            </p>

            <div className="flex flex-col gap-5 mb-6">
              {/* Current rent */}
              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label htmlFor="rpz-current-rent" className="font-sans text-sm font-medium" style={{ color: 'var(--ink)' }}>
                    Current monthly rent
                  </label>
                  <span className="font-sans text-sm tabular-nums font-semibold" style={{ color: 'var(--accent)' }}>
                    {formatEuro(currentRent)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={4_000}
                  step={50}
                  id="rpz-current-rent"
                  value={currentRent}
                  onChange={(e) => setCurrentRent(parseInt(e.target.value, 10))}
                  className="w-full"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <div className="flex justify-between font-sans text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
                  <span>€500</span>
                  <span>€4,000</span>
                </div>
              </div>

              {/* Months since last review */}
              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label htmlFor="rpz-months" className="font-sans text-sm font-medium" style={{ color: 'var(--ink)' }}>
                    Months since last rent review
                  </label>
                  <span className="font-sans text-sm tabular-nums font-semibold" style={{ color: 'var(--accent)' }}>
                    {monthsSinceReview} months
                  </span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={60}
                  step={1}
                  id="rpz-months"
                  value={monthsSinceReview}
                  onChange={(e) => setMonthsSinceReview(parseInt(e.target.value, 10))}
                  className="w-full"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <div className="flex justify-between font-sans text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
                  <span>12 months (minimum)</span>
                  <span>60 months</span>
                </div>
                <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                  Landlords may only review rent once every 12 months in an RPZ.
                </p>
              </div>
            </div>

            {increase && (
              <div
                style={{
                  border: '1px solid var(--rule)',
                  borderRadius: '4px',
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg)',
                }}
              >
                <p
                  className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--ink-2)' }}
                >
                  Maximum allowable rent (RPZ {RPZ_CAP_PCT}% annual cap)
                </p>
                <div className="font-sans text-sm" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--rule)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--ink-2)' }}>Current rent</span>
                    <span className="tabular-nums font-medium" style={{ color: 'var(--ink)' }}>
                      {formatEuro(currentRent)}/mo
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--rule)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--ink-2)' }}>Cap applied</span>
                    <span className="tabular-nums" style={{ color: 'var(--ink)' }}>
                      {RPZ_CAP_PCT}% p.a. × {(monthsSinceReview / 12).toFixed(1)} yrs
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.25rem' }}>
                    <span style={{ color: 'var(--ink)', fontWeight: 600 }}>
                      Maximum new rent
                    </span>
                    <span className="tabular-nums font-semibold" style={{ color: 'var(--accent)' }}>
                      {formatEuro(increase.maxMonthlyRent)}/mo
                    </span>
                  </div>
                  <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                    Maximum increase: {formatEuro(increase.maxMonthlyRent - currentRent)}/mo
                    {' '}({formatEuro(increase.maxAnnualIncrease)}/yr)
                  </p>
                </div>
              </div>
            )}
          </>
        )}

      </div>

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
          Key RPZ tenant rights
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
          <li>Rent can only be reviewed <strong>once every 12 months</strong> in an RPZ.</li>
          <li>Your landlord must give you at least <strong>90 days&rsquo; written notice</strong> of a rent increase.</li>
          <li>The notice must include a <strong>RTB Rent Pressure Zone Calculator certificate</strong> showing the calculation.</li>
          <li>If you believe your landlord has exceeded the cap, you can refer the matter to the RTB for dispute resolution (free).</li>
          <li>New tenancies are not subject to the cap — only existing tenancies within the same tenancy (not between tenancies).</li>
        </ul>
      </div>

      <div className="flex flex-wrap gap-4 mt-5">
        <a
          href="https://www.rtb.ie/rent-pressure-zones"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          RTB RPZ map &rarr;
        </a>
        <a
          href="https://www.rtb.ie/register-a-dispute"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-sm"
          style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
        >
          RTB dispute resolution &rarr;
        </a>
        <Link
          href="/lessons/rent"
          className="font-sans text-sm"
          style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
        >
          Renting in Ireland lesson &rarr;
        </Link>
      </div>

    </main>
  );
}
