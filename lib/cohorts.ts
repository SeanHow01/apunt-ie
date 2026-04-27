/**
 * Cohort definitions for institutional partnerships.
 * Each cohort maps to a /join/[id] landing page.
 *
 * `institutionName` must match one of the values in the sign-up form's INSTITUTIONS list
 * so that it can be pre-selected on arrival from a /join link.
 */

export type Cohort = {
  /** URL slug — used in /join/[id] and stored as cohort_id in profiles */
  id: string;
  /** Short display name */
  name: string;
  /** Full institution name */
  fullName: string;
  /** Value that matches the sign-up form institution dropdown */
  institutionName: string;
  /** Landing page headline */
  headline: string;
  /** Landing page subheading / welcome body (1–2 sentences) */
  body: string;
  /** Optional: what the institution partnership provides */
  partnerNote?: string;
};

const COHORTS: Cohort[] = [
  {
    id: 'ucd',
    name: 'UCD',
    fullName: 'University College Dublin',
    institutionName: 'UCD',
    headline: 'Your financial life, explained — for UCD students.',
    body: 'Free access to every Punt lesson and tool. From reading your first payslip to understanding your SUSI grant.',
    partnerNote: 'Punt is available free to all UCD students.',
  },
  {
    id: 'tcd',
    name: 'Trinity',
    fullName: 'Trinity College Dublin',
    institutionName: 'TCD',
    headline: 'Your money, demystified — for Trinity students.',
    body: 'Punt gives you plain-English answers to the financial questions nobody teaches in lectures.',
    partnerNote: 'Punt is available free to all Trinity students.',
  },
  {
    id: 'ucc',
    name: 'UCC',
    fullName: 'University College Cork',
    institutionName: 'UCC',
    headline: 'Financial clarity for UCC students.',
    body: 'Understand your payslip, your SUSI grant, and your borrowing options — before you need to.',
  },
  {
    id: 'dcu',
    name: 'DCU',
    fullName: 'Dublin City University',
    institutionName: 'DCU',
    headline: 'Your first job. Your first payslip. Your first Punt lesson.',
    body: 'Practical Irish financial education for DCU students — free, and built for your generation.',
    partnerNote: 'Punt is available free to all DCU students.',
  },
  {
    id: 'ul',
    name: 'UL',
    fullName: 'University of Limerick',
    institutionName: 'UL',
    headline: 'Money skills for UL students — and co-op workers.',
    body: 'Starting a co-op placement? Learn about emergency tax, payslips, and auto-enrolment before day one.',
  },
  {
    id: 'tud',
    name: 'TU Dublin',
    fullName: 'Technological University Dublin',
    institutionName: 'TU Dublin',
    headline: 'Financial tools built for TU Dublin students.',
    body: 'Real-world finance education — SUSI grants, loans, take-home pay, pensions — in plain English.',
  },
  {
    id: 'mtu',
    name: 'MTU',
    fullName: 'Munster Technological University',
    institutionName: 'MTU',
    headline: 'Your Punt. Your money. MTU students welcome.',
    body: 'Free Irish financial education — from your first payslip to your first pension contribution.',
  },
  {
    id: 'atu',
    name: 'ATU',
    fullName: 'Atlantic Technological University',
    institutionName: 'ATU',
    headline: 'Practical money skills for ATU students.',
    body: 'Punt makes Irish personal finance approachable — no jargon, no upselling, just clarity.',
  },
  {
    id: 'maynooth',
    name: 'Maynooth',
    fullName: 'Maynooth University',
    institutionName: 'Maynooth University',
    headline: 'Financial education for Maynooth students.',
    body: 'From understanding SUSI to reading your first payslip — Punt has you covered.',
  },
  {
    id: 'nuig',
    name: 'University of Galway',
    fullName: 'University of Galway',
    institutionName: 'University of Galway',
    headline: 'Your money, sorted — for University of Galway students.',
    body: 'Irish personal finance, explained plainly. Free for all University of Galway students.',
  },
];

/** Generic fallback for unrecognised institution IDs */
export const GENERIC_COHORT: Cohort = {
  id: 'generic',
  name: 'your college',
  fullName: 'your college',
  institutionName: 'Other',
  headline: 'Your financial life, explained.',
  body: 'Punt gives Irish students plain-English answers to personal finance — payslips, SUSI grants, auto-enrolment, and more.',
};

export function getCohort(id: string): Cohort {
  return COHORTS.find((c) => c.id === id.toLowerCase()) ?? GENERIC_COHORT;
}

export function getAllCohortIds(): string[] {
  return COHORTS.map((c) => c.id);
}
