'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Rule } from '@/components/ui/Rule';
import { Eyebrow } from '@/components/ui/Eyebrow';

type Answer = 'yes' | 'no' | null;

type Outcome = {
  headline: string;
  situation: string;
  action: string[];
  externalLinks: Array<{ label: string; href: string }>;
  severity: 'high' | 'medium' | 'low';
};

/** Decision tree nodes */
type Question = {
  id: string;
  text: string;
  hint: string;
  yesNext: string | null; // next question id, or outcome key
  noNext: string | null;
};

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Does your most recent payslip show "Week 1" or "Emergency" next to your tax basis?',
    hint: 'Look at the "Tax basis" or "Basis" field on your payslip. It should say "Cumulative". If it says "Week 1" or "Emergency Basis", you are on emergency tax.',
    yesNext: 'q2',
    noNext: 'outcome-fine',
  },
  {
    id: 'q2',
    text: 'Have you registered this job with Revenue on myAccount?',
    hint: 'Log into Revenue myAccount (revenue.ie) → "Manage your tax 2026" → "Add a job or pension". Your employer gets a Revenue Payroll Notification (RPN) with your correct credits.',
    yesNext: 'outcome-registered-not-applied',
    noNext: 'q3',
  },
  {
    id: 'q3',
    text: 'Is this your first job in Ireland (no previous PAYE employment or P45)?',
    hint: 'If you have worked in Ireland before, your previous employer should have issued a P45 (now replaced by the Revenue Payroll system). If this is your first Irish job ever, Revenue has no record of you yet.',
    yesNext: 'outcome-first-job',
    noNext: 'outcome-previous-employer',
  },
];

const OUTCOMES: Record<string, Outcome> = {
  'outcome-fine': {
    severity: 'low',
    headline: 'You\'re not on emergency tax.',
    situation: 'Your payslip shows a cumulative tax basis, which means Revenue has issued your employer the correct tax credits and cut-off points. Your take-home should reflect your actual entitlements.',
    action: [
      'Double-check that the tax credit amount on your payslip matches your Tax Credit Certificate on myAccount.',
      'If your net pay seems unexpectedly low despite a cumulative basis, check whether you have the correct credits (personal, PAYE, and any others you\'ve claimed).',
    ],
    externalLinks: [
      { label: 'View your tax credits on myAccount', href: 'https://www.ros.ie/myaccount-web/sign_in.html' },
    ],
  },
  'outcome-registered-not-applied': {
    severity: 'medium',
    headline: 'You\'ve registered — but your employer may not have received the RPN yet.',
    situation: 'You registered the job on myAccount, but your employer is still applying emergency tax. This usually means either the Revenue Payroll Notification (RPN) hasn\'t been processed yet (can take 1–2 payroll cycles), or your employer\'s payroll software hasn\'t fetched the updated RPN.',
    action: [
      'Wait until the next payroll run — RPNs are typically applied within 1–2 pay periods.',
      'Contact your payroll or HR department and ask them to fetch your latest RPN from Revenue.',
      'Confirm on myAccount that the job appears under "Manage your tax 2026" with the correct start date.',
      'Once you are correctly taxed, Revenue will automatically refund any overpaid tax through your payslip (cumulative basis) — you don\'t need to claim it separately.',
    ],
    externalLinks: [
      { label: 'Revenue myAccount', href: 'https://www.ros.ie/myaccount-web/sign_in.html' },
    ],
  },
  'outcome-first-job': {
    severity: 'high',
    headline: 'First job — you need to register with Revenue immediately.',
    situation: 'Because this is your first job in Ireland, Revenue has no record of you as an employee. Your employer cannot get a valid Revenue Payroll Notification (RPN) until you register. Until they receive an RPN, they are legally required to apply emergency tax — no exceptions.',
    action: [
      'Step 1: Register for myAccount at revenue.ie using your PPSN.',
      'Step 2: Once logged in, go to "Manage your tax 2026" → "Add a job or pension" → enter your employer\'s name and your start date.',
      'Step 3: Tell your employer you have registered. Their payroll software will fetch your RPN in the next payroll run.',
      'Step 4: Once your tax basis shows "Cumulative" on your payslip, any emergency tax overpaid will be refunded automatically through your subsequent payslips in the same tax year.',
      'If you are near the end of the tax year, request a P21 / Income Tax Statement in January to get any remaining refund.',
    ],
    externalLinks: [
      { label: 'Register for myAccount (Revenue)', href: 'https://www.ros.ie/myaccount-web/register.html' },
      { label: 'Revenue: Emergency tax explained', href: 'https://www.revenue.ie/en/jobs-and-pensions/starting-your-first-job/emergency-tax.aspx' },
    ],
  },
  'outcome-previous-employer': {
    severity: 'high',
    headline: 'Register this job on myAccount — your credits are stuck with a previous employer.',
    situation: 'You have worked in Ireland before, but this job is not yet registered with Revenue. Your personal tax credits may still be allocated to your previous employer, or Revenue may have no active employment registered for you. Your current employer has no choice but to apply emergency tax until they receive an RPN.',
    action: [
      'Step 1: Log into myAccount → "Manage your tax 2026" → check if your current employer appears. If not, add it: "Add a job or pension".',
      'Step 2: If your old employer still shows as active, remove it or update the end date so your credits transfer.',
      'Step 3: Tell your payroll/HR department you have updated Revenue — they will fetch the new RPN.',
      'Step 4: Emergency tax overpaid in the same tax year is refunded automatically through cumulative basis payslips. Cross-year overpayments require a Form 12 or P21 request.',
      'If you received a P45 from your previous employer, check you entered the details correctly on myAccount.',
    ],
    externalLinks: [
      { label: 'Revenue myAccount', href: 'https://www.ros.ie/myaccount-web/sign_in.html' },
      { label: 'Revenue: Changing jobs', href: 'https://www.revenue.ie/en/jobs-and-pensions/changing-jobs/index.aspx' },
    ],
  },
};

