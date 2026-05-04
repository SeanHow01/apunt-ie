'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';
import {
  getRefundCheckerResults,
  type RefundCheckerAnswers,
  type Q1Answer,
  type Q2Answer,
  type Q3Answer,
  type Q4Item,
  type Q5Answer,
  type Q6Answer,
  type ResultItem,
} from '@/lib/calculations/refund-checker';

const MYACCOUNT_URL = 'https://www.ros.ie/myaccount-web/sign_in.html';

const DISCLAIMER =
  'This tool gives an estimate of what to check, not what you\'re owed. Revenue calculates the actual amount based on your full tax situation for each year. The only way to know what you\'re owed is to sign in to MyAccount and review.';

function RadioGroup<T extends string>({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: T | null;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.625rem 0.875rem',
            border: `1px solid ${value === opt.value ? 'var(--accent)' : 'var(--rule)'}`,
            borderRadius: '2px',
            cursor: 'pointer',
            backgroundColor: value === opt.value ? 'var(--surface)' : 'transparent',
          }}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            style={{ accentColor: 'var(--accent)', flexShrink: 0 }}
          />
          <span className="font-sans text-sm" style={{ color: 'var(--ink)' }}>
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}

function CheckboxGroup({
  value,
  onChange,
  options,
}: {
  value: Q4Item[];
  onChange: (v: Q4Item[]) => void;
  options: { value: Q4Item; label: string }[];
}) {
  function toggle(item: Q4Item) {
    if (item === 'none') {
      onChange(['none']);
      return;
    }
    const withoutNone = value.filter((v) => v !== 'none');
    if (withoutNone.includes(item)) {
      onChange(withoutNone.filter((v) => v !== item));
    } else {
      onChange([...withoutNone, item]);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.625rem 0.875rem',
            border: `1px solid ${value.includes(opt.value) ? 'var(--accent)' : 'var(--rule)'}`,
            borderRadius: '2px',
            cursor: 'pointer',
            backgroundColor: value.includes(opt.value) ? 'var(--surface)' : 'transparent',
          }}
        >
          <input
            type="checkbox"
            value={opt.value}
            checked={value.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            style={{ accentColor: 'var(--accent)', flexShrink: 0 }}
          />
          <span className="font-sans text-sm" style={{ color: 'var(--ink)' }}>
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}

function HintBox({ text }: { text: string }) {
  return (
    <div
      style={{
        border: '1px solid var(--rule)',
        borderRadius: '4px',
        padding: '0.75rem 1rem',
        marginTop: '0.75rem',
        backgroundColor: 'var(--bg)',
      }}
    >
      <p className="font-sans text-xs" style={{ color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}>
        {text}
      </p>
    </div>
  );
}

function ResultCard({ item }: { item: ResultItem }) {
  return (
    <div
      style={{
        border: '1px solid var(--rule)',
        borderRadius: '4px',
        padding: '1.125rem 1.25rem',
        backgroundColor: 'var(--surface)',
      }}
    >
      <h3
        style={{
          fontSize: '1.0625rem',
          lineHeight: 1.3,
          color: 'var(--ink)',
          letterSpacing: '-0.01em',
          marginBottom: '0.5rem',
        }}
      >
        {item.title}
      </h3>
      <p className="font-sans text-sm" style={{ color: 'var(--ink)', lineHeight: 1.65, marginBottom: '0.875rem' }}>
        {item.description}
      </p>
      <div
        style={{
          borderLeft: '2px solid var(--rule)',
          paddingLeft: '0.75rem',
          marginBottom: '0.875rem',
        }}
      >
        <p
          className="font-sans text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: 'var(--ink-2)' }}
        >
          What to do on MyAccount
        </p>
        <p className="font-sans text-sm" style={{ color: 'var(--ink-2)', lineHeight: 1.65 }}>
          {item.whatToDo}
        </p>
      </div>
      <p className="font-sans text-xs" style={{ color: 'var(--ink-2)' }}>
        <span style={{ fontWeight: 600 }}>Years:</span> {item.years}
      </p>
    </div>
  );
}

export default function RefundCheckerPage() {
  const [q1, setQ1] = useState<Q1Answer | null>(null);
  const [q2, setQ2] = useState<Q2Answer | null>(null);
  const [q3, setQ3] = useState<Q3Answer | null>(null);
  const [q4, setQ4] = useState<Q4Item[]>([]);
  const [q5, setQ5] = useState<Q5Answer | null>(null);
  const [q6, setQ6] = useState<Q6Answer>('single');
  const [submitted, setSubmitted] = useState(false);

  const answers: RefundCheckerAnswers = { q1, q2, q3, q4, q5, q6 };
  const results = submitted ? getRefundCheckerResults(answers) : [];

  function handleSubmit() {
    setSubmitted(true);
    // Scroll to results after a tick
    setTimeout(() => {
      document.getElementById('refund-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  function handleReset() {
    setQ1(null);
    setQ2(null);
    setQ3(null);
    setQ4([]);
    setQ5(null);
    setQ6('single');
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <main className="max-w-3xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">

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
        <Eyebrow>Diagnostic</Eyebrow>
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
        Tax you might be owed
      </h1>

      <p
        style={{
          fontStyle: 'italic',
          fontSize: '1.125rem',
          color: 'var(--ink-2)',
          margin: '0 0 1rem',
        }}
      >
        Six quick questions. No calculation. Just a checklist of things to check on Revenue MyAccount.
      </p>

      {/* Always-visible disclaimer */}
      <div
        style={{
          border: '1px solid var(--rule)',
          borderRadius: '4px',
          padding: '0.875rem 1rem',
          marginBottom: '2rem',
          backgroundColor: 'var(--bg)',
        }}
      >
        <p className="font-sans text-xs" style={{ color: 'var(--ink-2)', lineHeight: 1.65, margin: 0 }}>
          {DISCLAIMER}
        </p>
      </div>

      <Rule />

      {/* Questions */}
      <div className="flex flex-col gap-8 mt-8">

        {/* Q1 */}
        <section>
          <p
            className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--ink-2)' }}
          >
            Question 1 of 6
          </p>
          <h2
            style={{
              fontSize: '1.25rem',
              lineHeight: 1.25,
              color: 'var(--ink)',
              letterSpacing: '-0.01em',
              marginBottom: '0.875rem',
            }}
          >
            Have you started a new PAYE job in the last four years?
          </h2>
          <RadioGroup<Q1Answer>
            name="q1"
            value={q1}
            onChange={setQ1}
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
              { value: 'not-sure', label: 'Not sure' },
            ]}
          />
        </section>

        {/* Q2 — only shown when Q1 = yes */}
        {q1 === 'yes' && (
          <section>
            <p
              className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--ink-2)' }}
            >
              Question 2 of 6
            </p>
            <h2
              style={{
                fontSize: '1.25rem',
                lineHeight: 1.25,
                color: 'var(--ink)',
                letterSpacing: '-0.01em',
                marginBottom: '0.875rem',
              }}
            >
              In any of those new jobs, were you on emergency tax for one or more pay periods?
            </h2>
            <RadioGroup<Q2Answer>
              name="q2"
              value={q2}
              onChange={setQ2}
              options={[
                { value: 'yes', label: 'Yes — I remember being on emergency tax' },
                { value: 'no', label: 'No — my tax credits were applied from the first payslip' },
                { value: 'not-sure', label: "Not sure / I'd need to check" },
              ]}
            />
            <HintBox text='Emergency tax shows on a payslip as a flat 40% income tax deduction, or a flat 20% with no tax credits applied.' />
          </section>
        )}

        {/* Q3 */}
        <section>
          <p
            className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--ink-2)' }}
          >
            Question {q1 === 'yes' ? '3' : '2'} of 6
          </p>
          <h2
            style={{
              fontSize: '1.25rem',
              lineHeight: 1.25,
              color: 'var(--ink)',
              letterSpacing: '-0.01em',
              marginBottom: '0.875rem',
            }}
          >
            In any of the last four years, did you rent private accommodation in Ireland?
          </h2>
          <RadioGroup<Q3Answer>
            name="q3"
            value={q3}
            onChange={setQ3}
            options={[
              { value: 'yes', label: 'Yes — paid rent on a private rental, including digs or rent-a-room' },
              { value: 'no', label: 'No — I lived at home or owned my home' },
              { value: 'partly', label: 'Partly — for some of those years' },
              { value: 'not-sure', label: 'Not sure' },
            ]}
          />
          <HintBox text="Includes student accommodation, shared rentals, and rent paid by you for your own residence. Does not include accommodation supported by HAP or other state housing supports." />
        </section>

        {/* Q4 */}
        <section>
          <p
            className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--ink-2)' }}
          >
            Question {q1 === 'yes' ? '4' : '3'} of 6
          </p>
          <h2
            style={{
              fontSize: '1.25rem',
              lineHeight: 1.25,
              color: 'var(--ink)',
              letterSpacing: '-0.01em',
              marginBottom: '0.5rem',
            }}
          >
            Have you paid for any of the following in the last four years?
          </h2>
          <p className="font-sans text-sm mb-3" style={{ color: 'var(--ink-2)' }}>
            Select all that apply.
          </p>
          <CheckboxGroup
            value={q4}
            onChange={setQ4}
            options={[
              { value: 'medical', label: 'GP visits, consultant fees, or hospital costs' },
              { value: 'prescriptions', label: 'Prescription medication' },
              { value: 'dental', label: 'Non-routine dental work (extractions, crowns, root canals, orthodontics)' },
              { value: 'physio', label: 'Physiotherapy or other prescribed treatment' },
              { value: 'tuition', label: "Tuition fees for a college course (where Free Fees didn't apply)" },
              { value: 'none', label: 'None of the above' },
            ]}
          />
        </section>

        {/* Q5 */}
        <section>
          <p
            className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--ink-2)' }}
          >
            Question {q1 === 'yes' ? '5' : '4'} of 6
          </p>
          <h2
            style={{
              fontSize: '1.25rem',
              lineHeight: 1.25,
              color: 'var(--ink)',
              letterSpacing: '-0.01em',
              marginBottom: '0.875rem',
            }}
          >
            Have you worked from home as part of any PAYE job?
          </h2>
          <RadioGroup<Q5Answer>
            name="q5"
            value={q5}
            onChange={setQ5}
            options={[
              { value: 'yes-regularly', label: 'Yes, regularly' },
              { value: 'yes-occasionally', label: 'Yes, occasionally' },
              { value: 'no', label: 'No' },
              { value: 'not-sure', label: 'Not sure' },
            ]}
          />
        </section>

        {/* Q6 */}
        <section>
          <p
            className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: 'var(--ink-2)' }}
          >
            Question {q1 === 'yes' ? '6' : '5'} of 6
          </p>
          <h2
            style={{
              fontSize: '1.25rem',
              lineHeight: 1.25,
              color: 'var(--ink)',
              letterSpacing: '-0.01em',
              marginBottom: '0.875rem',
            }}
          >
            Are you single, or jointly assessed with a spouse or civil partner?
          </h2>
          <RadioGroup<Q6Answer>
            name="q6"
            value={q6}
            onChange={setQ6}
            options={[
              { value: 'single', label: 'Single' },
              { value: 'jointly', label: 'Jointly assessed couple' },
            ]}
          />
        </section>

        {/* Submit */}
        {!submitted && (
          <div>
            <button
              type="button"
              onClick={handleSubmit}
              className="font-sans font-medium"
              style={{
                padding: '0.875rem 2rem',
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-ink)',
                border: 'none',
                borderRadius: '2px',
                cursor: 'pointer',
                fontSize: '0.9375rem',
              }}
            >
              See checklist &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {submitted && (
        <div id="refund-results" style={{ marginTop: '3rem' }}>
          <Rule className="mb-8" />

          {/* Disclaimer above results */}
          <div
            style={{
              border: '1px solid var(--rule)',
              borderRadius: '4px',
              padding: '0.875rem 1rem',
              marginBottom: '1.5rem',
              backgroundColor: 'var(--bg)',
            }}
          >
            <p className="font-sans text-xs" style={{ color: 'var(--ink-2)', lineHeight: 1.65, margin: 0 }}>
              {DISCLAIMER}
            </p>
          </div>

          <h2
            style={{
              fontSize: '1.75rem',
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
              marginBottom: '0.375rem',
            }}
          >
            Your checklist
          </h2>
          <p className="font-sans text-sm mb-6" style={{ color: 'var(--ink-2)' }}>
            {results.length} {results.length === 1 ? 'item' : 'items'} to check on Revenue MyAccount.
          </p>

          <div className="flex flex-col gap-4 mb-8">
            {results.map((item, i) => (
              <ResultCard key={i} item={item} />
            ))}
          </div>

          {/* Closing callout */}
          <div
            style={{
              border: '1px solid var(--rule)',
              borderRadius: '4px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              backgroundColor: 'var(--surface)',
            }}
          >
            <p className="font-sans text-sm mb-4" style={{ color: 'var(--ink-2)', lineHeight: 1.65 }}>
              This is an estimate of what to check, not what you&rsquo;re owed. Revenue calculates the
              actual amount based on your full tax situation for each year. The only way to know what
              you&rsquo;re owed is to sign in to MyAccount and review.
            </p>
            <a
              href={MYACCOUNT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans font-medium"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-ink)',
                borderRadius: '2px',
                textDecoration: 'none',
                fontSize: '0.9375rem',
              }}
            >
              Sign in to Revenue MyAccount &rarr;
            </a>
          </div>

          {/* Cross-link to module */}
          <p className="font-sans text-sm" style={{ color: 'var(--ink-2)' }}>
            Read the full module:{' '}
            <Link
              href="/lessons/tax-back"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}
            >
              Tax you might be owed &rarr;
            </Link>
          </p>

          <div style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              onClick={handleReset}
              className="font-sans text-sm"
              style={{
                color: 'var(--ink-2)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
              }}
            >
              Start again
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
