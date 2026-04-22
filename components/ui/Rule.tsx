export function Rule({ className = '' }: { className?: string }) {
  return (
    <hr
      className={`border-0 ${className}`}
      style={{ borderTop: '1px solid var(--rule)' }}
    />
  );
}
