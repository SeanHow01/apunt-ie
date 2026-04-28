/**
 * Rent Pressure Zone (RPZ) data for Ireland.
 * Source: Residential Tenancies Board (RTB) — rtb.ie/rent-pressure-zones
 *
 * RPZ rules (Residential Tenancies (Amendment) Act 2019 as amended):
 *   - Rent increases in RPZs are capped at the lower of:
 *       (a) 2% per annum (pro-rated for shorter periods), or
 *       (b) the rate of general inflation (HICP — Harmonised Index of Consumer Prices)
 *   - The cap applies to existing tenancies only; new tenancies are set at market rate.
 *   - Landlords must provide a Rent Review Notice with a Rent Pressure Zone Calculator
 *     certificate from the RTB confirming the allowable increase.
 *   - Exemptions apply for properties where substantial works have been carried out.
 *
 * RPZ designations are reviewed annually. The list below is current as of April 2026.
 * Always verify at rtb.ie before acting.
 *
 * Ireland is divided into Local Electoral Areas (LEAs). Dublin City, Cork City,
 * and several county areas are fully designated as RPZs.
 */

export const RPZ_CAP_PCT = 2; // % per annum
export const RPZ_LAST_UPDATED = 'April 2026';

export type RPZArea = {
  county: string;
  localArea: string | null; // null = entire county
  isRPZ: boolean;
  notes?: string;
};

/** Comprehensive list of RPZ designations (county and LEA level) */
export const RPZ_AREAS: RPZArea[] = [

  // ── Dublin ────────────────────────────────────────────────────────────────
  // Dublin City Council — fully designated
  { county: 'Dublin City', localArea: null, isRPZ: true },

  // Dún Laoghaire-Rathdown — fully designated
  { county: 'Dún Laoghaire-Rathdown', localArea: null, isRPZ: true },

  // Fingal — fully designated
  { county: 'Fingal', localArea: null, isRPZ: true },

  // South Dublin — fully designated
  { county: 'South Dublin', localArea: null, isRPZ: true },

  // ── Cork ──────────────────────────────────────────────────────────────────
  { county: 'Cork City', localArea: null, isRPZ: true },
  { county: 'Cork County', localArea: 'Ballincollig-Carrigaline', isRPZ: true },
  { county: 'Cork County', localArea: 'Cobh', isRPZ: true },
  { county: 'Cork County', localArea: 'Blarney-Macroom', isRPZ: true },

  // ── Galway ────────────────────────────────────────────────────────────────
  { county: 'Galway City', localArea: null, isRPZ: true },
  { county: 'Galway County', localArea: 'Oranmore-Athenry', isRPZ: true },

  // ── Kildare ───────────────────────────────────────────────────────────────
  { county: 'Kildare', localArea: 'Celbridge-Leixlip', isRPZ: true },
  { county: 'Kildare', localArea: 'Naas', isRPZ: true },
  { county: 'Kildare', localArea: 'Kildare-Newbridge', isRPZ: true },
  { county: 'Kildare', localArea: 'Maynooth', isRPZ: true },
  { county: 'Kildare', localArea: 'Athy', isRPZ: false, notes: 'Not designated as RPZ' },

  // ── Meath ─────────────────────────────────────────────────────────────────
  { county: 'Meath', localArea: 'Ashbourne', isRPZ: true },
  { county: 'Meath', localArea: 'Laytown-Bettystown', isRPZ: true },
  { county: 'Meath', localArea: 'Navan', isRPZ: true },
  { county: 'Meath', localArea: 'Ratoath', isRPZ: true },
  { county: 'Meath', localArea: 'Trim', isRPZ: false, notes: 'Not designated as RPZ' },

  // ── Wicklow ───────────────────────────────────────────────────────────────
  { county: 'Wicklow', localArea: 'Bray', isRPZ: true },
  { county: 'Wicklow', localArea: 'Greystones-Delgany', isRPZ: true },
  { county: 'Wicklow', localArea: 'Wicklow', isRPZ: true },
  { county: 'Wicklow', localArea: 'Arklow', isRPZ: false, notes: 'Not designated as RPZ' },

  // ── Louth ─────────────────────────────────────────────────────────────────
  { county: 'Louth', localArea: 'Drogheda', isRPZ: true },
  { county: 'Louth', localArea: 'Dundalk-Carlingford', isRPZ: true },

  // ── Limerick ──────────────────────────────────────────────────────────────
  { county: 'Limerick City and County', localArea: 'Limerick City', isRPZ: true },
  { county: 'Limerick City and County', localArea: 'Limerick Metropolitan', isRPZ: true },

  // ── Waterford ─────────────────────────────────────────────────────────────
  { county: 'Waterford City and County', localArea: 'Waterford City', isRPZ: true },

  // ── Westmeath ─────────────────────────────────────────────────────────────
  { county: 'Westmeath', localArea: 'Athlone', isRPZ: true },

  // ── Clare ─────────────────────────────────────────────────────────────────
  { county: 'Clare', localArea: 'Ennis', isRPZ: true },

  // ── Wexford ───────────────────────────────────────────────────────────────
  { county: 'Wexford', localArea: 'Wexford', isRPZ: true },
  { county: 'Wexford', localArea: 'Gorey', isRPZ: false, notes: 'Not designated as RPZ' },
];

