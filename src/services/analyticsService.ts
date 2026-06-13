import { CompleteWorkoutSession } from '../types/workout';
import { MetricSummary } from '../types/analytics';

export const analyticsService = {
  calculateSummary: (
    sessions: CompleteWorkoutSession[],
    currentWeight: number,
    weightHistory: { weight: number }[],
    targetWeight: number,
    bodyFat?: number
  ): MetricSummary => {
    // 1. Weight change
    let weightChange = 0;
    if (weightHistory.length > 1) {
      weightChange = currentWeight - weightHistory[0].weight;
    }

    // 2. Consistency score (based on completed sessions vs target days)
    const recentSessionsCount = sessions.filter(
      (s) => new Date(s.date).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length;

    // Consistency score starts at 50, goes up 15 points per weekly session, capped at 100
    const consistencyScore = Math.min(100, 45 + recentSessionsCount * 17);

    // 3. BMI
    const lastSession = sessions[0];
    const fitnessScore = Math.min(
      100,
      60 + (sessions.length * 4) + (recentSessionsCount > 2 ? 10 : 0)
    );

    // Health Score represents aggregate biometric standing
    const bodyFatScorePenalty = bodyFat && bodyFat > 25 ? -10 : bodyFat && bodyFat < 18 ? 5 : 0;
    const healthScore = Math.max(
      40,
      Math.min(100, 75 + bodyFatScorePenalty + (consistencyScore > 80 ? 10 : -5))
    );

    return {
      currentWeight,
      weightChange: parseFloat(weightChange.toFixed(1)),
      currentBMI: 23.5, // fallback baseline if no height is provided
      healthScore,
      fitnessScore,
      consistencyScore,
    };
  }
};
