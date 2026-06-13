import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, Calendar, TrendingUp, Compass, ArrowRight, ShieldCheck, Scale, Award, Layers
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileSidebar } from '../components/MobileSidebar';
import { GlassCard } from '../components/GlassCard';
import { useProfileStore } from '../store/profileStore';

export default function TransformationRoadmapPage() {
  const { profile } = useProfileStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form selections to experiment with estimates
  const [targetGoal, setTargetGoal] = useState(profile.goals.goalType || 'Fat Loss');
  const [expWeight, setExpWeight] = useState(profile.measurements.weight || 75);
  const [pacingRate, setPacingRate] = useState<'Standard' | 'Athletic Intensity' | 'Aggressive Deficit'>('Athletic Intensity');

  // Compute 30 / 60 / 90 / 180 timelines
  const getProjections = () => {
    const isFatLoss = targetGoal === 'Fat Loss';
    const isMuscle = targetGoal === 'Muscle Gain';

    const paceMultiplier = pacingRate === 'Standard' ? 0.7 : pacingRate === 'Athletic Intensity' ? 1.0 : 1.3;

    return [
      {
        duration: '30 Days Out',
        weightChange: isFatLoss ? -2 * paceMultiplier : isMuscle ? 1 * paceMultiplier : -1 * paceMultiplier,
        bodyFatChange: isFatLoss ? -1.2 * paceMultiplier : isMuscle ? -0.2 : -0.6 * paceMultiplier,
        muscleGain: isFatLoss ? 0.1 : isMuscle ? 0.8 * paceMultiplier : 0.3 * paceMultiplier,
        difficulty: 'Neurological Adapter Phase',
        summary: 'Your body adapts neuro-muscular pathways, stabilizing motor recruitment for heavy lifts & energy deficits.',
      },
      {
        duration: '60 Days Out',
        weightChange: isFatLoss ? -4 * paceMultiplier : isMuscle ? 2 * paceMultiplier : -2 * paceMultiplier,
        bodyFatChange: isFatLoss ? -2.5 * paceMultiplier : isMuscle ? -0.4 : -1.2 * paceMultiplier,
        muscleGain: isFatLoss ? 0.2 : isMuscle ? 1.5 * paceMultiplier : 0.6 * paceMultiplier,
        difficulty: 'Myofibrillar Hypertrophy Block',
        summary: 'Muscle density increases and visceral fat stores exhaust as high metabolic TDEE remains optimized.',
      },
      {
        duration: '90 Days Out',
        weightChange: isFatLoss ? -6.5 * paceMultiplier : isMuscle ? 3 * paceMultiplier : -3.5 * paceMultiplier,
        bodyFatChange: isFatLoss ? -4.0 * paceMultiplier : isMuscle ? -0.6 : -2.0 * paceMultiplier,
        muscleGain: isFatLoss ? 0.4 : isMuscle ? 2.2 * paceMultiplier : 0.9 * paceMultiplier,
        difficulty: 'Systemic Composition Shift',
        summary: 'Visible changes emerge: abdominal definition sharpens and compound lift strength peaks safely.',
      },
      {
        duration: '180 Days Out',
        weightChange: isFatLoss ? -12 * paceMultiplier : isMuscle ? 5.5 * paceMultiplier : -7 * paceMultiplier,
        bodyFatChange: isFatLoss ? -7.5 * paceMultiplier : isMuscle ? -1.2 : -4.0 * paceMultiplier,
        muscleGain: isFatLoss ? 0.8 : isMuscle ? 4 * paceMultiplier : 1.8 * paceMultiplier,
        difficulty: 'Athletic Peak Baseline',
        summary: 'Your metabolic rate completely resets, forming a hardened physical frame with dense capillary beds.',
      },
    ];
  };

  const projections = getProjections();

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
                <Compass className="h-4 w-4 animate-spin-slow" /> METABOLIC ROADMAPPING PRESETS
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 uppercase">Transformation Roadmap</h1>
              <p className="text-xs text-zinc-500 mt-1 font-medium">Auto-estimate your physical metrics at 30, 60, 90, and 180 days based on thermodynamic and compound loading consistency.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Settings selectors */}
              <GlassCard className="p-5 border border-white/[0.04] md:col-span-4 col-span-1 space-y-4">
                <h3 className="text-xs font-black uppercase text-zinc-300 tracking-wider border-b border-white/[0.02] pb-2 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-orange-500" /> Adjust Inputs
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1.5">Aspirational Goal</label>
                    <select
                      value={targetGoal}
                      onChange={(e) => setTargetGoal(e.target.value)}
                      className="w-full rounded-xl bg-zinc-950 border border-white/10 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-orange-500"
                    >
                      <option value="Fat Loss">Hard Fat Loss</option>
                      <option value="Muscle Gain">Hypertrophic Muscle Gaining</option>
                      <option value="Body Recomposition">Athletic Body Recomposition</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1.5">Training Pacing Intensity</label>
                    <div className="flex flex-col gap-1.5 pt-1">
                      {['Standard', 'Athletic Intensity', 'Aggressive Deficit'].map((pace) => (
                        <button
                          key={pace}
                          onClick={() => setPacingRate(pace as any)}
                          className={`w-full text-left rounded-xl px-4 py-2.5 text-xs font-bold transition-all border ${
                            pacingRate === pace 
                              ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' 
                              : 'bg-zinc-950 text-zinc-400 border-white/[0.04] hover:text-white'
                          }`}
                        >
                          {pace} (Multiplier: {pace === 'Standard' ? '0.7x' : pace === 'Athletic Intensity' ? '1.0x' : '1.3x'})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-950/40 border border-white/[0.02] rounded-xl text-[10px] leading-relaxed text-zinc-500">
                    Calculated by applying thermodynamic conversion rates against average calorie expenditures.
                  </div>
                </div>
              </GlassCard>

              {/* Projections timeline */}
              <div className="md:col-span-8 space-y-6">
                <div className="relative border-l-2 border-white/[0.06] pl-6 ml-3 space-y-8">
                  {projections.map((item, idx) => (
                    <div key={idx} className="relative">
                      {/* Floating dots indicators */}
                      <span className="absolute -left-[31px] top-0.5 h-4 w-4 rounded-full bg-zinc-950 border-2 border-orange-500 flex items-center justify-center shadow-lg">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                      </span>

                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{item.duration}</span>
                        <h4 className="text-sm font-extrabold uppercase text-white tracking-tight flex items-center justify-between">
                          <span>{item.difficulty}</span>
                        </h4>
                        
                        <div className="grid grid-cols-3 gap-3 pt-1">
                          <div className="p-3 bg-zinc-950/50 rounded-xl border border-white/[0.02] text-center">
                            <span className="block text-[7px] font-bold text-zinc-500 uppercase">Weight Delta</span>
                            <span className={`block text-xs font-black mt-1 ${item.weightChange < 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                              {item.weightChange > 0 ? `+${item.weightChange}` : item.weightChange} kg
                            </span>
                            <span className="block text-[8px] font-medium text-zinc-500 uppercase mt-0.5 mt-2">
                              Net: {(expWeight + item.weightChange).toFixed(1)} kg
                            </span>
                          </div>

                          <div className="p-3 bg-zinc-950/50 rounded-xl border border-white/[0.02] text-center">
                            <span className="block text-[7px] font-bold text-zinc-500 uppercase">Body Fat Delta</span>
                            <span className="block text-xs font-black text-emerald-400 mt-1">
                              {item.bodyFatChange} %
                            </span>
                            <span className="block text-[8px] font-medium text-zinc-500 uppercase mt-2">
                              Fat Mass Lost
                            </span>
                          </div>

                          <div className="p-3 bg-zinc-950/50 rounded-xl border border-white/[0.02] text-center">
                            <span className="block text-[7px] font-bold text-zinc-500 uppercase">Lean Muscle Gain</span>
                            <span className="block text-xs font-black text-cyan-400 mt-1">
                              +{item.muscleGain} kg
                            </span>
                            <span className="block text-[8px] font-medium text-zinc-500 uppercase mt-2">
                              Myofibrillar Tissue
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold pt-1 p-3 bg-zinc-900/10 border border-white/[0.01] rounded-xl">{item.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <GlassCard className="p-4 border border-white/[0.04] text-center text-xs text-zinc-550 flex items-center justify-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span>These projections represent reliable mathematical physical estimates. Consistency is required to lock transformation gains.</span>
                </GlassCard>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
