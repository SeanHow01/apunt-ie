/**
 * Centralised copy variants so they're easy to update.
 * Never include dark humour, housing jokes, or cynical references.
 */

export const heroHeadlines = [
  'Your money, explained properly.',
  'Money, without the waffle.',
  'A guide to your wages, written in plain English.',
  'The things no one told you about your payslip.',
] as const;

export function getHeroHeadline(): string {
  // Stable per-day rotation so it feels editorial, not random
  const idx = Math.floor(Date.now() / 86_400_000) % heroHeadlines.length;
  return heroHeadlines[idx];
}

export function getGreeting(firstName: string | null, hour?: number): string {
  const h = hour ?? new Date().getHours();
  const timeGreeting =
    h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const name = firstName?.trim() ?? '';
  return name ? `${timeGreeting}, ${name}` : timeGreeting;
}

export const volumeLabel = 'Vol. 01';

export const partnerLine = 'Higher Education Authority · CCPC · MABS';

export const fireupExplainer =
  'FiRe Up is a free financial wellbeing course from MABS — the Money Advice and Budgeting Service. It takes about two hours and covers budgeting, debt, and planning ahead. Completing it alongside these lessons gives you a solid foundation.';
