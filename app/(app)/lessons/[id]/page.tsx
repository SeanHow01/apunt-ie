'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { StepHeader } from '@/components/lessons/StepHeader';
import { PayslipVisual } from '@/components/lessons/PayslipVisual';
import { LessonNav } from '@/components/lessons/LessonNav';
import { Callout } from '@/components/ui/Callout';
import { Button } from '@/components/ui/Button';
import { ConfidenceSurvey } from '@/components/lessons/ConfidenceSurvey';
import { ShareButton } from '@/components/ui/ShareButton';
import { ModuleQuestion } from '@/components/lessons/ModuleQuestion';
import { SupportStrip } from '@/components/ui/SupportStrip';
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

  // ── Not found ────────────────────────────────────────────────────────────
  if (!module) {
    return (
      <AppShell>
        <div
          className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center"
          style={{ color: 'var(--ink)' }}
        >
          <h1
            className="font-display text-3xl mb-4"
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

  // ── Completion screen ─────────────────────────────────────────────────────
  if (finished) {
    return (
      <AppShell>
        <div className="flex-1 flex flex-col px-6 py-8 md:px-8 md:max-w-2xl md:mx-auto md:w-full">
          {/* Back links */}
          <div className="mb-8 flex items-center gap-4">
            <Link
              href="/home"
              className="font-sans text-sm underline underline-offset-2"
              style={{ color: 'var(--ink-2)' }}
            >
              Back to home
            </Link>
            <span className="font-sans text-sm" style={{ color: 'var(--rule)' }}>·</span>
            <Link
              href="/lessons"
              className="font-sans text-sm underline underline-offset-2"
              style={{ color: 'var(--ink-2)' }}
            >
              All lessons
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
              }}
            >
              {module.closingLine}
            </h1>

            <div className="mt-2 mb-6" style={{ borderTop: '1px solid var(--rule)' }} />

            <ModuleQuestion
              userId={userId}
              moduleId={module.id}
              moduleName={module.title}
            />

            <ConfidenceSurvey
              userId={userId}
              moduleId={module.id}
              moduleName={module.title}
            />

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
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

            <ShareButton
              title={module.title}
              text={`I just completed "${module.title}" on Punt — Ireland's personal finance app.`}
              label="Share this lesson"
            />

            <div className="mt-6">
              <SupportStrip />
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ── Lesson step ───────────────────────────────────────────────────────────
  //
  // Layout strategy:
  //   Mobile  → h-[100dvh] flex-col: header (shrink-0) | content (flex-1
  //             overflow-y-auto) | nav buttons (shrink-0 pb-20 for tab bar)
  //             The page itself does NOT scroll; only the content area scrolls.
  //   Desktop → h-auto / min-h-screen: normal page flow, nav after content.
  //
  // We bypass AppShell here and apply md:ml-56 directly so we control the
  // outer height without fighting AppShell's pb-20 padding.
  //
  const contentMaxW = isPayslipModule ? 'max-w-5xl' : 'max-w-2xl';

  return (
    <div
      className="flex flex-col h-[100dvh] lg:h-auto lg:min-h-screen md:ml-56"
      style={{ backgroundColor: 'var(--bg)' }}
    >

      {/* ── 1. Header — never scrolls ──────────────────────────────────── */}
      <div className={`flex-shrink-0 px-4 md:px-8 lg:px-12 pt-8 pb-3 mx-auto w-full ${contentMaxW}`}>

        {/* Back links */}
        <div className="mb-5 flex items-center gap-4">
          <Link
            href="/home"
            className="font-sans text-sm underline underline-offset-2"
            style={{ color: 'var(--ink-2)' }}
          >
            Back to home
          </Link>
          <span className="font-sans text-sm" style={{ color: 'var(--rule)' }}>·</span>
          <Link
            href="/lessons"
            className="font-sans text-sm underline underline-offset-2"
            style={{ color: 'var(--ink-2)' }}
          >
            All lessons
          </Link>
        </div>

        {/* Review date — shown only on first step */}
        {currentStep === 0 && module.lastReviewed && (
          <p
            className="font-sans text-xs mb-3"
            style={{ color: 'var(--ink-2)' }}
            title={module.reviewNote}
          >
            Content reviewed {module.lastReviewed}
          </p>
        )}

        {/* Progress dots */}
        <div
          className="flex items-center gap-1.5 mb-4"
          aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
        >
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentStep ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor:
                  i === currentStep
                    ? 'var(--accent)'
                    : i < currentStep
                    ? 'var(--ink-2)'
                    : 'var(--rule)',
                transition: 'width 0.2s ease, background-color 0.2s ease',
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        {/* Step title */}
        <StepHeader
          currentStep={currentStep + 1}
          totalSteps={totalSteps}
          label={step.label}
        />
      </div>

      {/* ── 2. Content — scrolls independently on mobile ───────────────── */}
      {/*
       * overflow-y-auto creates an independent scroll context on mobile
       * (where the outer container is height-constrained at 100dvh).
       * On desktop, lg:h-auto means the outer has no explicit height →
       * flex-1 doesn't constrain the content area → no overflow occurs →
       * overflow-y-auto adds no scroll context → lg:sticky on the payslip
       * visual works relative to the viewport as expected.
       *
       * lg:overflow-visible is added explicitly to prevent any cross-browser
       * ambiguity around the scroll context on desktop.
       */}
      <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-visible">
        <div className={`px-4 md:px-8 lg:px-12 pt-1 pb-6 mx-auto w-full ${contentMaxW}`}>

          {/*
           * Payslip module on lg+: two-column grid (text left, visual right sticky)
           * All other modules + payslip on mobile/tablet: single column
           */}
          <div className={hasPayslipVisual ? 'lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start' : ''}>

            {/* Primary text column */}
            <div>
              {/* PayslipVisual inline above body text on mobile/tablet */}
              {hasPayslipVisual && (
                <div className="mb-8 lg:hidden">
                  <PayslipVisual highlight={step.highlight!} />
                </div>
              )}

              <div className="mb-6 flex flex-col gap-4" style={{ maxWidth: '65ch' }}>
                {step.body.split('\n\n').filter(Boolean).map((para, i) => (
                  <p
                    key={i}
                    className="font-sans text-base lg:text-lg leading-relaxed"
                    style={{ color: 'var(--ink)' }}
                  >
                    {para.trim()}
                  </p>
                ))}
              </div>

              {step.callout && (
                <div className="mb-6 max-w-[65ch]">
                  <Callout kind={step.callout.kind} text={step.callout.text} />
                </div>
              )}
            </div>

            {/* PayslipVisual in right column — desktop only, sticky */}
            {hasPayslipVisual && (
              <div className="hidden lg:block lg:sticky lg:top-20">
                <PayslipVisual highlight={step.highlight!} />
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ── 3. Nav buttons — pinned to bottom, never scrolls ───────────── */}
      {/*
       * flex-shrink-0 ensures this row is never compressed by the flex layout.
       * pb-20 md:pb-4: on mobile, 80px bottom padding lifts the buttons above
       * the MobileTabBar (fixed, 64px + safe-area). On md+, normal padding only.
       * border-top gives a visual separator from the content.
       */}
      <div
        className={`flex-shrink-0 px-4 md:px-8 lg:px-12 pt-3 pb-20 md:pb-4 mx-auto w-full ${contentMaxW}`}
        style={{ borderTop: '1px solid var(--rule)' }}
      >
        <LessonNav
          onBack={handleBack}
          onNext={handleNext}
          isFirst={isFirst}
          isLast={isLast}
        />
      </div>

    </div>
  );
}
