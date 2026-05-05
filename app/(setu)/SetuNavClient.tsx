'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/setu', label: 'Hub' },
  { href: '/setu/saf', label: 'SAF' },
  { href: '/setu/calendar', label: 'Calendar' },
]

export default function SetuNavClient({ isStaff }: { isStaff: boolean }) {
  const pathname = usePathname()

  function active(href: string) {
    if (href === '/setu') return pathname === '/setu'
    return pathname.startsWith(href)
  }

  return (
    <nav
      aria-label="SETU navigation"
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="font-sans"
            style={{
              fontSize: '0.875rem',
              fontWeight: active(href) ? 600 : 400,
              color: active(href) ? 'var(--setu-primary)' : 'var(--ink-2)',
              textDecoration: 'none',
              padding: '0.625rem 0.875rem',
              borderBottom: active(href) ? '2px solid var(--setu-primary)' : '2px solid transparent',
              transition: 'color 150ms, border-color 150ms',
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      {isStaff && (
        <Link
          href="/setu/admin"
          className="font-sans font-semibold"
          style={{
            fontSize: '0.75rem',
            color: active('/setu/admin') ? 'var(--setu-primary)' : 'var(--ink-2)',
            textDecoration: 'none',
            padding: '0.5rem 0.75rem',
            border: '1px solid var(--setu-primary-border)',
            borderRadius: 'var(--radius-sm)',
            background: active('/setu/admin') ? 'var(--setu-primary-light)' : 'transparent',
          }}
        >
          Admin
        </Link>
      )}
    </nav>
  )
}
