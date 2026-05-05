'use client'

export default function SetuCalendarPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="font-sans print:hidden"
      style={{
        fontSize: '0.8125rem',
        padding: '0.5rem 0.875rem',
        border: '1px solid var(--rule)',
        borderRadius: 'var(--radius-sm)',
        backgroundColor: 'var(--paper)',
        color: 'var(--ink-2)',
        cursor: 'pointer',
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
    >
      Print / Save PDF
    </button>
  )
}
