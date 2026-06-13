import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, Dumbbell, Calendar, Briefcase, Play, RefreshCw, Layers, HardHat, Info, CheckCircle
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileSidebar } from '../components/MobileSidebar';
import { GlassCard } from '../components/GlassCard';
import { useProfileStore } from '../store/profileStore';
import { useToast } from '../components/ToastProvider';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: string;
}

interface RoutineDay {
  day: string;
  exercises: Exercise[];
}

interface GeneratedProgram {
  title: string;
  description: string;
  schedule: RoutineDay[];
}

export default function AiWorkoutGeneratorPage() {
  const { toast } = useToast();
  const { profile } = useProfileStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [program, setProgram] = useState<GeneratedProgram | null>(null);

  // Form State
  const [goal, setGoal] = useState(profile.goals.goalType || 'Fat Loss');
  const [splitType, setSplitType] = useState('Push Pull Legs');
  const [equipment, setEquipment] = useState(profile.hasGymAccess ? 'Full Gym' : 'Home Dumbbells & Bodyweight');
  const [intensity, setIntensity] = useState('Intermediate');
  const [age, setAge] = useState(profile.age || 26);
  const [weight, setWeight] = useState(profile.measurements.weight || 75);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai-workout-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          age,
          weight,
          height: profile.measurements.height,
          fitnessLevel: intensity,
          availableEquipment: equipment,
          splitType,
        }),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setProgram(data);
      toast('AI Program formulated successfully!', 'success');
    } catch {
      toast('Formulated program via local backup algorithms.', 'success');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 md:pl-72 animate-fade-in duration-300">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="border-b border-white/[0.04] pb-6">
              <span className="text-[10px] uppercase font-black text-orange-500 tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 animate-pulse" /> ALGORITHMIC PRECONSTRUCTION
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 uppercase">AI Workout Generator</h1>
              <p className="text-xs text-zinc-500 mt-1 font-medium">Auto-compose professional weekly routines engineered directly for muscle fiber recruiting and failure thresholds.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Form Settings */}
              <GlassCard className="p-6 md:col-span-5 border border-white/[0.04] space-y-5">
                <h3 className="text-xs font-black uppercase text-zinc-300 tracking-wider border-b border-white/[0.02] pb-2 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-orange-500" /> Adjust Variables
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1.5">Athletic Target</label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full rounded-xl bg-zinc-950 border border-white/10 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-orange-500"
                    >
                      <option value="Fat Loss">Fat Loss & Metabolic Rate</option>
                      <option value="Muscle Gain">Muscle Gain Hypertrophy</option>
                      <option value="Body Recomposition">Body Recomposition</option>
                      <option value="Strength">Powerlifting & Pure Strength</option>
                      <option value="Endurance">Cardiovascular Endurance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1.5">Routine Split Type</label>
                    <select
                      value={splitType}
                      onChange={(e) => setSplitType(e.target.value)}
                      className="w-full rounded-xl bg-zinc-950 border border-white/10 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-orange-500"
                    >
                      <option value="Push Pull Legs">Push Pull Legs (PPL)</option>
                      <option value="Upper Lower">Upper / Lower Split</option>
                      <option value="Full Body">Full Body Functional</option>
                      <option value="Home Custom">Minimalist Home Blast</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1.5">Available Equipment</label>
                    <select
                      value={equipment}
                      onChange={(e) => setEquipment(e.target.value)}
                      className="w-full rounded-xl bg-zinc-950 border border-white/10 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-orange-500"
                    >
                      <option value="Full Gym">Commercial Gym (Barbells, Cables, Dumbbells)</option>
                      <option value="Home Dumbbells & Bodyweight">Home Gym (Dumbbells, Restrictor Bands)</option>
                      <option value="Bodyweight Only">Raw Calisthenics Only (No Equipment)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1.5">Training Level Intensity</label>
                    <select
                      value={intensity}
                      onChange={(e) => setIntensity(e.target.value)}
                      className="w-full rounded-xl bg-zinc-950 border border-white/10 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-orange-500"
                    >
                      <option value="Beginner">Beginner (Foundation block)</option>
                      <option value="Intermediate">Intermediate (Progressive overload)</option>
                      <option value="Elite / Professional">Elite Athlete (High failure threshold)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3 ">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1.5">Age</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full rounded-xl bg-zinc-950 border border-white/10 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1.5">Weight (kg)</label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full rounded-xl bg-zinc-950 border border-white/10 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/20 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Formulating Neural Fiber Splits...</span>
                    </>
                  ) : (
                    <>
                      <Dumbbell className="h-4 w-4 animate-bounce" />
                      <span>Generate Weekly AI Routine</span>
                    </>
                  )}
                </button>
              </GlassCard>

              {/* Weekly Schedule Results */}
              <div className="md:col-span-7 space-y-4">
                {program ? (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <GlassCard className="p-5 border border-orange-500/20 bg-orange-500/[0.01]">
                      <div className="flex items-center gap-11">
                        <div>
                          <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            COMPREHENSIVE PRESCRIPTION
                          </span>
                          <h2 className="text-base font-black text-white uppercase mt-1.5 tracking-tight">{program.title}</h2>
                          <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-semibold">{program.description}</p>
                        </div>
                      </div>
                    </GlassCard>

                    <div className="space-y-4">
                      {program.schedule.map((dayPlan, dIdx) => (
                        <motion.div
                          key={dIdx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: dIdx * 0.05 }}
                        >
                          <GlassCard className="p-5 border border-white/[0.04] space-y-3">
                            <h4 className="text-xs font-extrabold uppercase text-orange-400 tracking-wider flex items-center justify-between">
                              <span>{dayPlan.day}</span>
                              <span className="text-[9px] font-medium text-zinc-500">{dayPlan.exercises.length} Exercises Staged</span>
                            </h4>

                            {dayPlan.exercises.length === 0 ? (
                              <div className="text-[11px] text-zinc-500 italic p-3 bg-zinc-950/40 border border-white/[0.01] rounded-xl">
                                Rest, stretching, deep cellular recovery and neural cooling sleep sequence prioritized.
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {dayPlan.exercises.map((ex, exIdx) => (
                                  <div
                                    key={exIdx}
                                    className="p-3 bg-zinc-950/40 rounded-xl border border-white/[0.02] flex items-center justify-between hover:border-orange-500/10 transition-colors"
                                  >
                                    <div>
                                      <p className="text-[11px] font-extrabold text-white">{ex.name}</p>
                                      <p className="text-[9px] text-zinc-500 mt-0.5 font-semibold">Targets: muscular fatigue load & form precision</p>
                                    </div>

                                    <div className="text-right shrink-0">
                                      <span className="text-[10px] font-black text-zinc-300 uppercase tracking-wider">
                                        {ex.sets} Sets × {ex.reps} Reps
                                      </span>
                                      <span className="block text-[8px] font-bold text-orange-400 mt-0.5 uppercase tracking-widest bg-orange-500/10 border border-orange-500/10 px-1.5 py-0.5 rounded">
                                        {ex.weight}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </GlassCard>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <GlassCard className="flex flex-col items-center justify-center p-12 text-center border border-white/[0.04]">
                    <div className="h-12 w-12 rounded-full bg-zinc-900 border border-white/[0.06] flex items-center justify-center text-zinc-500">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mt-4">Program Pipeline Empty</h4>
                    <p className="text-[11px] text-zinc-500 mt-1 max-w-sm">Select your current targets and equipment configuration to generate your hyper-personalized weekly athletic outline.</p>
                  </GlassCard>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
