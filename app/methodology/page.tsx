import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Methodology — Punt',
  description: 'How Punt calculates take-home pay, pensions, loans, mortgages, and ETF tax.',
};

type Section = {
  title: string;
  intro: string;
  items: Array<{ label: string; detail: string }>;
  caveats?: string[];
};

const sections: Section[] = [
  {
    title: 'Take-home pay calculator',
    intro:
      'The take-home calculator models a single PAYE employee in Ireland on Budget 2026 rates with standard tax credits.',
    items: [
      {
        label: 'PAYE',
        detail:
          '20% on the first €44,000 of gross income, 40% above that. Standard credits of €4,000 are applied (personal credit €1,875 + PAYE credit €1,875 + PRSI credit €250). The credit reduces the gross tax bill euro for euro.',
      },
      {
        label: 'USC (Universal Social Charge)',
        detail:
          '0.5% on the first €12,012, 2% from €12,013 to €27,382, 4% from €27,383 to €70,044, and 8% above that. Incomes of €13,000 or less are exempt entirely.',
      },
      {
        label: 'PRSI',
        detail: '4.1% on gross earnings. Class A PRSI (the standard employee class) with no upper ceiling.',
      },
      {
        label: 'Net take-home',
        detail: 'Gross minus PAYE (after credits), USC, and PRSI.',
      },
    ],
    caveats: [
      'Assumes a single job (one employer). Multiple employments are taxed differently.',
      'Does not account for benefit-in-kind (BIK), company cars, or non-standard credits.',
      'USC surcharge (8%) for non-PAYE income above €100,000 is not modelled.',
      'Figures are illustrative. Always verify with Revenue.ie or a tax professional.',
    ],
  },
  {
    title: 'Pension contribution calculator',
    intro:
      'Pension contributions reduce your income for PAYE purposes but not for USC or PRSI.',
    items: [
      {
        label: 'PAYE relief',
        detail:
          "Employee pension contributions are deducted from gross income before PAYE is calculated. The saving is the difference in PAYE with and without the contribution — effectively your marginal rate (20% or 40%) on the amount contributed.",
      },
      {
        label: 'USC and PRSI',
        detail:
          'USC and PRSI remain calculated on full gross salary regardless of pension contribution. This matches the Irish Revenue treatment of occupational pensions and PRSAs.',
      },
      {
        label: 'Age-banded relief limits',
        detail:
          'Revenue caps the amount that qualifies for relief as a percentage of net relevant earnings: 15% (under 30), 20% (30–39), 25% (40–49), 30% (50–54), 35% (55–59), 40% (60 and over). There is also an earnings ceiling of €115,000.',
      },
      {
        label: 'Auto-enrolment rates',
        detail:
          'Phase 1 (2025–27): employee 1.5%, employer 1.5%, state 0.5%. Phase 2 (2028–29): 3%/3%/1%. Phase 3 (2030–31): 4.5%/4.5%/1.5%. Phase 4 (2033+): 6%/6%/2%.',
      },
    ],
    caveats: [
      'True marginal relief depends on whether contributions cross the 20%/40% threshold. The calculator uses the actual PAYE difference, not an assumed rate.',
      'Employer contributions are excluded from the employee relief cap but may have separate tax implications not modelled here.',
    ],
  },
  {
    title: 'Loan calculator',
    intro:
      'Monthly repayments and total cost of credit are calculated using the standard annuity formula.',
    items: [
      {
        label: 'Monthly repayment',
        detail:
          'P × r / (1 − (1 + r)^−n), where P is the principal, r is the monthly interest rate (APR / 12 / 100), and n is the number of monthly repayments.',
      },
      {
        label: 'Total cost of credit',
        detail: 'Total repayments minus the original principal.',
      },
      {
        label: 'APR',
        detail:
          'Annual Percentage Rate as defined by the Central Bank of Ireland. The calculator uses APR directly — it does not model origination fees or other charges that some lenders include.',
      },
    ],
    caveats: [
      'Assumes fixed-rate repayment for the full term with no overpayments, early repayment, or default.',
      'Variable-rate loans will differ from this estimate.',
      'Does not include PPI, account fees, or other ancillary costs.',
    ],
  },
  {
    title: 'Mortgage calculator',
    intro:
      'Monthly repayments are calculated on a standard principal-and-interest (annuity) basis.',
    items: [
      {
        label: 'Monthly repayment',
        detail: 'Same annuity formula as the loan calculator, applied to the mortgage amount and term.',
      },
      {
        label: 'LTV and LTI limits',
        detail:
          'The Central Bank of Ireland limits first-time buyers to a loan-to-income ratio of 4× gross income and a loan-to-value of 90% (10% deposit). Second-time buyers: 3.5× LTI, 80% LTV. The calculator applies these to indicate maximum borrowing power.',
      },
    ],
    caveats: [
      'Does not model interest-only periods, tracker rates, or split mortgages.',
      'Stress-testing requirements and lender-specific criteria vary.',
      'Always get a formal approval in principle from your lender.',
    ],
  },
];

