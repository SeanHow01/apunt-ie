import Link from 'next/link';

type Props = {
  ordinal: number;
  title: string;
  subtitle?: string;
  durationMinutes?: number;
  progress?: { completed: boolean; currentStep: number; totalSteps: number } | null;
  href: string;
};

export function ModuleCard({ ordinal, title, subtitle, durationMinutes, progress, href }: Props) {
  const pct = progress
    ? progress.completed
      ? 100
      : progress.totalSteps > 0
      ? Math.round((progress.currentStep / progress.totalSteps) * 100)
      : 0
    : 0;

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        style={{
          background: 'var(--paper)',
          border: '1px solid var(--rule)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Progress stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'var(--rule)' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }} />
        </div>

        {/* Ordinal + duration */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.625rem', marginBottom: '0.5rem', marginTop: '0.25rem' }}>
          <span
            className="font-display italic"
            style={{ fontSize: '1.375rem', color: 'var(--accent)', opacity: 0.4, lineHeight: 1, userSelect: 'none' }}
          >
            {ordinal}
          </span>
          {durationMinutes && (
            <span
              className="font-mono uppercase"
              style={{ fontSize: '0.5625rem', color: 'var(--ink-3)', letterSpacing: '0.12em' }}
            >
              {durationMinutes} min
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="font-display"
          style={{ fontSize: '1rem', lineHeight: 1.25, color: 'var(--ink)', margin: '0 0 0.25rem', letterSpacing: '-0.01em' }}
        >
          {title}
        </h3>

        {/* Subtitle */}
        {subtitle && (
          <p className="font-sans" style={{ fontSize: '0.8125rem', color: 'var(--ink-3)', lineHeight: 1.4, margin: 0 }}>
            {subtitle}
          </p>
        )}

        {/* Status */}
        {progress?.completed && (
          <p
            className="font-mono uppercase"
            style={{ fontSize: '0.5625rem', color: 'var(--accent)', letterSpacing: '0.1em', margin: '0.75rem 0 0' }}
          >
            ✓ Complete
          </p>
        )}
        {progress && !progress.completed && progress.currentStep > 0 && (
          <p
            className="font-mono uppercase"
            style={{ fontSize: '0.5625rem', color: 'var(--ink-3)', letterSpacing: '0.1em', margin: '0.75rem 0 0' }}
          >
            Step {progress.currentStep} of {progress.totalSteps}
          </p>
        )}
      </article>
    </Link>
  );
}
