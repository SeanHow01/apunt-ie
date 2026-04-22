'use client';
import { diffLines } from 'diff';

export function DiffView({
  oldContent,
  newContent,
}: {
  oldContent: string;
  newContent: string;
}) {
  const changes = diffLines(oldContent, newContent);
  return (
    <div
      style={{
        fontFamily: 'DM Mono, monospace',
        fontSize: '0.8125rem',
        whiteSpace: 'pre-wrap',
        border: '1px solid var(--rule)',
        borderRadius: '2px',
        overflow: 'auto',
        maxHeight: '24rem',
      }}
    >
      {changes.map((change, i) => (
        <div
          key={i}
          style={{
            backgroundColor: change.added
              ? '#f0fdf4'
              : change.removed
              ? '#fef2f2'
              : 'transparent',
            color: change.added ? '#15803d' : change.removed ? '#dc2626' : 'var(--ink-2)',
            padding: '0 8px',
            lineHeight: 1.6,
          }}
        >
          {(change.added ? '+' : change.removed ? '-' : ' ') + change.value}
        </div>
      ))}
    </div>
  );
}
