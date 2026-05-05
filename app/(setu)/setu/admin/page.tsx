import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { STATUS_CONFIG, COLOR_VARS, REASON_LABELS } from '@/lib/setu/saf-types'
import type { SafApplication } from '@/lib/setu/saf-types'
import AdminTableClient from './AdminTableClient'
import AdminCsvButton from './AdminCsvButton'

export const dynamic = 'force-dynamic'

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--paper)', padding: '1.125rem 1.25rem' }}>
      <p className="font-mono uppercase" style={{ fontSize: '0.5625rem', letterSpacing: '0.15em', color: 'var(--ink-3)', margin: '0 0 0.25rem' }}>{label}</p>
      <p className="font-mono" style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--ink)', margin: 0, lineHeight: 1.1 }}>{value}</p>
      {sub && <p className="font-sans" style={{ fontSize: '0.75rem', color: 'var(--ink-3)', margin: '0.25rem 0 0' }}>{sub}</p>}
    </div>
  )
}

export default async function AdminDashboardPage() {
  const admin = createAdminClient()

  const { data: apps } = await admin
    .from('saf_applications')
    .select('id, reference_number, user_id, campus, course, year_of_study, reason_category, amount_requested, amount_awarded, status, submitted_at, decided_at')
    .eq('institution', 'SETU')
    .neq('status', 'draft')
    .order('submitted_at', { ascending: false }) as { data: SafApplication[] | null }

  const allApps = apps ?? []

  // Stats
  const total = allApps.length
  const awaitingReview = allApps.filter(a => ['submitted', 'under_review', 'awaiting_info'].includes(a.status)).length
  const approved = allApps.filter(a => a.status === 'approved').length
  const totalAwarded = allApps.reduce((sum, a) => sum + (a.amount_awarded ?? 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <p className="font-mono uppercase" style={{ fontSize: '0.625rem', letterSpacing: '0.18em', color: 'var(--ink-3)', margin: '0 0 0.375rem' }}>SETU · ADMIN</p>
          <h1 className="font-display italic" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: 'var(--ink)', letterSpacing: '-0.02em', margin: 0 }}>
            SAF Applications
          </h1>
        </div>
        <AdminCsvButton />
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.875rem', marginBottom: '2rem' }}>
        <StatCard label="Received" value={total} />
        <StatCard label="Awaiting review" value={awaitingReview} />
        <StatCard label="Approved" value={approved} sub="this cycle" />
        <StatCard label="Total awarded" value={`€${totalAwarded.toLocaleString('en-IE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
      </div>

      {/* Table */}
      <AdminTableClient applications={allApps} />
    </div>
  )
}
