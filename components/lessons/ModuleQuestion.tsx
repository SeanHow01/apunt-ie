'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type Status = 'idle' | 'submitting' | 'done';

const MAX_CHARS = 500;
const MIN_CHARS = 5;

type Props = {
  userId: string | null;
  moduleId: string;
  moduleName: string;
};

export function ModuleQuestion({ userId, moduleId, moduleName }: Props) {
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  if (!userId) return null;

  if (status === 'done') {
    return (
      <div
        style={{
          padding: '1rem 1.25rem',
          border: '1px solid var(--rule)',
          borderRadius: '4px',
          backgroundColor: 'var(--bg)',
          marginBottom: '1.5rem',
        }}
      >
        <p className="font-sans text-sm" style={{ color: '#2E7D52', fontWeight: 500 }}>
          Question received — thank you.
        </p>
        <p className="font-sans text-xs mt-0.5" style={{ color: 'var(--ink-2)', lineHeight: 1.5 }}>
          We read every question and use them to improve the lesson content.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || question.trim().length < MIN_CHARS || status === 'submitting') return;

    setStatus('submitting');
    const supabase = createClient();
    const { error } = await supabase.from('module_questions').insert({
      user_id: userId,
      module_id: moduleId,
      question: question.trim(),
    });

    // Non-blocking: show done even if the insert fails — cash flow impact is zero
    // and re-prompting for a retry would be more frustrating than the lost question.
    if (error) console.error('module_questions insert:', error.message);
    setStatus('done');
  }

  const remaining = MAX_CHARS - question.length;
  const isValid = question.trim().length >= MIN_CHARS;

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
      <p
        className="font-sans text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: 'var(--ink-2)' }}
      >
        Got a question about {moduleName}?
      </p>
      <p className="font-sans text-xs mb-3" style={{ color: 'var(--ink-2)', lineHeight: 1.5 }}>
        Ask anything that came to mind while going through this lesson.
        We read every submission.
      </p>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value.slice(0, MAX_CHARS))}
        placeholder="e.g. What happens if my employer doesn't update my tax basis?"
        rows={3}
        className="font-sans text-sm w-full"
        style={{
          padding: '0.625rem 0.75rem',
          border: '1px solid var(--rule)',
          borderRadius: '4px',
          backgroundColor: 'var(--bg)',
          color: 'var(--ink)',
          resize: 'vertical',
          lineHeight: 1.5,
        }}
      />

      <div className="flex items-center justify-between mt-2">
        <span
          className="font-sans text-xs tabular-nums"
          style={{ color: remaining < 50 ? 'var(--accent)' : 'var(--ink-2)' }}
        >
          {remaining} chars left
        </span>
        <button
          type="submit"
          disabled={!isValid || status === 'submitting'}
          className="font-sans text-sm font-medium"
          style={{
            padding: '0.5rem 1.25rem',
            backgroundColor: isValid ? 'var(--accent)' : 'var(--rule)',
            color: isValid ? 'var(--accent-ink)' : 'var(--ink-2)',
            border: 'none',
            borderRadius: '2px',
            cursor: isValid ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.15s ease',
          }}
        >
          {status === 'submitting' ? 'Sending…' : 'Send question'}
        </button>
      </div>

    </form>
  );
}
