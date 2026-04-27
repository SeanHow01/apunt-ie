'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calculator, TrendingUp, Flame, Settings, CalendarDays } from 'lucide-react';

const topNavItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/year', label: 'Your year', icon: CalendarDays },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
] as const;

const toolChildren = [
  { href: '/tools/loan-calculator', label: 'Loan calculator' },
  { href: '/tools/loan-comparison', label: 'Loan comparison' },
  { href: '/tools/mortgage-calculator', label: 'Mortgage calculator' },
  { href: '/tools/etf-calculator', label: 'ETF calculator' },
  { href: '/tools/buy-vs-rent', label: 'Buy vs rent' },
  { href: '/tools/susi-estimator', label: 'SUSI estimator' },
] as const;

const bottomNavItems = [
  { href: '/fireup', label: 'FiRe Up', icon: Flame },
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const toolsActive = pathname.startsWith('/tools');

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
              fontFamily: 'Instrument Serif, serif',
              letterSpacing: '-0.02em',
            }}
          >
            Punt
          </span>
        </Link>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Main navigation">
        {/* Top items: Home, Lessons, Calculator */}
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
          {/* Parent — link to loan-calculator when not in tools section */}
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

          {/* Sub-items — expand when anywhere under /tools */}
          {toolsActive && (
            <div className="mt-0.5 flex flex-col gap-0.5 pl-6">
              {toolChildren.map(({ href, label }) => {
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
          )}
        </div>

        {/* Bottom items: FiRe Up, Settings */}
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

      {/* Bottom indicator */}
      <div className="px-6 py-5" style={{ borderTop: '1px solid var(--rule)' }}>
        <span className="font-sans text-xs" style={{ color: 'var(--ink)' }}>
          Vol. I
        </span>
      </div>
    </aside>
  );
}
