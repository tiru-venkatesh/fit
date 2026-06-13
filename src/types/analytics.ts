export interface WeightLogEntry {
  date: string; // YYYY-MM-DD
  weight: number; // always aligned with user's current metrics
}

export interface BodyFatLogEntry {
  date: string;
  bodyFatPercent: number;
}

export interface WorkoutFrequencyEntry {
  dayName: string; // E.g. "Mon", "Tue"
  count: number;
}

export interface MuscleGroupVolumeEntry {
  category: string;
  setsCompleted: number;
}

export interface MetricSummary {
  currentWeight: number;
  weightChange: number; // negative for down, positive for up
  currentBMI: number;
  healthScore: number; // 0 - 100 calculated assessment score
  fitnessScore: number; // 0 - 100,
  consistencyScore: number; // 0 - 100 based on consecutive days and workout logins
}
