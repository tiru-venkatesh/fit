import React, { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  TrendingUp, Award, Calendar, BarChart3, Droplet, Flame, Compass, Scale
} from 'lucide-react';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useProfileStore } from '../store/profileStore';
import { GlassCard } from '../components/GlassCard';
import { ChartCard } from '../components/ChartCard';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileSidebar } from '../components/MobileSidebar';

export default function AnalyticsPage() {
  const { weightHistory, calorieHistory, waterHistory, getStatsSummary } = useAnalyticsStore();
  const { profile } = useProfileStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const stats = getStatsSummary();

  const weightUnit = profile.measurements.weightUnit || 'kg';

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 md:pl-72 animate-fade-in duration-300">
          <div className="max-w-5xl mx-auto space-y-8">
            
            <div className="border-b border-white/[0.04] pb-6">
              <span className="text-[10px] uppercase font-black text-orange-500 tracking-widest">BIOMETRIC AUDITING</span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 uppercase">Progress Analytics & Trends</h1>
              <p className="text-xs text-zinc-500 mt-1 font-medium">Verify structural reductions in fat mass and consistent training attendance grids.</p>
            </div>

            {/* Micro scorecard stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlassCard className="p-4 border border-white/[0.02]">
                <span className="text-[9px] uppercase font-medium text-zinc-500">Average Daily Calories</span>
                <p className="text-xl font-bold text-white mt-1.5">{stats.avgCalories} <span className="text-xs font-normal text-zinc-500">kcal</span></p>
              </GlassCard>

              <GlassCard className="p-4 border border-white/[0.02]">
                <span className="text-[9px] uppercase font-medium text-zinc-500">Total Training volume</span>
                <p className="text-xl font-bold text-white mt-1.5">{stats.totalWorkouts} <span className="text-xs font-normal text-zinc-500">Sessions</span></p>
              </GlassCard>

              <GlassCard className="p-4 border border-white/[0.02]">
                <span className="text-[9px] uppercase font-medium text-zinc-500">Mean sleep recovery</span>
                <p className="text-xl font-bold text-white mt-1.5">7.5 <span className="text-xs font-normal text-zinc-500">Hours</span></p>
              </GlassCard>

              <GlassCard className="p-4 border border-white/[0.02]">
                <span className="text-[9px] uppercase font-medium text-zinc-500">Hydration average</span>
                <p className="text-xl font-bold text-teal-400 mt-1.5">{stats.avgWater} <span className="text-xs font-normal text-zinc-550">L/day</span></p>
              </GlassCard>
            </div>

            {/* Graphics columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              
              {/* 1. Weight Trends Curve */}
              <ChartCard
                title="Bodyweight Progression Cycle"
                subtitle={`Measured weekly in (${weightUnit}) standard.`}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                      labelStyle={{ color: '#a1a1aa', fontWeight: 'bold', fontSize: '11px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ r: 4, stroke: '#f97316', strokeWidth: 1 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* 2. Calories Burned Bar */}
              <ChartCard
                title="Energy expenditure budgets"
                subtitle="Daily logged caloric ingestion schedules."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={calorieHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                    />
                    <Bar dataKey="calories" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* 3. Hydration details Area */}
              <ChartCard
                title="Hydration Intake records"
                subtitle="Recorded water volumes in standard liters."
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={waterHistory} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="water" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWater)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* 4. Diagnostic Consistency card */}
              <GlassCard className="p-5 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">BIOMETRIC ATTENDANCE ACCIDENT CONSOLE</h4>
                  <p className="text-xs text-zinc-500 mt-1">Verifying attendance scheduling compliance.</p>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="p-3 bg-zinc-950/40 rounded-xl border border-white/[0.02]">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Assigned Frequency Goal</span>
                    <p className="text-sm font-bold text-zinc-300 mt-1">{profile.workoutDays.length} sessions scheduled per calendar week</p>
                  </div>
                  
                  <div className="p-3 bg-zinc-950/40 rounded-xl border border-white/[0.02]">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">Hydration Target Threshold</span>
                    <p className="text-sm font-bold text-zinc-300 mt-1">Sustain consistent water volumes above 3.5 Liters daily</p>
                  </div>

                  <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                    "Continuous physiological progression is mathematically guaranteed by staying aligned with daily metabolic budget recommendations."
                  </p>
                </div>
              </GlassCard>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
