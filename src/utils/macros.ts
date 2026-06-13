import { GoalType } from '../types/profile';

export interface MacronutrientSplit {
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
}

export function calculateMacros(recommendedCalories: number, goalType: GoalType): MacronutrientSplit {
  let proteinPct = 0.30;
  let carbsPct = 0.45;
  let fatPct = 0.25;

  switch (goalType) {
    case 'Fat Loss':
      proteinPct = 0.40;
      carbsPct = 0.35;
      fatPct = 0.25;
      break;
    case 'Muscle Gain':
      proteinPct = 0.30;
      carbsPct = 0.45;
      fatPct = 0.25;
      break;
    case 'Recomposition':
      proteinPct = 0.35;
      carbsPct = 0.40;
      fatPct = 0.25;
      break;
    case 'Strength':
    case 'Athletic':
      proteinPct = 0.25;
      carbsPct = 0.50;
      fatPct = 0.25;
      break;
    case 'General Fitness':
    default:
      proteinPct = 0.30;
      carbsPct = 0.45;
      fatPct = 0.25;
      break;
  }

  const proteinKcal = recommendedCalories * proteinPct;
  const carbsKcal = recommendedCalories * carbsPct;
  const fatKcal = recommendedCalories * fatPct;

  return {
    proteinGrams: Math.round(proteinKcal / 4),
    carbsGrams: Math.round(carbsKcal / 4),
    fatGrams: Math.round(fatKcal / 9),
  };
}
