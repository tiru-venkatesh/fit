import { getNormalizedWeightKg, getNormalizedHeightCm } from './formatter';
import { GenderType } from '../types/profile';

export function calculateBMR(
  weight: number,
  weightUnit: 'kg' | 'lbs',
  height: number,
  heightUnit: 'cm' | 'feet',
  age: number,
  gender: GenderType
): number {
  const wKg = getNormalizedWeightKg(weight, weightUnit);
  const hCm = getNormalizedHeightCm(height, heightUnit);
  
  if (wKg <= 0 || hCm <= 0 || age <= 0) return 0;

  // Mifflin-St Jeor Equation
  let bmrValue = 0;
  if (gender === 'male') {
    bmrValue = 10 * wKg + 6.25 * hCm - 5 * age + 5;
  } else if (gender === 'female') {
    bmrValue = 10 * wKg + 6.25 * hCm - 5 * age - 161;
  } else {
    // Average representation
    const bMale = 10 * wKg + 6.25 * hCm - 5 * age + 5;
    const bFemale = 10 * wKg + 6.25 * hCm - 5 * age - 161;
    bmrValue = (bMale + bFemale) / 2;
  }

  return Math.round(bmrValue);
}
