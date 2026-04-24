import { RomanNumeral } from '@/components/ui/RomanNumeral';

type Props = {
  currentStep: number; // 1-based
  totalSteps: number;
  label: string;
};

export function StepHeader({ currentStep, totalSteps, label }: Props) {
  return (
    <header className="mb-6">
      {/* Step count: ii / v */}
      <div
        className="font-display italic text-base mb-3 flex items-baseline gap-1"
        aria-label={`Step ${currentStep} of ${totalSteps}`}
      >
        <RomanNumeral n={currentStep} className="text-base" />
        <span style={{ color: 'var(--ink-2)' }} className="font-display italic text-base">
          &thinsp;/&thinsp;
        </span>
        <RomanNumeral n={totalSteps} className="text-base" />
      </div>

      {/* Step label headline */}
      <h1
        className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight"
        style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}
      >
        {label}
      </h1>
    </header>
  );
}
