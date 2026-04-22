import type { Module } from '@/content/types';

const helpToBuy: Module = {
  id: 'help-to-buy',
  title: 'Help to Buy, plainly',
  subtitle: "The first-time buyer's tax rebate, and how it actually works.",
  durationMinutes: 5,
  steps: [
    {
      id: 'what-it-is',
      label: 'What Help to Buy is',
      body: "Help to Buy (HTB) is a tax rebate for first-time buyers purchasing a newly-built home. It refunds income tax and DIRT you have already paid over the previous four years, to help fund the deposit on the new property. It is not a loan and not a grant — it is a refund of tax you have already paid into the system. The scheme is administered through Revenue's MyAccount.",
    },
    {
      id: 'who-qualifies',
      label: 'Who qualifies',
      body: 'To qualify, you must be a first-time buyer — meaning you have never owned a residential property anywhere in the world. The property must be a newly-built home (not a second-hand property). You must take out a mortgage of at least 70% of the purchase price (or valuation, whichever is lower). You must have paid Irish income tax or DIRT at some point in the previous four tax years.',
    },
    {
      id: 'what-you-get',
      label: 'What you get',
      body: 'The rebate is the lower of: 10% of the purchase price of the property, €30,000, or the total income tax and DIRT you paid in the previous four years. If you paid less than €30,000 in tax over those four years, that is the maximum you can claim. A couple buying together can combine their tax paid to increase the potential rebate.',
    },
    {
      id: 'how-it-works-with-deposit',
      label: 'How it works with your deposit',
      body: "The rebate is paid directly to the property developer or to your mortgage provider — not to you personally. It counts as part of your deposit. For example, if the property costs €350,000 and you receive a €25,000 HTB rebate, you still need to provide the remainder of the required deposit from your own savings. The total deposit must still meet your lender's loan-to-value requirements.",
    },
    {
      id: 'the-application',
      label: 'The application',
      body: "Apply through Revenue's MyAccount at revenue.ie before you sign contracts. You will need to be tax-compliant — all returns filed, no outstanding debts to Revenue. Revenue will issue an access code which you give to your property developer. The developer claims the money directly from Revenue. The process takes a few days once your tax position is confirmed.",
    },
    {
      id: 'common-confusions',
      label: 'Common confusions',
      body: 'Help to Buy does not apply to second-hand homes — only new builds. It does not apply if you have ever owned property anywhere in the world, including abroad. It does not apply to self-builds above a certain value threshold. The amount you receive is limited by what you actually paid in income tax and DIRT — not by the purchase price alone. First-time buyers with short work histories may receive less than the maximum.',
    },
  ],
  closingLine: "Help to Buy is a refund of tax you've already paid. If you've worked in Ireland for a few years and are buying a new build, it's almost always worth applying.",
};

export default helpToBuy;
