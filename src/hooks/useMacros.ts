import { useMemo } from 'react';
import { calculateMacros } from '../utils/macros';
import { GoalType } from '../types/profile';

export function useMacros(recommendedCalories: number, goalType: GoalType) {
  return useMemo(() => {
    return calculateMacros(recommendedCalories, goalType);
  }, [recommendedCalories, goalType]);
}
