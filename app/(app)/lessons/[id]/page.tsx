'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { StepHeader } from '@/components/lessons/StepHeader';
import { PayslipVisual } from '@/components/lessons/PayslipVisual';
import { LessonNav } from '@/components/lessons/LessonNav';
import { Callout } from '@/components/ui/Callout';
import { Button } from '@/components/ui/Button';
import { getModule, getNextModule } from '@/content/modules/index';
import { createClient } from '@/lib/supabase/client';
import type { Module } from '@/content/types';

// Debounce helper
function useDebounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

type Props = {
  params: Promise<{ id: string }>;
};

export default function LessonPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const module: Module | undefined = getModule(id);

  const [currentStep, setCurrentStep] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  // Resolve user id once on mount
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null);
    });
  }, []);

  // Upsert progress to Supabase (debounced)
  const saveProgress = useCallback(
    useDebounce(async (uid: string, modId: string, step: number, completed: boolean) => {
      const supabase = createClient();
      await supabase.from('user_progress').upsert({
        user_id: uid,
        module_id: modId,
        current_step: step,
        completed,
        ...(completed ? { completed_at: new Date().toISOString() } : {}),
      });
    }, 500),
    []
  );

  // Persist step changes
  useEffect(() => {
    if (userId && module) {
      saveProgress(userId, module.id, currentStep, false);
    }
  }, [currentStep, userId, module, saveProgress]);

  if (!module) {
    return (
      <AppShell>
        <div
          className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center"
          style={{ color: 'var(--ink)' }}
        >
          <h1
            className="font-display text-3xl mb-4"
            style={{ fontFamily: 'Instrument Serif, serif' }}
          >
            Lesson not found
          </h1>
          <p className="font-sans text-base mb-8" style={{ color: 'var(--ink-2)' }}>
            That lesson doesn&rsquo;t exist.
          </p>
          <Link href="/home">
            <Button variant="primary">Back to home</Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const totalSteps = module.steps.length;
  const step = module.steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === totalSteps - 1;
  const nextModule = getNextModule(module.id);
  const isPayslipModule = module.id === 'payslip';
  const hasPayslipVisual = isPayslipModule && !!step.highlight;

  function handleBack() {
    setCurrentStep((s) => Math.max(0, s - 1));
  }

  async function handleNext() {
    if (isLast) {
      // Mark complete
      if (userId) {
        const supabase = createClient();
        await supabase.from('user_progress').upsert({
          user_id: userId,
          module_id: module!.id,
          current_step: totalSteps,
          completed: true,
          completed_at: new Date().toISOString(),
        });
      }
      setFinished(true);
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  // Completion screen
  if (finished) {
    return (
      <AppShell>
        <div className="flex-1 flex flex-col px-6 py-12 md:px-8 md:max-w-2xl md:mx-auto md:w-full">
          {/* Back link */}
          <div className="mb-10">
            <Link
              href="/home"
              className="font-sans text-sm underline underline-offset-2"
              style={{ color: 'var(--ink-2)' }}
            >
              Back to home
            </Link>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-[65ch]">
            <p
              className="font-sans font-semibold uppercase tracking-[0.2em] text-[10px] mb-6"
              style={{ color: 'var(--ink-2)' }}
            >
              Complete
            </p>

            <h1
              className="font-display text-4xl sm:text-5xl leading-tight mb-6"
              style={{
                color: 'var(--ink)',
                letterSpacing: '-0.02em',
                fontFamily: 'Instrument Serif, serif',
              }}
            >
              {module.closingLine}
            </h1>

            <div
              className="mt-2 mb-10"
              style={{ borderTop: '1px solid var(--rule)' }}
            />

            <div className="flex flex-col sm:flex-row gap-3">
              {nextModule ? (
                <Link href={`/lessons/${nextModule.id}`}>
                  <Button variant="primary">
                    Next lesson: {nextModule.title}
                  </Button>
                </Link>
              ) : (
                <Link href="/home">
                  <Button variant="primary">Back to home</Button>
                </Link>
              )}
              <Link href="/home">
                <Button variant="ghost">Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex-1 flex flex-col">

        {/*
         * Reading content.
         * - Non-payslip modules: max-w-2xl centred (~65ch comfortable reading width)
         * - Payslip module: max-w-5xl to accommodate side-by-side visual on lg+
         */}
        <div className={`flex-1 px-4 md:px-8 lg:px-12 py-8 mx-auto w-full ${isPayslipModule ? 'max-w-5xl' : 'max-w-2xl'}`}>

          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/home"
              className="font-sans text-sm underline underline-offset-2"
              style={{ color: 'var(--ink-2)' }}
            >
              Back to home
            </Link>
          </div>

          {/* Step header */}
          <StepHeader
            currentStep={currentStep + 1}
            totalSteps={totalSteps}
            label={step.label}
          />

          {/*
           * Content area:
           * - Payslip module on lg+: explanation left (col 1/2), PayslipVisual right (col 2/2, sticky)
           * - Tablet / mobile payslip: visual inline above body text
           * - All other modules: single reading column
           */}
          <div className={hasPayslipVisual ? 'lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start' : ''}>

            {/* Primary text + callout + nav */}
            <div>
              {/* PayslipVisual above body text on mobile and tablet only */}
              {hasPayslipVisual && (
                <div className="mb-8 lg:hidden">
                  <PayslipVisual highlight={step.highlight!} />
                </div>
              )}

              <p
                className="font-sans text-base lg:text-lg leading-relaxed mb-6"
                style={{
                  color: 'var(--ink)',
                  maxWidth: '65ch',
                }}
              >
                {step.body}
              </p>

              {step.callout && (
                <div className="mb-6 max-w-[65ch]">
                  <Callout kind={step.callout.kind} text={step.callout.text} />
                </div>
              )}

              {/* Navigation inside content column so it's contained within max-width */}
              <LessonNav
                onBack={handleBack}
                onNext={handleNext}
                isFirst={isFirst}
                isLast={isLast}
              />
            </div>

            {/* PayslipVisual alongside body text on lg+ only, sticky so it stays visible while reading */}
            {hasPayslipVisual && (
              <div className="hidden lg:block lg:sticky lg:top-20">
                <PayslipVisual highlight={step.highlight!} />
              </div>
            )}

          </div>
        </div>

      </div>
    </AppShell>
  );
}
