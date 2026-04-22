import type { Module } from '@/content/types';

const investing: Module = {
  id: 'investing',
  title: 'Your first €50 invested',
  subtitle: 'A calm introduction to saving and investing. No stock tips.',
  durationMinutes: 6,
  steps: [
    {
      id: 'saving-vs-investing',
      label: 'Saving vs investing',
      body: "Saving means putting money in a deposit account or credit union — it's accessible, safe, and earns a small return. Investing means putting money into assets like shares or funds that can grow more over time, but whose value can also fall. Most people benefit from having both: savings for things they need within a few years, investments for longer-term goals. The two are not in competition.",
    },
    {
      id: 'compound-interest',
      label: 'Compound interest, plainly',
      body: 'Compound interest means you earn returns on your returns — not just on the original amount. €50 a month invested at 6% average annual growth becomes roughly €50,000 after 30 years, but only around €8,200 after 10 years. The difference — €41,800 — is almost entirely the effect of time, not extra money put in. Starting earlier has a much larger effect than increasing the amount later.',
    },
    {
      id: 'shares-and-funds',
      label: "What's a share, what's a fund",
      body: "A share is part-ownership of a single company — if the company does well, the share price rises; if it does badly, it falls. A fund is a basket of many shares (or bonds), spread across many companies or markets. For most people starting out, a low-cost diversified fund is simpler and less risky than picking individual shares, because the risk is spread across hundreds of companies rather than concentrated in one.",
    },
    {
      id: 'irish-landscape',
      label: 'The Irish investing landscape',
      body: "Common starting points in Ireland include deposit savings accounts, State Savings products (through An Post, capital-guaranteed), and pensions via auto-enrolment. For those who want to invest beyond pensions, ETFs and funds are available through online brokers — but the Irish tax treatment of these is unusual. Most investment funds are subject to \"deemed disposal\" every eight years, which is a taxable event even if you haven't sold. This is worth understanding before you start.",
      callout: {
        kind: 'warning',
        text: 'Irish tax on some investment products is unusual — especially "deemed disposal" on ETFs. Before you invest in a fund, understand its tax treatment. MABS and an authorised advisor can help.',
      },
    },
    {
      id: 'risk-plainly',
      label: 'Risk, plainly',
      body: 'Investment values go up and down. A fund that tracks global stock markets might fall 30% in a bad year and rise 25% in a good one. Over very long periods, diversified funds have historically trended upward — but past performance does not guarantee future results. The general principle is that the longer you plan to leave money invested, the less day-to-day volatility matters. Never invest money you may need within the next two to three years.',
    },
    {
      id: 'where-people-start',
      label: 'Where people start',
      body: 'App-based platforms like Revolut, Trading 212, and DEGIRO offer low-cost access to funds and shares — they are examples of what exists, not recommendations. Traditional stockbrokers and financial advisors are another route, particularly for larger sums. Credit union savings are a straightforward option for short-term goals. State Savings through An Post suit very cautious savers who want capital protection. Each has different costs, tax implications, and access rules.',
    },
  ],
  closingLine: 'Starting small is starting. €50 a month for 30 years teaches you more than €5,000 lumped in once.',
};

export default investing;
