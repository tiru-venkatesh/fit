import React from 'react';
import { Eye, Sparkles, Dumbbell, Apple, Moon, Zap, Activity } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { AICoachAdvice } from '../services/aiService';

interface AIInsightsCardProps {
  insights: AICoachAdvice | null;
  isLoading: boolean;
  onRefresh?: () => void;
}

export function AIInsightsCard({ insights, isLoading, onRefresh }: AIInsightsCardProps) {
  if (isLoading) {
    return (
      <GlassCard className="p-6 space-y-4 border border-orange-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-500 animate-pulse" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">FitForge Coach</h3>
          </div>
          <div className="text-[10px] uppercase font-semibold tracking-widest text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded">Synthesizing Biometrics</div>
        </div>
        <div className="space-y-3 pt-2">
          <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-11/12 bg-zinc-800 rounded animate-pulse" />
          <div className="h-4 w-9/12 bg-zinc-800 rounded animate-pulse" />
        </div>
      </GlassCard>
    );
  }

  if (!insights) return null;

  return (
    <GlassCard className="p-6 relative overflow-hiddenborder border-orange-500/10 bg-gradient-to-b from-zinc-950/80 to-zinc-950/40">
      <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-orange-500/[0.03] blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-base font-bold text-white uppercase tracking-wider">Coach AI Recommendations</h3>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-xs font-semibold uppercase text-zinc-400 hover:text-orange-400 transition-colors bg-zinc-900 border border-white/[0.04] px-3 py-1.5 rounded-lg active:scale-95"
          >
            Re-Assess
          </button>
        )}
      </div>

      <div className="mt-5 space-y-4 text-sm">
        {/* Row 1: Workout */}
        <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-white/[0.02]">
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-widest">
            <Dumbbell className="h-3.5 w-3.5" />
            <span>Target Training Plan</span>
          </div>
          <p className="mt-2 text-xs text-zinc-300 leading-relaxed">{insights.workout}</p>
        </div>

        {/* Row 2: Nutrition */}
        <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-white/[0.02]">
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-widest">
            <Apple className="h-3.5 w-3.5" />
            <span>Nutritional Directives</span>
          </div>
          <p className="mt-2 text-xs text-zinc-300 leading-relaxed">{insights.nutrition}</p>
        </div>

        {/* Row 3: Recovery */}
        <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-white/[0.02]">
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-widest">
            <Moon className="h-3.5 w-3.5" />
            <span>Sleep & Tissue Recovery</span>
          </div>
          <p className="mt-2 text-xs text-zinc-300 leading-relaxed">{insights.recovery}</p>
        </div>

        {/* Row 4: Motivation */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 uppercase tracking-widest">
            <Zap className="h-3.5 w-3.5" />
            <span>Habit & Motivation Catalyst</span>
          </div>
          <p className="mt-2 text-xs text-orange-200 leading-relaxed italic">"{insights.motivation}"</p>
        </div>
      </div>
    </GlassCard>
  );
}
