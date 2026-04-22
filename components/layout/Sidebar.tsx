'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calculator, TrendingUp, Flame, Settings } from 'lucide-react';

const navItems = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
  { href: '/tools/loan-calculator', label: 'Loan tools', icon: TrendingUp },
  { href: '/fireup', label: 'FiRe Up', icon: Flame },
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

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
        {navItems.map(({ href, label, icon: Icon }) => {
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
      </nav>

      {/* Bottom indicator */}
      <div className="px-6 py-5" style={{ borderTop: '1px solid var(--rule)' }}>
        <span className="font-sans text-xs" style={{ color: 'var(--ink-2)' }}>
          Vol. I
        </span>
      </div>
    </aside>
  );
}
