import Link from 'next/link';
import { RomanNumeral } from '@/components/ui/RomanNumeral';
import { Tag } from '@/components/ui/Tag';

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'] as const;

function toRoman(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}

type ModuleItem = {
  id: string;
  ordinal: number;
  title: string;
  subtitle: string | null;
  durationMinutes: number;
  tag: string | null;
  progress?: { currentStep: number; completed: boolean } | null;
};

type Props = {
  modules: ModuleItem[];
};

function ProgressLabel({ progress, totalSteps }: { progress: NonNullable<ModuleItem['progress']>; totalSteps?: number }) {
  if (progress.completed) {
    return (
      <span
        className="font-sans text-xs tracking-wide"
        style={{ color: 'var(--ink-2)' }}
      >
        Completed
      </span>
    );
  }
  if (totalSteps) {
    return (
      <span
        className="font-display italic text-sm"
        style={{ color: 'var(--accent)' }}
        aria-label={`Step ${progress.currentStep} of ${totalSteps}`}
      >
        {toRoman(progress.currentStep)}&thinsp;/&thinsp;{toRoman(totalSteps)}
      </span>
    );
  }
  return null;
}

export function ArticleList({ modules }: Props) {
  return (
    <ol className="list-none m-0 p-0">
      {modules.map((mod, idx) => {
        const isLast = idx === modules.length - 1;

        return (
          <li key={mod.id}>
            <Link
              href={`/lessons/${mod.id}`}
              className="block no-underline group"
            >
              <div className="flex items-start gap-3 sm:gap-5 py-5">
                {/* Roman numeral */}
                <div className="w-8 shrink-0 pt-0.5">
                  <RomanNumeral n={mod.ordinal} className="text-2xl" />
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-0.5">
                    <h3
                      className="font-display text-lg leading-snug group-hover:underline underline-offset-2"
                      style={{ color: 'var(--ink)', overflowWrap: 'break-word', wordBreak: 'break-word' }}
                    >
                      {mod.title}
                    </h3>
                    {mod.tag && <Tag label={mod.tag} />}
                  </div>

                  {mod.subtitle && (
                    <p
                      className="font-sans text-sm leading-snug"
                      style={{ color: 'var(--ink-2)' }}
                    >
                      {mod.subtitle}
                    </p>
                  )}
                </div>

                {/* Right meta column */}
                <div className="shrink-0 flex flex-col items-end gap-1">
                  <span
                    className="font-sans text-xs"
                    style={{ color: 'var(--ink-2)' }}
                  >
                    {mod.durationMinutes}&thinsp;min
                  </span>

                  {mod.progress && (
                    <ProgressLabel progress={mod.progress} />
                  )}
                </div>
              </div>
            </Link>

            {!isLast && (
              <div style={{ borderTop: '1px solid var(--rule)' }} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
