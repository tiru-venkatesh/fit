import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, Droplet, Moon, RefreshCw, BarChart, Plus, CheckCircle, Flame, Sun, Heart, Award
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileSidebar } from '../components/MobileSidebar';
import { GlassCard } from '../components/GlassCard';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useProfileStore } from '../store/profileStore';
import { useToast } from '../components/ToastProvider';

export default function WaterAndSleepCoachPage() {
  const { toast } = useToast();
  const { profile } = useProfileStore();
  const { loggedWaterIntakeToday, addWater, loggedSleepToday, addSleep } = useAnalyticsStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [climate, setClimate] = useState('Temperate');
  const [isWorkoutDay, setIsWorkoutDay] = useState(true);

  // Derive Water Goal
  let dailyBaseWater = profile.measurements.weight * 0.035; // kg to Liters config
  if (isWorkoutDay) dailyBaseWater += 1.0; 
  if (climate === 'Hot / Tropical') dailyBaseWater += 0.8;
  else if (climate === 'Cold / Dry') dailyBaseWater += 0.3;
  const computedWaterGoal = parseFloat(Math.max(2.0, Math.min(6.5, dailyBaseWater)).toFixed(1));

  // Derive Sleep Goal & Recovery Score
  const sleepTargetHours = 8.0;
  const recoveryScore = loggedSleepToday >= 8 
    ? 98 
    : loggedSleepToday >= 7 
    ? 85 
    : loggedSleepToday >= 5 
    ? 60 
    : 35;

  const handleWaterAdd = (amount: number) => {
    addWater(amount);
    toast(`Added ${amount * 1000}ml Hydration!`, 'success');
  };

  const handleSleepAdd = (amount: number) => {
    addSleep(amount);
    toast(`Logged ${amount} Hour of core physical sleep!`, 'success');
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
              <span className="text-[10px] uppercase font-black text-cyan-400 tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 animate-pulse" /> CIRCADIAN BALANCING ENGINE
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 uppercase">Water Planner & Sleep Coach</h1>
              <p className="text-xs text-zinc-500 mt-1 font-medium">Verify your chemical hydration ratios and track neural sleep parameters to lower blood cortisol stress spikes.</p>
            </div>

            {/* Dynamic Environment Settings */}
            <GlassCard className="p-5 border border-white/[0.03] grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div>
                <span className="text-[10px] uppercase font-black text-zinc-500 block">Climate Zone</span>
                <div className="flex gap-1.5 mt-2">
                  {['Temperate', 'Hot / Tropical', 'Cold / Dry'].map((cZone) => (
                    <button
                      key={cZone}
                      onClick={() => setClimate(cZone)}
                      className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-lg border transition-all ${
                        climate === cZone 
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                          : 'text-zinc-500 bg-transparent border-transparent hover:text-white'
                      }`}
                    >
                      {cZone}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-black text-zinc-500 block">Workout Day Intensity</span>
                <div className="flex gap-1.5 mt-2">
                  <button
                    onClick={() => setIsWorkoutDay(true)}
                    className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-lg border transition-all ${
                      isWorkoutDay 
                        ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' 
                        : 'text-zinc-500 border-transparent hover:text-white'
                    }`}
                  >
                    Active Session (+1.0L)
                  </button>
                  <button
                    onClick={() => setIsWorkoutDay(false)}
                    className={`px-3 py-1.5 text-[9px] font-bold uppercase rounded-lg border transition-all ${
                      !isWorkoutDay 
                        ? 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30' 
                        : 'text-zinc-500 border-transparent hover:text-white'
                    }`}
                  >
                    Passive Rest Day
                  </button>
                </div>
              </div>

              <div className="text-right md:border-l border-white/[0.04] pl-6 h-full flex flex-col justify-center">
                <span className="text-[10px] uppercase font-black text-orange-500 tracking-widest block block">Dynamic Water Target</span>
                <p className="text-xl font-black text-white mt-1 uppercase">{computedWaterGoal} L <span className="text-xs text-zinc-550 lowercase">/ day</span></p>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Hydration Segment */}
              <GlassCard className="p-6 border border-cyan-500/15 bg-cyan-500/[0.01] space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.02] pb-3">
                  <h3 className="text-xs font-black uppercase text-zinc-200 tracking-wider flex items-center gap-2">
                    <Droplet className="h-4.5 w-4.5 text-cyan-400 animate-bounce" /> Hydration tracking Console
                  </h3>
                  <span className="text-[9px] font-bold text-zinc-500">Live Intake Gauge</span>
                </div>

                <div className="flex items-center justify-around py-2">
                  <div className="text-center">
                    <span className="block text-[8px] uppercase font-bold text-zinc-500">Intake Achieved</span>
                    <span className="text-2xl font-black text-white mt-1 block">{loggedWaterIntakeToday} Liters</span>
                  </div>
                  <div className="text-center border-l border-white/[0.04] pl-6">
                    <span className="block text-[8px] uppercase font-bold text-zinc-500">Quota Target</span>
                    <span className="text-2xl font-black text-cyan-400 mt-1 block">{computedWaterGoal} Liters</span>
                  </div>
                </div>

                <div className="w-full bg-zinc-950 border border-white/[0.03] p-1.5 rounded-2xl">
                  <div className="h-4 bg-gradient-to-r from-cyan-500 to-teal-400 rounded-xl transition-all duration-300" style={{ width: `${Math.min(100, (loggedWaterIntakeToday / computedWaterGoal) * 100)}%` }} />
                </div>

                <div className="grid grid-cols-2 gap-3 ">
                  <button
                    onClick={() => handleWaterAdd(0.25)}
                    className="p-3 bg-zinc-950 border border-white/[0.04] hover:border-cyan-500/20 rounded-xl text-xs font-bold font-sans tracking-tight transition-all text-zinc-300 hover:text-white"
                  >
                    + 250ml Glass drink
                  </button>
                  <button
                    onClick={() => handleWaterAdd(0.75)}
                    className="p-3 bg-zinc-950 border border-white/[0.04] hover:border-cyan-500/20 rounded-xl text-xs font-bold font-sans tracking-tight transition-all text-zinc-300 hover:text-white"
                  >
                    + 750ml Gym bottle
                  </button>
                </div>

                <div className="p-3.5 bg-zinc-950/40 border border-white/[0.01] rounded-xl text-[10px] text-zinc-500 leading-normal leading-relaxed">
                  <strong className="text-cyan-400 uppercase font-bold tracking-wider block mb-1">Hydration Bio-guidance:</strong>
                  Maintaining strict chemical cell volume via clean water helps sustain metabolic waste clearing and ensures full joint structural lubrication.
                </div>
              </GlassCard>

              {/* Sleep Coach Segment */}
              <GlassCard className="p-6 border border-violet-500/15 bg-violet-500/[0.01] space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.02] pb-3">
                  <h3 className="text-xs font-black uppercase text-zinc-200 tracking-wider flex items-center gap-2">
                    <Moon className="h-4.5 w-4.5 text-violet-400 shrink-0" /> Sleep Recouperate Coach
                  </h3>
                  <span className="text-[9px] font-bold text-violet-400 tracking-widest uppercase">RECOVERY: {recoveryScore}%</span>
                </div>

                <div className="flex items-center justify-around py-2">
                  <div className="text-center">
                    <span className="block text-[8px] uppercase font-bold text-zinc-500">Logged Rest</span>
                    <span className="text-2xl font-black text-white mt-1 block">{loggedSleepToday} Hours</span>
                  </div>
                  <div className="text-center border-l border-white/[0.04] pl-6">
                    <span className="block text-[8px] uppercase font-bold text-zinc-500">Sleep Goal</span>
                    <span className="text-2xl font-black text-violet-440 mt-1 block">{sleepTargetHours} Hours</span>
                  </div>
                </div>

                <div className="w-full bg-zinc-950 border border-white/[0.03] p-1.5 rounded-2xl">
                  <div className="h-4 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl transition-all duration-300" style={{ width: `${Math.min(100, (loggedSleepToday / sleepTargetHours) * 100)}%` }} />
                </div>

                <div className="grid grid-cols-2 gap-3 ">
                  <button
                    onClick={() => handleSleepAdd(1)}
                    className="p-3 bg-zinc-950 border border-white/[0.04] hover:border-violet-500/20 rounded-xl text-xs font-bold font-sans tracking-tight transition-all text-zinc-300 hover:text-white"
                  >
                    + 1.0 Hour Core Sleep
                  </button>
                  <button
                    onClick={() => handleSleepAdd(0.5)}
                    className="p-3 bg-zinc-950 border border-white/[0.04] hover:border-violet-500/20 rounded-xl text-xs font-bold font-sans tracking-tight transition-all text-zinc-300 hover:text-white"
                  >
                    + 30 minutes Nap
                  </button>
                </div>

                <div className="p-3.5 bg-zinc-950/40 border border-white/[0.01] rounded-xl text-[10px] text-zinc-500 leading-normal leading-relaxed">
                  <strong className="text-violet-400 uppercase font-bold tracking-wider block mb-1">Coach Recommendations:</strong>
                  Slow-wave muscle cell rebuild is active mainly in sleep blocks. Limit blue-light exposure 60 mins before sleep to support melatonin release.
                </div>
              </GlassCard>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
