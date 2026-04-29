/**
 * Punt glossary — plain-English definitions for Irish financial terms.
 *
 * All terms use Irish-specific context where relevant (Revenue, RTB, SUSI, etc.).
 * Sort order: alphabetical by term.
 */

export type GlossaryTerm = {
  term: string;
  definition: string;
  /** Optional related terms to cross-reference */
  seeAlso?: string[];
  /** Optional lesson or tool to link to */
  learnMore?: { label: string; href: string };
};

export const glossaryTerms: GlossaryTerm[] = [
  // A
  {
    term: 'Adjacency (SUSI)',
    definition:
      'A SUSI grant category for students who live within 45 km of their college and study full-time. Adjacency students receive a lower maintenance grant than non-adjacent students, as they are assumed to be living at home.',
    seeAlso: ['Non-adjacency (SUSI)', 'SUSI grant'],
    learnMore: { label: 'SUSI grant module', href: '/lessons/susi' },
  },
  {
    term: 'Annual Percentage Rate (APR)',
    definition:
      "The true yearly cost of borrowing, expressed as a percentage. APR includes the interest rate and most fees, making it the best number to compare loans across lenders. In Ireland, lenders are legally required to disclose APR under Central Bank regulations.",
    seeAlso: ['Interest rate', 'Total cost of credit'],
    learnMore: { label: 'Loans module', href: '/lessons/loans' },
  },
  {
    term: 'Auto-enrolment',
    definition:
      "Ireland's automatic workplace pension scheme, launching in 2025. Eligible employees are automatically enrolled and contribute a percentage of salary, matched by their employer, with a state top-up. Contributions increase every three years across four phases.",
    seeAlso: ['Pension', 'PRSA'],
    learnMore: { label: 'Auto-enrolment module', href: '/lessons/auto-enrolment' },
  },
  // B
  {
    term: 'Benefit-in-Kind (BIK)',
    definition:
      'Non-cash benefits provided by an employer — such as a company car, private health insurance, or a gym membership — that are taxable as income. The value of the benefit is added to your gross income for PAYE purposes.',
    seeAlso: ['PAYE', 'Gross income'],
  },
  {
    term: 'Budget (annual)',
    definition:
      "Ireland's annual financial statement, usually delivered by the Minister for Finance in October. The Budget sets income tax rates, credits, USC bands, and welfare rates for the following year. Punt's calculators are updated after each Budget.",
    seeAlso: ['PAYE', 'USC'],
  },
  // C
  {
    term: 'Capital Gains Tax (CGT)',
    definition:
      'A tax on profits made when you sell an asset — such as shares, property (other than your main home), or an investment trust — for more than you paid for it. In Ireland the CGT rate is 33%, with an annual exemption of €1,270.',
    seeAlso: ['Annual Percentage Rate (APR)', 'Exit tax (ETF)', 'Investment trust'],
    learnMore: { label: 'Investing module', href: '/lessons/investing' },
  },
  {
    term: 'Central Bank of Ireland',
    definition:
      "Ireland's financial regulator. The Central Bank sets mortgage lending rules (loan-to-income and loan-to-value limits), supervises banks and insurance companies, and protects consumers in financial markets.",
    seeAlso: ['Loan-to-income (LTI)', 'Loan-to-value (LTV)'],
  },
  {
    term: 'CCPC',
    definition:
      'The Competition and Consumer Protection Commission — the Irish body that enforces consumer law and publishes comparison tools for financial products, including loans, credit cards, and mortgages.',
  },
  {
    term: 'Credit rating',
    definition:
      "An assessment of how creditworthy you are — i.e., how likely a lender thinks you are to repay. In Ireland, the Central Credit Register (CCR) holds records of all loans over €500. There is no universal 'score' as in some other countries, but lenders check your repayment history.",
    seeAlso: ['Central Credit Register'],
  },
  {
    term: 'Central Credit Register (CCR)',
    definition:
      'A database run by the Central Bank of Ireland that holds records of all credit agreements above €500. Lenders check it when you apply for a loan or mortgage. You can request a free copy of your own record at centralcreditregister.ie.',
    seeAlso: ['Credit rating'],
  },
  // D
  {
    term: 'Deemed disposal',
    definition:
      'A rule that applies to UCITS ETFs in Ireland. Every 8 years, you are treated as if you sold and repurchased all your ETF units, even if you have not actually sold anything. You must pay 41% exit tax on the gain at that point, and your cost basis resets to the current market value.',
    seeAlso: ['Exit tax (ETF)', 'UCITS ETF'],
    learnMore: { label: 'ETF calculator', href: '/tools/etf-calculator' },
  },
  {
    term: 'Deposit (renting)',
    definition:
      'The upfront payment made to a landlord when starting a tenancy, typically one month\'s rent. The deposit must be returned when you leave, minus any legitimate deductions for damage beyond normal wear and tear. Disputes can be taken to the RTB.',
    seeAlso: ['RTB', 'Tenancy'],
    learnMore: { label: 'Renting module', href: '/lessons/rent' },
  },
  // E
  {
    term: 'Employer contribution (pension)',
    definition:
      "Money your employer adds to your pension pot on top of your own contributions. Under auto-enrolment, the employer matches your contribution euro for euro up to the phase limit. This is effectively part of your total pay package.",
    seeAlso: ['Auto-enrolment', 'Pension'],
  },
  {
    term: 'Exit tax (ETF)',
    definition:
      'The Irish tax rate applied to gains and income from UCITS ETFs, at 41%. It applies both when you actually sell your ETF units and at each 8-year deemed disposal event. Unlike CGT, there is no annual exemption.',
    seeAlso: ['Deemed disposal', 'UCITS ETF', 'Capital Gains Tax (CGT)'],
    learnMore: { label: 'ETF calculator', href: '/tools/etf-calculator' },
  },
  // F
  {
    term: 'Fixed-rate loan',
    definition:
      'A loan where the interest rate stays the same for the full term. Monthly repayments are predictable. Most personal loans in Ireland are fixed-rate. Compare with variable-rate mortgages, where the rate can change.',
    seeAlso: ['Annual Percentage Rate (APR)', 'Variable rate'],
  },
  {
    term: 'FiRe Up',
    definition:
      "A free online Financial Wellbeing course provided by MABS and Atlantic Technological University. It builds practical money management skills in under two hours and can be done at your own pace.",
    seeAlso: ['MABS'],
  },
  // G
  {
    term: 'Grant (SUSI)',
    definition:
      'A means-tested payment from SUSI (Student Universal Support Ireland) to help cover the costs of third-level education. Grants are split into maintenance grants (living costs) and fee grants (tuition). You must apply every year.',
    seeAlso: ['SUSI grant', 'Reckonable income'],
    learnMore: { label: 'SUSI grant module', href: '/lessons/susi' },
  },
  {
    term: 'Gross income',
    definition:
      'Your total income before any tax or deductions. On a payslip this is what the job pays before PAYE, USC, and PRSI are subtracted. It is the figure used to calculate your tax bill.',
    seeAlso: ['Net income', 'PAYE'],
    learnMore: { label: 'Payslip module', href: '/lessons/payslip' },
  },
  // H
  {
    term: 'Help to Buy (HTB)',
    definition:
      'A Revenue scheme that gives first-time buyers a refund of income tax paid over the previous four years (up to €30,000) to put towards a deposit on a new-build home. The property must be newly built and cost no more than €500,000.',
    seeAlso: ['Mortgage', 'Loan-to-value (LTV)'],
    learnMore: { label: 'Help to Buy module', href: '/lessons/help-to-buy' },
  },
  // I
  {
    term: 'Income tax',
    definition:
      'See PAYE. Income tax in Ireland is collected through the Pay As You Earn system for employees.',
    seeAlso: ['PAYE'],
  },
  {
    term: 'Interest rate',
    definition:
      'The percentage of a loan amount charged by a lender as the cost of borrowing, expressed per year. Different from APR — the interest rate does not always include all fees. Always compare loans using APR.',
    seeAlso: ['Annual Percentage Rate (APR)'],
  },
  {
    term: 'Investment trust',
    definition:
      'A company listed on a stock exchange that invests in other assets on behalf of shareholders. In Ireland, investment trust shares are taxed under CGT at 33% when sold — unlike UCITS ETFs, which face the 41% exit tax and deemed disposal rules.',
    seeAlso: ['Capital Gains Tax (CGT)', 'UCITS ETF', 'Exit tax (ETF)'],
    learnMore: { label: 'ETF calculator', href: '/tools/etf-calculator' },
  },
  // L
  {
    term: 'Landlord',
    definition:
      'A person or company that rents out residential property. In Ireland, landlords must register with the RTB and comply with minimum notice periods, rent increase rules, and property standards. Most landlord-tenant disputes are handled by the RTB.',
    seeAlso: ['RTB', 'Rent Pressure Zone (RPZ)', 'Tenancy'],
  },
  {
    term: 'Loan-to-income (LTI)',
    definition:
      "A Central Bank rule that limits mortgage borrowing relative to your income. For first-time buyers, the limit is 4 times gross annual income. Second and subsequent buyers are limited to 3.5 times income.",
    seeAlso: ['Loan-to-value (LTV)', 'Mortgage'],
    learnMore: { label: 'Mortgage calculator', href: '/tools/mortgage-calculator' },
  },
  {
    term: 'Loan-to-value (LTV)',
    definition:
      'The ratio of your mortgage to the property value. A 90% LTV means you borrowed 90% and put in a 10% deposit. Central Bank rules cap LTV at 90% for first-time buyers and 80% for second-time buyers.',
    seeAlso: ['Loan-to-income (LTI)', 'Mortgage'],
  },
  // M
  {
    term: 'MABS',
    definition:
      "The Money Advice and Budgeting Service — a free, independent, government-funded service that helps people manage money and deal with debt. MABS operates nationwide and online. Call 0818 07 2000 or visit mabs.ie.",
    seeAlso: ['FiRe Up'],
  },
  {
    term: 'Marginal rate',
    definition:
      'The tax rate applied to your next euro of income. In Ireland, the standard rate is 20% and the higher rate is 40%. Your marginal rate is important for calculating the true saving from pension contributions, which receive relief at marginal rate.',
    seeAlso: ['PAYE', 'Pension'],
  },
  {
    term: 'Means test',
    definition:
      'An assessment of a household\'s income and sometimes assets to determine eligibility for a grant or benefit. SUSI grants are means-tested using "reckonable income." Some social welfare payments are also means-tested.',
    seeAlso: ['SUSI grant', 'Reckonable income'],
  },
  {
    term: 'Moneylender',
    definition:
      'A lender licensed under the Consumer Credit Act to provide short-term, high-cost loans. In Ireland, licensed moneylenders can charge very high APRs (sometimes over 100%). Always compare with credit unions and banks first.',
    seeAlso: ['Annual Percentage Rate (APR)', 'Credit union'],
    learnMore: { label: 'Loans module', href: '/lessons/loans' },
  },
  {
    term: 'Mortgage',
    definition:
      'A long-term loan used to buy property, where the property itself is used as security. If you cannot repay, the lender can repossess the property. Mortgages in Ireland typically run for 25–35 years.',
    seeAlso: ['Loan-to-income (LTI)', 'Loan-to-value (LTV)', 'Help to Buy (HTB)'],
    learnMore: { label: 'Mortgage calculator', href: '/tools/mortgage-calculator' },
  },
  // N
  {
    term: 'Net income',
    definition:
      'Your take-home pay after all deductions (PAYE, USC, PRSI) have been subtracted from gross income. This is what actually lands in your bank account.',
    seeAlso: ['Gross income', 'PAYE', 'USC', 'PRSI'],
    learnMore: { label: 'Take-home calculator', href: '/calculator' },
  },
  {
    term: 'Non-adjacency (SUSI)',
    definition:
      'A SUSI grant category for students who live more than 45 km from their college, or who live within 45 km but rent independently near college. Non-adjacent students receive a higher maintenance grant than adjacent students.',
    seeAlso: ['Adjacency (SUSI)', 'SUSI grant'],
  },
  {
    term: 'Notice period (tenancy)',
    definition:
      'The amount of time either a landlord or tenant must give before ending a tenancy. Notice periods in Ireland depend on how long you have lived in the property. Landlords have stricter obligations than tenants under the Residential Tenancies Act.',
    seeAlso: ['RTB', 'Tenancy'],
    learnMore: { label: 'Renting module', href: '/lessons/rent' },
  },
  // O
  {
    term: 'Overpayment (mortgage)',
    definition:
      'Paying more than the required monthly mortgage repayment. Overpayments reduce the outstanding principal faster and can save significant interest over the life of the loan. Some lenders allow unlimited overpayments; others cap them.',
    seeAlso: ['Mortgage'],
  },
  // P
  {
    term: 'PAYE',
    definition:
      "Pay As You Earn — Ireland's income tax system for employees. Your employer deducts income tax from your pay each month and sends it to Revenue. The standard rate is 20% on the first €44,000 of income (2026 rate), and 40% above that. Tax credits reduce your bill.",
    seeAlso: ['Tax credits', 'USC', 'Gross income', 'Marginal rate'],
    learnMore: { label: 'Payslip module', href: '/lessons/payslip' },
  },
  {
    term: 'Pension',
    definition:
      'A long-term savings arrangement specifically for retirement. In Ireland, contributions to approved pensions receive income tax (PAYE) relief at your marginal rate — meaning the government effectively subsidises your saving. USC and PRSI still apply on your gross salary.',
    seeAlso: ['Auto-enrolment', 'PRSA', 'Marginal rate'],
    learnMore: { label: 'Auto-enrolment module', href: '/lessons/auto-enrolment' },
  },
  {
    term: 'PRSA',
    definition:
      'Personal Retirement Savings Account — a portable, flexible pension arrangement available from regulated providers in Ireland. You own the PRSA directly (unlike an occupational pension, which is employer-specific). Contributions receive PAYE relief at marginal rate.',
    seeAlso: ['Pension', 'Auto-enrolment'],
  },
  {
    term: 'PRSI',
    definition:
      'Pay Related Social Insurance — a contribution deducted from your wages that funds social welfare benefits including the State Pension, Jobseeker\'s Benefit, and Maternity Benefit. The Class A rate (most employees) is 4.1% of gross salary with no upper ceiling.',
    seeAlso: ['PAYE', 'USC', 'State Pension'],
    learnMore: { label: 'Payslip module', href: '/lessons/payslip' },
  },
  // R
  {
    term: 'Reckonable income (SUSI)',
    definition:
      "The income figure SUSI uses to assess grant eligibility. It includes most income from the previous tax year — employment, self-employment, rental, and some social welfare payments. Some income types (such as certain disability payments) are excluded.",
    seeAlso: ['SUSI grant', 'Means test'],
  },
  {
    term: 'Rent Pressure Zone (RPZ)',
    definition:
      'A designated area in Ireland where rent increases are capped. In most RPZs, landlords cannot raise rent by more than the rate of inflation or 2% per year (whichever is lower). Most major urban areas are RPZs.',
    seeAlso: ['RTB', 'Landlord', 'Tenancy'],
    learnMore: { label: 'Renting module', href: '/lessons/rent' },
  },
  {
    term: 'Revenue (Revenue Commissioners)',
    definition:
      "Ireland's tax authority, responsible for collecting income tax, VAT, CGT, stamp duty, and other taxes. Revenue.ie is the primary source for all Irish tax rates, reliefs, and deadlines.",
    seeAlso: ['PAYE', 'CGT', 'Help to Buy (HTB)'],
  },
  {
    term: 'RTB',
    definition:
      'The Residential Tenancies Board — the Irish body that registers tenancies, mediates landlord-tenant disputes, and enforces rent regulations including Rent Pressure Zone rules. Tenants can take complaints to the RTB for free.',
    seeAlso: ['Rent Pressure Zone (RPZ)', 'Tenancy', 'Landlord'],
    learnMore: { label: 'Renting module', href: '/lessons/rent' },
  },
  // S
  {
    term: 'Standard rate cut-off point',
    definition:
      'The income level at which you switch from the 20% PAYE rate to the 40% rate. In 2026, the cut-off is €44,000 for a single person. Income above this threshold is taxed at 40%.',
    seeAlso: ['PAYE', 'Marginal rate'],
  },
  {
    term: 'State Pension',
    definition:
      "A weekly payment from the Irish government to people who have reached pension age (currently 66) and have made enough PRSI contributions over their working life. The full State Pension (Contributory) in 2026 is approximately €277 per week.",
    seeAlso: ['PRSI', 'Pension'],
  },
  {
    term: 'SUSI grant',
    definition:
      'A means-tested financial grant from Student Universal Support Ireland (SUSI) for eligible students in approved full-time and part-time courses. SUSI grants are split into maintenance (living costs) and fee grants (tuition). Applications open each spring.',
    seeAlso: ['Adjacency (SUSI)', 'Non-adjacency (SUSI)', 'Reckonable income (SUSI)'],
    learnMore: { label: 'SUSI module', href: '/lessons/susi' },
  },
  // T
  {
    term: 'Tax credits',
    definition:
      'Fixed amounts that reduce your income tax bill euro for euro. Every employee receives a personal credit (€1,875) and a PAYE credit (€1,875), totalling €3,750. Additional credits are available for single parents, renters, and others. Credits are more valuable than deductions.',
    seeAlso: ['PAYE', 'Gross income'],
    learnMore: { label: 'Payslip module', href: '/lessons/payslip' },
  },
  {
    term: 'Tax relief (pension)',
    definition:
      'The reduction in your income tax bill from making pension contributions. Relief is given at your marginal rate — so a 40% taxpayer who contributes €1,000 effectively costs them only €600. USC and PRSI are not relieved on pension contributions.',
    seeAlso: ['Pension', 'Marginal rate', 'PRSA'],
    learnMore: { label: 'Take-home calculator', href: '/calculator' },
  },
  {
    term: 'Tenancy',
    definition:
      'A legal agreement giving a tenant the right to occupy a property in exchange for rent. Tenancies in Ireland are governed by the Residential Tenancies Acts. After 6 months, a tenant gains security of tenure — the landlord can only end the tenancy on specific grounds.',
    seeAlso: ['RTB', 'Landlord', 'Notice period (tenancy)'],
    learnMore: { label: 'Renting module', href: '/lessons/rent' },
  },
  {
    term: 'Total cost of credit',
    definition:
      'The total amount you pay in interest and fees over the life of a loan, above and beyond the amount you borrowed. On a €10,000 personal loan at 7% APR over 5 years, the total cost of credit is approximately €1,878.',
    seeAlso: ['Annual Percentage Rate (APR)', 'Interest rate'],
    learnMore: { label: 'Loan calculator', href: '/tools/loan-calculator' },
  },
  // U
  {
    term: 'UCITS ETF',
    definition:
      'An exchange-traded fund structured under the EU\'s UCITS (Undertakings for Collective Investment in Transferable Securities) framework. Most mainstream index funds sold to Irish investors (Vanguard, iShares, SPDR) are UCITS ETFs. In Ireland, they are taxed at 41% exit tax with an 8-year deemed disposal rule — not at the 33% CGT rate.',
    seeAlso: ['Exit tax (ETF)', 'Deemed disposal', 'Investment trust'],
    learnMore: { label: 'ETF calculator', href: '/tools/etf-calculator' },
  },
  {
    term: 'USC',
    definition:
      'Universal Social Charge — a tax on income paid by most workers in Ireland, on top of PAYE. USC rates in 2026 range from 0.5% to 8% across income bands. If you earn €13,000 or less, you pay no USC. USC is calculated on gross salary, including pension contributions.',
    seeAlso: ['PAYE', 'PRSI'],
    learnMore: { label: 'Payslip module', href: '/lessons/payslip' },
  },
  // V
  {
    term: 'Variable rate',
    definition:
      'A loan or mortgage interest rate that can change over time, typically linked to ECB rates or the lender\'s standard variable rate (SVR). Monthly repayments can go up or down. Compare with fixed-rate loans where payments are predictable.',
    seeAlso: ['Fixed-rate loan', 'Mortgage'],
  },
  // W
  {
    term: 'Wear and tear',
    definition:
      'The natural deterioration of a property through normal use over time — scuffed walls, worn carpets, faded paint. Landlords cannot deduct the cost of wear and tear from a tenant\'s deposit. Only damage beyond normal use (e.g., broken fixtures, large stains) is deductible.',
    seeAlso: ['Deposit (renting)', 'RTB'],
  },
  // Y
  {
    term: 'Year of assessment',
    definition:
      'The calendar year used by Revenue for tax purposes in Ireland (January 1 to December 31). Your tax credits, USC bands, and PAYE rates are determined by the year of assessment. SUSI uses the previous year of assessment to calculate reckonable income.',
    seeAlso: ['PAYE', 'Reckonable income (SUSI)'],
  },
];

/** All unique first letters of terms in alphabetical order. */
export function getGlossaryLetters(): string[] {
  const letters = new Set(
    glossaryTerms.map((t) => t.term[0].toUpperCase()),
  );
  return Array.from(letters).sort();
}

/** Group terms by first letter. */
export function groupByLetter(): Map<string, GlossaryTerm[]> {
  const map = new Map<string, GlossaryTerm[]>();
  for (const term of glossaryTerms) {
    const letter = term.term[0].toUpperCase();
    const group = map.get(letter) ?? [];
    group.push(term);
    map.set(letter, group);
  }
  return map;
}
