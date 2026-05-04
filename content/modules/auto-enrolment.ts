import type { Module } from '@/content/types';

const autoEnrolment: Module = {
  id: 'auto-enrolment',
  title: 'The new pension, explained',
  subtitle: 'Auto-enrolment and what it means for you',
  durationMinutes: 4,
  steps: [
    {
      id: 'what-it-is',
      label: 'What it is',
      body: 'From January 2026, most workers are enrolled in a pension automatically. If you are aged 23 or over and earn more than €20,000 a year, you are in — unless you have already arranged your own pension.',
    },
    {
      id: 'your-contribution',
      label: 'Your contribution',
      body: 'You start by contributing 1.5% of your gross pay. This rises gradually over ten years, reaching 6% by 2035. The increases are small and phased — you will not notice a sudden drop in your take-home.',
      callout: {
        kind: 'info',
        text: 'Pension contributions reduce your taxable income through your payslip — but other credits (rent, medical, working from home) only reduce tax when you claim them yourself. Module VIII covers what to claim and how.',
      },
    },
    {
      id: 'employer-match',
      label: "Your employer's match",
      body: 'Your employer matches whatever you put in, euro for euro. If you contribute 1.5%, they add another 1.5%. This is part of your pay — it goes straight to your pension, not to the government.',
      callout: {
        kind: 'context',
        text: "Your employer's contribution is money you would not otherwise see. Opting out means leaving that match on the table.",
      },
    },
    {
      id: 'state-topup',
      label: 'The state top-up',
      body: 'For every €3 you contribute, the state adds €1. That is a 33% bonus on your own money, before any investment growth. No other savings product in Ireland comes close to this.',
    },
    {
      id: 'opt-out',
      label: 'Can you opt out?',
      body: 'Yes. After six months, you can opt out and get your own contributions refunded. But you will be re-enrolled automatically in two years. The scheme is designed to keep you saving even if life gets complicated.',
    },
    {
      id: 'why-it-matters',
      label: 'Why it matters',
      body: 'A pension that starts in your twenties has decades to grow. Even small amounts, matched and topped up, compound into something significant. The best time to start is now — the scheme just made that decision for you.',
    },
  ],
  closingLine: 'Your future self already has a pension. You just needed to know about it.',
  lastReviewed: 'April 2026',
  reviewNote: 'Auto-enrolment commencement and contribution rates verified against Department of Social Protection guidance.',
};

export default autoEnrolment;
