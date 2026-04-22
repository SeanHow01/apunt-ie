export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded ${className}`}
      style={{ backgroundColor: 'var(--rule)' }}
      aria-hidden="true"
    />
  );
}
