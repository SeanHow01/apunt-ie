'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

type Props = {
  onBack: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export function LessonNav({ onBack, onNext, isFirst, isLast }: Props) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore when focus is inside an input/textarea/select
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'ArrowLeft' && !isFirst) {
        onBack();
      } else if (e.key === 'ArrowRight') {
        onNext();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack, onNext, isFirst]);

  return (
    <nav
      className="flex items-center gap-3 mt-8"
      aria-label="Lesson navigation"
    >
      {!isFirst && (
        <Button variant="ghost" size="md" onClick={onBack}>
          Back
        </Button>
      )}

      <Button variant="primary" size="md" onClick={onNext}>
        {isLast ? 'Finish' : 'Next'}
      </Button>
    </nav>
  );
}
