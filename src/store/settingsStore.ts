import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'feet';
  theme: 'dark'; // Dark theme is requested for FitForge, keeping dark mode cohesive
  notifications: {
    workoutReminders: boolean;
    nutritionalReminders: boolean;
    streakAlerts: boolean;
    aiInsights: boolean;
  };
  privacy: {
    publicProfile: boolean;
    shareHistory: boolean;
    allowAIRecommendations: boolean;
  };

  // UI expectations in SettingsPage:
  unitSystem: 'metric' | 'imperial';
  emailNotifications: boolean;
  pushNotifications: boolean;
  privacyMode: boolean;
  themeMode: 'dark';
}

interface SettingsActions {
  setWeightUnit: (unit: 'kg' | 'lbs') => void;
  setHeightUnit: (unit: 'cm' | 'feet') => void;
  updateNotifications: (updates: Partial<SettingsState['notifications']>) => void;
  updatePrivacy: (updates: Partial<SettingsState['privacy']>) => void;
  resetSettings: () => void;

  // UI expectations actions:
  setUnitSystem: (system: 'metric' | 'imperial') => void;
  setEmailNotifications: (enabled: boolean) => void;
  setPushNotifications: (enabled: boolean) => void;
  setPrivacyMode: (enabled: boolean) => void;
  setThemeMode: (theme: 'dark') => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      weightUnit: 'kg',
      heightUnit: 'cm',
      theme: 'dark',
      notifications: {
        workoutReminders: true,
        nutritionalReminders: true,
        streakAlerts: true,
        aiInsights: true,
      },
      privacy: {
        publicProfile: false,
        shareHistory: true,
        allowAIRecommendations: true,
      },

      unitSystem: 'metric',
      emailNotifications: true,
      pushNotifications: true,
      privacyMode: false,
      themeMode: 'dark',

      setWeightUnit: (weightUnit) => set({ weightUnit }),
      setHeightUnit: (heightUnit) => set({ heightUnit }),
      updateNotifications: (updates) =>
        set((state) => ({
          notifications: { ...state.notifications, ...updates },
        })),
      updatePrivacy: (updates) =>
        set((state) => ({
          privacy: { ...state.privacy, ...updates },
        })),

      setUnitSystem: (unitSystem) => set({ 
        unitSystem,
        weightUnit: unitSystem === 'metric' ? 'kg' : 'lbs',
        heightUnit: unitSystem === 'metric' ? 'cm' : 'feet'
      }),
      setEmailNotifications: (emailNotifications) => set({ emailNotifications }),
      setPushNotifications: (pushNotifications) => set({ pushNotifications }),
      setPrivacyMode: (privacyMode) => set({ privacyMode }),
      setThemeMode: (themeMode) => set({ themeMode }),

      resetSettings: () =>
        set({
          weightUnit: 'kg',
          heightUnit: 'cm',
          theme: 'dark',
          notifications: {
            workoutReminders: true,
            nutritionalReminders: true,
            streakAlerts: true,
            aiInsights: true,
          },
          privacy: {
            publicProfile: false,
            shareHistory: true,
            allowAIRecommendations: true,
          },
          unitSystem: 'metric',
          emailNotifications: true,
          pushNotifications: true,
          privacyMode: false,
          themeMode: 'dark',
        }),
    }),
    {
      name: 'fitforge-settings-storage',
    }
  )
);
