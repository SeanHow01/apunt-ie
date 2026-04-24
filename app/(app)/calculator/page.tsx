'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Rule } from '@/components/ui/Rule';
import { Button } from '@/components/ui/Button';
import { calcNet, formatEuro, pct } from '@/lib/tax';
import { createClient } from '@/lib/supabase/client';

const MIN_SALARY = 15000;
const MAX_SALARY = 120000;
const STEP = 1;
const DEFAULT_SALARY = 35000;

type SavedCalc = {
  gross_annual_cents: number;
  net_annual_cents: number;
  created_at: string | null;
};

function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IE', { month: 'long', year: 'numeric' });
}

export default function CalculatorPage() {
  const [gross, setGross] = useState(DEFAULT_SALARY);

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

  const result = calcNet(gross);
  const totalDeductions = result.paye + result.usc + result.prsi;

  const rows: { label: string; amount: number; isTotal?: boolean; isNet?: boolean }[] = [
    { label: 'PAYE', amount: result.paye },
    { label: 'USC', amount: result.usc },
    { label: 'PRSI', amount: result.prsi },
    { label: 'Total deductions', amount: totalDeductions, isTotal: true },
    { label: 'Take-home (net)', amount: result.net, isNet: true },
  ];

  // Banner delta calculation
  const bannerContent = (() => {
    if (!savedCalc || bannerHidden) return null;
    const savedGross = savedCalc.gross_annual_cents / 100;
    const savedNet = savedCalc.net_annual_cents / 100;
    const currentNetFromSaved = calcNet(savedGross).net;
    const delta = currentNetFromSaved - savedNet;
    const month = savedCalc.created_at ? formatMonth(savedCalc.created_at) : 'previously';

    let deltaText: string;
    if (Math.abs(delta) < 10) {
      deltaText = 'Today\'s rates give you virtually the same take-home as when you saved this calculation.';
    } else if (delta > 0) {
      deltaText = `That's ${formatEuro(delta)} more per year than when you saved it.`;
    } else {
      deltaText = `That's ${formatEuro(Math.abs(delta))} less per year than when you saved it.`;
    }

    return {
      savedGross,
      savedNet,
      currentNetFromSaved,
      month,
      deltaText,
    };
  })();

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const supabase = createClient();
      await supabase.from('saved_calculations').insert({
        user_id: userId,
        gross_annual_cents: Math.round(gross * 100),
        net_annual_cents: Math.round(result.net * 100),
        tax_year: '2026',
        calculation_type: 'take_home',
      });
      setSaveSuccess(true);
      // Refresh saved calc so the banner updates on next load
      setSavedCalc({
        gross_annual_cents: Math.round(gross * 100),
        net_annual_cents: Math.round(result.net * 100),
        created_at: new Date().toISOString(),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <div className="flex-1 px-4 py-8 md:px-8 lg:px-12 max-w-5xl mx-auto w-full">

        {/* Heading */}
        <header className="mb-8 lg:mb-10">
          <h1
            className="font-display text-4xl sm:text-5xl leading-tight mb-2"
            style={{
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              fontFamily: 'Instrument Serif, serif',
            }}
          >
            Take-home pay calculator
          </h1>
          <p
            className="font-sans text-base"
            style={{ color: 'var(--ink-2)' }}
          >
            Based on Budget 2026 rates.
          </p>
        </header>

        {/* Shared panel wrapping both columns */}
        <div
          style={{
            border: '1px solid var(--rule)',
            borderRadius: '8px',
            backgroundColor: 'var(--surface)',
            overflow: 'hidden',
          }}
        >
          <div className="flex flex-col lg:grid lg:grid-cols-12">

            {/* ── Left column: inputs + banner + save ───────────── */}
            <div className="lg:col-span-5 p-6 lg:p-10 flex flex-col gap-6">

              {/* Salary input */}
              <div>
                <label
                  htmlFor="salary-input"
                  className="font-sans text-sm font-medium block mb-3"
                  style={{ color: 'var(--ink)' }}
                >
                  Annual gross salary
                </label>

                {/* Current value display above slider */}
                <p
                  className="font-display text-3xl mb-3 tabular-nums"
                  style={{ fontFamily: 'Instrument Serif, serif', color: 'var(--ink)', letterSpacing: '-0.02em' }}
                >
                  {formatEuro(gross)}
                </p>

                <input
                  type="range"
                  id="salary-input"
                  min={MIN_SALARY}
                  max={MAX_SALARY}
                  step={STEP}
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

                {/* Direct type-in fallback */}
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
                    <p className="font-sans text-sm" style={{ color: 'var(--ink)', margin: 0, lineHeight: 1.55 }}>
                      Your last saved calculation ({formatEuro(bannerContent.savedGross)} gross, saved {bannerContent.month}) works out to{' '}
                      <strong>{formatEuro(bannerContent.currentNetFromSaved)}</strong> take-home at today's rates.{' '}
                      {bannerContent.deltaText}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Button variant="primary" onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving…' : 'Save this calculation'}
                    </Button>
                    {saveSuccess && (
                      <span className="font-sans text-sm" style={{ color: 'var(--accent)' }}>Saved!</span>
                    )}
                  </div>
                ) : (
                  <p className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>
                    Sign in to save and track your take-home over time.
                  </p>
                )}
              </div>

            </div>

            {/* ── Right column: results ──────────────────────────── */}
            <div className="lg:col-span-7 p-6 lg:p-10">

              {/* Annual net */}
              <div className="mb-2">
                <p
                  className="font-sans text-xs font-medium tracking-wide mb-1"
                  style={{ color: 'var(--ink-2)' }}
                >
                  Annual net
                </p>
                <p
                  className="font-display text-5xl lg:text-7xl leading-none"
                  style={{
                    fontFamily: 'Instrument Serif, serif',
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatEuro(result.net)}
                </p>
              </div>

              {/* Monthly net */}
              <div className="mb-6">
                <p
                  className="font-sans text-xs font-medium tracking-wide mb-1"
                  style={{ color: 'var(--ink-2)' }}
                >
                  Monthly
                </p>
                <p
                  className="font-display text-2xl leading-none"
                  style={{
                    fontFamily: 'Instrument Serif, serif',
                    color: 'var(--ink)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatEuro(Math.round(result.net / 12))}
                </p>
              </div>

              <Rule className="my-6" />

              {/* Deductions breakdown — bars proportional to total deductions */}
              <div>
                {[
                  { label: 'PAYE', amount: result.paye },
                  { label: 'USC', amount: result.usc },
                  { label: 'PRSI', amount: result.prsi },
                ].map(({ label, amount }) => (
                  <div className="mb-4" key={label}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>{label}</span>
                      <span className="font-sans text-sm font-medium tabular-nums" style={{ color: 'var(--ink)' }}>{formatEuro(amount)}</span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '4px', backgroundColor: 'var(--rule)' }}>
                      <div style={{ width: `${totalDeductions > 0 ? Math.min(100, (amount / totalDeductions) * 100) : 0}%`, height: '100%', borderRadius: '4px', backgroundColor: 'var(--accent)' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Cross-link to payslip lesson */}
              <p className="font-sans text-xs mt-6" style={{ color: 'var(--ink-2)' }}>
                Want to understand these numbers?{' '}
                <a href="/lessons/payslip" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                  Read the payslip lesson →
                </a>
              </p>

            </div>

          </div>
        </div>

        {/* Footnote */}
        <p
          className="font-sans italic text-xs mt-4"
          style={{ color: 'var(--ink-2)', maxWidth: '65ch' }}
        >
          Based on Budget 2026 rates for a single PAYE worker with standard credits. This is a guide, not tax advice.
        </p>

      </div>
    </AppShell>
  );
}
