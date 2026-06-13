import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WeightLogEntry, BodyFatLogEntry, MetricSummary } from '../types/analytics';

const getPastDateStr = (daysAgo: number): string => {
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
};

interface AnalyticsActions {
  addWeightLog: (weight: number) => void;
  addBodyFatLog: (bodyFat: number) => void;
  addWaterDrank: (liters: number) => void;
  addCaloriesConsumed: (kcal: number) => void;
  resetAnalytics: () => void;
  
  // page aliases
  addWater: (liters: number) => void;
  addCalories: (kcal: number) => void;
  addSleep: (hours: number) => void;
  logWorkoutAction: (kcalBurned: number, durationMinutes: number) => void;
  getStatsSummary: () => { avgCalories: number; totalWorkouts: number; avgWater: number };
}

interface AnalyticsState {
  weightHistory: WeightLogEntry[];
  bodyFatHistory: BodyFatLogEntry[];
  waterIntakeHistory: { date: string; amountLiters: number }[];
  caloriesHistory: { date: string; calories: number }[];
  todayWaterDrank: number;
  todayCaloriesConsumed: number;

  // page state mappings
  loggedWaterIntakeToday: number;
  loggedCaloriesToday: number;
  loggedSleepToday: number;
  calorieHistory: { date: string; calories: number }[];
  waterHistory: { date: string; water: number }[];
}

const DEFAULT_WEIGHT: WeightLogEntry[] = [
  { date: getPastDateStr(6), weight: 87.2 },
  { date: getPastDateStr(5), weight: 86.5 },
  { date: getPastDateStr(4), weight: 86.1 },
  { date: getPastDateStr(3), weight: 85.3 },
  { date: getPastDateStr(2), weight: 84.8 },
  { date: getPastDateStr(1), weight: 84.4 },
  { date: getPastDateStr(0), weight: 84.0 },
];

const DEFAULT_BF: BodyFatLogEntry[] = [
  { date: getPastDateStr(6), bodyFatPercent: 24.2 },
  { date: getPastDateStr(5), bodyFatPercent: 23.8 },
  { date: getPastDateStr(4), bodyFatPercent: 23.5 },
  { date: getPastDateStr(3), bodyFatPercent: 23.1 },
  { date: getPastDateStr(2), bodyFatPercent: 22.8 },
  { date: getPastDateStr(1), bodyFatPercent: 22.4 },
  { date: getPastDateStr(0), bodyFatPercent: 22.0 },
];

const DEFAULT_WATER_MAPPED = [
  { date: getPastDateStr(6), water: 2.8 },
  { date: getPastDateStr(5), water: 3.2 },
  { date: getPastDateStr(4), water: 3.5 },
  { date: getPastDateStr(3), water: 2.5 },
  { date: getPastDateStr(2), water: 3.8 },
  { date: getPastDateStr(1), water: 4.1 },
  { date: getPastDateStr(0), water: 2.4 }, // today
];

const DEFAULT_CALORIES_MAPPED = [
  { date: getPastDateStr(6), calories: 2350 },
  { date: getPastDateStr(5), calories: 2100 },
  { date: getPastDateStr(4), calories: 1980 },
  { date: getPastDateStr(3), calories: 2200 },
  { date: getPastDateStr(2), calories: 2050 },
  { date: getPastDateStr(1), calories: 2150 },
  { date: getPastDateStr(0), calories: 1450 }, // today
];

