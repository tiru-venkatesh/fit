export function kgToLbs(kg: number): number {
  return kg * 2.20462;
}

export function lbsToKg(lbs: number): number {
  return lbs / 2.20462;
}

export function cmToFeetAndInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
}

export function feetAndInchesToCm(feet: number, inches: number): number {
  return (feet * 12 + inches) * 2.54;
}

export function formatWeight(weight: number, unit: 'kg' | 'lbs'): string {
  return `${Math.round(weight)} ${unit}`;
}

export function formatHeight(height: number, unit: 'cm' | 'feet'): string {
  if (unit === 'cm') {
    return `${Math.round(height)} cm`;
  } else {
    const { feet, inches } = cmToFeetAndInches(height);
    return `${feet}'${inches}"`;
  }
}

export function getNormalizedWeightKg(weight: number, unit: 'kg' | 'lbs'): number {
  return unit === 'kg' ? weight : lbsToKg(weight);
}

export function getNormalizedHeightCm(height: number, unit: 'cm' | 'feet'): number {
  // Height inputs for CM can be cm directly. If feet, we treat the number as representing feet,
  // or we write a converter that parses numeric values. To stay fully robust, we convert.
  return unit === 'cm' ? height : height * 30.48;
}
