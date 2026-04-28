import Link from 'next/link';

type ModuleSegment = {
  id: string;
  title: string;
  completed: boolean;
  inProgress: boolean;
};

type Props = {
  segments: ModuleSegment[];
};

/** Reliable short labels keyed by module ID (not title, which has commas/extra words) */
const SEGMENT_LABELS: Record<string, string> = {
  'payslip': 'Payslip',
  'auto-enrolment': 'Auto-enrol',
  'loans': 'Loans',
  'rent': 'Rent',
  'help-to-buy': 'Help to Buy',
  'susi': 'SUSI',
  'investing': 'Investing',
};

function segmentLabel(id: string): string {
  return SEGMENT_LABELS[id] ?? id;
}

export function ModuleProgressBar({ segments }: Props) {
  const completedCount = segments.filter((s) => s.completed).length;
  const total = segments.length;
  const allDone = completedCount === total;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Header row */}
      <div className="flex items-baseline justify-between mb-3">
        <p
          className="font-sans text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--ink-2)' }}
        >
          Your progress
        </p>
        <p
          className="font-sans text-xs tabular-nums"
          style={{ color: allDone ? '#2E7D52' : 'var(--ink-2)' }}
        >
          {allDone ? 'All complete ✓' : `${completedCount} of ${total} complete`}
        </p>
      </div>

      {/* Segments */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${total}, 1fr)`,
          gap: '3px',
        }}
        role="list"
        aria-label="Module completion progress"
      >
        {segments.map((seg) => (
          <Link
            key={seg.id}
            href={`/lessons/${seg.id}`}
            role="listitem"
            title={seg.title}
            style={{ textDecoration: 'none' }}
          >
            {/* Coloured bar */}
            <div
              style={{
                height: '6px',
                borderRadius: '3px',
                backgroundColor: seg.completed
                  ? 'var(--accent)'
                  : seg.inProgress
                  ? 'color-mix(in srgb, var(--accent) 40%, var(--rule))'
                  : 'var(--rule)',
                transition: 'background-color 0.2s ease',
              }}
            />
            {/*
             * Labels hidden on xs (≤ 639px) — 7 segments at 375px gives ~47px each,
             * too narrow for readable text. The bar colours + tooltip are sufficient on
             * mobile; labels appear at sm (640px+) where each column is ≥ 88px.
             */}
            <p
              className="hidden sm:block font-sans text-center mt-1.5 leading-tight"
              style={{
                fontSize: '0.625rem',
                color: seg.completed ? 'var(--ink)' : 'var(--ink-2)',
                fontWeight: seg.completed ? 500 : 400,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {segmentLabel(seg.id)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
