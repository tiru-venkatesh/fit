import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Award, Sparkles, Activity, ShieldCheck, ArrowRight, ShieldAlert, BadgePlus } from 'lucide-react';
import { useProfileStore } from '../store/profileStore';
import { useToast } from '../components/ToastProvider';
import { aiService, AICoachAdvice } from '../services/aiService';
import { GlassCard } from '../components/GlassCard';
import { AssessmentCard } from '../components/AssessmentCard';
import { AIInsightsCard } from '../components/AIInsightsCard';
import { getBMICategory } from '../utils/bmi';

export default function FitnessAssessmentPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, setOnboarded } = useProfileStore();

  const [aiAdvice, setAiAdvice] = useState<AICoachAdvice | null>(null);
  const [loadingAI, setLoadingAI] = useState(false);

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

  // Direct score calculations
  const bmiCat = getBMICategory(bmi);
  const healthScore = bmiCat === 'Normal' ? 95 : bmiCat === 'Overweight' ? 78 : bmiCat === 'Underweight' ? 72 : 55;
  const fitnessScore = profile.fitnessLevel === 'Advanced' ? 90 : profile.fitnessLevel === 'Intermediate' ? 78 : 60;
  const consistencyScore = profile.workoutDays.length >= 5 ? 95 : profile.workoutDays.length >= 3 ? 84 : 55;

  // Derive recommended calorie plan
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

  let caloriesNeeded = tdee;
  if (profile.goals.goalType === 'Fat Loss') {
    caloriesNeeded = Math.round(tdee - 500);
  } else if (profile.goals.goalType === 'Muscle Gain') {
    caloriesNeeded = Math.round(tdee + 300);
  } else if (profile.goals.goalType === 'Strength') {
    caloriesNeeded = Math.round(tdee + 150);
  }

  // Derive workout split suggestion names
  const workoutSplitName = profile.workoutDays.length >= 5 
    ? 'Push, Pull, Legs, Upper, Lower Split (5 days)' 
    : profile.workoutDays.length >= 3
    ? 'Push, Pull, Legs Standard Split (3 days)'
    : 'Full Body Compound Stimulus Routine (2 days)';

  // Build the prompt & fetch recommendations
  const triggerAssessment = async () => {
    setLoadingAI(true);
    toast('Consulting FitForge Coach Engine...', 'info');
    try {
      const physiology = {
        bmi,
        targetBmi,
        bmr,
        tdee,
        maintenanceCalories: tdee,
        recommendedCalories: caloriesNeeded,
        proteinGrams: Math.round(weightInKg * (profile.goals.goalType === 'Muscle Gain' ? 2.0 : 1.6)),
        carbsGrams: Math.round((caloriesNeeded - Math.round(weightInKg * (profile.goals.goalType === 'Muscle Gain' ? 2.0 : 1.6)) * 4) / 4),
        fatGrams: Math.round((caloriesNeeded * 0.25) / 9),
        waterIntakeLiters: parseFloat((weightInKg * 0.035).toFixed(1)),
        sleepTargetHours: 8,
        timelineWeeks: profile.goals.deadlineWeeks || 12,
      };

      const response = await aiService.getCoachInsights(profile, physiology);
      setAiAdvice(response);
      toast('Biometrical assessment compiled successfully!', 'success');
    } catch {
      toast('Synthesizer offline. Using offline advisory modules.', 'error');
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    triggerAssessment();
  }, []);

  const handleLaunchDashboard = () => {
    setOnboarded(true);
    toast('Welcome to training center! Your engine is primed.', 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <nav className="border-b border-white/10 bg-white/5 p-4 sticky top-0 z-10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
              <Award className="h-4.5 w-4.5" />
            </span>
            <span className="text-sm font-black uppercase tracking-wider">FITFORGE AI DIAGNOSTIC</span>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Diagnostic primed
          </span>
        </div>
      </nav>

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8 animate-fade-in duration-300">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/10 bg-orange-500/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-400">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Assessment results synthesized successfully</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">YOUR PHYSICAL BASELINE</h1>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-2xl mx-auto">We have calculated index quotients, macro weights, and target caloric cycles. Review insights powered by our server-side intelligent coach.</p>
          </div>

          <AssessmentCard
            healthScore={healthScore}
            fitnessScore={fitnessScore}
            consistencyScore={consistencyScore}
            targetBmi={targetBmi}
            currentBmi={bmi}
            caloriesNeeded={caloriesNeeded}
            timelineEstimateWeeks={profile.goals.deadlineWeeks}
            workoutSplitName={workoutSplitName}
            dietType={profile.dietType}
          />

          <AIInsightsCard
            insights={aiAdvice}
            isLoading={loadingAI}
            onRefresh={triggerAssessment}
          />

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
            <button
              onClick={() => navigate('/onboarding/profile')}
              className="w-full sm:w-auto rounded-xl border border-white/[0.08] hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-zinc-300"
            >
              Reconfigure Biometrics
            </button>
            <button
              onClick={handleLaunchDashboard}
              className="w-full sm:w-auto rounded-xl bg-orange-500 hover:bg-orange-600 px-8 py-4 text-xs font-black uppercase tracking-wider text-white shadow-[0_4px_30px_rgba(249,115,22,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Initialize Workspace Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
