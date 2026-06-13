import { ActivityLevel, GoalType } from '../types/profile';

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  'Sedentary': 1.2,
  'Lightly Active': 1.375,
  'Moderately Active': 1.55,
  'Very Active': 1.725,
  'Athlete': 1.9,
};

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return Math.round(bmr * multiplier);
}

export function calculateRecommendedCalories(tdee: number, goalType: GoalType): number {
  switch (goalType) {
    case 'Fat Loss':
      // 500 kcal deficit, enforce safe floors
      return Math.max(1200, Math.round(tdee - 500));
    case 'Muscle Gain':
      return Math.round(tdee + 300);
    case 'Recomposition':
      return tdee;
    case 'Strength':
    case 'Athletic':
      return Math.round(tdee + 150);
    case 'General Fitness':
    default:
      return tdee;
  }
}

export function calculateWaterIntake(weightKg: number, activityLevel: ActivityLevel): number {
  // Base water requirement: 35ml per kg of weight
  let baseWaterLiters = weightKg * 0.035;
  
  // Add direct volume for higher activity
  if (activityLevel === 'Very Active' || activityLevel === 'Athlete') {
    baseWaterLiters += 1.0;
  } else if (activityLevel === 'Moderately Active') {
    baseWaterLiters += 0.5;
  }
  
  return parseFloat(Math.max(2.0, Math.min(6.0, baseWaterLiters)).toFixed(1));
}

export function calculateSleepTarget(activityLevel: ActivityLevel): number {
  if (activityLevel === 'Athlete' || activityLevel === 'Very Active') {
    return 8.5; // athletes require more recovery sleep
  }
  return 8.0;
}
