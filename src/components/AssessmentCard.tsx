import React from 'react';
import { Award, Zap, Shield, Flame, Target, Compass, Sparkles } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface AssessmentCardProps {
  healthScore: number;
  fitnessScore: number;
  consistencyScore: number;
  targetBmi: number;
  currentBmi: number;
  caloriesNeeded: number;
  timelineEstimateWeeks: number;
  workoutSplitName: string;
  dietType: string;
}

export function AssessmentCard({
  healthScore,
  fitnessScore,
  consistencyScore,
  targetBmi,
  currentBmi,
  caloriesNeeded,
  timelineEstimateWeeks,
  workoutSplitName,
  dietType,
}: AssessmentCardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Score parameters */}
      <GlassCard className="col-span-1 flex flex-col justify-between py-6 border border-orange-500/15 bg-gradient-to-tr from-zinc-950 to-zinc-900/50">
        <div>
          <div className="flex items-center gap-2 text-zinc-400">
            <Award className="h-4 w-4 text-orange-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">Functional Standing</span>
          </div>
          <h4 className="mt-2 text-lg font-bold text-white tracking-tight">Active FitForge Score</h4>
        </div>

        <div className="mt-8 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Health Index</span>
            <div className="w-2/3 flex items-center gap-3">
              <div className="h-2 w-full bg-zinc-900 overflow-hidden rounded-full border border-white/[0.02]">
                <div className="h-full bg-emerald-500" style={{ width: `${healthScore}%` }} />
              </div>
              <span className="text-xs font-bold text-emerald-400">{healthScore}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Fitness Power</span>
            <div className="w-2/3 flex items-center gap-3">
              <div className="h-2 w-full bg-zinc-900 overflow-hidden rounded-full border border-white/[0.02]">
                <div className="h-full bg-orange-500" style={{ width: `${fitnessScore}%` }} />
              </div>
              <span className="text-xs font-bold text-orange-400">{fitnessScore}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Consistency</span>
            <div className="w-2/3 flex items-center gap-3">
              <div className="h-2 w-full bg-zinc-900 overflow-hidden rounded-full border border-white/[0.02]">
                <div className="h-full bg-blue-500" style={{ width: `${consistencyScore}%` }} />
              </div>
              <span className="text-xs font-bold text-blue-400">{consistencyScore}</span>
            </div>
          </div>
        </div>

        <p className="mt-6 text-[10px] text-zinc-500 leading-relaxed">
          Scores are generated relative to consistency, biometric standing, and energy output schedules.
        </p>
      </GlassCard>

      {/* 2. Directives Details */}
      <GlassCard className="col-span-1 md:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="h-4.5 w-4.5 text-orange-500" />
            <h4 className="text-base font-bold text-white uppercase tracking-wider">AI Assessment Targets</h4>
          </div>
          <span className="text-xs text-zinc-400 bg-zinc-900 border border-white/[0.04] px-2.5 py-1 rounded-full">{dietType} Selection</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/[0.03]">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-orange-500" /> Target Budget
            </span>
            <p className="mt-1.5 text-xl font-extrabold text-white">{caloriesNeeded} <span className="text-xs font-medium text-zinc-400">kcal/day</span></p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/[0.03]">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
              <Target className="h-3.5 w-3.5 text-orange-500" /> Goal Timeframe
            </span>
            <p className="mt-1.5 text-xl font-extrabold text-white">{timelineEstimateWeeks} <span className="text-xs font-medium text-zinc-400">Weeks</span></p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/[0.03]">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-orange-500" /> Assigned Training Split
            </span>
            <span className="mt-1.5 block text-sm font-bold text-white tracking-tight leading-snug">{workoutSplitName}</span>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950/40 border border-white/[0.03]">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-orange-500" /> BMI Delta Progress
            </span>
            <p className="mt-1.5 text-sm font-bold text-zinc-300">
              {currentBmi} BMI <span className="text-zinc-600">→</span> <span className="text-orange-400 font-extrabold">{targetBmi} BMI</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-orange-500/5 border border-orange-500/10 rounded-xl p-3 text-xs text-orange-200">
          <Sparkles className="h-4 w-4 text-orange-400 shrink-0" />
          <span>This workout split takes into account your week-to-week consistency score and diet plan. Keep going!</span>
        </div>
      </GlassCard>
    </div>
  );
}
