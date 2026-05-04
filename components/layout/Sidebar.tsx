'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calculator, TrendingUp, Settings, CalendarDays, Calendar } from 'lucide-react';

const topNavItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/year', label: 'Your year', icon: CalendarDays },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
] as const;

type ToolGroup = {
  groupLabel: string;
  items: readonly { href: string; label: string }[];
};

const toolGroups: ToolGroup[] = [
  {
    groupLabel: 'Calculators',
    items: [
      { href: '/calculator', label: 'Take-home pay' },
      { href: '/tools/loan-calculator', label: 'Loan calculator' },
      { href: '/tools/loan-comparison', label: 'Loan comparison' },
      { href: '/tools/mortgage-calculator', label: 'Mortgage calculator' },
      { href: '/tools/etf-calculator', label: 'ETF calculator' },
      { href: '/tools/buy-vs-rent', label: 'Buy vs rent' },
      { href: '/tools/susi-estimator', label: 'SUSI estimator' },
      { href: '/tools/pay-rise', label: 'Pay rise' },
      { href: '/tools/salary-sacrifice', label: 'Salary sacrifice' },
    ],
  },
  {
    groupLabel: 'Diagnostics',
    items: [
      { href: '/tools/emergency-tax', label: 'Emergency tax' },
      { href: '/tools/rpz-checker', label: 'RPZ checker' },
      { href: '/tools/payslip-checker', label: 'Payslip checker' },
      { href: '/tools/side-hustle', label: 'Side hustle tax' },
      { href: '/tools/refund-checker', label: 'Refund checker' },
    ],
  },
];

const bottomNavItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const toolsActive = pathname.startsWith('/tools') || pathname === '/calculator';

  return (
    <aside
      className="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 z-40"
      style={{
        backgroundColor: 'var(--bg)',
        borderRight: '1px solid var(--rule)',
      }}
    >
      {/* Logo */}
      <div className="px-6 py-6" style={{ borderBottom: '1px solid var(--rule)' }}>
        <Link href="/home" className="no-underline focus-visible:outline-none">
          <span
            className="font-display italic text-2xl"
            style={{
              color: 'var(--accent)',
              letterSpacing: '-0.02em',
            }}
          >
            Punt
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto" aria-label="Main navigation">
        {/* Top items */}
        {topNavItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/home'
              ? pathname === '/home'
              : pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 transition-colors"
              style={{
                backgroundColor: active ? 'var(--surface)' : 'transparent',
                color: active ? 'var(--ink)' : 'var(--ink-2)',
                borderRadius: '2px',
                textDecoration: 'none',
              }}
            >
              <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
              <span className="font-sans text-sm font-medium">{label}</span>
            </Link>
          );
        })}

        {/* Tools group */}
        <div>
          <Link
            href="/tools/loan-calculator"
            className="flex items-center gap-3 px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 transition-colors"
            style={{
              color: toolsActive ? 'var(--ink)' : 'var(--ink-2)',
              backgroundColor: toolsActive ? 'var(--surface)' : 'transparent',
              borderRadius: '2px',
              textDecoration: 'none',
            }}
          >
            <TrendingUp size={15} strokeWidth={1.5} aria-hidden="true" />
            <span className="font-sans text-sm font-medium">Tools</span>
          </Link>

          {/* Sub-items — grouped, expand when under /tools */}
          {toolsActive && (
            <div className="mt-0.5 pl-6">
              {toolGroups.map((group) => (
                <div key={group.groupLabel} className="mb-2">
                  {/* Group label */}
                  <p
                    className="font-sans px-3 pt-2 pb-1"
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--ink-2)',
                      opacity: 0.6,
                    }}
                  >
                    {group.groupLabel}
                  </p>
                  {/* Group items */}
                  <div className="flex flex-col gap-0.5">
                    {group.items.map(({ href, label }) => {
                      const active = pathname === href || pathname.startsWith(href + '/');
                      return (
                        <Link
                          key={href}
                          href={href}
                          className="flex items-center px-3 py-2 focus-visible:outline-none focus-visible:ring-2 transition-colors"
                          style={{
                            backgroundColor: active ? 'var(--surface)' : 'transparent',
                            color: active ? 'var(--ink)' : 'var(--ink-2)',
                            borderRadius: '2px',
                            textDecoration: 'none',
                          }}
                        >
                          <span className="font-sans text-sm">{label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        {bottomNavItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 focus-visible:outline-none focus-visible:ring-2 transition-colors"
              style={{
                backgroundColor: active ? 'var(--surface)' : 'transparent',
                color: active ? 'var(--ink)' : 'var(--ink-2)',
                borderRadius: '2px',
                textDecoration: 'none',
              }}
            >
              <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
              <span className="font-sans text-sm font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* FiRe Up footer link */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid var(--rule)' }}>
        <Link
          href="/fireup"
          className="font-sans block text-xs leading-snug focus-visible:outline-none"
          style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
        >
          FiRe Up — free financial wellbeing course
        </Link>
      </div>
    </aside>
  );
}
