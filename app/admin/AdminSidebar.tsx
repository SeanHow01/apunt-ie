'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/news', label: 'Articles', icon: FileText },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside
      className="hidden md:flex flex-col fixed top-0 left-0 h-full w-56 z-40"
      style={{ backgroundColor: 'var(--bg)', borderRight: '1px solid var(--rule)' }}
    >
      <div className="px-6 py-6" style={{ borderBottom: '1px solid var(--rule)' }}>
        <Link href="/admin" className="no-underline focus-visible:outline-none">
          <span
            className="font-sans text-sm font-semibold uppercase tracking-[0.2em]"
            style={{ color: 'var(--ink-2)' }}
          >
            Admin
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Admin navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 focus-visible:outline-none transition-colors"
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
      <div className="px-6 py-4" style={{ borderTop: '1px solid var(--rule)' }}>
        <Link
          href="/home"
          className="font-sans text-xs"
          style={{ color: 'var(--ink-2)', textDecoration: 'none' }}
        >
          ← Back to app
        </Link>
      </div>
    </aside>
  );
}
