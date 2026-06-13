export type MuscleGroup = 'Chest' | 'Back' | 'Shoulders' | 'Legs' | 'Arms' | 'Core' | 'Cardio';

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weight: number; // always stored in absolute for the record, displayed by preference
  reps: number;
  completed: boolean;
}

export interface WorkoutLog {
  id: string;
  exerciseName: string;
  category: MuscleGroup;
  sets: WorkoutSet[];
}

export interface CompleteWorkoutSession {
  id: string;
  userId: string;
  date: string; // ISO date
  durationMinutes: number;
  exercises: WorkoutLog[];
  notes?: string;
  caloriesBurned?: number;
  creatorId?: string;
  isAssignedByOwner?: boolean;
}

export interface WorkoutStreak {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
}
