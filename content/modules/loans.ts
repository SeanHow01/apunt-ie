import type { Module } from '@/content/types';

const loans: Module = {
  id: 'loans',
  title: 'Before you sign',
  subtitle: 'A plain guide to loans, borrowing, and what it really costs.',
  durationMinutes: 7,
  steps: [
    {
      id: 'loans-1',
      label: 'The words that matter',
      body: 'APR (Annual Percentage Rate) is the true yearly cost of borrowing, expressed as a percentage — it includes interest and most fees. AER (Annual Equivalent Rate) is used for savings, not loans. Capital is the amount you actually borrow. Interest is the fee the lender charges for lending it. The term is how long you have to repay. A secured loan is tied to an asset (usually a home) the lender can claim if you stop paying; an unsecured loan is not. The rest of this lesson uses these words. If you remember one, remember APR — it\'s the true yearly cost of borrowing, expressed as a percentage.',
    },
    {
      id: 'loans-2',
      label: 'Short, medium, long term',
      body: 'Borrowing under 12 months typically covers short-term cash gaps — an overdraft, a credit card balance, or a small personal loan for a specific purchase. One to five years is the most common range for personal loans: a car, home improvements, or consolidating existing debt. Beyond five years, borrowing is typically tied to larger assets — most commonly a mortgage on a property — where the extended term is what makes the monthly figure manageable.',
    },
    {
      id: 'loans-3',
      label: 'Where you can borrow in Ireland',
      body: 'Banks offer personal loans and mortgages and are often competitive on larger, longer-term borrowing. Credit unions are member-owned cooperatives and often competitive on smaller personal loans, particularly for members with a savings history. Licensed moneylenders are authorised by the Central Bank but typically carry higher APRs — the licence is the key thing to check. Buy Now Pay Later (BNPL) providers offer short-term instalment plans, usually interest-free if paid on time, but late fees and interest can apply. Hire purchase is common for vehicles: you use the asset while paying for it, and ownership transfers only when the final payment is made.',
    },
    {
      id: 'loans-4',
      label: 'What a loan actually costs',
      body: 'The monthly payment is not the same as the cost of the loan. On a €5,000 loan at 9% APR over 3 years, most borrowers pay around €159 a month — and roughly €724 in total interest over the life of the loan. Stretch that same loan to 5 years and the monthly figure drops to around €104, but the total interest rises to over €1,200. A lower monthly payment usually means a higher total cost.',
      callout: {
        kind: 'tip',
        text: 'Always look at the total cost of credit, not just the monthly repayment. The total cost of credit is what you pay in interest on top of the amount you borrowed.',
      },
    },
    {
      id: 'loans-5',
      label: 'The Central Credit Register',
      body: 'The Central Credit Register (CCR) is Ireland\'s national record of personal credit. It logs every loan, credit card, and overdraft over €500, and lenders are required to check it before approving new credit applications. The CCR also records missed and late payments, and that information stays on the record for five years from when the issue was resolved.',
    },
    {
      id: 'loans-6',
      label: 'When payments slip',
      body: 'A first missed payment typically triggers a late fee and, on some products, a penalty interest rate. Once a payment is 30 or more days overdue, lenders are required to report it to the CCR. At 90 days overdue, the account is typically classified as in default — which can lead to further charges, referral to a collections team, or legal proceedings. A default on your CCR record affects future loan applications and, in some cases, mortgage prospects and rental references.',
    },
    {
      id: 'loans-7',
      label: 'If things go wrong',
      body: 'MABS — the Money Advice and Budgeting Service — is a free, confidential, state-funded service that helps people in financial difficulty work through their options. For homeowners in mortgage distress, the Abhaile scheme offers free professional advice from solicitors and financial advisers. Where debts are significant and unmanageable, the Personal Insolvency Act provides structured legal routes — including Debt Relief Notices, Debt Settlement Arrangements, and Personal Insolvency Arrangements — as a last resort.',
      callout: {
        kind: 'context',
        text: 'If you\'re worried about repayments — even if you haven\'t missed one yet — MABS is free. Call 0818 07 2000 or visit mabs.ie.',
      },
    },
    {
      id: 'loans-8',
      label: 'Red flags before you sign',
      body: 'Worth checking before you commit: that the lender is authorised by the Central Bank of Ireland (searchable on the Register of Regulated Firms at centralbank.ie); that the APR is quoted clearly and upfront; whether early repayment penalties apply; whether payment protection or other insurance has been added in and whether it\'s optional; and that the total cost of credit matches what you were quoted. A good loan is one you\'ve read before you\'ve signed.',
    },
  ],
  closingLine: "You don't need to borrow often to borrow well. You just need to know what you're signing.",
  lastReviewed: 'April 2026',
  reviewNote: 'APR rules, CBI authorised lender register, and credit union guidance verified.',
};

export default loans;
