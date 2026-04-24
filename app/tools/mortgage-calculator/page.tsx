'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { formatEuro } from '@/lib/tax';
import { createClient } from '@/lib/supabase/client';

// ── Mortgage maths ──────────────────────────────────────────────────────────

function calcMortgage(principal: number, annualRatePct: number, termYears: number) {
  if (principal <= 0 || termYears <= 0) return null;
  const n = termYears * 12;
  if (annualRatePct === 0) {
    const monthly = principal / n;
    return {
      monthly,
      totalInterest: 0,
      totalCost: principal,
      monthlyStress: monthly,
    };
  }
  const r = annualRatePct / 100 / 12;
  const rn = Math.pow(1 + r, n);
  const monthly = (principal * r * rn) / (rn - 1);
  const totalRepaid = monthly * n;
  const totalInterest = totalRepaid - principal;

  // Stress test at +2%
  const rStress = (annualRatePct + 2) / 100 / 12;
  const rnStress = Math.pow(1 + rStress, n);
  const monthlyStress = (principal * rStress * rnStress) / (rnStress - 1);

  return { monthly, totalInterest, totalCost: totalRepaid, monthlyStress };
}

// Amortisation snapshot for a given year (1-based)
function amortYearSnapshot(principal: number, annualRatePct: number, termYears: number, year: number) {
  if (principal <= 0 || termYears <= 0 || annualRatePct <= 0) return { interest: 0, principal: 0 };
  const n = termYears * 12;
  const r = annualRatePct / 100 / 12;
  const rn = Math.pow(1 + r, n);
  const monthly = (principal * r * rn) / (rn - 1);

  // Sum payments in the target year
  const startMonth = (year - 1) * 12 + 1;
  const endMonth = Math.min(year * 12, n);

  let totalInterest = 0;
  let totalPrincipal = 0;

  for (let k = startMonth; k <= endMonth; k++) {
    const factor = Math.pow(1 + r, k - 1);
    const balance = principal * factor - monthly * (factor - 1) / r;
    const interestPmt = balance * r;
    const principalPmt = monthly - interestPmt;
    totalInterest += interestPmt;
    totalPrincipal += principalPmt;
  }

  return { interest: totalInterest, principal: totalPrincipal };
}

type ApplicantType = 'ftb' | 'stb' | 'switcher';

// ── Colour helpers ──────────────────────────────────────────────────────────

function ltvColor(ltv: number): string {
  if (ltv <= 80) return '#2EAF6F';
  if (ltv <= 90) return '#F59E0B';
  return '#E94F37';
}

function ltiColor(lti: number, type: ApplicantType): string {
  const limit = type === 'ftb' ? 4 : 3.5;
  return lti <= limit ? '#2EAF6F' : '#E94F37';
}

// ── Component ───────────────────────────────────────────────────────────────

