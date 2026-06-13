import { GoalType } from '../types/profile';

export function calculateGoalTimeline(
  currentWeight: number,
  targetWeight: number,
  goalType: GoalType
): number {
  const diff = Math.abs(currentWeight - targetWeight);
  if (diff === 0) return 4; // Minimal baseline of 4 weeks for programming

  // Healthy weekly weight loss or gain rate is typically 0.5kg (1lb) to 1.0kg (2lbs)
  let changeRatePerWeek = 0.5; // in standard normalized kg

  if (goalType === 'Fat Loss') {
    changeRatePerWeek = 0.6; // Average 1.3 lbs a week
  } else if (goalType === 'Muscle Gain') {
    changeRatePerWeek = 0.25; // Lean muscle gain is slower, about 0.5 lbs a week safely
  } else {
    changeRatePerWeek = 0.4;
  }

  const estimatedWeeks = Math.ceil(diff / changeRatePerWeek);
  
  // Keep values bounded to standard reasonable bounds (4 - 48 weeks)
  return Math.max(4, Math.min(48, estimatedWeeks));
}
