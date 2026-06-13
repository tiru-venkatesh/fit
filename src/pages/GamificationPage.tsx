import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, Trophy, Award, Star, Flame, Shield, Play, Gift, Users, Zap, CheckCircle
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileSidebar } from '../components/MobileSidebar';
import { GlassCard } from '../components/GlassCard';
import { useWorkoutStore } from '../store/workoutStore';
import { useToast } from '../components/ToastProvider';

interface Challenge {
  id: string;
  name: string;
  duration: string;
  rewardXP: number;
  badge: string;
  type: string;
  progress: number;
  joined: boolean;
}

interface LeaderboardUser {
  rank: number;
  name: string;
  level: number;
  xp: number;
  streak: number;
}

export default function GamificationPage() {
  const { toast } = useToast();
  const { streak } = useWorkoutStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active state vars
  const [userLevel, setUserLevel] = useState(4);
  const [userXP, setUserXP] = useState(3840);
  const nextLevelXP = 5000;

  // Active Challenges State list
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: '1', name: '30 Day Fat Loss Blast', duration: '30 Days', rewardXP: 1000, badge: '🔥 Cut Master', type: 'Fat Loss', progress: 45, joined: true },
    { id: '2', name: '90 Day Transformation Odyssey', duration: '90 Days', rewardXP: 4000, badge: '🔱 Golden Athlete', type: 'Hypertrophy', progress: 0, joined: false },
    { id: '3', name: 'Hydration Challenge (3.5L/day)', duration: '14 Days', rewardXP: 450, badge: '💧 Pure Flow', type: 'Hydration', progress: 80, joined: true },
    { id: '4', name: '10K Steps Daily March', duration: '30 Days', rewardXP: 1200, badge: '👣 Pathfinder', type: 'Activity', progress: 0, joined: false },
  ]);

  // Unlockable Achievements
  const achievements = [
    { name: 'Consistency Engine', desc: 'Sustain a 7-day workout log streak.', status: streak.currentStreak >= 7 ? 'Unlocked' : 'Staged', xp: 500 },
    { name: 'Pure Hydrator', desc: 'Average above 3.5 liters of clean water for 5 days straight.', status: 'Unlocked', xp: 300 },
    { name: 'ATP Heavy Overload', desc: 'Log a compound load exceeding 1.25x body weight.', status: 'Unlocked', xp: 800 },
    { name: 'Nervous Rest Pattern', desc: 'Secure 8.0+ sleep recovery hours 7 days consecutively.', status: 'Staged', xp: 600 },
  ];

  // Live real-time ranking Leaderboard
  const leaderboard: LeaderboardUser[] = [
    { rank: 1, name: 'Ananya Sharma', level: 8, xp: 9410, streak: 18 },
    { rank: 2, name: 'Vikram Singh', level: 6, xp: 5930, streak: 12 },
    { rank: 3, name: 'Tiru Venkatesh (You)', level: userLevel, xp: userXP, streak: streak.currentStreak },
    { rank: 4, name: 'Priya Patel', level: 3, xp: 2840, streak: 4 },
    { rank: 5, name: 'Rohan Deshmukh', level: 2, xp: 1950, streak: 0 },
  ];

  const handleJoinChallenge = (id: string, name: string) => {
    setChallenges((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, joined: true, progress: 5 } : ch))
    );
    toast(`Successfully registered for the ${name}!`, 'success');
  };

  const handleClaimReward = (id: string, rewardValue: number, badge: string) => {
    setUserXP((prev) => prev + rewardValue);
    setChallenges((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, progress: 100 } : ch))
    );
    toast(`Claimed +${rewardValue} XP & Unlocked ${badge}!`, 'success');
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
                <Trophy className="h-4 w-4" /> GAMIFIED ATHLETE MATRIX
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 uppercase font-sans">Leaderboards, Streaks & Rewards</h1>
              <p className="text-xs text-zinc-500 mt-1 font-medium font-sans">Boost training compliance via dynamic achievements, challenges leveling, and live community leaderboards.</p>
            </div>

            {/* Level & XP Gauge Section */}
            <GlassCard className="p-6 border border-orange-500/10 bg-orange-500/[0.01]">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                <div className="text-center md:text-left">
                  <span className="text-[9px] uppercase font-black text-zinc-500">Athlete Rank Status</span>
                  <h2 className="text-2xl font-black text-white uppercase mt-1">Level {userLevel} <span className="text-xs text-orange-400 font-bold">Elite</span></h2>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase">
                    <span>XP Tracker</span>
                    <span>{userXP} / {nextLevelXP} XP</span>
                  </div>
                  <div className="w-full bg-zinc-950 border border-white/[0.04] rounded-full h-3 overflow-hidden">
                    <div className="h-full bg-orange-500" style={{ width: `${(userXP / nextLevelXP) * 100}%` }} />
                  </div>
                </div>

                <div className="flex justify-center md:justify-end gap-3 shrink-0">
                  <div className="p-2.5 bg-zinc-950 rounded-xl border border-white/[0.02] text-center px-4">
                    <Flame className="h-4 w-4 text-orange-500 mx-auto" />
                    <span className="block text-[8px] font-black text-white mt-1">{streak.currentStreak} Day Streak</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Active Challenges List */}
              <div className="md:col-span-7 space-y-6">
                <h3 className="text-xs font-black uppercase text-orange-400 tracking-wider flex items-center gap-2">
                  <Zap className="h-4.5 w-4.5 text-orange-500" /> Active System challenges
                </h3>

                <div className="space-y-4">
                  {challenges.map((ch) => (
                    <GlassCard key={ch.id} className="p-5 border border-white/[0.04] space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="bg-zinc-950 border border-white/[0.04] px-2.5 py-0.5 rounded text-[8px] font-black text-zinc-400 uppercase tracking-widest">
                            {ch.type} | Duration: {ch.duration}
                          </span>
                          <h4 className="text-xs font-black text-white uppercase mt-2 tracking-tight">{ch.name}</h4>
                        </div>
                        <span className="text-[10px] font-black text-orange-400">+{ch.rewardXP} XP</span>
                      </div>

                      {ch.joined ? (
                        <div className="space-y-3 pt-1">
                          <div className="flex justify-between text-[8px] font-bold text-zinc-500 uppercase">
                            <span>Challenge Completion progress</span>
                            <span>{ch.progress}%</span>
                          </div>
                          <div className="w-full bg-zinc-950 border border-white/[0.04] rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${ch.progress}%` }} />
                          </div>

                          <div className="flex justify-between items-center pt-1.5">
                            <span className="text-[9px] text-zinc-500 font-semibold flex items-center gap-1">
                              Badge to unlock: <strong className="text-orange-400">{ch.badge}</strong>
                            </span>

                            {ch.progress >= 80 && ch.progress < 100 ? (
                              <button
                                onClick={() => handleClaimReward(ch.id, ch.rewardXP, ch.badge)}
                                className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-[9px] font-black text-white uppercase rounded-md shadow"
                              >
                                Claim Reward
                              </button>
                            ) : ch.progress === 100 ? (
                              <span className="text-[8px] font-black uppercase text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                                <CheckCircle className="h-3 w-3" /> Completed
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-zinc-400 uppercase">Keep pushing</span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center pt-2 border-t border-white/[0.02]">
                          <span className="text-[10px] font-semibold text-zinc-500 flex items-center gap-1">
                            Reward: <strong className="text-orange-400">{ch.badge}</strong>
                          </span>
                          <button
                            onClick={() => handleJoinChallenge(ch.id, ch.name)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-[10px] font-black text-white uppercase rounded-xl transition-colors cursor-pointer"
                          >
                            Enter Challenge
                          </button>
                        </div>
                      )}
                    </GlassCard>
                  ))}
                </div>

                {/* Achievements Segment */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider flex items-center gap-2">
                    <Award className="h-4.5 w-4.5 text-orange-500" /> Unlockable achievements
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8">
                    {achievements.map((ach, aIdx) => (
                      <GlassCard key={aIdx} className="p-4 border border-white/[0.02]">
                        <div className="flex items-start justify-between">
                          <h5 className="text-[11px] font-extrabold uppercase text-white leading-none">{ach.name}</h5>
                          <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded ${ach.status === 'Unlocked' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10' : 'bg-zinc-950 text-zinc-500'}`}>
                            {ach.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 leading-normal mt-2 leading-relaxed">{ach.desc}</p>
                        <span className="block text-[9px] font-bold text-orange-500 mt-2">+{ach.xp} XP reward</span>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              </div>

              {/* Leaderboards Segment */}
              <div className="md:col-span-5 space-y-4">
                <h3 className="text-xs font-black uppercase text-orange-400 tracking-wider flex items-center gap-2">
                  <Users className="h-4.5 w-4.5 text-orange-500" /> Community Scoreboard leaderboard
                </h3>

                <GlassCard className="p-4 border border-white/[0.04]">
                  <div className="space-y-2">
                    {leaderboard.map((userRow) => (
                      <div
                        key={userRow.rank}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                          userRow.name.includes('(You)') 
                            ? 'bg-orange-500/10 border-orange-500/20 shadow-md' 
                            : 'bg-zinc-950/45 border-white/[0.01]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`h-6 w-6 rounded-full text-[10px] font-black flex items-center justify-center border ${
                            userRow.rank === 1 
                              ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                              : userRow.rank === 2 
                              ? 'bg-slate-300/10 text-slate-300 border-slate-300/20' 
                              : 'bg-zinc-900 text-zinc-550 border-white/[0.02]'
                          }`}>
                            {userRow.rank}
                          </span>
                          <div>
                            <span className="text-xs font-extrabold text-white">{userRow.name}</span>
                            <span className="block text-[8px] text-zinc-500 uppercase font-bold">Level {userRow.level} Champion</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="block text-xs font-black text-white">{userRow.xp} XP</span>
                          <span className="block text-[8px] text-orange-500 font-bold uppercase tracking-widest">{userRow.streak} day streak</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
