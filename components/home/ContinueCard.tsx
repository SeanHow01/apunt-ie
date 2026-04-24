import Link from 'next/link';

type Props = {
  moduleTitle: string | null;
  moduleId: string | null;
  currentStep: number;
  totalSteps: number;
};

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'] as const;

function toRoman(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}

export function ContinueCard({ moduleTitle, moduleId, currentStep, totalSteps }: Props) {
  const hasProgress = moduleId !== null && moduleTitle !== null;
  const href = hasProgress ? `/lessons/${moduleId}` : '/lessons/payslip';
  const eyebrow = hasProgress ? 'Continue' : 'Start here';
  const headline = hasProgress ? moduleTitle : 'Your payslip, line by line';

  return (
    <Link href={href} className="block no-underline group">
      <div
        className="relative overflow-hidden p-6 sm:p-8 lg:p-10 min-h-[180px] transition-opacity duration-200 group-hover:opacity-90"
        style={{ backgroundColor: 'var(--ink)', color: 'var(--bg)', cursor: 'pointer' }}
      >
        {/* Decorative corner character */}
        <span
          className="font-display italic absolute right-5 top-3 select-none text-[7rem] leading-none pointer-events-none"
          style={{ color: 'var(--accent)', opacity: 0.22 }}
          aria-hidden="true"
        >
          {hasProgress ? '\u2192' : '?'}
        </span>

        {/* Eyebrow */}
        <span
          className="font-sans font-semibold uppercase tracking-[0.2em] text-[10px] leading-none block mb-4"
          style={{ color: 'var(--accent)' }}
        >
          {eyebrow}
        </span>

        {/* Headline */}
        <h2
          className="font-display text-2xl sm:text-3xl leading-tight mb-6 max-w-[28ch]"
          style={{ color: 'var(--bg)' }}
        >
          {headline}
        </h2>

        {/* Progress indicator */}
        {hasProgress && totalSteps > 0 && (
          <p
            className="font-display italic text-base"
            style={{ color: 'var(--accent)' }}
            aria-label={`Step ${currentStep} of ${totalSteps}`}
          >
            {toRoman(currentStep)}&thinsp;/&thinsp;{toRoman(totalSteps)}
          </p>
        )}

        {/* Bottom-right CTA affordance */}
        <span
          className="absolute bottom-5 right-5 font-sans text-sm font-semibold transition-transform duration-200 group-hover:translate-x-1"
          style={{ color: 'var(--accent)' }}
          aria-hidden="true"
        >
          {hasProgress ? 'Continue →' : 'Start →'}
        </span>
      </div>
    </Link>
  );
}