export default function MortgageCalculatorPage() {
  // Inputs
  const [price, setPrice] = useState(350000);
  const [deposit, setDeposit] = useState(35000);
  const [termYears, setTermYears] = useState(30);
  const [ratePct, setRatePct] = useState(3.8);
  const [applicantType, setApplicantType] = useState<ApplicantType>('ftb');
  const [income, setIncome] = useState(50000);

  // Auth / save
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // Derived
  const principal = Math.max(0, price - deposit);
  const ltv = price > 0 ? (principal / price) * 100 : 0;
  const lti = income > 0 ? principal / income : 0;
  const depositPct = price > 0 ? (deposit / price) * 100 : 0;

  const result = calcMortgage(principal, ratePct, termYears);
  const monthlyNet = income > 0 ? income / 12 : 0;
  const stressAffordable =
    result && monthlyNet > 0 ? (result.monthlyStress / monthlyNet) <= 0.35 : true;

  // Amortisation snapshots (Year 1, 5, 10, 20, final)
  const snapYears = [1, 5, 10, 20, termYears].filter((y, i, a) => a.indexOf(y) === i && y <= termYears);
  const snapshots = snapYears.map((y) => ({
    year: y,
    ...amortYearSnapshot(principal, ratePct, termYears, y),
  }));
  const maxSnap = Math.max(...snapshots.map((s) => s.interest + s.principal), 1);

  async function handleSave() {
    if (!userId) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const supabase = createClient();
      await supabase.from('saved_calculations').insert({
        user_id: userId,
        calculation_type: 'mortgage',
        gross_annual_cents: Math.round(price * 100),
        net_annual_cents: result ? Math.round(result.monthly * 100) : 0,
        tax_year: '2026',
        label: `€${Math.round(price / 1000)}k over ${termYears}yr at ${ratePct}%`,
      });
      setSaveSuccess(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
      {/* Back link */}
      <div className="mb-5">
        <Link href="/home" style={{ fontSize: '0.8125rem', color: 'var(--ink-2)', textDecoration: 'none' }}>
          ← Back to home
        </Link>
      </div>

      <div className="mb-1">
        <Eyebrow>Tool</Eyebrow>
      </div>

      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '0.25rem 0 0.5rem',
          color: 'var(--ink)',
        }}
      >
        Mortgage calculator
      </h1>

      <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.125rem', color: 'var(--ink-2)', margin: '0 0 1rem' }}>
        What can you afford, what will it cost.
      </p>

      <p style={{ fontSize: '0.8125rem', fontStyle: 'italic', color: 'var(--ink-2)', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
        Punt provides financial education, not financial advice. For regulated mortgage advice, consult an authorised mortgage broker or contact{' '}
        <a href="https://mabs.ie" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>MABS (mabs.ie)</a>.
      </p>

      <Rule />

      {/* Main two-column panel */}
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

          {/* ── Left: inputs ─────────────────────────────────────── */}
          <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col gap-5">

            {/* Property price */}
            <div>
              <label className="font-sans text-sm font-medium block mb-1" style={{ color: 'var(--ink)' }}>
                Property price
              </label>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>€</span>
                <input
                  type="number" min={150000} max={800000} step={1000}
                  value={price}
                  onChange={(e) => setPrice(Math.max(150000, Math.min(800000, parseInt(e.target.value) || 150000)))}
                  style={{ flex: 1, border: '1px solid var(--rule)', padding: '8px 10px', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', outline: 'none', borderRadius: '2px' }}
                />
              </div>
              <input type="range" min={150000} max={800000} step={1000} value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                className="w-full" style={{ accentColor: 'var(--accent)' }} />
              <div className="flex justify-between font-sans text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
                <span>€150k</span><span>€800k</span>
              </div>
            </div>

            {/* Deposit */}
            <div>
              <label className="font-sans text-sm font-medium block mb-1" style={{ color: 'var(--ink)' }}>
                Deposit
                <span className="font-normal ml-2" style={{ color: 'var(--ink-2)' }}>
                  ({depositPct.toFixed(1)}% of price)
                </span>
              </label>
              <div className="flex items-center gap-3">
                <span className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>€</span>
                <input
                  type="number" min={0} max={price} step={1000}
                  value={deposit}
                  onChange={(e) => setDeposit(Math.max(0, Math.min(price, parseInt(e.target.value) || 0)))}
                  style={{ flex: 1, border: '1px solid var(--rule)', padding: '8px 10px', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', outline: 'none', borderRadius: '2px' }}
                />
              </div>
            </div>

            {/* Term */}
            <div>
              <label className="font-sans text-sm font-medium block mb-1" style={{ color: 'var(--ink)' }}>
                Term (years)
              </label>
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="number" min={15} max={35} step={1}
                  value={termYears}
                  onChange={(e) => setTermYears(Math.max(15, Math.min(35, parseInt(e.target.value) || 30)))}
                  style={{ width: '80px', border: '1px solid var(--rule)', padding: '8px 10px', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', outline: 'none', borderRadius: '2px' }}
                />
                <span className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>years</span>
              </div>
              <input type="range" min={15} max={35} step={1} value={termYears}
                onChange={(e) => setTermYears(parseInt(e.target.value))}
                className="w-full" style={{ accentColor: 'var(--accent)' }} />
              <div className="flex justify-between font-sans text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
                <span>15 yr</span><span>35 yr</span>
              </div>
            </div>

            {/* Interest rate */}
            <div>
              <label className="font-sans text-sm font-medium block mb-1" style={{ color: 'var(--ink)' }}>
                Interest rate (% p.a.)
              </label>
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="number" min={2.5} max={6} step={0.05}
                  value={ratePct}
                  onChange={(e) => setRatePct(Math.max(2.5, Math.min(6, parseFloat(e.target.value) || 3.8)))}
                  style={{ width: '80px', border: '1px solid var(--rule)', padding: '8px 10px', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', outline: 'none', borderRadius: '2px' }}
                />
                <span className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>%</span>
              </div>
              <input type="range" min={2.5} max={6} step={0.05} value={ratePct}
                onChange={(e) => setRatePct(parseFloat(e.target.value))}
                className="w-full" style={{ accentColor: 'var(--accent)' }} />
              <div className="flex justify-between font-sans text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
                <span>2.5%</span><span>6%</span>
              </div>
            </div>

            {/* Mortgage type */}
            <div>
              <label className="font-sans text-sm font-medium block mb-2" style={{ color: 'var(--ink)' }}>
                Mortgage type
              </label>
              <div className="flex flex-wrap gap-2">
                {([
                  ['ftb', 'First-time buyer'],
                  ['stb', 'Second-time buyer'],
                  ['switcher', 'Switcher'],
                ] as const).map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setApplicantType(val)}
                    className="font-sans text-sm px-3 py-1.5 transition-colors"
                    style={{
                      border: '1px solid var(--rule)',
                      borderRadius: '2px',
                      backgroundColor: applicantType === val ? 'var(--ink)' : 'transparent',
                      color: applicantType === val ? 'var(--bg)' : 'var(--ink-2)',
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Applicant income */}
            <div>
              <label className="font-sans text-sm font-medium block mb-1" style={{ color: 'var(--ink)' }}>
                Annual gross income
              </label>
              <div className="flex items-center gap-3">
                <span className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>€</span>
                <input
                  type="number" min={0} max={500000} step={1000}
                  value={income}
                  onChange={(e) => setIncome(Math.max(0, parseInt(e.target.value) || 0))}
                  style={{ flex: 1, border: '1px solid var(--rule)', padding: '8px 10px', background: 'var(--bg)', color: 'var(--ink)', fontFamily: 'Inter, sans-serif', fontSize: '0.9375rem', outline: 'none', borderRadius: '2px' }}
                />
              </div>
              <p className="font-sans text-xs mt-1" style={{ color: 'var(--ink-2)' }}>
                Used for LTI and stress-test calculations only.
              </p>
            </div>

            {/* Save */}
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--rule)' }}>
              {userId !== null ? (
                <div className="flex items-center gap-3">
                  <Button variant="secondary" onClick={handleSave} disabled={saving || !result}>
                    {saving ? 'Saving…' : 'Save this calculation'}
                  </Button>
                  {saveSuccess && <span className="font-sans text-sm" style={{ color: 'var(--accent)' }}>Saved!</span>}
                </div>
              ) : (
                <p className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>
                  Sign in to save your calculations.
                </p>
              )}
            </div>
          </div>

          {/* ── Right: results ───────────────────────────────────── */}
          <div
            className="lg:col-span-7 p-6 lg:p-8 flex flex-col gap-6"
            style={{ borderTop: '1px solid var(--rule)' }}
          >
            {result ? (
              <>
                {/* Monthly repayment */}
                <div>
                  <p className="font-sans text-xs font-medium tracking-wide mb-1" style={{ color: 'var(--ink-2)' }}>
                    Monthly repayment
                  </p>
                  <p
                    className="font-display leading-none"
                    style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--ink)', letterSpacing: '-0.02em' }}
                  >
                    {formatEuro(result.monthly)}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex justify-between font-sans text-sm">
                    <span style={{ color: 'var(--ink-2)' }}>Total interest</span>
                    <span className="tabular-nums font-medium" style={{ color: 'var(--ink)' }}>{formatEuro(result.totalInterest)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span style={{ color: 'var(--ink-2)' }}>Total cost (price + interest)</span>
                    <span className="tabular-nums font-medium" style={{ color: 'var(--ink)' }}>{formatEuro(result.totalCost)}</span>
                  </div>
                </div>

                <Rule />

                {/* LTV + LTI */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-sans text-xs mb-1" style={{ color: 'var(--ink-2)' }}>Loan-to-value (LTV)</p>
                    <p className="font-sans text-2xl font-semibold tabular-nums" style={{ color: ltvColor(ltv) }}>
                      {ltv.toFixed(1)}%
                    </p>
                    <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
                      {ltv <= 80 ? 'Within standard limit' : ltv <= 90 ? 'Borderline (FTB max 90%)' : 'Above standard limit'}
                    </p>
                  </div>
                  <div>
                    <p className="font-sans text-xs mb-1" style={{ color: 'var(--ink-2)' }}>
                      Loan-to-income (LTI)
                    </p>
                    <p className="font-sans text-2xl font-semibold tabular-nums" style={{ color: ltiColor(lti, applicantType) }}>
                      {lti.toFixed(2)}×
                    </p>
                    <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--ink-2)' }}>
                      {applicantType === 'ftb' ? 'FTB limit: 4×' : 'Limit: 3.5×'}
                    </p>
                  </div>
                </div>

                <Rule />

                {/* Stress test */}
                <div
                  style={{
                    border: '1px solid var(--rule)',
                    borderRadius: '4px',
                    padding: '1rem',
                    backgroundColor: stressAffordable ? 'transparent' : 'rgba(233, 79, 55, 0.04)',
                  }}
                >
                  <p className="font-sans text-sm font-semibold mb-1" style={{ color: 'var(--ink)' }}>
                    Central Bank stress test
                  </p>
                  <p className="font-sans text-xs mb-2" style={{ color: 'var(--ink-2)', lineHeight: 1.5 }}>
                    Lenders stress-test your ability to repay if interest rates rose by 2%.
                  </p>
                  <p className="font-sans text-sm" style={{ color: 'var(--ink)' }}>
                    Stress-tested monthly repayment:{' '}
                    <span className="font-semibold tabular-nums" style={{ color: stressAffordable ? 'var(--ink)' : '#E94F37' }}>
                      {formatEuro(result.monthlyStress)}
                    </span>
                    {' '}at {(ratePct + 2).toFixed(2)}%
                  </p>
                  {!stressAffordable && (
                    <p className="font-sans text-xs mt-2" style={{ color: '#E94F37', lineHeight: 1.5 }}>
                      This would likely fail the standard affordability check — the stress-tested payment exceeds 35% of your monthly gross income.
                    </p>
                  )}
                </div>

                <Rule />

                {/* Amortisation visual */}
                <div>
                  <p className="font-sans text-xs font-medium mb-3" style={{ color: 'var(--ink-2)' }}>
                    Interest vs principal over time
                  </p>
                  <div className="flex flex-col gap-2">
                    {snapshots.map((snap) => {
                      const total = snap.interest + snap.principal;
                      const intPct = total > 0 ? (snap.interest / total) * 100 : 50;
                      return (
                        <div key={snap.year}>
                          <div className="flex justify-between font-sans text-xs mb-1" style={{ color: 'var(--ink-2)' }}>
                            <span>Year {snap.year}</span>
                            <span className="tabular-nums">{formatEuro(total / 12)}/mo avg</span>
                          </div>
                          <div className="flex w-full overflow-hidden" style={{ height: '10px', borderRadius: '5px', gap: '1px' }}>
                            <div style={{ flex: intPct, backgroundColor: 'var(--accent)', opacity: 0.85 }} />
                            <div style={{ flex: 100 - intPct, backgroundColor: 'var(--ink)', opacity: 0.25 }} />
                          </div>
                          <div className="flex justify-between font-sans text-[10px] mt-0.5" style={{ color: 'var(--ink-2)' }}>
                            <span>Interest {intPct.toFixed(0)}%</span>
                            <span>Principal {(100 - intPct).toFixed(0)}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: 'var(--accent)', opacity: 0.85 }} />
                      <span className="font-sans text-xs" style={{ color: 'var(--ink-2)' }}>Interest</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: 'var(--ink)', opacity: 0.25 }} />
                      <span className="font-sans text-xs" style={{ color: 'var(--ink-2)' }}>Principal</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="font-sans text-sm italic" style={{ color: 'var(--ink-2)' }}>
                Enter a property price and deposit to see results.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Disclaimer */}
      <p style={{ fontFamily: 'var(--font-sans)', fontStyle: 'italic', fontSize: '0.8125rem', color: 'var(--ink-2)', marginTop: '2rem', lineHeight: 1.6 }}>
        This calculator is for educational purposes only. Actual mortgage offers depend on your full financial profile, the lender&rsquo;s criteria, and Central Bank of Ireland mortgage measures. Always speak to a mortgage advisor or use the{' '}
        <a href="https://ccpc.ie" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>CCPC&rsquo;s money tools</a>{' '}
        before making a decision.
      </p>

      {/* Cross-link */}
      <p className="font-sans text-sm mt-4" style={{ color: 'var(--ink-2)' }}>
        New to mortgages?{' '}
        <Link href="/lessons/help-to-buy" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
          Read the Help to Buy lesson →
        </Link>
      </p>
    </main>
  );
}
