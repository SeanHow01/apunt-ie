import payslip from './payslip';
import autoEnrolment from './auto-enrolment';
import loans from './loans';
import rent from './rent';
import helpToBuy from './help-to-buy';
import susi from './susi';
import investing from './investing';
import taxBack from './tax-back';
import type { Module } from '@/content/types';

export const modules: Module[] = [
  payslip,
  autoEnrolment,
  loans,
  rent,
  helpToBuy,
  susi,
  investing,
  taxBack,
];

export function getModule(id: string): Module | undefined {
  return modules.find((m) => m.id === id);
}

export function getNextModule(currentId: string): Module | undefined {
  const idx = modules.findIndex((m) => m.id === currentId);
  if (idx === -1 || idx === modules.length - 1) return undefined;
  return modules[idx + 1];
}

export { payslip, autoEnrolment, loans, rent, helpToBuy, susi, investing, taxBack };
