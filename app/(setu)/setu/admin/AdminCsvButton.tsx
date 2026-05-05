'use client'

import { exportCsv } from '@/lib/setu/saf-actions'

export default function AdminCsvButton() {
  async function handleExport() {
    const csv = await exportCsv('SETU')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `saf-applications-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="font-sans font-semibold"
      style={{
        fontSize: '0.875rem',
        padding: '0.5rem 1rem',
        border: '1px solid var(--setu-primary-border)',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--setu-primary-light)',
        color: 'var(--setu-primary)',
        cursor: 'pointer',
      }}
    >
      Export CSV
    </button>
  )
}
