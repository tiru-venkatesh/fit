export type GenderType = 'male' | 'female' | 'other';
export type MassUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'feet';

export type GoalType = 'Fat Loss' | 'Muscle Gain' | 'Recomposition' | 'Strength' | 'Athletic' | 'General Fitness';
export type ActivityLevel = 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active' | 'Athlete';
export type DietType = 'Vegetarian' | 'Vegan' | 'Eggetarian' | 'Non Vegetarian';
export type WorkoutTime = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export interface BodyMeasurements {
  height: number;
  heightUnit: HeightUnit;
  weight: number;
  weightUnit: MassUnit;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  hip?: number;
  neck?: number;
  arm?: number;
  thigh?: number;
}

export interface FitnessGoals {
  targetWeight: number;
  targetWeightUnit: MassUnit;
  targetBodyFat?: number;
  goalType: GoalType;
  deadlineWeeks: number; // Goal timeline estimate in weeks or target date
}

export interface FitnessProfile {
  userId?: string;
  // Step 1: Personal
  fullName: string;
  age: number;
  gender: GenderType;
  dateOfBirth: string;
  
  // Step 2: Body Measurements
  measurements: BodyMeasurements;
  
  // Step 3: Goals
  goals: FitnessGoals;
  
  // Step 4: Lifestyle
  activityLevel: ActivityLevel;
  
  // Step 5: Diet
  dietType: DietType;
  allergies: string[];
  
  // Step 6: Gym Details
  hasGymAccess: boolean;
  fitnessLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  workoutDays: number[]; // days of week, e.g. [1, 3, 5] for Mon, Wed, Fri
  workoutTime?: WorkoutTime;
  
  isOnboarded: boolean;
}

export interface PhysiologicalCalculations {
  bmi: number;
  targetBmi: number;
  bmr: number;
  tdee: number;
  maintenanceCalories: number;
  recommendedCalories: number;
  waterIntakeLiters: number;
  sleepTargetHours: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  timelineWeeks: number;
}
