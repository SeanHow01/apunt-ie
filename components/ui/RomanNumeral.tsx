const NUMERALS = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'] as const;

export function RomanNumeral({
  n,
  className = '',
}: {
  n: number; // 1-based
  className?: string;
}) {
  const numeral = NUMERALS[n - 1] ?? String(n);
  return (
    <span
      className={`font-display italic ${className}`}
      style={{ color: 'var(--accent)' }}
      aria-label={`${n}`}
    >
      {numeral}
    </span>
  );
}
