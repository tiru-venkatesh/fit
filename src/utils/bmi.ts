import { getNormalizedWeightKg, getNormalizedHeightCm } from './formatter';

export function calculateBMI(
  weight: number,
  weightUnit: 'kg' | 'lbs',
  height: number,
  heightUnit: 'cm' | 'feet'
): number {
  const wKg = getNormalizedWeightKg(weight, weightUnit);
  const hCm = getNormalizedHeightCm(height, heightUnit);
  if (hCm <= 0) return 0;
  
  const hMeters = hCm / 100;
  const bmiVal = wKg / (hMeters * hMeters);
  return parseFloat(bmiVal.toFixed(1));
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function getBMIMessage(bmi: number): string {
  if (bmi < 18.5) return 'Focus on muscle building and energy-dense, nutrient-rich nutrition.';
  if (bmi < 25) return 'Excellent status! Maintain this zone through consistent, disciplined habits.';
  if (bmi < 30) return 'Consider mild caloric deficit paired with high-quality resistance training.';
  return 'Target structured lifestyle edits, caloric management, and low-impact activity.';
}
