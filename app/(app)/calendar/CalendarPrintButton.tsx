'use client';

export default function CalendarPrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="font-sans text-xs font-medium print:hidden"
      style={{
        padding: '0.5rem 0.875rem',
        border: '1px solid var(--rule)',
        borderRadius: '2px',
        backgroundColor: 'var(--surface)',
        color: 'var(--ink-2)',
        cursor: 'pointer',
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
    >
      Print / Save PDF
    </button>
  );
}
