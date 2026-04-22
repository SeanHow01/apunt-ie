export function Tag({ label }: { label: string }) {
  return (
    <span
      className="inline-block font-sans font-semibold text-[9px] uppercase tracking-[0.2em] px-2 py-0.5"
      style={{
        color: 'var(--accent)',
        border: '1px solid var(--accent)',
      }}
    >
      {label}
    </span>
  );
}