export const useAnalyticsStore = create<AnalyticsState & AnalyticsActions>()(
  persist(
    (set, get) => ({
      weightHistory: DEFAULT_WEIGHT,
      bodyFatHistory: DEFAULT_BF,
      waterIntakeHistory: DEFAULT_WATER_MAPPED.map(w => ({ date: w.date, amountLiters: w.water })),
      caloriesHistory: DEFAULT_CALORIES_MAPPED,
      todayWaterDrank: 2.4,
      todayCaloriesConsumed: 1450,

      // State mappings
      loggedWaterIntakeToday: 2.4,
      loggedCaloriesToday: 1450,
      loggedSleepToday: 7.5,
      calorieHistory: DEFAULT_CALORIES_MAPPED,
      waterHistory: DEFAULT_WATER_MAPPED,

      addWeightLog: (weight) => {
        const todayStr = getPastDateStr(0);
        set((state) => {
          const filtered = state.weightHistory.filter((w) => w.date !== todayStr);
          return {
            weightHistory: [...filtered, { date: todayStr, weight }].sort((a, b) => a.date.localeCompare(b.date)),
          };
        });
      },

      addBodyFatLog: (bodyFatPercent) => {
        const todayStr = getPastDateStr(0);
        set((state) => {
          const filtered = state.bodyFatHistory.filter((bf) => bf.date !== todayStr);
          return {
            bodyFatHistory: [...filtered, { date: todayStr, bodyFatPercent }].sort((a, b) => a.date.localeCompare(b.date)),
          };
        });
      },

      addWaterDrank: (liters) => {
        const todayStr = getPastDateStr(0);
        set((state) => {
          const newAmount = parseFloat((state.todayWaterDrank + liters).toFixed(1));
          const filteredAmount = state.waterIntakeHistory.filter((w) => w.date !== todayStr);
          const filteredHistory = state.waterHistory.filter((w) => w.date !== todayStr);
          return {
            todayWaterDrank: newAmount,
            loggedWaterIntakeToday: newAmount,
            waterIntakeHistory: [...filteredAmount, { date: todayStr, amountLiters: newAmount }].sort((a, b) => a.date.localeCompare(b.date)),
            waterHistory: [...filteredHistory, { date: todayStr, water: newAmount }].sort((a, b) => a.date.localeCompare(b.date)),
          };
        });
      },

      addCaloriesConsumed: (kcal) => {
        const todayStr = getPastDateStr(0);
        set((state) => {
          const newTotal = state.todayCaloriesConsumed + kcal;
          const filteredAmount = state.caloriesHistory.filter((c) => c.date !== todayStr);
          const filteredHistory = state.calorieHistory.filter((c) => c.date !== todayStr);
          return {
            todayCaloriesConsumed: newTotal,
            loggedCaloriesToday: newTotal,
            caloriesHistory: [...filteredAmount, { date: todayStr, calories: newTotal }].sort((a, b) => a.date.localeCompare(b.date)),
            calorieHistory: [...filteredHistory, { date: todayStr, calories: newTotal }].sort((a, b) => a.date.localeCompare(b.date)),
          };
        });
      },

      // page mappings
      addWater: (liters) => {
        get().addWaterDrank(liters);
      },

      addCalories: (kcal) => {
        get().addCaloriesConsumed(kcal);
      },

      addSleep: (hours) => {
        set((state) => ({
          loggedSleepToday: parseFloat((state.loggedSleepToday + hours).toFixed(1))
        }));
      },

      logWorkoutAction: (kcalBurned, durationMinutes) => {
        // can increment training aggregates
      },

      getStatsSummary: () => {
        const finalCalories = get().calorieHistory;
        const finalWater = get().waterHistory;

        const avgCalories = finalCalories.length > 0
          ? Math.round(finalCalories.reduce((a, b) => a + b.calories, 0) / finalCalories.length)
          : 0;

        const avgWater = finalWater.length > 0
          ? parseFloat((finalWater.reduce((a, b) => a + b.water, 0) / finalWater.length).toFixed(1))
          : 0;

        return {
          avgCalories,
          totalWorkouts: 14,
          avgWater,
        };
      },

      resetAnalytics: () => {
        set({
          weightHistory: [
            { date: getPastDateStr(0), weight: 84.0 },
          ],
          bodyFatHistory: [
            { date: getPastDateStr(0), bodyFatPercent: 22.0 },
          ],
          waterIntakeHistory: [
            { date: getPastDateStr(0), amountLiters: 0 },
          ],
          caloriesHistory: [
            { date: getPastDateStr(0), calories: 0 },
          ],
          todayWaterDrank: 0,
          todayCaloriesConsumed: 0,
          loggedWaterIntakeToday: 0,
          loggedCaloriesToday: 0,
          loggedSleepToday: 0,
          calorieHistory: [],
          waterHistory: [],
        });
      },
    }),
    {
      name: 'fitforge-analytics-storage',
    }
  )
);
