import Link from 'next/link'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 32px',
        borderBottom: '1px solid var(--rule)',
        background: 'var(--bg)',
      }}>
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-display, Georgia, serif)',
            fontSize: 20,
            color: 'var(--accent)',
            textDecoration: 'none',
            fontWeight: 400,
            fontStyle: 'italic',
          }}
        >
          Punt
        </Link>

        {/* Auth nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            href="/sign-in"
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 14,
              color: 'var(--ink-2)',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: 6,
              border: '1.5px solid var(--rule)',
              background: 'transparent',
              fontWeight: 500,
              transition: 'border-color 0.15s',
            }}
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 14,
              color: '#fff',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: 6,
              background: 'var(--ink)',
              fontWeight: 600,
            }}
          >
            Sign up
          </Link>
        </nav>
      </header>

      {children}
    </>
  )
}
