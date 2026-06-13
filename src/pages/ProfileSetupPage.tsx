import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft, ChevronRight, User, Dumbbell, Target, Activity, Apple,
  Sparkles, Zap, Award, Gauge
} from 'lucide-react';
import { useProfileStore } from '../store/profileStore';
import { useToast } from '../components/ToastProvider';
import { GlassCard } from '../components/GlassCard';
import { BMICard } from '../components/BMICard';
import { MetricCard } from '../components/MetricCard';
import {
  GenderType, GoalType, ActivityLevel, DietType, WorkoutTime, HeightUnit, MassUnit
} from '../types/profile';
import { cmToFeetAndInches, feetAndInchesToCm, lbsToKg, kgToLbs } from '../utils/formatter';

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, updateProfile, updateMeasurements, updateGoals, calculatePhysiology, setOnboarded } = useProfileStore();

  const [step, setStep] = useState(1);

  // Form states initialized with store values
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [age, setAge] = useState(profile.age || 26);
  const [gender, setGender] = useState<GenderType>(profile.gender || 'male');
  const [dateOfBirth, setDateOfBirth] = useState(profile.dateOfBirth || '2000-01-01');

  // Measurements
  const [height, setHeight] = useState(profile.measurements.height || 178);
  const [heightUnit, setHeightUnit] = useState<HeightUnit>(profile.measurements.heightUnit || 'cm');
  const [weight, setWeight] = useState(profile.measurements.weight || 84);
  const [weightUnit, setWeightUnit] = useState<MassUnit>(profile.measurements.weightUnit || 'kg');
  const [bodyFat, setBodyFat] = useState(profile.measurements.bodyFat || 22);

  // Girths
  const [chest, setChest] = useState(profile.measurements.chest || 104);
  const [waist, setWaist] = useState(profile.measurements.waist || 92);
  const [hip, setHip] = useState(profile.measurements.hip || 101);
  const [neck, setNeck] = useState(profile.measurements.neck || 39);
  const [arm, setArm] = useState(profile.measurements.arm || 37);
  const [thigh, setThigh] = useState(profile.measurements.thigh || 59);

  // Goals
  const [targetWeight, setTargetWeight] = useState(profile.goals.targetWeight || 75);
  const [targetWeightUnit, setTargetWeightUnit] = useState<MassUnit>(profile.goals.targetWeightUnit || 'kg');
  const [targetBodyFat, setTargetBodyFat] = useState(profile.goals.targetBodyFat || 14);
  const [goalType, setGoalType] = useState<GoalType>(profile.goals.goalType || 'Fat Loss');
  const [deadlineWeeks, setDeadlineWeeks] = useState(profile.goals.deadlineWeeks || 12);

  // Lifestyle
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel || 'Moderately Active');

  // Diet
  const [dietType, setDietType] = useState<DietType>(profile.dietType || 'Non Vegetarian');
  const [allergiesText, setAllergiesText] = useState(profile.allergies?.join(', ') || '');

  // Gym Access
  const [hasGymAccess, setHasGymAccess] = useState(profile.hasGymAccess);
  const [fitnessLevel, setFitnessLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>(profile.fitnessLevel || 'Intermediate');
  const [workoutDays, setWorkoutDays] = useState<number[]>(profile.workoutDays || [1, 3, 5]);
  const [workoutTime, setWorkoutTime] = useState<WorkoutTime>(profile.workoutTime || 'Evening');

  // Sync back to store and run calculations in real-time
  const liveCalculations = useMemo(() => {
    // Collect local values that affect mathematics
    // Convert weights to proper matching standards if needed for calculation
    const currentWeightInKg = weightUnit === 'kg' ? weight : weight / 2.20462;
    const targetWeightInKg = targetWeightUnit === 'kg' ? targetWeight : targetWeight / 2.20462;
    const currentHeightInCm = heightUnit === 'cm' ? height : height * 30.48;

    // Apply exact same mathematics helper functions
    const bmr = Math.round(
      gender === 'male'
        ? 10 * currentWeightInKg + 6.25 * currentHeightInCm - 5 * age + 5
        : gender === 'female'
        ? 10 * currentWeightInKg + 6.25 * currentHeightInCm - 5 * age - 161
        : 10 * currentWeightInKg + 6.25 * currentHeightInCm - 5 * age - 78
    );

    const mFactors: Record<ActivityLevel, number> = {
      'Sedentary': 1.2,
      'Lightly Active': 1.375,
      'Moderately Active': 1.55,
      'Very Active': 1.725,
      'Athlete': 1.9,
    };
    const tdee = Math.round(bmr * (mFactors[activityLevel] || 1.55));
    
    let targetCalories = tdee;
    if (goalType === 'Fat Loss') {
      targetCalories = Math.max(1200, Math.round(tdee - 500));
    } else if (goalType === 'Muscle Gain') {
      targetCalories = Math.round(tdee + 300);
    } else if (goalType === 'Strength') {
      targetCalories = Math.round(tdee + 150);
    }

    const hMeters = currentHeightInCm / 100;
    const bmi = hMeters > 0 ? parseFloat((currentWeightInKg / (hMeters * hMeters)).toFixed(1)) : 0;
    const targetBmi = hMeters > 0 ? parseFloat((targetWeightInKg / (hMeters * hMeters)).toFixed(1)) : 0;

    let waterIntake = currentWeightInKg * 0.035;
    if (activityLevel === 'Very Active' || activityLevel === 'Athlete') waterIntake += 1.0;
    else if (activityLevel === 'Moderately Active') waterIntake += 0.5;

    const timelineWeeks = Math.max(4, Math.ceil(Math.abs(weight - targetWeight) / (goalType === 'Fat Loss' ? 0.6 : 0.25)));

    return {
      bmi,
      targetBmi,
      bmr,
      tdee,
      targetCalories,
      waterIntake: parseFloat(Math.max(2.0, Math.min(6.0, waterIntake)).toFixed(1)),
      sleepHours: activityLevel === 'Athlete' || activityLevel === 'Very Active' ? 8.5 : 8.0,
      timelineWeeks,
    };
  }, [gender, weight, weightUnit, height, heightUnit, age, activityLevel, goalType, targetWeight, targetWeightUnit]);

  // Handle day toggles
  const handleDaySelect = (dayIndex: number) => {
    setWorkoutDays(prev => 
      prev.includes(dayIndex) ? prev.filter(d => d !== dayIndex) : [...prev, dayIndex].sort()
    );
  };

  const handleNext = () => {
    if (step === 1 && !fullName) {
      toast('Full name is required to initialize program profiles.', 'error');
      return;
    }
    if (step === 2 && (weight <= 0 || height <= 0)) {
      toast('Valid height and weight parameters are required.', 'error');
      return;
    }
    if (step === 3 && (targetWeight <= 0 || targetBodyFat <= 0)) {
      toast('Valid target physical parameters are required.', 'error');
      return;
    }

    if (step < 6) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      // Final save!
      const allergyArr = allergiesText.split(',').map(s => s.trim()).filter(Boolean);
      
      updateProfile({
        fullName,
        age: Number(age),
        gender,
        dateOfBirth,
        activityLevel,
        dietType,
        allergies: allergyArr,
        hasGymAccess,
        fitnessLevel,
        workoutDays,
        workoutTime,
        isOnboarded: false // user is finishing step but going to review assessment first
      });

      updateMeasurements({
        height: Number(height),
        heightUnit,
        weight: Number(weight),
        weightUnit,
        bodyFat: Number(bodyFat),
        chest: Number(chest),
        waist: Number(waist),
        hip: Number(hip),
        neck: Number(neck),
        arm: Number(arm),
        thigh: Number(thigh),
      });

      updateGoals({
        targetWeight: Number(targetWeight),
        targetWeightUnit,
        targetBodyFat: Number(targetBodyFat),
        goalType,
        deadlineWeeks: liveCalculations.timelineWeeks,
      });

      toast('All profile measurements finalized!', 'success');
      navigate('/onboarding/assessment');
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0,0);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      {/* Mini top profile bar */}
      <nav className="border-b border-white/10 bg-white/5 p-4 sticky top-0 z-10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
              <Dumbbell className="h-4.5 w-4.5" />
            </span>
            <span className="text-sm font-black uppercase tracking-wider">FITFORGE PROFILE BUILDER</span>
          </div>
          <span className="text-xs font-semibold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
            Wizard Setup Phase
          </span>
        </div>
      </nav>

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT: Multi-Step Wizards */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">Form Progression</span>
                <h2 className="text-xl font-bold tracking-tight text-white mt-1">Step {step} of 6</h2>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className={`h-1.5 w-6 rounded-full transition-all duration-300 ${step >= idx + 1 ? 'bg-orange-500' : 'bg-zinc-900'}`} />
                ))}
              </div>
            </div>

            <GlassCard className="p-8 border border-white/10 bg-white/5">
              {/* Conditional step renderer */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* STEP 1: PERSONAL */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider text-xs">
                        <User className="h-4.5 w-4.5" />
                        <span>PERSONAL INFORMATION</span>
                      </div>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Full Structural Name</label>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your complete name"
                          className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 px-4 text-xs font-medium text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Biological Age</label>
                          <input
                            type="number"
                            min="10"
                            max="120"
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                            className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 px-4 text-xs font-medium text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Date of Birth</label>
                          <input
                            type="date"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 px-4 text-xs font-medium text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Gender Identification</label>
                        <div className="grid grid-cols-3 gap-3">
                          {(['male', 'female', 'other'] as GenderType[]).map((gen) => (
                            <button
                              key={gen}
                              type="button"
                              onClick={() => setGender(gen)}
                              className={`py-3 rounded-xl border text-xs font-bold uppercase transition-all tracking-wider ${
                                gender === gen 
                                  ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-extrabold'
                                  : 'border-white/[0.04] bg-zinc-900/50 text-zinc-400'
                              }`}
                            >
                              {gen}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: BODY MEASUREMENTS */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider text-xs">
                          <Activity className="h-4.5 w-4.5" />
                          <span>BODYWEIGHT & MEASUREMENTS</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (weightUnit === 'lbs') {
                                setWeightUnit('kg');
                                setWeight(parseFloat((weight / 2.20462).toFixed(1)));
                              }
                            }}
                            className={`px-3 py-1 text-[10px] uppercase font-bold rounded-lg ${weightUnit === 'kg' ? 'bg-orange-500 text-white' : 'bg-zinc-900'}`}
                          >
                            kg
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (weightUnit === 'kg') {
                                setWeightUnit('lbs');
                                setWeight(parseFloat((weight * 2.20462).toFixed(1)));
                              }
                            }}
                            className={`px-3 py-1 text-[10px] uppercase font-bold rounded-lg ${weightUnit === 'lbs' ? 'bg-orange-500 text-white' : 'bg-zinc-900'}`}
                          >
                            lbs
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5 col-span-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-400 block pb-1">Height ({heightUnit})</label>
                          <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 px-4 text-xs font-semibold text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5 col-span-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-400 block pb-1">Weight ({weightUnit})</label>
                          <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 px-4 text-xs font-semibold text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5 col-span-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-400 block pb-1">Est. Body Fat (%)</label>
                          <input
                            type="number"
                            value={bodyFat}
                            onChange={(e) => setBodyFat(Number(e.target.value))}
                            className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 px-4 text-xs font-semibold text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Girth expansions */}
                      <span className="block text-[9px] uppercase font-extrabold tracking-widest text-zinc-600">Optional Anthropometric Girths (cm)</span>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500">Chest</label>
                          <input type="number" value={chest} onChange={(e) => setChest(Number(e.target.value))} className="block w-full rounded-xl bg-zinc-900 border border-white/[0.02] py-2 px-3 text-xs font-semibold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500">Waist</label>
                          <input type="number" value={waist} onChange={(e) => setWaist(Number(e.target.value))} className="block w-full rounded-xl bg-zinc-900 border border-white/[0.02] py-2 px-3 text-xs font-semibold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500">Hip</label>
                          <input type="number" value={hip} onChange={(e) => setHip(Number(e.target.value))} className="block w-full rounded-xl bg-zinc-900 border border-white/[0.02] py-2 px-3 text-xs font-semibold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500">Neck</label>
                          <input type="number" value={neck} onChange={(e) => setNeck(Number(e.target.value))} className="block w-full rounded-xl bg-zinc-900 border border-white/[0.02] py-2 px-3 text-xs font-semibold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500">Arm</label>
                          <input type="number" value={arm} onChange={(e) => setArm(Number(e.target.value))} className="block w-full rounded-xl bg-zinc-900 border border-white/[0.02] py-2 px-3 text-xs font-semibold" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-zinc-500">Thigh</label>
                          <input type="number" value={thigh} onChange={(e) => setThigh(Number(e.target.value))} className="block w-full rounded-xl bg-zinc-900 border border-white/[0.02] py-2 px-3 text-xs font-semibold" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: GOALS */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider text-xs">
                        <Target className="h-4.5 w-4.5" />
                        <span>DEFENSIVE PROGRAM GOALS</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-zinc-400">Target Weight ({weightUnit})</label>
                          <input
                            type="number"
                            value={targetWeight}
                            onChange={(e) => setTargetWeight(Number(e.target.value))}
                            className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 px-4 text-xs font-semibold text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-zinc-400">Target Body Fat (%)</label>
                          <input
                            type="number"
                            value={targetBodyFat}
                            onChange={(e) => setTargetBodyFat(Number(e.target.value))}
                            className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 px-4 text-xs font-semibold text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Workout Focus Category</label>
                        <div className="grid grid-cols-2 gap-3">
                          {(['Fat Loss', 'Muscle Gain', 'Recomposition', 'Strength', 'Athletic', 'General Fitness'] as GoalType[]).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setGoalType(type)}
                              className={`py-3.5 rounded-xl border text-xs font-bold transition-all tracking-wide ${
                                goalType === type 
                                  ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-extrabold'
                                  : 'border-white/[0.04] bg-zinc-900/50 text-zinc-400'
                              }`}
                            >
                              {type}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: LIFESTYLE */}
                  {step === 4 && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider text-xs">
                        <Gauge className="h-4.5 w-4.5" />
                        <span>METABOLIC ACTIVITY VOLUME</span>
                      </div>

                      <div className="space-y-3.5">
                        {([
                          { level: 'Sedentary', multi: '1.20', desc: 'Minimal activity, desk boundaries, remote roles.' },
                          { level: 'Lightly Active', multi: '1.38', desc: 'Light structural walks or standing 1-3 days.' },
                          { level: 'Moderately Active', multi: '1.55', desc: 'Structured dynamic workouts 3-5 days weekly.' },
                          { level: 'Very Active', multi: '1.73', desc: 'Heavy strength maneuvers or fast activities 6-7 days.' },
                          { level: 'Athlete', multi: '1.90', desc: 'Professional athletic workloads, double splits training.' },
                        ] as { level: ActivityLevel; multi: string; desc: string }[]).map((item) => (
                          <div
                            key={item.level}
                            onClick={() => setActivityLevel(item.level)}
                            className={`group cursor-pointer rounded-xl border p-4 flex justify-between items-center transition-all ${
                              activityLevel === item.level
                                ? 'border-orange-500 bg-orange-500/5 text-white'
                                : 'border-white/[0.04] bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700'
                            }`}
                          >
                            <div>
                              <h5 className="text-xs font-bold uppercase tracking-wider leading-none text-zinc-200 group-hover:text-white">
                                {item.level} <span className="text-[10px] text-orange-400 font-mono ml-2">× {item.multi} TDEE</span>
                              </h5>
                              <p className="mt-1.5 text-[11px] text-zinc-500 group-hover:text-zinc-400 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                            <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${activityLevel === item.level ? 'border-orange-500 bg-orange-500' : 'border-zinc-700'}`}>
                              {activityLevel === item.level && <div className="h-1.5 w-1.5 rounded-full bg-white animate-scale-in" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 5: DIET */}
                  {step === 5 && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider text-xs">
                        <Apple className="h-4.5 w-4.5" />
                        <span>NUTRITIONAL COMPLIANCE</span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Primary Dietary Regime</label>
                        <div className="grid grid-cols-2 gap-3">
                          {(['Vegetarian', 'Vegan', 'Eggetarian', 'Non Vegetarian'] as DietType[]).map((diet) => (
                            <button
                              key={diet}
                              type="button"
                              onClick={() => setDietType(diet)}
                              className={`py-3.5 rounded-xl border text-xs font-bold transition-all tracking-wide ${
                                dietType === diet 
                                  ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-extrabold'
                                  : 'border-white/[0.04] bg-zinc-900/50 text-zinc-400'
                              }`}
                            >
                              {diet}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Gastrointestinal Food Allergies</label>
                        <input
                          type="text"
                          value={allergiesText}
                          onChange={(e) => setAllergiesText(e.target.value)}
                          placeholder="Peanuts, Shellfish, Gluten (comma separated)"
                          className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 px-4 text-xs font-medium text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* STEP 6: GYM DETAILS */}
                  {step === 6 && (
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider text-xs">
                        <Dumbbell className="h-4.5 w-4.5" />
                        <span>FACILITY DETAILS & FREQUENCY</span>
                      </div>

                      <div className="flex justify-between items-center p-4 rounded-xl bg-zinc-900/40 border border-white/[0.03]">
                        <div>
                          <h5 className="text-xs font-bold uppercase text-zinc-300">Gym Access Availability</h5>
                          <p className="text-[10px] text-zinc-500 mt-0.5 font-medium">Do you possess barbell and machines access?</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setHasGymAccess(!hasGymAccess)}
                          className={`w-14 h-7 rounded-full border transition-all relative ${hasGymAccess ? 'bg-orange-500 border-orange-500' : 'bg-zinc-900 border-zinc-700'}`}
                        >
                          <span className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white transition-all ${hasGymAccess ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>

                      {hasGymAccess && (
                        <div className="space-y-1.5 animate-slide-in duration-350">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Your Muscular Experience</label>
                          <div className="grid grid-cols-3 gap-3">
                            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => setFitnessLevel(lvl)}
                                className={`py-3 rounded-xl border text-xs font-bold uppercase transition-all tracking-wider ${
                                  fitnessLevel === lvl 
                                    ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-extrabold'
                                    : 'border-white/[0.04] bg-zinc-900/50 text-zinc-400'
                                }`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Weekly Desired Training Days (Select Multiple)</label>
                        <div className="grid grid-cols-7 gap-2">
                          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => {
                            const isSelected = workoutDays.includes(idx);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleDaySelect(idx)}
                                className={`h-10 w-full rounded-lg border text-xs font-black transition-all ${
                                  isSelected 
                                    ? 'bg-orange-500 border-orange-500 text-white' 
                                    : 'bg-zinc-900/40 border-white/[0.03] text-zinc-500 hover:text-white hover:border-zinc-700'
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">Optimal Target Session Hour</label>
                        <div className="grid grid-cols-4 gap-2">
                          {(['Morning', 'Afternoon', 'Evening', 'Night'] as WorkoutTime[]).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setWorkoutTime(t as WorkoutTime)}
                              className={`py-3 rounded-lg border text-[10px] font-bold uppercase tracking-wide transition-all ${
                                workoutTime === t 
                                  ? 'border-orange-500 bg-orange-500/10 text-orange-400 font-extrabold'
                                  : 'border-white/[0.03] bg-zinc-900/40 text-zinc-500'
                              }`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Wizard Controller Actions */}
                  <div className="flex gap-4 pt-6 border-t border-white/[0.04]">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="flex-1 rounded-xl border border-white/[0.08] hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 py-3.5 text-xs font-bold uppercase tracking-widest text-zinc-300 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous State</span>
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-[2] rounded-xl bg-orange-500 hover:bg-orange-600 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{step === 6 ? 'Assess My Standing Now' : 'Build Next Phase'}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </GlassCard>
          </div>

          {/* RIGHT: Live Recalculating Indexes Panel */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="border-b border-white/[0.04] pb-4">
              <span className="text-[10px] uppercase font-black tracking-widest text-orange-500 flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" /> Live Recalculating Matrix
              </span>
              <p className="text-xs text-zinc-500 mt-1 font-medium">Physiology values dynamically calculated using your active input selections.</p>
            </div>

            <BMICard bmi={liveCalculations.bmi} />

            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                id="live-bmr-card"
                title="Basal Metabolic (BMR)"
                value={liveCalculations.bmr}
                unit="kcal"
                icon={Activity}
                subtext="Absolute resting metabolic rate"
              />

              <MetricCard
                id="live-calories-card"
                title="Daily Suggested Goal"
                value={liveCalculations.targetCalories}
                unit="kcal"
                icon={Zap}
                subtext={`${goalType} customized budget`}
              />

              <MetricCard
                id="live-water-card"
                title="Water intake"
                value={liveCalculations.waterIntake}
                unit="L"
                icon={Apple}
                subtext="Required volume schedules"
              />

              <MetricCard
                id="live-timeline-card"
                title="Goal Timeline"
                value={liveCalculations.timelineWeeks}
                unit="Weeks"
                icon={Award}
                subtext="Linear timeframe projection"
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