export default function MethodologyPage() {
  return (
    <main style={{ maxWidth: '42rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

      <nav style={{ marginBottom: '2rem' }}>
        <Link
          href="/"
          style={{ fontSize: '0.8125rem', color: '#666', textDecoration: 'none' }}
        >
          &larr; Punt
        </Link>
      </nav>

      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 2.75rem)',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: '0.75rem',
          color: '#1A1A1A',
        }}
      >
        Methodology
      </h1>

      <p
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '1rem',
          lineHeight: 1.7,
          color: '#555',
          marginBottom: '2.5rem',
        }}
      >
        How Punt&rsquo;s calculators and content work — assumptions, formulas, and
        what we don&rsquo;t model.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {sections.map((section, idx) => (
          <section key={idx}>
            <h2
              style={{
                fontSize: '1.5rem',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
                color: '#1A1A1A',
                marginBottom: '0.5rem',
              }}
            >
              {section.title}
            </h2>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                lineHeight: 1.65,
                color: '#555',
                marginBottom: '1.25rem',
              }}
            >
              {section.intro}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {section.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    paddingLeft: '1rem',
                    borderLeft: '2px solid #E8E8E8',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#1A1A1A',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {item.label}
                  </p>
                  <p
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.9375rem',
                      lineHeight: 1.65,
                      color: '#444',
                      margin: 0,
                    }}
                  >
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            {section.caveats && section.caveats.length > 0 && (
              <div
                style={{
                  marginTop: '1.25rem',
                  padding: '0.875rem 1rem',
                  backgroundColor: '#F8F8F8',
                  borderRadius: '4px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: '#666',
                    marginBottom: '0.5rem',
                  }}
                >
                  Limitations
                </p>
                <ul
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    color: '#555',
                    paddingLeft: '1.125rem',
                    margin: 0,
                  }}
                >
                  {section.caveats.map((caveat, i) => (
                    <li key={i} style={{ marginBottom: '0.25rem' }}>
                      {caveat}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ))}
      </div>

      <div
        style={{
          marginTop: '3rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #E8E8E8',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9375rem',
            lineHeight: 1.65,
            color: '#666',
            fontStyle: 'italic',
            marginBottom: '0.75rem',
          }}
        >
          All calculations are illustrative. Punt is not a tax or financial adviser.
          For personalised advice, contact{' '}
          <a
            href="https://www.mabs.ie"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#E94F37' }}
          >
            MABS
          </a>{' '}
          or an authorised financial adviser.
        </p>
        <Link
          href="/sources"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9375rem',
            color: '#E94F37',
            textDecoration: 'none',
          }}
        >
          See our sources &rarr;
        </Link>
      </div>

    </main>
  );
}
