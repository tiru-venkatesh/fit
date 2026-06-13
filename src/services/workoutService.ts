import { MuscleGroup } from '../types/workout';

export interface ExerciseDefinition {
  name: string;
  category: MuscleGroup;
  description: string;
  equipment: 'Barbell' | 'Dumbbell' | 'Cable' | 'Bodyweight' | 'Machine' | 'Cardio Static';
}

const EXERCISE_CATALOG: ExerciseDefinition[] = [
  { name: 'Barbell Bench Press', category: 'Chest', description: 'Compound chest movement for mass.', equipment: 'Barbell' },
  { name: 'Dumbbell Incline Bench', category: 'Chest', description: 'Upper chest focused pressing.', equipment: 'Dumbbell' },
  { name: 'Cable Chest Fly', category: 'Chest', description: 'Squeeze movement for inner chest fibers.', equipment: 'Cable' },
  { name: 'Weighted Pushup', category: 'Chest', description: 'Horizontal pressing master class.', equipment: 'Bodyweight' },
  
  { name: 'Conventional Deadlift', category: 'Back', description: 'Posterior chain builder.', equipment: 'Barbell' },
  { name: 'Pull-up', category: 'Back', description: 'Lats and upper back wideness builder.', equipment: 'Bodyweight' },
  { name: 'Seated Cable Row', category: 'Back', description: 'Horizontal pulling for density.', equipment: 'Cable' },
  { name: 'Single Arm Dumbbell Row', category: 'Back', description: 'Unilateral lat development.', equipment: 'Dumbbell' },

  { name: 'Overhead Barbell Press', category: 'Shoulders', description: 'Heavy shoulder mass press.', equipment: 'Barbell' },
  { name: 'Dumbbell Lateral Raise', category: 'Shoulders', description: 'Targets the side delts for wide looks.', equipment: 'Dumbbell' },
  { name: 'Cable Face Pull', category: 'Shoulders', description: 'Rear delt and posture stabilizer.', equipment: 'Cable' },

  { name: 'Barbell Back Squat', category: 'Legs', description: 'King of leg compound exercises.', equipment: 'Barbell' },
  { name: 'Romanian Deadlift', category: 'Legs', description: 'Hamstrings and glutes developer.', equipment: 'Barbell' },
  { name: 'Dumbbell Walking Lunge', category: 'Legs', description: 'Unilateral quad and glute conditioning.', equipment: 'Dumbbell' },
  { name: 'Seated Leg Press', category: 'Legs', description: 'Quad focus tension developer.', equipment: 'Machine' },

  { name: 'Incline Dumbbell Curl', category: 'Arms', description: 'Long-head bicep stretch curl.', equipment: 'Dumbbell' },
  { name: 'Tricep Cable Pushdown', category: 'Arms', description: 'Tricep lateral head focus.', equipment: 'Cable' },
  { name: 'Barbell Spider Curl', category: 'Arms', description: 'Bicep peaks generator.', equipment: 'Barbell' },

  { name: 'Hanging Leg Raise', category: 'Core', description: 'Lower abs and hip stabilizers.', equipment: 'Bodyweight' },
  { name: 'Weighted Ab Crunch', category: 'Core', description: 'Upper abdominal wall hypertrophy.', equipment: 'Cable' },
  { name: 'Ab Wheel Rollout', category: 'Core', description: 'Advanced core anti-extension builder.', equipment: 'Bodyweight' },

  { name: 'Incline Treadmill Sprints', category: 'Cardio', description: 'HIIT fat incinerating sprints.', equipment: 'Cardio Static' },
  { name: 'Assault Bike Intervals', category: 'Cardio', description: 'Vastus Lateralis and lung capacity builder.', equipment: 'Cardio Static' },
];

export const workoutService = {
  getExercises: (): ExerciseDefinition[] => {
    return EXERCISE_CATALOG;
  },

  getExercisesByCategory: (category: MuscleGroup): ExerciseDefinition[] => {
    return EXERCISE_CATALOG.filter((ex) => ex.category === category);
  },

  suggestSplit: (daysPerWeek: number, level: string): { name: string; split: string[] } => {
    if (daysPerWeek <= 3) {
      return {
        name: 'Full Body Compound Split',
        split: ['Day 1: Full Body A', 'Day 2: Rest / Active Recovery', 'Day 3: Full Body B', 'Day 4: Rest', 'Day 5: Full Body C', 'Day 6 & 7: Rest'],
      };
    } else if (daysPerWeek === 4) {
      return {
        name: 'Upper / Lower Hypertrophy Split',
        split: ['Day 1: Upper Chest & Back', 'Day 2: Lower Quads & Posterior', 'Day 3: Rest', 'Day 4: Upper Shoulders & Arms', 'Day 5: Lower Hamstrings & Core', 'Day 6 & 7: Rest'],
      };
    } else {
      return {
        name: 'Push / Pull / Legs (PPL) Split',
        split: ['Day 1: Push (Chest, Shoulders, Triceps)', 'Day 2: Pull (Back, Rear Delts, Biceps)', 'Day 3: Legs (Quads, Hamstrings, Calves)', 'Day 4: Push (Volume Focus)', 'Day 5: Pull + Core', 'Day 6: Legs + Cardio', 'Day 7: Rest'],
      };
    }
  }
};
