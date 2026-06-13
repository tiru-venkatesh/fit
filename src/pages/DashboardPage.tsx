import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Flame, Droplet, Apple, Calendar, LineChart, Trophy,
  ArrowRight, Dumbbell, User, RefreshCw, Moon, Clock, Compass, HelpCircle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { useWorkoutStore } from '../store/workoutStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useToast } from '../components/ToastProvider';
import { GlassCard } from '../components/GlassCard';
import { MetricCard } from '../components/MetricCard';
import { ProgressRing } from '../components/ProgressRing';
import { ProfilePreviewCard } from '../components/ProfilePreviewCard';
import { BMICard } from '../components/BMICard';
import { AIInsightsCard } from '../components/AIInsightsCard';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileSidebar } from '../components/MobileSidebar';
import { formatWeight, formatHeight } from '../utils/formatter';
import { getBMICategory } from '../utils/bmi';
import { aiService, AICoachAdvice } from '../services/aiService';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { profile } = useProfileStore();
  const { streak, announcements } = useWorkoutStore();
  const { loggedWaterIntakeToday, loggedCaloriesToday, addWater, addCalories, loggedSleepToday, addSleep } = useAnalyticsStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insights, setInsights] = useState<AICoachAdvice | null>(null);

  // Derive parameters
  const heightInMeters = profile.measurements.heightUnit === 'cm'
    ? profile.measurements.height / 100
    : (profile.measurements.height * 30.48) / 100;

  const weightInKg = profile.measurements.weightUnit === 'kg'
    ? profile.measurements.weight
    : profile.measurements.weight / 2.20462;

  const targetWeightInKg = profile.goals.targetWeightUnit === 'kg'
    ? profile.goals.targetWeight
    : profile.goals.targetWeight / 2.20462;

  const bmi = parseFloat((weightInKg / (heightInMeters * heightInMeters)).toFixed(1));
  const targetBmi = parseFloat((targetWeightInKg / (heightInMeters * heightInMeters)).toFixed(1));

  // Calories needed logic
  const bmr = Math.round(
    profile.gender === 'male'
      ? 10 * weightInKg + 6.25 * (profile.measurements.heightUnit === 'cm' ? profile.measurements.height : profile.measurements.height * 30.48) - 5 * profile.age + 5
      : 10 * weightInKg + 6.25 * (profile.measurements.heightUnit === 'cm' ? profile.measurements.height : profile.measurements.height * 30.48) - 5 * profile.age - 161
  );

  const mFactors = {
    'Sedentary': 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725,
    'Athlete': 1.9,
  };
  const tdee = Math.round(bmr * (mFactors[profile.activityLevel] || 1.55));

  let calorieGoal = tdee;
  if (profile.goals.goalType === 'Fat Loss') {
    calorieGoal = Math.round(tdee - 500);
  } else if (profile.goals.goalType === 'Muscle Gain') {
    calorieGoal = Math.round(tdee + 300);
  } else if (profile.goals.goalType === 'Strength') {
    calorieGoal = Math.round(tdee + 150);
  }

  // Water target
  let waterTarget = parseFloat((weightInKg * 0.035).toFixed(1));
  if (profile.activityLevel === 'Very Active' || profile.activityLevel === 'Athlete') waterTarget += 1.0;
  else if (profile.activityLevel === 'Moderately Active') waterTarget += 0.5;
  waterTarget = Math.max(2.0, Math.min(6.0, waterTarget));

  // Macros (Protein, Carbs, Fats) based on weight
  const proteinGoal = Math.round(weightInKg * (profile.goals.goalType === 'Muscle Gain' ? 2.0 : 1.6));
  const fatGoal = Math.round((calorieGoal * 0.25) / 9);
  const carbGoal = Math.round((calorieGoal - (proteinGoal * 4 + fatGoal * 9)) / 4);

  // Calorie calculations
  const caloriePercent = Math.min(120, (loggedCaloriesToday / calorieGoal) * 100);
  const waterPercent = Math.min(120, (loggedWaterIntakeToday / waterTarget) * 100);

  // Fetch coach insights
  const fetchCoachAdvice = async () => {
    setLoadingInsights(true);
    try {
      const physiology = {
        bmi,
        targetBmi,
        bmr,
        tdee,
        maintenanceCalories: tdee,
        recommendedCalories: calorieGoal,
        waterIntakeLiters: waterTarget,
        sleepTargetHours: 8,
        proteinGrams: proteinGoal,
        carbsGrams: carbGoal,
        fatGrams: fatGoal,
        timelineWeeks: profile.goals.deadlineWeeks || 12,
      };

      const response = await aiService.getCoachInsights(profile, physiology);
      setInsights(response);
    } catch {
      toast('Could not synch AI thoughts.', 'error');
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchCoachAdvice();
  }, []);

  const handleLoggedWater = () => {
    addWater(0.25);
    toast('Added 250ml Water hydration!', 'success');
  };

  const handleLoggedCalories = () => {
    addCalories(350);
    toast('Logged meal of 350 kcal!', 'success');
  };

  const handleLoggedSleep = () => {
    addSleep(1);
    toast('Logged 1 Hour of physical recovery sleep!', 'success');
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-grow flex">
        <Sidebar />

        {/* Core Main Panel */}
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 md:pl-72 animate-fade-in duration-300">
          
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Header greeting card */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.04] pb-6">
              <div>
                <span className="text-[10px] uppercase font-black text-orange-500 tracking-widest leading-none">BIOMETRIC COMMAND</span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1 uppercase">
                  Welcome to training, {profile.fullName || user?.email?.split('@')[0] || 'Athlete'}
                </h1>
                <p className="text-xs text-zinc-500 mt-1 font-medium">Your metabolic variables are fully synced. Keep logging logs for precision analytics.</p>
              </div>

              {/* Training Streaks */}
              <div className="flex items-center gap-2 bg-gradient-to-tr from-zinc-900 to-zinc-900/60 rounded-xl px-4 py-3 border border-white/[0.04]">
                <Trophy className="h-4.5 w-4.5 text-orange-500" />
                <div>
                  <span className="text-[9px] uppercase font-bold text-zinc-500">Active Streak</span>
                  <p className="text-xs font-black text-white">{streak.currentStreak} Active Days</p>
                </div>
              </div>
            </div>

            {/* Quick logging console panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={handleLoggedCalories}
                className="group flex flex-col text-left p-4 rounded-xl border border-white/[0.04] bg-zinc-900/40 hover:bg-zinc-900 hover:border-orange-500/20 active:scale-95 transition-all outline-none"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
                  <Apple className="h-4 w-4" />
                </div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 mt-4">Log Meal</span>
                <p className="text-sm font-extrabold text-white mt-1">+350 kcal limit</p>
              </button>

              <button
                onClick={handleLoggedWater}
                className="group flex flex-col text-left p-4 rounded-xl border border-white/[0.04] bg-zinc-900/40 hover:bg-zinc-900 hover:border-cyan-500/20 active:scale-95 transition-all outline-none"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500 group-hover:scale-110 transition-transform">
                  <Droplet className="h-4 w-4" />
                </div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 mt-4">Log Hydration</span>
                <p className="text-sm font-extrabold text-white mt-1">+250ml water</p>
              </button>

              <button
                onClick={handleLoggedSleep}
                className="group flex flex-col text-left p-4 rounded-xl border border-white/[0.04] bg-zinc-900/40 hover:bg-zinc-900 hover:border-violet-500/20 active:scale-95 transition-all outline-none"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500 group-hover:scale-110 transition-transform">
                  <Moon className="h-4 w-4" />
                </div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 mt-4">Log Sleep</span>
                <p className="text-sm font-extrabold text-white mt-1">+1 Hour rest</p>
              </button>

              <button
                onClick={() => navigate('/workouts')}
                className="group flex flex-col text-left p-4 rounded-xl border border-orange-500/10 bg-orange-500/[0.03] hover:bg-orange-500/[0.06] active:scale-95 transition-all cursor-pointer"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white shadow-md">
                  <Dumbbell className="h-4 w-4" />
                </div>
                <span className="text-[10px] uppercase font-bold text-orange-400 mt-4">Active Training</span>
                <p className="text-sm font-black text-white mt-1">Open Logger Console</p>
              </button>
            </div>

            {/* Core Biometrics metrics columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left visual progress rings */}
              <GlassCard className="col-span-1 p-6 space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">DAILY ENERGY SUMMARY</h3>
                  <p className="text-[10px] text-zinc-550 mt-1 leading-normal">Track logged food totals relative to recommended intake levels.</p>
                </div>

                <div className="flex justify-around items-center py-4">
                  <ProgressRing
                    percentage={caloriePercent}
                    size={130}
                    strokeWidth={10}
                    label={`${loggedCaloriesToday}`}
                    subLabel="KCAL OUT"
                  />

                  <ProgressRing
                    percentage={waterPercent}
                    size={110}
                    strokeWidth={8}
                    label={`${loggedWaterIntakeToday}`}
                    subLabel="L Liters"
                  />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-semibold border-b border-white/[0.02] pb-1.5">
                    <span className="text-zinc-500">Suggested Budget</span>
                    <span className="text-zinc-200">{calorieGoal} kcal</span>
                  </div>
                  <div className="flex justify-between font-semibold border-b border-white/[0.02] pb-1.5">
                    <span className="text-zinc-500">Water target value</span>
                    <span className="text-zinc-200">{waterTarget} Liters</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-zinc-500">Sleep logged totals</span>
                    <span className="text-zinc-200">{loggedSleepToday} hrs / 8.0</span>
                  </div>
                </div>
              </GlassCard>

              {/* Mid column macros progress bars */}
              <GlassCard className="col-span-1 p-6 flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">MACRONUTRIENT BUDGETS</h3>
                  <p className="text-[10px] text-zinc-550 mt-1 leading-normal">Ideal distributions computed live for protein and carbs.</p>
                </div>

                <div className="space-y-5 flex-grow pt-4">
                  {/* Protein */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-orange-400 font-bold uppercase">Protein goal</span>
                      <span className="text-white">{(loggedCaloriesToday * 0.3 / 4).toFixed(0)} / {proteinGoal}g</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-900 border border-white/[0.01] rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500" style={{ width: `${Math.min(100, ( (loggedCaloriesToday * 0.3 / 4) / proteinGoal ) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Fats */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-violet-400 font-bold uppercase">Fats goal</span>
                      <span className="text-white">{(loggedCaloriesToday * 0.25 / 9).toFixed(0)} / {fatGoal}g</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-900 border border-white/[0.01] rounded-full overflow-hidden">
                      <div className="h-full bg-violet-400" style={{ width: `${Math.min(100, ( (loggedCaloriesToday * 0.25 / 9) / fatGoal ) * 100)}%` }} />
                    </div>
                  </div>

                  {/* Carbs */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-cyan-400 font-bold uppercase">Carbs goal</span>
                      <span className="text-white">{(loggedCaloriesToday * 0.45 / 4).toFixed(0)} / {carbGoal}g</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-900 border border-white/[0.01] rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: `${Math.min(100, ( (loggedCaloriesToday * 0.45 / 4) / carbGoal ) * 100)}%` }} />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-zinc-950/40 border border-white/[0.02] rounded-xl text-[10px] leading-relaxed text-zinc-500">
                  Defines absolute molecular turnover required to retain optimal physical tissue mass.
                </div>
              </GlassCard>

              {/* Right column: profile summary & BMI scale view */}
              <div className="col-span-1 space-y-6">
                <ProfilePreviewCard profile={profile} onEdit={() => navigate('/settings')} />
                <BMICard bmi={bmi} />
              </div>

            </div>

            {/* Gym Bulletins / Announcements Block */}
            {announcements && announcements.length > 0 && (
              <GlassCard className="p-6 border border-orange-500/20 bg-orange-500/[0.01]">
                <div className="flex items-center gap-2 mb-4 border-b border-white/[0.04] pb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                    <Trophy className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-xs font-bold uppercase text-white tracking-widest">
                    Gym community bulletins
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {announcements.slice(0, 4).map((ann) => (
                    <div key={ann.id} className="p-3.5 bg-zinc-950/40 rounded-lg border border-white/[0.02]">
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                          ann.urgency === 'urgent' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                          ann.urgency === 'important' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                          'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                        }`}>
                          {ann.urgency}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono">{new Date(ann.date).toLocaleDateString()}</span>
                      </div>
                      <p className="font-extrabold text-white text-xs mt-2">{ann.title}</p>
                      <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Coach AI Advisor screen block */}
            <AIInsightsCard insights={insights} isLoading={loadingInsights} onRefresh={fetchCoachAdvice} />

          </div>
        </main>
      </div>
    </div>
  );
}
