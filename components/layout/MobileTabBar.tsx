'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Calculator, TrendingUp, Settings } from 'lucide-react';

const tabs = [
  { href: '/home', label: 'Home', icon: Home },
  { href: '/lessons', label: 'Lessons', icon: BookOpen },
  { href: '/calculator', label: 'Calculator', icon: Calculator },
  { href: '/tools/loan-calculator', label: 'Tools', icon: TrendingUp },
  { href: '/settings', label: 'Settings', icon: Settings },
] as const;

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        backgroundColor: 'var(--bg)',
        borderTop: '1px solid var(--rule)',
        height: 'calc(64px + env(safe-area-inset-bottom))',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
      aria-label="Mobile navigation"
    >
      {tabs.map(({ href, label, icon: Icon }) => {
        const active =
          href === '/home'
            ? pathname === '/home'
            : pathname === href || pathname.startsWith(href + '/');

        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center justify-center gap-1 flex-1 focus-visible:outline-none"
            style={{
              color: active ? 'var(--accent)' : 'var(--ink-2)',
              textDecoration: 'none',
            }}
          >
            <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
            <span className="font-sans text-[10px] font-medium leading-none">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