/** Get all unique counties in the dataset */
export function getCounties(): string[] {
  return [...new Set(RPZ_AREAS.map((a) => a.county))].sort();
}

/** Get local areas for a county (null entry means the whole county is designated) */
export function getLocalAreas(county: string): RPZArea[] {
  return RPZ_AREAS.filter((a) => a.county === county);
}

/** Check RPZ status for a given county + optional local area */
export function checkRPZ(county: string, localArea: string | null): {
  isRPZ: boolean;
  wholeCounty: boolean;
  notes?: string;
} {
  const countyAreas = getLocalAreas(county);
  if (countyAreas.length === 0) {
    return { isRPZ: false, wholeCounty: false, notes: 'County not found in database' };
  }

  // Check if whole county is designated (localArea === null in data)
  const wholeCountyEntry = countyAreas.find((a) => a.localArea === null);
  if (wholeCountyEntry) {
    return { isRPZ: wholeCountyEntry.isRPZ, wholeCounty: true };
  }

  // County has area-level designations — look up specific area
  if (localArea) {
    const areaEntry = countyAreas.find(
      (a) => a.localArea?.toLowerCase() === localArea.toLowerCase(),
    );
    if (areaEntry) {
      return { isRPZ: areaEntry.isRPZ, wholeCounty: false, notes: areaEntry.notes };
    }
    return {
      isRPZ: false,
      wholeCounty: false,
      notes: 'Area not found — check rtb.ie for the definitive designation',
    };
  }

  return { isRPZ: false, wholeCounty: false, notes: 'Select your local area for this county' };
}

/**
 * Calculate the maximum allowable rent increase in an RPZ.
 * @param currentRent Monthly rent (€)
 * @param months How long since the last review (must be at least 12)
 */
export function calcMaxRPZIncrease(currentRent: number, months: number): {
  maxMonthlyRent: number;
  maxAnnualIncrease: number;
  cappedAtPct: number;
} {
  const years = months / 12;
  const cappedAtPct = RPZ_CAP_PCT;
  const maxMonthlyRent = currentRent * Math.pow(1 + cappedAtPct / 100, years);
  const maxAnnualIncrease = (maxMonthlyRent - currentRent) * 12;
  return {
    maxMonthlyRent: Math.round(maxMonthlyRent * 100) / 100,
    maxAnnualIncrease: Math.round(maxAnnualIncrease * 100) / 100,
    cappedAtPct,
  };
}
