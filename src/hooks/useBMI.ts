import { useMemo } from 'react';
import { calculateBMI, getBMICategory, getBMIMessage } from '../utils/bmi';

export function useBMI(weight: number, weightUnit: 'kg' | 'lbs', height: number, heightUnit: 'cm' | 'feet') {
  return useMemo(() => {
    const value = calculateBMI(weight, weightUnit, height, heightUnit);
    const category = getBMICategory(value);
    const message = getBMIMessage(value);
    return { value, category, message };
  }, [weight, weightUnit, height, heightUnit]);
}
