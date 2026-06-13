import { create } from 'zustand';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { FitnessProfile, PhysiologicalCalculations } from '../types/profile';
import { calculateBMI } from '../utils/bmi';
import { calculateBMR } from '../utils/bmr';
import { calculateTDEE, calculateRecommendedCalories, calculateWaterIntake, calculateSleepTarget } from '../utils/calories';
import { calculateMacros } from '../utils/macros';
import { calculateGoalTimeline } from '../utils/timeline';
import { handleFirestoreError, OperationType } from '../utils/firebaseError';

interface ProfileActions {
  fetchProfile: (userId: string) => Promise<boolean>;
  updateProfile: (profile: Partial<FitnessProfile>) => Promise<void>;
  updateMeasurements: (measurements: Partial<FitnessProfile['measurements']>) => Promise<void>;
  updateGoals: (goals: Partial<FitnessProfile['goals']>) => Promise<void>;
  calculatePhysiology: () => PhysiologicalCalculations;
  resetProfile: () => Promise<void>;
  setOnboarded: (status: boolean) => Promise<void>;
}

const INITIAL_PROFILE: FitnessProfile = {
  fullName: 'Tiru Venkatesh',
  age: 26,
  gender: 'male',
  dateOfBirth: '2000-01-01',
  measurements: {
    height: 178,
    heightUnit: 'cm',
    weight: 84,
    weightUnit: 'kg',
    bodyFat: 22,
    chest: 104,
    waist: 92,
    hip: 101,
    neck: 39,
    arm: 37,
    thigh: 59,
  },
  goals: {
    targetWeight: 75,
    targetWeightUnit: 'kg',
    targetBodyFat: 14,
    goalType: 'Fat Loss',
    deadlineWeeks: 12,
  },
  activityLevel: 'Moderately Active',
  dietType: 'Non Vegetarian',
  allergies: ['Peanuts'],
  hasGymAccess: true,
  fitnessLevel: 'Intermediate',
  workoutDays: [1, 3, 5],
  workoutTime: 'Evening',
  isOnboarded: false, // Default to false for new users to trigger onboarding cleanly!
};

export const useProfileStore = create<{
  profile: FitnessProfile;
  allClientProfiles: Record<string, FitnessProfile>; // Gym Owner cache for global clients
} & ProfileActions>()((set, get) => ({
  profile: INITIAL_PROFILE,
  allClientProfiles: {},

  fetchProfile: async (userId) => {
    try {
      const docSnap = await getDoc(doc(db, 'clientProfiles', userId));
      if (docSnap.exists()) {
        const cloudProfile = docSnap.data() as FitnessProfile;
        set({ profile: { ...cloudProfile, userId } });
        return true;
      } else {
        // Create initial default profile on cloud
        const initialWithUser: FitnessProfile = { 
          ...INITIAL_PROFILE, 
          userId, 
          fullName: auth.currentUser?.displayName || INITIAL_PROFILE.fullName 
        };
        await setDoc(doc(db, 'clientProfiles', userId), initialWithUser);
        set({ profile: initialWithUser });
        return false;
      }
    } catch (error) {
      console.warn("Could not fetch client profile, fallback to local:", error);
      return false;
    }
  },

  updateProfile: async (updates) => {
    const updated = { ...get().profile, ...updates };
    set({ profile: updated });

    const uid = auth.currentUser?.uid;
    if (uid) {
      try {
        await setDoc(doc(db, 'clientProfiles', uid), updated, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `clientProfiles/${uid}`);
      }
    }
  },

  updateMeasurements: async (updates) => {
    const updatedMeasurements = { ...get().profile.measurements, ...updates };
    const updated = { ...get().profile, measurements: updatedMeasurements };
    set({ profile: updated });

    const uid = auth.currentUser?.uid;
    if (uid) {
      try {
        await setDoc(doc(db, 'clientProfiles', uid), updated, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `clientProfiles/${uid}`);
      }
    }
  },

  updateGoals: async (updates) => {
    const updatedGoals = { ...get().profile.goals, ...updates };
    const updated = { ...get().profile, goals: updatedGoals };
    set({ profile: updated });

    const uid = auth.currentUser?.uid;
    if (uid) {
      try {
        await setDoc(doc(db, 'clientProfiles', uid), updated, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `clientProfiles/${uid}`);
      }
    }
  },

  setOnboarded: async (status) => {
    const updated = { ...get().profile, isOnboarded: status };
    set({ profile: updated });

    const uid = auth.currentUser?.uid;
    if (uid) {
      try {
        await setDoc(doc(db, 'clientProfiles', uid), { isOnboarded: status }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `clientProfiles/${uid}`);
      }
    }
  },

  calculatePhysiology: () => {
    const p = get().profile;
    const m = p.measurements;
    const g = p.goals;

    const bmi = calculateBMI(m.weight, m.weightUnit, m.height, m.heightUnit);
    const targetBmi = calculateBMI(g.targetWeight, g.targetWeightUnit, m.height, m.heightUnit);
    
    const bmr = calculateBMR(
      m.weight,
      m.weightUnit,
      m.height,
      m.heightUnit,
      p.age,
      p.gender
    );

    const tdee = calculateTDEE(bmr, p.activityLevel);
    const recommendedCalories = calculateRecommendedCalories(tdee, g.goalType);
    
    const wKg = m.weightUnit === 'kg' ? m.weight : m.weight / 2.20462;
    const waterIntakeLiters = calculateWaterIntake(wKg, p.activityLevel);
    const sleepTargetHours = calculateSleepTarget(p.activityLevel);

    const macros = calculateMacros(recommendedCalories, g.goalType);
    const timelineWeeks = calculateGoalTimeline(m.weight, g.targetWeight, g.goalType);

    return {
      bmi,
      targetBmi,
      bmr,
      tdee,
      maintenanceCalories: tdee,
      recommendedCalories,
      waterIntakeLiters,
      sleepTargetHours,
      proteinGrams: macros.proteinGrams,
      carbsGrams: macros.carbsGrams,
      fatGrams: macros.fatGrams,
      timelineWeeks,
    };
  },

  resetProfile: async () => {
    const uid = auth.currentUser?.uid;
    const initialWithUser: FitnessProfile = { 
      ...INITIAL_PROFILE, 
      userId: uid || '', 
      fullName: auth.currentUser?.displayName || INITIAL_PROFILE.fullName 
    };
    set({ profile: initialWithUser });
    if (uid) {
      try {
        await setDoc(doc(db, 'clientProfiles', uid), initialWithUser);
      } catch (e) {
        console.error("Profile reset err", e);
        handleFirestoreError(e, OperationType.WRITE, `clientProfiles/${uid}`);
      }
    }
  },
}));
