import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useProfileStore } from './store/profileStore';
import { useWorkoutStore } from './store/workoutStore';
import { ToastProvider } from './components/ToastProvider';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import FitnessAssessmentPage from './pages/FitnessAssessmentPage';
import DashboardPage from './pages/DashboardPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import WorkoutTrackerPage from './pages/WorkoutTrackerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import PricingPage from './pages/PricingPage';

// Premium Athletic SAAS Modules
import AiWorkoutGeneratorPage from './pages/AiWorkoutGeneratorPage';
import AiDietPlannerPage from './pages/AiDietPlannerPage';
import WaterAndSleepCoachPage from './pages/WaterAndSleepCoachPage';
import BodyMeasurementsPage from './pages/BodyMeasurementsPage';
import TransformationRoadmapPage from './pages/TransformationRoadmapPage';
import GamificationPage from './pages/GamificationPage';
import AiChatbotPage from './pages/AiChatbotPage';
import CommunityPage from './pages/CommunityPage';

// Protectors
function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function WorkspaceRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  const { profile } = useProfileStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If the user is a Gym Owner, they bypass standard member onboarding check!
  if (user?.role === 'owner') {
    return <>{children}</>;
  }

  // If a Client-member is authenticated but hasn't onboarded physical assessments yet, redirect
  if (!profile.isOnboarded) {
    return <Navigate to="/onboarding/profile" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { initAuthSync, user, isAuthenticated, isLoading } = useAuthStore();
  const { fetchProfile } = useProfileStore();
  const { initWorkoutsSync } = useWorkoutStore();

  // 1. Establish the Firebase Auth session event listener
  useEffect(() => {
    const unsubAuth = initAuthSync();
    return () => {
      unsubAuth();
    };
  }, [initAuthSync]);

  // 2. Load the corresponding user's profile from Firestore upon login
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'client') {
        fetchProfile(user.id);
      }
    }
  }, [isAuthenticated, user, fetchProfile]);

  // 3. Establish the real-time workouts and announcement snapshot loaders
  useEffect(() => {
    if (isAuthenticated && user) {
      const unsubWorkouts = initWorkoutsSync(user.id, user.role === 'owner');
      return () => {
        unsubWorkouts();
      };
    }
  }, [isAuthenticated, user, initWorkoutsSync]);

  // Display loading screen during boot checks
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Initializing Forge Core...</p>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="relative min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
        {/* Abstract Background Blur */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-orange-500/15 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

        <div className="relative z-10 flex flex-col min-h-screen justify-between bg-transparent">
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Onboarding Wizard for clients */}
              <Route
                path="/onboarding/profile"
                element={
                  <AuthenticatedRoute>
                    <ProfileSetupPage />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/onboarding/assessment"
                element={
                  <AuthenticatedRoute>
                    <FitnessAssessmentPage />
                  </AuthenticatedRoute>
                }
              />

              {/* Core System Workspaces */}
              <Route
                path="/dashboard"
                element={
                  <WorkspaceRoute>
                    {user?.role === 'owner' ? <OwnerDashboardPage /> : <DashboardPage />}
                  </WorkspaceRoute>
                }
              />
              <Route
                path="/workouts"
                element={
                  <WorkspaceRoute>
                    <WorkoutTrackerPage />
                  </WorkspaceRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <WorkspaceRoute>
                    <AnalyticsPage />
                  </WorkspaceRoute>
                }
              />
              <Route
                path="/pricing"
                element={
                  <WorkspaceRoute>
                    <PricingPage />
                  </WorkspaceRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <WorkspaceRoute>
                    <SettingsPage />
                  </WorkspaceRoute>
                }
              />

              <Route
                path="/ai-workout"
                element={
                  <WorkspaceRoute>
                    <AiWorkoutGeneratorPage />
                  </WorkspaceRoute>
                }
              />
              <Route
                path="/ai-diet"
                element={
                  <WorkspaceRoute>
                    <AiDietPlannerPage />
                  </WorkspaceRoute>
                }
              />
              <Route
                path="/water-sleep"
                element={
                  <WorkspaceRoute>
                    <WaterAndSleepCoachPage />
                  </WorkspaceRoute>
                }
              />
              <Route
                path="/measurements"
                element={
                  <WorkspaceRoute>
                    <BodyMeasurementsPage />
                  </WorkspaceRoute>
                }
              />
              <Route
                path="/roadmap"
                element={
                  <WorkspaceRoute>
                    <TransformationRoadmapPage />
                  </WorkspaceRoute>
                }
              />
              <Route
                path="/gamification"
                element={
                  <WorkspaceRoute>
                    <GamificationPage />
                  </WorkspaceRoute>
                }
              />
              <Route
                path="/ai-chatbot"
                element={
                  <WorkspaceRoute>
                    <AiChatbotPage />
                  </WorkspaceRoute>
                }
              />
              <Route
                path="/community"
                element={
                  <WorkspaceRoute>
                    <CommunityPage />
                  </WorkspaceRoute>
                }
              />

              {/* Catch-all Routing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </ToastProvider>
  );
}
