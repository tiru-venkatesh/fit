import { useMemo } from 'react';
import { calculateTDEE, calculateRecommendedCalories, calculateWaterIntake, calculateSleepTarget } from '../utils/calories';
import { ActivityLevel, GoalType } from '../types/profile';

export function useCalories(
  bmr: number,
  weightKg: number,
  activityLevel: ActivityLevel,
  goalType: GoalType
) {
  return useMemo(() => {
    const tdee = calculateTDEE(bmr, activityLevel);
    const recommendedCalories = calculateRecommendedCalories(tdee, goalType);
    const waterIntakeLiters = calculateWaterIntake(weightKg, activityLevel);
    const sleepTargetHours = calculateSleepTarget(activityLevel);
    
    return {
      tdee,
      recommendedCalories,
      waterIntakeLiters,
      sleepTargetHours,
    };
  }, [bmr, weightKg, activityLevel, goalType]);
}
