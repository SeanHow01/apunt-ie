export type TaxBreakdown = {
  gross: number;
  net: number;
  paye: number;
  usc: number;
  prsi: number;
};

/**
 * Budget 2026 take-home calculator.
 * Single PAYE worker, standard credits (personal + PAYE = €4,000).
 *
 * TODO(pre-pilot): validate these rates and bands against Revenue.ie before
 * showing to university partners or the Department of Finance. Rates assumed:
 * standard rate cutoff €44,000, credits €4,000, USC bands per Budget 2026,
 * PRSI 4.1%. Formula is correct per spec; reference expected values were not
 * independently verified.
 */
export function calcNet(grossAnnual: number): TaxBreakdown {
  const PAYE_CUTOFF = 44000;
  const CREDITS = 4000;

  const grossPaye =
    Math.min(grossAnnual, PAYE_CUTOFF) * 0.2 +
    Math.max(0, grossAnnual - PAYE_CUTOFF) * 0.4;
  const paye = Math.max(0, grossPaye - CREDITS);

  let usc = 0;
  if (grossAnnual > 13000) {
    usc +=
      Math.min(grossAnnual, 12012) * 0.005 +
      Math.max(0, Math.min(grossAnnual, 27382) - 12012) * 0.02 +
      Math.max(0, Math.min(grossAnnual, 70044) - 27382) * 0.04 +
      Math.max(0, grossAnnual - 70044) * 0.08;
  }

  const prsi = grossAnnual * 0.041;
  const net = grossAnnual - paye - usc - prsi;

  return {
    gross: Math.round(grossAnnual),
    net: Math.round(net),
    paye: Math.round(paye),
    usc: Math.round(usc),
    prsi: Math.round(prsi),
  };
}

export function formatEuro(n: number): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);
}

export function pct(part: number, total: number): string {
  if (total === 0) return '0%';
  return ((part / total) * 100).toFixed(1) + '%';
}