const SEVERITY_COLOUR: Record<'high' | 'medium' | 'low', string> = {
  high: 'var(--accent)',
  medium: '#E65100',
  low: '#2E7D52',
};

export default function EmergencyTaxPage() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('q1');
  const [outcomeKey, setOutcomeKey] = useState<string | null>(null);

  function handleAnswer(questionId: string, answer: 'yes' | 'no') {
    const question = QUESTIONS.find((q) => q.id === questionId);
    if (!question) return;

    setAnswers((prev) => ({ ...prev, [questionId]: answer }));

    const nextId = answer === 'yes' ? question.yesNext : question.noNext;
    if (!nextId) return;

    if (nextId.startsWith('outcome-')) {
      setOutcomeKey(nextId);
    } else {
      setCurrentQuestionId(nextId);
    }
  }

  function restart() {
    setAnswers({});
    setCurrentQuestionId('q1');
    setOutcomeKey(null);
  }

  const currentQuestion = QUESTIONS.find((q) => q.id === currentQuestionId);
  const outcome = outcomeKey ? OUTCOMES[outcomeKey] : null;
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = QUESTIONS.length;

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
        Emergency tax diagnostic
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
        Three questions to find out why you&rsquo;re being overtaxed — and how to fix it.
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

        {!outcome ? (
          <>
            {/* Progress */}
            <div className="flex items-center gap-2 mb-6">
              {QUESTIONS.map((q, i) => (
                <div
                  key={q.id}
                  style={{
                    height: '4px',
                    borderRadius: '2px',
                    flex: 1,
                    backgroundColor:
                      answers[q.id] !== undefined
                        ? 'var(--accent)'
                        : q.id === currentQuestionId
                        ? 'var(--ink-2)'
                        : 'var(--rule)',
                    transition: 'background-color 0.2s ease',
                  }}
                />
              ))}
            </div>

            {currentQuestion && (
              <div>
                <p
                  className="font-sans text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: 'var(--ink-2)' }}
                >
                  Question {QUESTIONS.findIndex((q) => q.id === currentQuestionId) + 1} of {totalQuestions}
                </p>

                <h2
                  style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: '1.375rem',
                    lineHeight: 1.25,
                    color: 'var(--ink)',
                    letterSpacing: '-0.01em',
                    marginBottom: '1rem',
                  }}
                >
                  {currentQuestion.text}
                </h2>

                <div
                  style={{
                    border: '1px solid var(--rule)',
                    borderRadius: '4px',
                    padding: '0.875rem 1rem',
                    marginBottom: '1.5rem',
                    backgroundColor: 'var(--bg)',
                  }}
                >
                  <p
                    className="font-sans text-xs"
                    style={{ color: 'var(--ink-2)', lineHeight: 1.6, margin: 0 }}
                  >
                    <strong className="font-semibold" style={{ color: 'var(--ink)' }}>
                      How to check:{' '}
                    </strong>
                    {currentQuestion.hint}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => handleAnswer(currentQuestion.id, 'yes')}
                    className="font-sans font-medium"
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'var(--accent)',
                      color: 'var(--accent-ink)',
                      border: 'none',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      fontSize: '0.9375rem',
                    }}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAnswer(currentQuestion.id, 'no')}
                    className="font-sans font-medium"
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: 'var(--bg)',
                      color: 'var(--ink)',
                      border: '1px solid var(--rule)',
                      borderRadius: '2px',
                      cursor: 'pointer',
                      fontSize: '0.9375rem',
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Outcome */
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: SEVERITY_COLOUR[outcome.severity],
                  flexShrink: 0,
                }}
              />
              <p
                className="font-sans text-xs font-semibold uppercase tracking-widest"
                style={{ color: SEVERITY_COLOUR[outcome.severity] }}
              >
                {outcome.severity === 'high' ? 'Action required' : outcome.severity === 'medium' ? 'Follow up needed' : 'All clear'}
              </p>
            </div>

            <h2
              style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: '1.5rem',
                lineHeight: 1.2,
                color: 'var(--ink)',
                letterSpacing: '-0.01em',
                marginBottom: '0.875rem',
              }}
            >
              {outcome.headline}
            </h2>

            <p
              className="font-sans text-sm"
              style={{ color: 'var(--ink-2)', lineHeight: 1.65, marginBottom: '1.5rem' }}
            >
              {outcome.situation}
            </p>

            <Rule className="mb-4" />

            <p
              className="font-sans text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--ink-2)' }}
            >
              What to do
            </p>
            <ol
              className="font-sans text-sm"
              style={{
                paddingLeft: '1.25rem',
                margin: '0 0 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.625rem',
                color: 'var(--ink)',
                lineHeight: 1.6,
              }}
            >
              {outcome.action.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>

            {outcome.externalLinks.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {outcome.externalLinks.map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm"
                    style={{ color: 'var(--accent)', textDecoration: 'none' }}
                  >
                    {label} &rarr;
                  </a>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={restart}
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
        )}
      </div>

      {/* Context note */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          border: '1px solid var(--rule)',
          borderRadius: '4px',
        }}
      >
        <p
          className="font-sans text-xs"
          style={{ color: 'var(--ink-2)', lineHeight: 1.65, margin: 0 }}
        >
          <strong style={{ color: 'var(--ink)' }}>What is emergency tax?</strong> When your
          employer cannot verify your tax credits with Revenue, they are legally required to
          apply emergency tax. For the first four weeks, this means 20% on all income (no
          credits). From week 5 onwards, the 40% rate applies to all income. Emergency tax
          is always fully refundable once the correct RPN is received — no money is lost
          permanently, but the cash flow impact can be significant.
        </p>
      </div>

      <p className="font-sans text-sm mt-4" style={{ color: 'var(--ink-2)' }}>
        Read the lesson:{' '}
        <Link
          href="/lessons/payslip"
          style={{ color: 'var(--accent)', textDecoration: 'none' }}
        >
          Your payslip, line by line &rarr;
        </Link>
      </p>

    </main>
  );
}
