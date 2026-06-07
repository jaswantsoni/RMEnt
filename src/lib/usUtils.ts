// US-specific tax rates by state (simplified - using average rates)
export const US_TAX_RATES: Record<string, number> = {
  AL: 0.0400, // Alabama
  AK: 0.0000, // Alaska (no state tax)
  AZ: 0.0560, // Arizona
  AR: 0.0650, // Arkansas
  CA: 0.0725, // California (base rate)
  CO: 0.0290, // Colorado
  CT: 0.0635, // Connecticut
  DE: 0.0000, // Delaware (no state tax)
  FL: 0.0600, // Florida
  GA: 0.0400, // Georgia
  HI: 0.0400, // Hawaii
  ID: 0.0600, // Idaho
  IL: 0.0625, // Illinois
  IN: 0.0700, // Indiana
  IA: 0.0600, // Iowa
  KS: 0.0650, // Kansas
  KY: 0.0600, // Kentucky
  LA: 0.0445, // Louisiana
  ME: 0.0550, // Maine
  MD: 0.0600, // Maryland
  MA: 0.0625, // Massachusetts
  MI: 0.0600, // Michigan
  MN: 0.0688, // Minnesota
  MS: 0.0700, // Mississippi
  MO: 0.0423, // Missouri
  MT: 0.0000, // Montana (no state tax)
  NE: 0.0550, // Nebraska
  NV: 0.0685, // Nevada
  NH: 0.0000, // New Hampshire (no state tax)
  NJ: 0.0663, // New Jersey
  NM: 0.0513, // New Mexico
  NY: 0.0400, // New York
  NC: 0.0475, // North Carolina
  ND: 0.0500, // North Dakota
  OH: 0.0575, // Ohio
  OK: 0.0450, // Oklahoma
  OR: 0.0000, // Oregon (no state tax)
  PA: 0.0600, // Pennsylvania
  RI: 0.0700, // Rhode Island
  SC: 0.0600, // South Carolina
  SD: 0.0450, // South Dakota
  TN: 0.0700, // Tennessee
  TX: 0.0625, // Texas
  UT: 0.0485, // Utah
  VT: 0.0600, // Vermont
  VA: 0.0530, // Virginia
  WA: 0.0650, // Washington
  WV: 0.0600, // West Virginia
  WI: 0.0500, // Wisconsin
  WY: 0.0400, // Wyoming
};

// Default tax rate (9.75% VAT)
export const DEFAULT_TAX_RATE = 0.0975;

// Free shipping threshold
export const FREE_SHIPPING_THRESHOLD = 1000;

// Standard shipping cost
export const STANDARD_SHIPPING_COST = 30;

/**
 * Get tax rate for a US state
 */
export function getTaxRate(state?: string): number {
  if (!state) return DEFAULT_TAX_RATE;
  return US_TAX_RATES[state.toUpperCase()] || DEFAULT_TAX_RATE;
}

/**
 * Calculate tax amount
 */
export function calculateTax(subtotal: number, state?: string): number {
  const rate = getTaxRate(state);
  return subtotal * rate;
}

/**
 * Calculate shipping cost
 */
export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
}

/**
 * Format price in INR
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(subtotal: number, state?: string) {
  const tax = calculateTax(subtotal, state);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
    currency: 'INR' as const,
  };
}
