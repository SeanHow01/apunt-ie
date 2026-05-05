import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SetuNavClient from './SetuNavClient'

export default async function SetuLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/sign-in?redirect=/setu')

  // Check staff status
  const admin = createAdminClient()
  const { data: staffRow } = await admin
    .from('saf_staff_users')
    .select('display_name')
    .eq('user_id', user.id)
    .maybeSingle()

  const isStaff = !!staffRow

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Top bar */}
      <header
        style={{
          borderBottom: '1px solid var(--rule)',
          backgroundColor: 'var(--paper)',
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Wordmark + badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link
              href="/setu"
              style={{ textDecoration: 'none' }}
            >
              <span
                className="font-display italic"
                style={{ fontSize: '1.375rem', color: 'var(--accent)', letterSpacing: '-0.02em' }}
              >
                Punt
              </span>
            </Link>
            <span
              className="font-sans font-bold"
              style={{
                fontSize: '11px',
                letterSpacing: '0.08em',
                padding: '2px 8px',
                border: '1px solid var(--setu-primary-border)',
                background: 'var(--setu-primary-light)',
                color: 'var(--setu-primary)',
                borderRadius: '99px',
              }}
            >
              ·in SETU·
            </span>
          </div>

          {/* Right: email + settings */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              className="font-sans"
              style={{ fontSize: '0.75rem', color: 'var(--ink-3)', display: 'none' }}
              data-email
            >
              {user.email}
            </span>
            <Link
              href="/settings"
              className="font-sans"
              style={{ fontSize: '0.75rem', color: 'var(--ink-2)', textDecoration: 'none' }}
              title="Settings"
            >
              ⚙
            </Link>
          </div>
        </div>

        {/* Nav strip */}
        <SetuNavClient isStaff={isStaff} />
      </header>

      {/* Content */}
      <main
        id="main-content"
        style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}
      >
        {children}
      </main>
    </div>
  )
}
