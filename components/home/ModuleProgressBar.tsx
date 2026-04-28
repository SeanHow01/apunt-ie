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

/** Short label for each segment — keep under ~10 chars so they fit on mobile */
function shortTitle(title: string): string {
  const overrides: Record<string, string> = {
    'auto-enrolment': 'Auto-enrol',
    'help-to-buy': 'Help to Buy',
  };
  return overrides[title.toLowerCase().replace(/\s+/g, '-')] ?? title.split(' ').slice(0, 2).join(' ');
}

export function ModuleProgressBar({ segments }: Props) {
  const completedCount = segments.filter((s) => s.completed).length;
  const total = segments.length;
  const allDone = completedCount === total;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Header row */}
      <div
        className="flex items-baseline justify-between mb-3"
      >
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
          {allDone
            ? 'All complete ✓'
            : `${completedCount} of ${total} complete`}
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
            <p
              className="font-sans text-center mt-1.5 leading-tight"
              style={{
                fontSize: '0.625rem',
                color: seg.completed ? 'var(--ink)' : 'var(--ink-2)',
                fontWeight: seg.completed ? 500 : 400,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {shortTitle(seg.title)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
