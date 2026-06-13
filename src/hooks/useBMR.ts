import { useMemo } from 'react';
import { calculateBMR } from '../utils/bmr';
import { GenderType } from '../types/profile';

export function useBMR(
  weight: number,
  weightUnit: 'kg' | 'lbs',
  height: number,
  heightUnit: 'cm' | 'feet',
  age: number,
  gender: GenderType
) {
  return useMemo(() => {
    return calculateBMR(weight, weightUnit, height, heightUnit, age, gender);
  }, [weight, weightUnit, height, heightUnit, age, gender]);
}
