/**
 * Refund checker — pure logic.
 *
 * Takes answers from the six diagnostic questions and returns a checklist
 * of items to investigate on Revenue MyAccount.
 *
 * NO monetary estimates are produced. Output is strictly a list of
 * things to check. Actual amounts depend on the user's full tax situation
 * and are determined by Revenue, not this tool.
 */

export type Q1Answer = 'yes' | 'no' | 'not-sure';
export type Q2Answer = 'yes' | 'no' | 'not-sure';
export type Q3Answer = 'yes' | 'no' | 'partly' | 'not-sure';
export type Q4Item = 'medical' | 'prescriptions' | 'dental' | 'physio' | 'tuition' | 'none';
export type Q5Answer = 'yes-regularly' | 'yes-occasionally' | 'no' | 'not-sure';
export type Q6Answer = 'single' | 'jointly';

export type RefundCheckerAnswers = {
  q1: Q1Answer | null;
  q2: Q2Answer | null; // only relevant when q1 === 'yes'
  q3: Q3Answer | null;
  q4: Q4Item[];
  q5: Q5Answer | null;
  q6: Q6Answer;
};

export type ResultItem = {
  title: string;
  description: string;
  whatToDo: string;
  years: string;
};

const STANDARD_CREDITS_RESULT: ResultItem = {
  title: 'Confirm your Personal and Employee Tax Credits are applied',
  description:
    "Every Irish PAYE worker is entitled to a Personal Tax Credit (€1,875 in 2026) and an Employee Tax Credit (€1,875 in 2026). These are usually applied automatically — but if you've ever been on emergency tax, they may have been missed for a period.",
  whatToDo:
    'Sign in to MyAccount and view your Tax Credit Certificate for the current year. Both credits should be listed. If they\'re missing, add them.',
  years: 'Current year, plus any previous year you worked',
};

const EMERGENCY_TAX_RESULT: ResultItem = {
  title: 'Check for emergency tax overpayment',
  description:
    'If you were on emergency tax for more than one pay period, you may have overpaid in the year(s) it happened.',
  whatToDo:
    'In MyAccount, go to Review Your Tax for each year in question. Add any missing tax credits and submit. Revenue produces a Statement of Liability and refunds any overpayment to your bank account, usually within 5 working days.',
  years: 'All four (2022–2025)',
};

const RENT_CREDIT_RESULT: ResultItem = {
  title: 'Rent Tax Credit',
  description:
    'A credit worth up to €1,000 (single, 2024 onwards) or up to €500 (single, 2022–2023). Applies to rent paid on private accommodation, including digs. Not applied automatically — you have to claim it. The credit doubles for jointly assessed couples.',
  whatToDo:
    "In MyAccount, go to Manage Your Tax (current year) or Review Your Tax (previous years). Add Rent Tax Credit. You'll need your landlord's name, the property address, and the rent paid that year.",
  years: 'All four (2022–2025), plus current year',
};

const MEDICAL_RESULT: ResultItem = {
  title: 'Medical expenses tax relief',
  description:
    '20% relief on qualifying healthcare costs you paid yourself. No minimum threshold. Includes GP and consultant fees, prescriptions, non-routine dental work, and physiotherapy. Routine eye tests and glasses do not qualify.',
  whatToDo:
    'In MyAccount, go to Receipts Tracker to upload receipts as you go, or claim everything at year-end through Review Your Tax. For non-routine dental, ask your dentist for a Med 2 form and keep it.',
  years: 'All four (2022–2025), plus current year',
};

const TUITION_RESULT: ResultItem = {
  title: 'Tuition Fee Relief',
  description:
    "20% relief on qualifying tuition fees above a Revenue threshold. Applies where Free Fees didn't cover the cost.",
  whatToDo:
    "In MyAccount, add Tuition Fee Relief under the year the fees were paid. You'll need a receipt or statement from the college showing the qualifying fee amount.",
  years: 'All four (2022–2025), plus current year',
};

const WFH_RESULT: ResultItem = {
  title: 'Working from home relief',
  description:
    "Relief on electricity, heating, and broadband costs incurred while working from home, where your employer hasn't already paid you the daily allowance.",
  whatToDo:
    "In MyAccount, claim Remote Working Relief. You'll need your utility bills and a record of how many days you worked from home each year.",
  years: 'All four (2022–2025), plus current year',
};

const MEDICAL_Q4_ITEMS: Q4Item[] = ['medical', 'prescriptions', 'dental', 'physio'];

export function getRefundCheckerResults(answers: RefundCheckerAnswers): ResultItem[] {
  const results: ResultItem[] = [];

  // Always shown: standard credits check
  results.push(STANDARD_CREDITS_RESULT);

  // Emergency tax: only when Q1=yes AND Q2 suggests there may have been emergency tax
  if (
    answers.q1 === 'yes' &&
    (answers.q2 === 'yes' || answers.q2 === 'not-sure')
  ) {
    results.push(EMERGENCY_TAX_RESULT);
  }

  // Rent Tax Credit: any indication of private renting
  if (
    answers.q3 === 'yes' ||
    answers.q3 === 'partly' ||
    answers.q3 === 'not-sure'
  ) {
    results.push(RENT_CREDIT_RESULT);
  }

  // Medical expenses: any medical/health spending flagged
  if (answers.q4.some((a) => MEDICAL_Q4_ITEMS.includes(a))) {
    results.push(MEDICAL_RESULT);
  }

  // Tuition Fee Relief
  if (answers.q4.includes('tuition')) {
    results.push(TUITION_RESULT);
  }

  // Working from home relief
  if (answers.q5 === 'yes-regularly' || answers.q5 === 'yes-occasionally') {
    results.push(WFH_RESULT);
  }

  return results;
}
