import { useMemo } from 'react';
import { calculateGoalTimeline } from '../utils/timeline';
import { GoalType } from '../types/profile';

export function useTimeline(currentWeight: number, targetWeight: number, goalType: GoalType) {
  return useMemo(() => {
    return calculateGoalTimeline(currentWeight, targetWeight, goalType);
  }, [currentWeight, targetWeight, goalType]);
}
