# Take-Home Calculator — Validation

**Last reviewed:** April 2026  
**Reviewed against:** Revenue.ie Budget 2026 summary (Finance Act 2025, effective 1 January 2026)

---

## Rates used in `lib/tax.ts`

| Parameter | Value | Source |
|-----------|-------|--------|
| Standard rate | 20% | Revenue.ie PAYE |
| Higher rate | 40% | Revenue.ie PAYE |
| Standard rate cutoff (single) | €44,000 | Budget 2026 |
| Personal + PAYE tax credits | €4,000 | Budget 2026 (€1,875 + €1,875 + €125 increase each) → effectively €4,000 combined |
| USC — Band 1 (0.5%) ceiling | €12,012 | Budget 2026 |
| USC — Band 2 (2%) ceiling | €27,382 | Budget 2026 |
| USC — Band 3 (4%) ceiling | €70,044 | Budget 2026 |
| USC — Band 4 rate | 8% | Budget 2026 |
| USC exemption threshold | €13,000 | Budget 2026 |
| PRSI rate (employee, Class A) | 4.1% | Budget 2026 (increased from 4.0% in 2025) |

### Discrepancy note — build prompt spec vs implemented rates

The feature spec (written before Budget 2026 was finalised) referenced:
- PAYE cutoff: €42,000 — this is the **Budget 2025** figure
- PRSI: 4.0% — this is the **Budget 2025** figure
- USC Band 2 ceiling: €25,760 — this is the **Budget 2025** figure

**The implemented rates are correct for Budget 2026.** The spec contained pre-Budget figures. No code change is needed; this document records the reconciliation.

---

## Model assumptions and scope

- **Single PAYE worker** — no joint assessment, no self-employment income.
- **Standard rate band** applies at €44,000 for a single person (can be increased for e.g. married couples; not modelled).
- **Tax credits used:** Personal Tax Credit (€1,875) + Employee Tax Credit (€1,875) = €3,750, plus the Home Carer Credit is **not** included. The combined credit constant of €4,000 in code includes the 2026 budget increase to both credits.
- **PRSI:** Class A1 employee rate (4.1%). PRSI does not reduce taxable income for USC/PAYE.
- **USC:** Applied on gross income. Not reduced by pension contributions in this calculator (see pension calculator for interaction).
- **Out of scope:** PAYE Exclusion Orders, split year relief, SCSB, pension, BIK, non-standard credits.

---

## Test cases — manual verification

The formula in `calcNet(grossAnnual)`:

```
grossPaye = min(gross, 44000) × 0.20 + max(0, gross - 44000) × 0.40
paye      = max(0, grossPaye - 4000)

usc (if gross > 13000):
  band1 = min(gross, 12012) × 0.005
  band2 = max(0, min(gross, 27382) - 12012) × 0.02
  band3 = max(0, min(gross, 70044) - 27382) × 0.04
  band4 = max(0, gross - 70044) × 0.08
  usc   = band1 + band2 + band3 + band4

prsi = gross × 0.041
net  = gross - paye - usc - prsi
```

All values rounded to nearest integer on output.

---

### Case 1: €25,000 (below standard rate)

| Component | Calculation | Amount |
|-----------|-------------|--------|
| Gross PAYE | 25,000 × 20% = 5,000; credits 4,000 | **€1,000** |
| USC Band 1 | 12,012 × 0.5% | €60 |
| USC Band 2 | (25,000 − 12,012) × 2% = 12,988 × 2% | €260 |
| USC Band 3 | max(0, 25,000 − 27,382) = 0 | €0 |
| **USC total** | | **€320** |
| PRSI | 25,000 × 4.1% | **€1,025** |
| **Net take-home** | 25,000 − 1,000 − 320 − 1,025 | **€22,655** |
| Effective rate | (1,000 + 320 + 1,025) / 25,000 | **18.6%** |

---

### Case 2: €40,000 (below standard rate, all USC bands 1–3)

