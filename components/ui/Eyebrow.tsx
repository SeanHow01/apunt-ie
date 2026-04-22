export function Eyebrow({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-sans font-semibold uppercase tracking-[0.2em] text-[10px] leading-none ${className}`}
      style={{ color: 'var(--ink-2)' }}
    >
      {children}
    </span>
  );
}
