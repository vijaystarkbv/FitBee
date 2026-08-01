// Bidirectional Unit Conversion Helpers
// Standard DB Formats: height_cm, weight_kg, max_dumbbell_weight_kg

export const CM_PER_INCH = 2.54;
export const INCHES_PER_FOOT = 12;
export const KG_PER_LB = 0.45359237;

/**
 * Converts Height in cm to Feet & Inches
 */
export function cmToFtIn(cm: number): { ft: number; in: number } {
  if (!cm || cm <= 0) return { ft: 0, in: 0 };
  const totalInches = cm / CM_PER_INCH;
  const ft = Math.floor(totalInches / INCHES_PER_FOOT);
  const inches = Math.round(totalInches % INCHES_PER_FOOT);
  
  if (inches === 12) {
    return { ft: ft + 1, in: 0 };
  }
  return { ft, in: inches };
}

/**
 * Converts Feet & Inches to Height in cm
 */
export function ftInToCm(ft: number, inches: number): number {
  const totalInches = (ft || 0) * INCHES_PER_FOOT + (inches || 0);
  return Number((totalInches * CM_PER_INCH).toFixed(1));
}

/**
 * Converts Weight in kg to lbs
 */
export function kgToLbs(kg: number): number {
  if (!kg || kg <= 0) return 0;
  return Number((kg / KG_PER_LB).toFixed(1));
}

/**
 * Converts Weight in lbs to kg
 */
export function lbsToKg(lbs: number): number {
  if (!lbs || lbs <= 0) return 0;
  return Number((lbs * KG_PER_LB).toFixed(1));
}
