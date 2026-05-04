import type { CalloutKind } from '@/content/types';

const labels: Record<CalloutKind, string> = {
  tip: 'Worth knowing',
  warning: 'Take note',
  context: 'Context',
  info: 'Note',
};

const borderColors: Record<CalloutKind, string> = {
  tip: 'var(--accent)',
  warning: 'var(--accent)',
  context: 'var(--accent)',
  info: 'var(--rule)',
};

const labelColors: Record<CalloutKind, string> = {
  tip: 'var(--accent)',
  warning: 'var(--accent)',
  context: 'var(--accent)',
  info: 'var(--ink-2)',
};

export function Callout({
  kind,
  text,
}: {
  kind: CalloutKind;
  text: string;
}) {
  return (
    <aside
      className="pl-4 py-1"
      style={{ borderLeft: `2px solid ${borderColors[kind]}` }}
      role="note"
    >
      <p
        className="font-sans text-xs font-semibold uppercase tracking-[0.15em] mb-1"
        style={{ color: labelColors[kind] }}
      >
        {labels[kind]}
      </p>
      <p
        className="font-display italic text-base leading-relaxed"
        style={{ color: 'var(--ink-2)' }}
      >
        {text}
      </p>
    </aside>
  );
}