| Component | Calculation | Amount |
|-----------|-------------|--------|
| Gross PAYE | 40,000 × 20% = 8,000; credits 4,000 | **€4,000** |
| USC Band 1 | 12,012 × 0.5% | €60 |
| USC Band 2 | (27,382 − 12,012) × 2% = 15,370 × 2% | €307 |
| USC Band 3 | (40,000 − 27,382) × 4% = 12,618 × 4% | €505 |
| **USC total** | | **€872** |
| PRSI | 40,000 × 4.1% | **€1,640** |
| **Net take-home** | 40,000 − 4,000 − 872 − 1,640 | **€33,488** |
| Effective rate | (4,000 + 872 + 1,640) / 40,000 | **16.3%** |

---

### Case 3: €50,000 (crosses standard rate band at €44,000)

| Component | Calculation | Amount |
|-----------|-------------|--------|
| Gross PAYE | (44,000 × 20%) + (6,000 × 40%) = 8,800 + 2,400 = 11,200; credits 4,000 | **€7,200** |
| USC Band 1 | 12,012 × 0.5% | €60 |
| USC Band 2 | (27,382 − 12,012) × 2% | €307 |
| USC Band 3 | (50,000 − 27,382) × 4% = 22,618 × 4% | €905 |
| **USC total** | | **€1,272** |
| PRSI | 50,000 × 4.1% | **€2,050** |
| **Net take-home** | 50,000 − 7,200 − 1,272 − 2,050 | **€39,478** |
| Effective rate | (7,200 + 1,272 + 2,050) / 50,000 | **21.0%** |

---

### Case 4: €80,000 (crosses USC Band 4 at €70,044)

| Component | Calculation | Amount |
|-----------|-------------|--------|
| Gross PAYE | (44,000 × 20%) + (36,000 × 40%) = 8,800 + 14,400 = 23,200; credits 4,000 | **€19,200** |
| USC Band 1 | 12,012 × 0.5% | €60 |
| USC Band 2 | (27,382 − 12,012) × 2% | €307 |
| USC Band 3 | (70,044 − 27,382) × 4% = 42,662 × 4% | €1,707 |
| USC Band 4 | (80,000 − 70,044) × 8% = 9,956 × 8% | €796 |
| **USC total** | | **€2,870** |
| PRSI | 80,000 × 4.1% | **€3,280** |
| **Net take-home** | 80,000 − 19,200 − 2,870 − 3,280 | **€54,650** |
| Effective rate | (19,200 + 2,870 + 3,280) / 80,000 | **31.7%** |

---

## Marginal rates summary

| Gross range | Marginal rate (PAYE + USC + PRSI) |
|-------------|-----------------------------------|
| €0 – €12,012 | 0% PAYE + 0.5% USC + 4.1% PRSI = **4.6%** |
| €12,013 – €13,000 | 0% + 2% + 4.1% = **6.1%** (below USC exemption: 0% USC) |
| €13,001 – €27,382 | 20% + 2% + 4.1% = **26.1%** |
| €27,383 – €44,000 | 20% + 4% + 4.1% = **28.1%** |
| €44,001 – €70,044 | 40% + 4% + 4.1% = **48.1%** |
| €70,045+ | 40% + 8% + 4.1% = **52.1%** |

*Note: credits (€4,000) reduce the PAYE liability but do not change the marginal rate calculation above the credit threshold.*

---

## Limitations to communicate to users

1. **Single PAYE worker only.** Does not model joint assessment, restricted non-residents, or PAYE Exclusion Orders.
2. **Standard credits only.** Additional credits (Home Carer, Dependent Relative, Single Person Child Carer, etc.) are not applied.
3. **No pension interaction.** Pension contributions reduce taxable income for PAYE only — not for USC or PRSI. The pension calculator handles this separately.
4. **No BIK (Benefit in Kind).** Company cars, health insurance, etc. are not modelled.
5. **Rounding:** Output values are rounded to the nearest euro. Payslip figures may differ slightly due to cumulative basis (pay period vs annual).
6. **Emergency tax:** Not modelled. Correct tax credit allocation is assumed.

---

## Primary source

Revenue.ie — [Budget 2026 Summary](https://www.revenue.ie/en/corporate/press-office/budget-information/2026/index.aspx)
