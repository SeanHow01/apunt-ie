'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Library, Newspaper, Settings, Calculator } from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon?: React.ElementType;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: 'LEARN',
    items: [
      { href: '/lessons', label: 'Lessons', icon: BookOpen },
      { href: '/glossary', label: 'Glossary', icon: Library },
      { href: '/methodology', label: 'Methodology' },
    ],
  },
  {
    label: 'TOOLS',
    items: [
      { href: '/calculator', label: 'Take-home pay', icon: Calculator },
      { href: '/tools/loan-calculator', label: 'Loan calculator' },
      { href: '/tools/mortgage-calculator', label: 'Mortgage' },
      { href: '/tools/buy-vs-rent', label: 'Buy vs rent' },
      { href: '/tools/etf-calculator', label: 'ETF calculator' },
      { href: '/tools/susi-estimator', label: 'SUSI estimator' },
    ],
  },
  {
    label: 'READ',
    items: [
      { href: '/news', label: 'News', icon: Newspaper },
      { href: '/sources', label: 'Sources' },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { href: '/settings', label: 'Settings', icon: Settings },
      { href: '/fireup', label: 'FiRe Up' },
    ],
  },
];

function isActive(href: string, pathname: string): boolean {
  if (href === '/home') return pathname === '/home';
  return pathname === href || pathname.startsWith(href + '/');
}

export function Sidebar() {
  const pathname = usePathname();

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

      {/* Nav sections */}
      <nav className="flex-1 py-3 overflow-y-auto" aria-label="Main navigation">
        {navSections.map((section) => (
          <div key={section.label} className="mb-2">
            {/* Section eyebrow */}
            <p
              className="font-mono uppercase"
              style={{
                fontSize: '0.5625rem',
                letterSpacing: '0.18em',
                color: 'var(--ink-3)',
                padding: '0.75rem 0.75rem 0.25rem',
                margin: 0,
              }}
            >
              {section.label}
            </p>

            {/* Section items */}
            <div className="flex flex-col gap-0.5 px-2">
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = isActive(href, pathname);
                return (
                  <Link
                    key={href}
                    href={href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.4375rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-sans)',
                      backgroundColor: active ? 'var(--paper)' : 'transparent',
                      color: active ? 'var(--ink)' : 'var(--ink-2)',
                      borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                    }}
                  >
                    {Icon && <Icon size={14} strokeWidth={1.5} aria-hidden="true" />}
                    <span>{label}</span>
                  </Link>
                );
              })}

              {/* See all tools link — only shown under TOOLS section */}
              {section.label === 'TOOLS' && (
                <Link
                  href="/tools"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.4375rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    textDecoration: 'none',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--accent)',
                    borderLeft: '2px solid transparent',
                  }}
                >
                  See all tools →
                </Link>
              )}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
