'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { STATUS_CONFIG, COLOR_VARS, REASON_LABELS } from '@/lib/setu/saf-types'
import type { SafApplication } from '@/lib/setu/saf-types'

function StatusPill({ status }: { status: SafApplication['status'] }) {
  const cfg = STATUS_CONFIG[status]
  const col = COLOR_VARS[cfg.color]
  return (
    <span className="font-mono" style={{ fontSize: '0.6875rem', padding: '2px 8px', borderRadius: '99px', backgroundColor: col.bg, color: col.text, border: `1px solid ${col.border}`, whiteSpace: 'nowrap' }}>
      {cfg.label}
    </span>
  )
}

export default function AdminTableClient({ applications }: { applications: SafApplication[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCampus, setFilterCampus] = useState('')

  const campuses = [...new Set(applications.map(a => a.campus).filter(Boolean))] as string[]

  const filtered = applications.filter(a => {
    if (filterStatus && a.status !== filterStatus) return false
    if (filterCampus && a.campus !== filterCampus) return false
    if (search) {
      const q = search.toLowerCase()
      return a.reference_number.toLowerCase().includes(q) || (a.course ?? '').toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <input
          type="text"
          placeholder="Search reference or course…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="font-sans"
          style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--paper)', color: 'var(--ink)', fontSize: '0.875rem', minWidth: '220px', outline: 'none' }}
        />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="font-sans" style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--paper)', color: 'var(--ink)', fontSize: '0.875rem', outline: 'none' }}>
          <option value="">All statuses</option>
          {(['submitted', 'under_review', 'awaiting_info', 'approved', 'rejected'] as SafApplication['status'][]).map(s => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
        <select value={filterCampus} onChange={e => setFilterCampus(e.target.value)} className="font-sans" style={{ padding: '0.5rem 0.75rem', border: '1px solid var(--rule)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--paper)', color: 'var(--ink)', fontSize: '0.875rem', outline: 'none' }}>
          <option value="">All campuses</option>
          {campuses.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid var(--rule)', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--paper)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--rule)', backgroundColor: 'var(--bg)' }}>
                {['Reference', 'Course', 'Year', 'Submitted', 'Reason', 'Amount', 'Status'].map(h => (
                  <th key={h} className="font-mono" style={{ padding: '0.625rem 0.875rem', textAlign: 'left', fontSize: '0.625rem', letterSpacing: '0.12em', color: 'var(--ink-3)', fontWeight: 600, whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="font-sans" style={{ padding: '2rem', textAlign: 'center', color: 'var(--ink-3)', fontSize: '0.875rem' }}>No applications match your filters.</td></tr>
              )}
              {filtered.map((app, i) => (
                <tr
                  key={app.id}
                  onClick={() => router.push(`/setu/admin/applications/${app.id}`)}
                  style={{ borderTop: i > 0 ? '1px solid var(--rule)' : 'none', cursor: 'pointer', transition: 'background-color 100ms' }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = 'var(--bg)')}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td className="font-mono" style={{ padding: '0.625rem 0.875rem', color: 'var(--accent)', fontSize: '0.8125rem' }}>{app.reference_number}</td>
                  <td className="font-sans" style={{ padding: '0.625rem 0.875rem', color: 'var(--ink)' }}>{app.course ?? '—'}</td>
                  <td className="font-sans" style={{ padding: '0.625rem 0.875rem', color: 'var(--ink-2)' }}>{app.year_of_study ?? '—'}</td>
                  <td className="font-mono" style={{ padding: '0.625rem 0.875rem', color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>
                    {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-IE', { day: 'numeric', month: 'short' }) : '—'}
                  </td>
                  <td className="font-sans" style={{ padding: '0.625rem 0.875rem', color: 'var(--ink-2)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {app.reason_category ? REASON_LABELS[app.reason_category] : '—'}
                  </td>
                  <td className="font-mono" style={{ padding: '0.625rem 0.875rem', color: 'var(--ink)', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {app.amount_requested ? `€${app.amount_requested.toFixed(2)}` : '—'}
                  </td>
                  <td style={{ padding: '0.625rem 0.875rem' }}><StatusPill status={app.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding: '0.5rem 0.875rem', borderTop: '1px solid var(--rule)', backgroundColor: 'var(--bg)' }}>
          <span className="font-sans" style={{ fontSize: '0.75rem', color: 'var(--ink-3)' }}>
            {filtered.length} of {applications.length} application{applications.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  )
}
