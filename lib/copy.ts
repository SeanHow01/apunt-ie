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

export const fireupExplainer =
  'FiRe Up is a free financial wellbeing course provided by MABS (Money Advice and Budgeting Service) and Atlantic Technological University. It takes about 90 minutes and covers budgeting, debt, and planning ahead. Punt is independent.';

/* ── Number spelling ────────────────────────────────────────────────────── */

const SPELL_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];

/**
 * Spell out integers 0–10 as words; return the numeral string for anything
 * outside that range. Use in editorial body copy — not in data tables,
 * calculators, or monospaced metadata (dates, "1 of 6", durations).
 *
 *   spell(8)  → "eight"
 *   spell(12) → "12"
 */
export function spell(n: number): string {
  return n >= 0 && n <= 10 ? SPELL_WORDS[n] : String(n);
}

/** spell(n) with the first letter capitalised. */
export function Spell(n: number): string {
  const s = spell(n);
  return s.charAt(0).toUpperCase() + s.slice(1);
}
