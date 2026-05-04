import Link from 'next/link';

type Tool = {
  href: string;
  title: string;
  description: string;
};

type Category = {
  label: string;
  tools: Tool[];
};

const categories: Category[] = [
  {
    label: 'INCOME & PAY',
    tools: [
      {
        href: '/calculator',
        title: 'Take-home pay',
        description: 'See your exact net pay after PAYE, USC, and PRSI.',
      },
      {
        href: '/tools/payslip-checker',
        title: 'Payslip checker',
        description: 'Verify your deductions against what Revenue expects.',
      },
      {
        href: '/tools/pay-rise',
        title: 'Pay rise impact',
        description: 'See how a salary increase changes your take-home, including tax band crossings.',
      },
      {
        href: '/tools/side-hustle',
        title: 'Side hustle tax',
        description: 'Income tax and PRSI on self-employed earnings.',
      },
      {
        href: '/tools/emergency-tax',
        title: 'Emergency tax',
        description: 'Find out if you\'re on emergency tax and the steps to fix it.',
      },
    ],
  },
  {
    label: 'BORROWING',
    tools: [
      {
        href: '/tools/loan-calculator',
        title: 'Loan calculator',
        description: 'Compare APR, total cost, and term across providers.',
      },
      {
        href: '/tools/loan-comparison',
        title: 'Loan comparison',
        description: 'Compare two loans side-by-side to find the cheaper option.',
      },
      {
        href: '/tools/mortgage-calculator',
        title: 'Mortgage calculator',
        description: 'Estimate repayments and stress-test at higher rates.',
      },
    ],
  },
  {
    label: 'SAVING & INVESTING',
    tools: [
      {
        href: '/tools/etf-calculator',
        title: 'ETF vs investment trust',
        description: 'Model the 8-year deemed disposal and exit tax on Irish-domiciled funds.',
      },
      {
        href: '/tools/salary-sacrifice',
        title: 'Salary sacrifice',
        description: 'Bike to Work and Travel Pass savings after tax.',
      },
      {
        href: '/tools/susi-estimator',
        title: 'SUSI estimator',
        description: 'Estimate your student grant based on reckonable income.',
      },
      {
        href: '/tools/refund-checker',
        title: 'Tax refund checker',
        description: 'Find out which tax years you may be owed a refund from Revenue.',
      },
    ],
  },
  {
    label: 'HOUSING',
    tools: [
      {
        href: '/tools/buy-vs-rent',
        title: 'Buy vs rent',
        description: 'Break-even analysis for Irish property prices.',
      },
      {
        href: '/tools/rpz-checker',
        title: 'RPZ checker',
        description: 'Check if your area is a Rent Pressure Zone and the maximum legal rent increase.',
      },
    ],
  },
];

export default function ToolsIndexPage() {
  return (
    <main id="main-content" style={{ maxWidth: '48rem', margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

      {/* Header */}
      <p
        className="font-mono uppercase tracking-widest"
        style={{ fontSize: '0.6875rem', color: 'var(--ink-3)', marginBottom: '0.75rem' }}
      >
        TOOLS · ALL CALCULATORS
      </p>

      <h1
        className="font-display italic"
        style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: 'var(--ink)',
          marginBottom: '0.5rem',
          marginTop: 0,
        }}
      >
        Free calculators for Irish workers.
      </h1>

      <p
        className="font-sans"
        style={{
          fontSize: 'var(--step-lead)',
          lineHeight: 1.45,
          color: 'var(--ink-2)',
          marginTop: '0.75rem',
          marginBottom: '3rem',
        }}
      >
        Built for the Irish tax system. No sign-up, no ads.
      </p>

      {/* Category sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {categories.map((cat) => (
          <section key={cat.label} aria-labelledby={`cat-${cat.label}`}>
            <p
              id={`cat-${cat.label}`}
              className="font-mono uppercase"
              style={{
                fontSize: '0.625rem',
                letterSpacing: '0.18em',
                color: 'var(--ink-3)',
                marginBottom: '0.875rem',
                marginTop: 0,
              }}
            >
              {cat.label}
            </p>

            <div
              style={{
                border: '1px solid var(--rule)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: 'var(--paper)',
              }}
            >
              {cat.tools.map((tool, i) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="hover:bg-[var(--bg)] transition-colors duration-150"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    textDecoration: 'none',
                    borderTop: i > 0 ? '1px solid var(--rule)' : 'none',
                  }}
                >
                  <div>
                    <p
                      className="font-display"
                      style={{
                        fontSize: '1.0625rem',
                        lineHeight: 1.3,
                        color: 'var(--ink)',
                        margin: 0,
                        marginBottom: '0.125rem',
                      }}
                    >
                      {tool.title}
                    </p>
                    <p
                      className="font-sans"
                      style={{
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        color: 'var(--ink-2)',
                        margin: 0,
                      }}
                    >
                      {tool.description}
                    </p>
                  </div>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '1rem',
                      color: 'var(--accent)',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
