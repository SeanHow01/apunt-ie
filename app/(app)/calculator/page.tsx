'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Rule } from '@/components/ui/Rule';
import { Button } from '@/components/ui/Button';
import { calcNet, formatEuro } from '@/lib/tax';
import { createClient } from '@/lib/supabase/client';
import {
  calcPension,
  AGE_BAND_LABELS,
  AGE_BAND_RELIEF_PCT,
  AUTO_ENROL_RATES,
  PHASE_LABELS,
  PENSION_EARNINGS_CAP,
  type AgeBand,
  type AutoEnrolPhase,
} from '@/lib/calculations/pension';

const MIN_SALARY = 15000;
const MAX_SALARY = 120000;
const DEFAULT_SALARY = 35000;
const MIN_WAGE_2026 = 13.50;
const MAX_HOURS_LEGAL = 48;

type SavedCalc = {
  gross_annual_cents: number;
  net_annual_cents: number;
  created_at: string | null;
};

type Mode = 'annual' | 'hourly';

/** Two decimal place euro formatter for weekly/hourly figures */
function fmt2(n: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IE', { month: 'long', year: 'numeric' });
}

export default function CalculatorPage() {
  // ── Mode ─────────────────────────────────────────────────────────
  const [mode, setMode] = useState<Mode>('annual');

  // ── Annual state ─────────────────────────────────────────────────
  const [gross, setGross] = useState(DEFAULT_SALARY);

  // ── Hourly state ─────────────────────────────────────────────────
  const [hourlyRate, setHourlyRate] = useState(15.00);
  const [hoursPerWeek, setHoursPerWeek] = useState(20);

  // ── Shift premium state ───────────────────────────────────────────
  const [shiftExpanded, setShiftExpanded] = useState(false);
  const [shiftType, setShiftType] = useState('standard');
  const [customMultiplier, setCustomMultiplier] = useState(1.0);

  // ── Pension state ─────────────────────────────────────────────────
  const [pensionEnabled, setPensionEnabled] = useState(false);
  const [pensionMode, setPensionMode] = useState<'auto-enrolment' | 'custom'>('auto-enrolment');
  const [autoEnrolPhase, setAutoEnrolPhase] = useState<AutoEnrolPhase>(1);
  const [ageBand, setAgeBand] = useState<AgeBand>('under30');
  const [customPct, setCustomPct] = useState(5);

  const [userId, setUserId] = useState<string | null>(null);
  const [savedCalc, setSavedCalc] = useState<SavedCalc | null>(null);
  const [bannerHidden, setBannerHidden] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Resolve auth + most recent saved take_home calculation
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const { data: row } = await supabase
          .from('saved_calculations')
          .select('gross_annual_cents, net_annual_cents, created_at')
          .eq('user_id', uid)
          .eq('calculation_type', 'take_home')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        setSavedCalc(row ?? null);
      }
    });
  }, []);

  // ── Derived values ───────────────────────────────────────────────

  // Clamp hours to legal max
  const clampedHours = Math.min(Math.max(0, hoursPerWeek), MAX_HOURS_LEGAL);
  const hoursExceedLegal = hoursPerWeek > MAX_HOURS_LEGAL;

  // Shift premium multiplier
  const SHIFT_MULTIPLIERS: Record<string, number> = {
    standard: 1.0,
    afternoon: 1.15,
    night: 1.25,
    saturday: 1.5,
    sunday: 2.0,
    bank_holiday: 2.0,
    custom: customMultiplier,
  };
  const activeMultiplier = shiftExpanded ? (SHIFT_MULTIPLIERS[shiftType] ?? 1.0) : 1.0;
  const effectiveHourlyRate = hourlyRate * activeMultiplier;

  // Annual equivalent for tax purposes (hourly mode)
  const annualEquiv = Math.round(effectiveHourlyRate * clampedHours * 52);

  // Effective gross fed into all tax/pension calculations
  // Annual mode: slider gross; Hourly mode: annualised equivalent
  const displayGross = mode === 'hourly' ? (hourlyRate > 0 && clampedHours > 0 ? annualEquiv : 0) : gross;

  // ── Tax calculations ─────────────────────────────────────────────

  // Base tax always computed on full displayGross (no pension)
  const baseTax = calcNet(displayGross);

  // Determine contribution percentages
  const phaseRates = AUTO_ENROL_RATES[autoEnrolPhase];
  const employeePct =
    pensionEnabled && pensionMode === 'auto-enrolment'
      ? phaseRates.employee * 100
      : pensionEnabled
      ? customPct
      : 0;
  const employerPct =
    pensionEnabled && pensionMode === 'auto-enrolment' ? phaseRates.employer * 100 : 0;
  const statePct =
    pensionEnabled && pensionMode === 'auto-enrolment' ? phaseRates.state * 100 : 0;

  // Effective employee contribution, capped by age band
  const maxReliefPct = AGE_BAND_RELIEF_PCT[ageBand];
  const maxEmployeeContrib = (Math.min(displayGross, PENSION_EARNINGS_CAP) * maxReliefPct) / 100;
  const uncappedEmployeeContrib = (displayGross * employeePct) / 100;
  const employeeContrib = pensionEnabled
    ? Math.min(uncappedEmployeeContrib, maxEmployeeContrib)
    : 0;

  // PAYE on reduced taxable income (pension contributions are PAYE-deductible)
  // USC and PRSI remain on full displayGross
  const taxableIncome = displayGross - employeeContrib;
  const taxAdjusted = pensionEnabled ? calcNet(taxableIncome) : baseTax;
  const displayPaye = taxAdjusted.paye;

  // Net take-home (annual): subtract deductions from gross, then subtract pension contribution
  const displayNet = pensionEnabled
    ? Math.round(displayGross - displayPaye - baseTax.usc - baseTax.prsi - employeeContrib)
    : baseTax.net;

  const totalDeductions = displayPaye + baseTax.usc + baseTax.prsi;

  // Pension breakdown object (null when disabled)
  const pensionBreakdown = pensionEnabled
    ? calcPension({
        gross: displayGross,
        employeePct,
        employerPct,
        statePct,
        ageBand,
        payeWithPension: displayPaye,
        payeWithoutPension: baseTax.paye,
      })
    : null;

  // Slider max clamped to age band limit (own pension mode only)
  const sliderMax = maxReliefPct;

  // ── Hourly weekly figures ─────────────────────────────────────────
  const weeklyBasePay = hourlyRate * clampedHours;
  const weeklyPremium = (effectiveHourlyRate - hourlyRate) * clampedHours;
  const weeklyGross  = effectiveHourlyRate * clampedHours;
  const weeklyPAYE   = displayPaye / 52;
  const weeklyUSC    = baseTax.usc / 52;
  const weeklyPRSI   = baseTax.prsi / 52;
  const weeklyNet    = displayNet / 52;
  const hourlyNet    = clampedHours > 0 ? weeklyNet / clampedHours : 0;
  const weeklyTotalDeductions = weeklyPAYE + weeklyUSC + weeklyPRSI;

  // Edge case flags (hourly mode)
  const showMinWageNote = mode === 'hourly' && hourlyRate > 0 && hourlyRate < MIN_WAGE_2026;

  // ── Banner ───────────────────────────────────────────────────────

  const bannerContent = (() => {
    if (!savedCalc || bannerHidden) return null;
    const savedGross = savedCalc.gross_annual_cents / 100;
    const savedNet = savedCalc.net_annual_cents / 100;
    const currentNetFromSaved = calcNet(savedGross).net;
    const delta = currentNetFromSaved - savedNet;
    const month = savedCalc.created_at ? formatMonth(savedCalc.created_at) : 'previously';

    let deltaText: string;
    if (Math.abs(delta) < 10) {
      deltaText = "Today's rates give you virtually the same take-home as when you saved this calculation.";
    } else if (delta > 0) {
      deltaText = `That's ${formatEuro(delta)} more per year than when you saved it.`;
    } else {
      deltaText = `That's ${formatEuro(Math.abs(delta))} less per year than when you saved it.`;
    }

    return { savedGross, savedNet, currentNetFromSaved, month, deltaText };
  })();

  // ── Save ─────────────────────────────────────────────────────────

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const supabase = createClient();
      await supabase.from('saved_calculations').insert({
        user_id: userId,
        gross_annual_cents: Math.round(displayGross * 100),
        net_annual_cents: Math.round(displayNet * 100),
        tax_year: '2026',
        calculation_type: 'take_home',
      });
      setSaveSuccess(true);
      setSavedCalc({
        gross_annual_cents: Math.round(displayGross * 100),
        net_annual_cents: Math.round(displayNet * 100),
        created_at: new Date().toISOString(),
      });
    } finally {
      setSaving(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────

  return (
    <AppShell>
      <div className="flex-1 px-4 py-8 md:px-8 lg:px-12 max-w-5xl mx-auto w-full">

        {/* Heading */}
        <header className="mb-8 lg:mb-10">
          <h1
            className="font-display text-4xl sm:text-5xl leading-tight mb-2"
            style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
          >
            Take-home pay calculator
          </h1>
          <p className="font-sans text-base" style={{ color: 'var(--ink-2)' }}>
            Based on Budget 2026 rates.
          </p>
        </header>

        {/* Shared panel */}
        <div
          style={{
            border: '1px solid var(--rule)',
            borderRadius: '8px',
            backgroundColor: 'var(--surface)',
            overflow: 'hidden',
          }}
        >
          <div className="flex flex-col lg:grid lg:grid-cols-12">

            {/* ── Left column: inputs ──────────────────────────────── */}
            <div className="lg:col-span-5 p-6 lg:p-10 flex flex-col gap-6">

              {/* Mode toggle */}
              <div>
                <p
                  className="font-sans text-xs font-medium mb-2"
                  style={{ color: 'var(--ink-2)' }}
                >
                  Input mode
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['annual', 'hourly'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className="font-sans text-sm"
                      style={{
                        padding: '0.375rem 0.875rem',
                        border: '1px solid',
                        borderColor: mode === m ? 'var(--accent)' : 'var(--rule)',
                        backgroundColor:
                          mode === m
                            ? 'color-mix(in srgb, var(--accent) 10%, transparent)'
                            : 'transparent',
                        color: mode === m ? 'var(--accent)' : 'var(--ink-2)',
                        cursor: 'pointer',
                        borderRadius: '2px',
                        fontWeight: mode === m ? 600 : 400,
                      }}
                    >
                      {m === 'annual' ? 'Annual salary' : 'Hourly rate'}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Annual salary input ──────────────────────────────── */}
              {mode === 'annual' && (
                <div>
                  <label
                    htmlFor="salary-input"
                    className="font-sans text-sm font-medium block mb-3"
                    style={{ color: 'var(--ink)' }}
                  >
                    Annual gross salary
                  </label>

                  <p
                    className="font-display text-3xl mb-3 tabular-nums"
                    style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
                  >
                    {formatEuro(gross)}
                  </p>

                  <input
                    type="range"
                    id="salary-input"
                    min={MIN_SALARY}
                    max={MAX_SALARY}
                    step={1}
                    value={gross}
                    onChange={(e) => setGross(parseInt(e.target.value, 10))}
                    className="w-full max-w-sm mb-1"
                    style={{ accentColor: 'var(--accent)' }}
                  />

                  <div
                    className="flex justify-between font-sans text-xs max-w-sm mb-4"
                    style={{ color: 'var(--ink-2)' }}
                  >
                    <span>{formatEuro(MIN_SALARY)}</span>
                    <span>{formatEuro(MAX_SALARY)}</span>
                  </div>

                  {/* Direct type-in */}
                  <div className="relative inline-block">
                    <span
                      className="absolute left-3 top-1/2 -translate-y-1/2 font-sans text-base pointer-events-none"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      &euro;
                    </span>
                    <input
                      type="number"
                      min={MIN_SALARY}
                      max={MAX_SALARY}
                      step={1}
                      value={gross}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!isNaN(v)) setGross(Math.max(MIN_SALARY, Math.min(MAX_SALARY, v)));
                      }}
                      aria-label="Or type a salary amount"
                      style={{
                        width: '160px',
                        border: '1px solid var(--rule)',
                        padding: '8px 12px 8px 28px',
                        background: 'var(--surface)',
                        color: 'var(--ink)',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.9375rem',
                        outline: 'none',
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* ── Hourly rate inputs ───────────────────────────────── */}
              {mode === 'hourly' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                  {/* Hourly rate */}
                  <div>
                    <label
                      htmlFor="hourly-rate-input"
                      className="font-sans text-sm font-medium block mb-2"
                      style={{ color: 'var(--ink)' }}
                    >
                      Hourly rate
                    </label>
                    <div className="relative inline-block">
                      <span
                        className="absolute left-3 top-1/2 -translate-y-1/2 font-sans text-base pointer-events-none"
                        style={{ color: 'var(--ink-2)' }}
                      >
                        &euro;
                      </span>
                      <input
                        id="hourly-rate-input"
                        type="number"
                        min={0}
                        max={200}
                        step={0.01}
                        value={hourlyRate}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setHourlyRate(isNaN(v) ? 0 : Math.max(0, Math.min(200, v)));
                        }}
                        style={{
                          width: '160px',
                          border: '1px solid var(--rule)',
                          padding: '8px 12px 8px 28px',
                          background: 'var(--surface)',
                          color: 'var(--ink)',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.9375rem',
                          outline: 'none',
                          borderRadius: '2px',
                        }}
                      />
                    </div>
                    {showMinWageNote && (
                      <p
                        className="font-sans text-xs mt-1.5"
                        style={{ color: 'var(--ink-3)' }}
                      >
                        Note: The national minimum wage for workers aged 20+ is €{MIN_WAGE_2026.toFixed(2)}/hr.
                      </p>
                    )}
                  </div>

                  {/* Hours per week */}
                  <div>
                    <label
                      htmlFor="hours-input"
                      className="font-sans text-sm font-medium block mb-2"
                      style={{ color: 'var(--ink)' }}
                    >
                      Hours per week
                    </label>
                    <div className="relative inline-block">
                      <input
                        id="hours-input"
                        type="number"
                        min={0}
                        max={MAX_HOURS_LEGAL}
                        step={0.5}
                        value={hoursPerWeek}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          setHoursPerWeek(isNaN(v) ? 0 : Math.max(0, v));
                        }}
                        style={{
                          width: '120px',
                          border: '1px solid var(--rule)',
                          padding: '8px 12px',
                          background: 'var(--surface)',
                          color: 'var(--ink)',
                          fontFamily: 'var(--font-mono, monospace)',
                          fontSize: '0.9375rem',
                          outline: 'none',
                          borderRadius: '2px',
                        }}
                      />
                    </div>
                    {hoursExceedLegal && (
                      <p
                        className="font-sans text-xs mt-1.5"
                        style={{ color: 'var(--ink-3)' }}
                      >
                        Maximum working week under Irish law is {MAX_HOURS_LEGAL} hours.
                        Calculation uses {MAX_HOURS_LEGAL} hours.
                      </p>
                    )}
                  </div>

                  {/* Shift premium toggle */}
                  <div>
                    <button
                      onClick={() => setShiftExpanded(!shiftExpanded)}
                      aria-expanded={shiftExpanded}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'none',
                        border: 'none',
                        padding: '10px 0',
                        cursor: 'pointer',
                        fontSize: 13,
                        fontFamily: 'system-ui, sans-serif',
                        color: 'var(--ink-2)',
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ fontSize: 16, lineHeight: 1 }}>
                        {shiftExpanded ? '−' : '+'}
                      </span>
                      {shiftExpanded ? 'Remove shift premium' : 'Add shift premium'}
                    </button>

                    {shiftExpanded && (
                      <div style={{
                        padding: '14px 0',
                        borderTop: '1px solid var(--rule)',
                        borderBottom: '1px solid var(--rule)',
                        marginBottom: 4,
                      }}>

                        {/* Shift type select */}
                        <div style={{ marginBottom: 14 }}>
                          <label
                            htmlFor="shift-type-select"
                            className="font-sans text-xs font-medium block mb-1.5"
                            style={{ color: 'var(--ink-2)' }}
                          >
                            Shift type
                          </label>
                          <select
                            id="shift-type-select"
                            value={shiftType}
                            onChange={(e) => setShiftType(e.target.value)}
                            className="font-sans text-sm"
                            style={{
                              border: '1px solid var(--rule)',
                              padding: '6px 8px',
                              background: 'var(--surface)',
                              color: 'var(--ink)',
                              borderRadius: '2px',
                              outline: 'none',
                              width: '100%',
                              maxWidth: '280px',
                            }}
                          >
                            <option value="standard">Standard day — ×1.0 (no premium)</option>
                            <option value="afternoon">Afternoon / evening — ×1.15</option>
                            <option value="night">Night shift — ×1.25</option>
                            <option value="saturday">Saturday — ×1.5</option>
                            <option value="sunday">Sunday — ×2.0</option>
                            <option value="bank_holiday">Bank / public holiday — ×2.0</option>
                            <option value="custom">Custom rate — enter your own</option>
                          </select>
                          <p className="font-sans" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
                            Typical rates — your actual rate may differ. Check your contract.
                          </p>
                        </div>

                        {/* Custom multiplier */}
                        {shiftType === 'custom' && (
                          <div style={{ marginBottom: 14 }}>
                            <label
                              htmlFor="custom-multiplier-input"
                              className="font-sans text-xs font-medium block mb-1.5"
                              style={{ color: 'var(--ink-2)' }}
                            >
                              Your shift multiplier
                            </label>
                            <input
                              id="custom-multiplier-input"
                              type="number"
                              min={1.0}
                              max={4.0}
                              step={0.01}
                              value={customMultiplier}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                setCustomMultiplier(isNaN(v) ? 1.0 : v);
                              }}
                              placeholder="e.g. 1.33 for time and a third"
                              style={{
                                width: '160px',
                                border: '1px solid var(--rule)',
                                padding: '8px 12px',
                                background: 'var(--surface)',
                                color: 'var(--ink)',
                                fontFamily: 'var(--font-mono, monospace)',
                                fontSize: '0.9375rem',
                                outline: 'none',
                                borderRadius: '2px',
                              }}
                            />
                            <p className="font-sans" style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 4 }}>
                              Enter 1.5 for time and a half, 2.0 for double time, etc.
                            </p>
                            {customMultiplier < 1.0 && (
                              <p className="font-sans" style={{ fontSize: 12, color: 'var(--accent)', marginTop: 4 }}>
                                A multiplier below 1.0 means earning less than your base rate — check the value entered.
                              </p>
                            )}
                          </div>
                        )}

                        {/* Effective rate display */}
                        <div style={{
                          padding: '10px 12px',
                          background: 'var(--bg)',
                          borderRadius: 6,
                          border: '1px solid var(--rule)',
                          fontSize: 13,
                          fontFamily: 'system-ui, sans-serif',
                          color: 'var(--ink-2)',
                        }}>
                          Effective hourly rate:{' '}
                          <strong style={{ fontFamily: 'var(--font-mono, monospace)', color: 'var(--ink)' }}>
                            €{effectiveHourlyRate.toFixed(2)}/hr
                          </strong>
                          {activeMultiplier > 1.0 && (
                            <span style={{ color: 'var(--ink-3)', marginLeft: 8 }}>
                              (€{hourlyRate.toFixed(2)} base + €{(hourlyRate * (activeMultiplier - 1)).toFixed(2)} premium)
                            </span>
                          )}
                        </div>

                        {/* Sunday legal note */}
                        {shiftType === 'sunday' && (
                          <p className="font-sans" style={{
                            marginTop: 10,
                            fontSize: 12,
                            color: 'var(--ink-3)',
                            lineHeight: 1.5,
                          }}>
                            Sunday work is protected under the Organisation of Working Time Act 1997.
                            Employers must provide additional compensation but the exact amount is set
                            in your contract — ×2.0 (double time) is common but not the only option.
                          </p>
                        )}

                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* ── Pension section ─────────────────────────────────── */}
              <div style={{ borderTop: '1px solid var(--rule)', paddingTop: '1.25rem' }}>

                {/* Toggle */}
                <label className="flex items-center gap-2.5 cursor-pointer mb-4">
                  <input
                    type="checkbox"
                    checked={pensionEnabled}
                    onChange={(e) => setPensionEnabled(e.target.checked)}
                    style={{
                      accentColor: 'var(--accent)',
                      width: '16px',
                      height: '16px',
                      cursor: 'pointer',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="font-sans text-sm font-medium"
                    style={{ color: 'var(--ink)' }}
                  >
                    Include pension contribution
                  </span>
                </label>

                {pensionEnabled && (
                  <div className="flex flex-col gap-4">

                    {/* Mode: auto-enrolment or own pension */}
                    <div>
                      <p
                        className="font-sans text-xs font-medium mb-2"
                        style={{ color: 'var(--ink-2)' }}
                      >
                        Contribution type
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {(['auto-enrolment', 'custom'] as const).map((m) => (
                          <button
                            key={m}
                            onClick={() => setPensionMode(m)}
                            className="font-sans text-xs"
                            style={{
                              padding: '0.375rem 0.75rem',
                              border: '1px solid',
                              borderColor:
                                pensionMode === m ? 'var(--accent)' : 'var(--rule)',
                              backgroundColor:
                                pensionMode === m
                                  ? 'color-mix(in srgb, var(--accent) 10%, transparent)'
                                  : 'transparent',
                              color:
                                pensionMode === m ? 'var(--accent)' : 'var(--ink-2)',
                              cursor: 'pointer',
                              borderRadius: '2px',
                              fontWeight: pensionMode === m ? 600 : 400,
                            }}
                          >
                            {m === 'auto-enrolment' ? 'Auto-enrolment' : 'Own pension'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Auto-enrolment: phase selector + info */}
                    {pensionMode === 'auto-enrolment' && (
                      <div>
                        <label
                          className="font-sans text-xs font-medium block mb-1.5"
                          style={{ color: 'var(--ink-2)' }}
                        >
                          Phase
                        </label>
                        <select
                          value={autoEnrolPhase}
                          onChange={(e) =>
                            setAutoEnrolPhase(
                              parseInt(e.target.value, 10) as AutoEnrolPhase,
                            )
                          }
                          className="font-sans text-sm"
                          style={{
                            border: '1px solid var(--rule)',
                            padding: '6px 8px',
                            background: 'var(--surface)',
                            color: 'var(--ink)',
                            borderRadius: '2px',
                            outline: 'none',
                          }}
                        >
                          {([1, 2, 3, 4] as AutoEnrolPhase[]).map((p) => (
                            <option key={p} value={p}>
                              {PHASE_LABELS[p]}
                            </option>
                          ))}
                        </select>
                        <p
                          className="font-sans text-xs mt-1.5"
                          style={{ color: 'var(--ink-2)' }}
                        >
                          You {phaseRates.employee * 100}%&ensp;&middot;&ensp;Employer{' '}
                          {phaseRates.employer * 100}%&ensp;&middot;&ensp;State{' '}
                          {phaseRates.state * 100}%
                        </p>
                        <p
                          className="font-sans text-xs mt-2 leading-relaxed"
                          style={{ color: 'var(--ink-2)', fontStyle: 'italic' }}
                        >
                          Auto-enrolment is Ireland&rsquo;s automatic workplace pension
                          scheme, launching in 2025. Rates increase every three years.
                        </p>
                      </div>
                    )}

                    {/* Own pension: age band + % slider */}
                    {pensionMode === 'custom' && (
                      <div className="flex flex-col gap-3">

                        <div>
                          <label
                            className="font-sans text-xs font-medium block mb-1.5"
                            style={{ color: 'var(--ink-2)' }}
                          >
                            Your age group
                          </label>
                          <select
                            value={ageBand}
                            onChange={(e) => {
                              const next = e.target.value as AgeBand;
                              setAgeBand(next);
                              const nextMax = AGE_BAND_RELIEF_PCT[next];
                              if (customPct > nextMax) setCustomPct(nextMax);
                            }}
                            className="font-sans text-sm"
                            style={{
                              border: '1px solid var(--rule)',
                              padding: '6px 8px',
                              background: 'var(--surface)',
                              color: 'var(--ink)',
                              borderRadius: '2px',
                              outline: 'none',
                            }}
                          >
                            {(Object.keys(AGE_BAND_LABELS) as AgeBand[]).map((band) => (
                              <option key={band} value={band}>
                                {AGE_BAND_LABELS[band]}
                              </option>
                            ))}
                          </select>
                          <p
                            className="font-sans text-xs mt-1"
                            style={{ color: 'var(--ink-2)' }}
                          >
                            Max relief: {maxReliefPct}% of salary
                          </p>
                        </div>

                        <div>
                          <label
                            className="font-sans text-xs font-medium block mb-1.5"
                            style={{ color: 'var(--ink-2)' }}
                          >
                            Your contribution: {customPct}%
                          </label>
                          <input
                            type="range"
                            min={1}
                            max={sliderMax}
                            step={0.5}
                            value={customPct}
                            onChange={(e) => setCustomPct(parseFloat(e.target.value))}
                            className="w-full max-w-sm mb-1"
                            style={{ accentColor: 'var(--accent)' }}
                          />
                          <div
                            className="flex justify-between font-sans text-xs max-w-sm"
                            style={{ color: 'var(--ink-2)' }}
                          >
                            <span>1%</span>
                            <span>{sliderMax}% (your limit)</span>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* What changed banner */}
              {bannerContent && (
                <div
                  style={{
                    border: '1px solid var(--accent)',
                    borderRadius: '4px',
                    padding: '0.875rem 1rem',
                    backgroundColor: 'color-mix(in srgb, var(--accent) 8%, var(--bg))',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p
                      className="font-sans text-sm"
                      style={{ color: 'var(--ink)', margin: 0, lineHeight: 1.55 }}
                    >
                      Your last saved calculation ({formatEuro(bannerContent.savedGross)} gross,
                      saved {bannerContent.month}) works out to{' '}
                      <strong>{formatEuro(bannerContent.currentNetFromSaved)}</strong> take-home
                      at today&rsquo;s rates. {bannerContent.deltaText}
                    </p>
                  </div>
                  <button
                    onClick={() => setBannerHidden(true)}
                    className="font-sans text-xs"
                    style={{
                      color: 'var(--ink-2)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px 0',
                      flexShrink: 0,
                    }}
                  >
                    Hide
                  </button>
                </div>
              )}

              {/* Save / sign-in prompt */}
              <div>
                {userId !== null ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Button variant="primary" onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving…' : 'Save this calculation'}
                    </Button>
                    {saveSuccess && (
                      <span className="font-sans text-sm" style={{ color: 'var(--accent)' }}>
                        Saved!
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>
                    Sign in to save and track your take-home over time.
                  </p>
                )}
              </div>

            </div>

            {/* ── Right column: results ────────────────────────────── */}
            <div className="lg:col-span-7 p-6 lg:p-10">

              {/* ═══ ANNUAL MODE OUTPUT ════════════════════════════ */}
              {mode === 'annual' && (
                <>
                  {/* Annual net */}
                  <div className="mb-1">
                    <p
                      className="font-sans text-xs font-medium tracking-wide mb-1"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      {pensionEnabled ? 'Annual take-home (after pension)' : 'Annual net'}
                    </p>
                    <p
                      className="font-display text-5xl lg:text-7xl leading-none"
                      style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
                    >
                      {formatEuro(displayNet)}
                    </p>
                    {pensionEnabled && (
                      <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                        Without pension: {formatEuro(baseTax.net)}
                      </p>
                    )}
                  </div>

                  {/* Monthly net */}
                  <div className="mb-6 mt-3">
                    <p
                      className="font-sans text-xs font-medium tracking-wide mb-1"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      Monthly
                    </p>
                    <p
                      className="font-display text-2xl leading-none"
                      style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
                    >
                      {formatEuro(Math.round(displayNet / 12))}
                    </p>
                  </div>

                  <Rule className="my-6" />

                  {/* Deductions breakdown */}
                  <div>
                    {[
                      { label: 'PAYE', amount: displayPaye },
                      { label: 'USC', amount: baseTax.usc },
                      { label: 'PRSI', amount: baseTax.prsi },
                    ].map(({ label, amount }) => (
                      <div className="mb-4" key={label}>
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>
                            {label}
                          </span>
                          <span
                            className="font-sans text-sm font-medium tabular-nums"
                            style={{ color: 'var(--ink)' }}
                          >
                            {formatEuro(amount)}
                          </span>
                        </div>
                        <div
                          style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--rule)' }}
                        >
                          <div
                            style={{
                              width: `${totalDeductions > 0 ? Math.min(100, (amount / totalDeductions) * 100) : 0}%`,
                              height: '100%',
                              borderRadius: '4px',
                              backgroundColor: 'var(--accent)',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pension breakdown */}
                  {pensionBreakdown && (
                    <>
                      <Rule className="my-6" />
                      <div>
                        <p
                          className="font-sans text-xs font-medium tracking-wide mb-3"
                          style={{ color: 'var(--ink-2)' }}
                        >
                          {pensionMode === 'auto-enrolment'
                            ? `Pension — ${PHASE_LABELS[autoEnrolPhase]}`
                            : 'Pension contribution'}
                        </p>

                        <div
                          className="font-sans text-sm"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            gap: '0.5rem 1rem',
                            alignItems: 'baseline',
                          }}
                        >
                          <span style={{ color: 'var(--ink-2)' }}>Your contribution</span>
                          <span className="tabular-nums text-right" style={{ color: 'var(--ink)' }}>
                            {formatEuro(pensionBreakdown.employeeContribution)}/yr
                          </span>

                          <span style={{ color: 'var(--ink-2)' }}>Tax relief (PAYE saving)</span>
                          <span className="tabular-nums text-right" style={{ color: 'var(--accent)' }}>
                            &minus;{formatEuro(pensionBreakdown.payeSaving)}/yr
                          </span>

                          <span className="font-medium" style={{ color: 'var(--ink)' }}>
                            True cost to you
                          </span>
                          <span className="tabular-nums text-right font-medium" style={{ color: 'var(--ink)' }}>
                            {formatEuro(pensionBreakdown.trueCost)}/yr
                            <span className="font-normal" style={{ color: 'var(--ink-2)', fontSize: '0.75rem' }}>
                              {' '}({formatEuro(Math.round(pensionBreakdown.trueCost / 12))}/mo)
                            </span>
                          </span>

                          {pensionMode === 'auto-enrolment' && (
                            <>
                              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--rule)', margin: '0.25rem 0' }} />
                              <span style={{ color: 'var(--ink-2)' }}>Your employer adds</span>
                              <span className="tabular-nums text-right" style={{ color: 'var(--ink)' }}>
                                {formatEuro(pensionBreakdown.employerContribution)}/yr
                              </span>
                              <span style={{ color: 'var(--ink-2)' }}>State top-up</span>
                              <span className="tabular-nums text-right" style={{ color: 'var(--ink)' }}>
                                {formatEuro(pensionBreakdown.stateContribution)}/yr
                              </span>
                              <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--rule)', margin: '0.25rem 0' }} />
                              <span className="font-medium" style={{ color: 'var(--ink)' }}>Total into your pot</span>
                              <span className="tabular-nums text-right font-medium" style={{ color: 'var(--ink)' }}>
                                {formatEuro(pensionBreakdown.totalPotContribution)}/yr
                              </span>
                            </>
                          )}
                        </div>

                        <p
                          className="font-sans text-xs mt-3 leading-relaxed"
                          style={{ color: 'var(--ink-2)', fontStyle: 'italic' }}
                        >
                          USC and PRSI apply to your full gross salary — pension contributions
                          don&rsquo;t reduce these.
                        </p>

                        {pensionBreakdown.cappedByAge && (
                          <p className="font-sans text-xs mt-2 leading-relaxed" style={{ color: 'var(--ink-2)' }}>
                            Your contribution has been capped at{' '}
                            {pensionBreakdown.maxEmployeeContribPct}% of salary (the Revenue
                            limit for your age group).
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Cross-link */}
                  <p className="font-sans text-xs mt-6" style={{ color: 'var(--ink-2)' }}>
                    Want to understand these numbers?{' '}
                    <a href="/lessons/payslip" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                      Read the payslip lesson &rarr;
                    </a>
                  </p>
                </>
              )}

              {/* ═══ HOURLY MODE OUTPUT ════════════════════════════ */}
              {mode === 'hourly' && (
                <>
                  {/* Weekly gross */}
                  <div className="mb-4">
                    {shiftExpanded && activeMultiplier > 1.0 ? (
                      <div
                        className="font-sans text-sm"
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr auto',
                          gap: '0.35rem 1rem',
                          alignItems: 'baseline',
                          marginBottom: '0.25rem',
                        }}
                      >
                        <span style={{ color: 'var(--ink-2)' }}>
                          Base pay ({clampedHours} hrs × {fmt2(hourlyRate)}/hr)
                        </span>
                        <span className="tabular-nums text-right" style={{ color: 'var(--ink)' }}>
                          {fmt2(weeklyBasePay)}
                        </span>
                        <span style={{ color: 'var(--ink-2)' }}>Shift premium</span>
                        <span className="tabular-nums text-right" style={{ color: 'var(--ink)' }}>
                          +{fmt2(weeklyPremium)}
                        </span>
                        <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--rule)', margin: '0.15rem 0' }} />
                        <span className="font-medium" style={{ color: 'var(--ink)' }}>Weekly gross</span>
                        <span
                          className="tabular-nums text-right font-medium font-display"
                          style={{ color: 'var(--ink)', fontSize: '1.5rem', letterSpacing: '-0.02em' }}
                        >
                          {fmt2(weeklyGross)}
                        </span>
                      </div>
                    ) : (
                      <>
                        <p
                          className="font-sans text-xs font-medium tracking-wide mb-1"
                          style={{ color: 'var(--ink-2)' }}
                        >
                          Weekly gross
                        </p>
                        <p
                          className="font-display text-2xl leading-none tabular-nums"
                          style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
                        >
                          {fmt2(weeklyGross)}
                        </p>
                      </>
                    )}
                  </div>

                  <Rule className="my-4" />

                  {/* Weekly deductions */}
                  <div className="mb-2">
                    {[
                      { label: 'Income tax (PAYE)', amount: weeklyPAYE },
                      { label: 'Universal Social Charge (USC)', amount: weeklyUSC },
                      { label: 'Pay Related Social Insurance (PRSI)', amount: weeklyPRSI },
                    ].map(({ label, amount }) => (
                      <div className="mb-4" key={label}>
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>
                            − {label}
                          </span>
                          <span
                            className="font-sans text-sm font-medium tabular-nums"
                            style={{ color: 'var(--ink)' }}
                          >
                            {fmt2(amount)}
                          </span>
                        </div>
                        <div
                          style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--rule)' }}
                        >
                          <div
                            style={{
                              width: `${weeklyTotalDeductions > 0 ? Math.min(100, (amount / weeklyTotalDeductions) * 100) : 0}%`,
                              height: '100%',
                              borderRadius: '4px',
                              backgroundColor: 'var(--accent)',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Rule className="my-4" />

                  {/* Weekly take-home — large display number */}
                  <div className="mb-1">
                    <p
                      className="font-sans text-xs font-medium tracking-wide mb-1"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      {pensionEnabled ? 'Weekly take-home (after pension)' : 'Weekly take-home'}
                    </p>
                    <p
                      className="font-display text-5xl lg:text-7xl leading-none tabular-nums"
                      style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
                    >
                      {fmt2(weeklyNet)}
                    </p>
                    {pensionEnabled && (
                      <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                        Without pension: {fmt2(baseTax.net / 52)}
                      </p>
                    )}
                  </div>

                  {/* Hourly net */}
                  <div className="mb-6 mt-3">
                    <p
                      className="font-sans text-xs font-medium tracking-wide mb-1"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      {shiftExpanded && activeMultiplier > 1.0
                        ? 'Take-home per hour (after tax)'
                        : 'Hourly net (approx.)'}
                    </p>
                    <p
                      className="font-display text-2xl leading-none tabular-nums"
                      style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
                    >
                      {fmt2(hourlyNet)}
                    </p>
                  </div>

                  {/* Pension breakdown (weekly) */}
                  {pensionBreakdown && (
                    <>
                      <Rule className="my-6" />
                      <div>
                        <p
                          className="font-sans text-xs font-medium tracking-wide mb-3"
                          style={{ color: 'var(--ink-2)' }}
                        >
                          {pensionMode === 'auto-enrolment'
                            ? `Pension — ${PHASE_LABELS[autoEnrolPhase]}`
                            : 'Pension contribution'}
                        </p>
                        <div
                          className="font-sans text-sm"
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto',
                            gap: '0.5rem 1rem',
                            alignItems: 'baseline',
                          }}
                        >
                          <span style={{ color: 'var(--ink-2)' }}>Your contribution</span>
                          <span className="tabular-nums text-right" style={{ color: 'var(--ink)' }}>
                            {fmt2(pensionBreakdown.employeeContribution / 52)}/wk
                          </span>
                          <span style={{ color: 'var(--ink-2)' }}>Tax relief (PAYE saving)</span>
                          <span className="tabular-nums text-right" style={{ color: 'var(--accent)' }}>
                            &minus;{fmt2(pensionBreakdown.payeSaving / 52)}/wk
                          </span>
                          <span className="font-medium" style={{ color: 'var(--ink)' }}>True cost to you</span>
                          <span className="tabular-nums text-right font-medium" style={{ color: 'var(--ink)' }}>
                            {fmt2(pensionBreakdown.trueCost / 52)}/wk
                          </span>
                        </div>
                        <p
                          className="font-sans text-xs mt-3 leading-relaxed"
                          style={{ color: 'var(--ink-2)', fontStyle: 'italic' }}
                        >
                          USC and PRSI apply to your full earnings — pension contributions don&rsquo;t reduce these.
                        </p>
                      </div>
                    </>
                  )}

                  {/* Contextual note */}
                  <p className="font-sans italic text-xs mt-5" style={{ color: 'var(--ink-2)', lineHeight: 1.6 }}>
                    Based on Budget 2026 rates for a single PAYE worker with standard credits
                    working {clampedHours} hours per week at{' '}
                    {shiftExpanded && activeMultiplier > 1.0
                      ? `${fmt2(effectiveHourlyRate)}/hr effective rate`
                      : `${fmt2(hourlyRate)}/hr`}
                    {' '}({formatEuro(annualEquiv)} annual equivalent).
                    Pension contributions not included{pensionEnabled ? ' in the base figure' : ''}.
                    For irregular hours, use your average weekly hours.
                    {shiftExpanded && activeMultiplier > 1.0 && (
                      <>{' '}Shift premium (×{activeMultiplier}) is fully taxable — PAYE, USC and PRSI apply to the premium at the same rate as base pay.</>
                    )}
                  </p>

                  {/* Cross-link */}
                  <p className="font-sans text-xs mt-4" style={{ color: 'var(--ink-2)' }}>
                    Want to understand what these deductions mean?{' '}
                    <a href="/lessons/payslip" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                      Read the payslip module &rarr;
                    </a>
                  </p>
                </>
              )}

            </div>

          </div>
        </div>

        {/* Footnote */}
        <p
          className="font-sans italic text-xs mt-4"
          style={{ color: 'var(--ink-2)', maxWidth: '65ch' }}
        >
          {mode === 'annual'
            ? 'Based on Budget 2026 rates for a single PAYE worker with standard credits. Pension relief calculations are illustrative — consult Revenue.ie or a financial adviser for your specific situation.'
            : 'PRSI is applied to all earnings in this calculator. In practice, workers earning below €352/week may be exempt or on a reduced rate — check Revenue.ie for your exact class.'}
        </p>

      </div>
    </AppShell>
  );
}
