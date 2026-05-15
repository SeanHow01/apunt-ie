/**
 * ModuleChrome — the strip of metadata + progress that sits at the top of
 * every lesson reader screen. Mirrors the hero module preview on the
 * homepage exactly: mono "MODULE 0X · N MIN · STEP Y OF 6" on the left,
 * six progress pips on the right. 1px bottom rule, 1rem padding-bottom.
 *
 * Pip semantics:
 *   - filled accent     → current step
 *   - half-opacity ink-2 → visited steps
 *   - rule              → ahead
 *
 * Step is 1-indexed (1…6). Module data passes ordinal, duration, and total
 * step count — the chrome only renders.
 */

export type ModuleMeta = {
  /** 1-based ordinal across the curriculum (1…8). Padded to two digits. */
  ordinal: number;
  /** Total number of steps in the module (typically 6). */
  totalSteps: number;
  /** Average duration in minutes. */
  durationMinutes: number;
};

export function ModuleChrome({
  module,
  step,
}: {
  module: ModuleMeta;
  step: number;
}) {
  const { ordinal, totalSteps, durationMinutes } = module;
  const paddedOrdinal = String(ordinal).padStart(2, '0');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--rule)',
      }}
    >
      <span
        className="font-mono uppercase"
        style={{
          fontSize: '0.6875rem',
          letterSpacing: '0.14em',
          color: 'var(--ink-3)',
        }}
      >
        Module {paddedOrdinal} · {durationMinutes} min · Step {step} of {totalSteps}
      </span>

      <span style={{ display: 'flex', gap: '5px', flexShrink: 0 }} aria-hidden="true">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepIndex = i + 1;
          let background = 'var(--rule)';
          let opacity = 1;
          if (stepIndex === step) {
            background = 'var(--accent)';
          } else if (stepIndex < step) {
            background = 'var(--ink-2)';
            opacity = 0.5;
          }
          return (
            <span
              key={i}
              style={{
                display: 'block',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background,
                opacity,
              }}
            />
          );
        })}
      </span>
    </div>
  );
}
