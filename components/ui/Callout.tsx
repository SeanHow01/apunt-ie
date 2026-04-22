import type { CalloutKind } from '@/content/types';

const labels: Record<CalloutKind, string> = {
  tip: 'Worth knowing',
  warning: 'Take note',
  context: 'Context',
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
      style={{ borderLeft: '2px solid var(--accent)' }}
      role="note"
    >
      <p
        className="font-sans text-xs font-semibold uppercase tracking-[0.15em] mb-1"
        style={{ color: 'var(--accent)' }}
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
