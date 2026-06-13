import React from 'react';
import { Target, Calendar, Award } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { GoalType } from '../types/profile';

interface GoalCardProps {
  goalType: GoalType;
  currentValue: number;
  targetValue: number;
  unit: string;
  deadlineWeeks: number;
}

export function GoalCard({ goalType, currentValue, targetValue, unit, deadlineWeeks }: GoalCardProps) {
  // Let's figure out matching metrics progress
  const diff = Math.abs(currentValue - targetValue);
  const isLoss = goalType === 'Fat Loss' || currentValue > targetValue;
  
  // Simulated progress percentage from a baseline (assume 10% progress increment initially if they just started, up to 100%)
  const percentage = isLoss
    ? currentValue <= targetValue ? 100 : Math.max(10, Math.min(95, (targetValue / currentValue) * 100))
    : currentValue >= targetValue ? 100 : Math.max(10, Math.min(95, (currentValue / targetValue) * 100));

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 text-zinc-400">
        <Target className="h-4 w-4 text-orange-500" />
        <span className="text-xs font-semibold uppercase tracking-wider">Active Fitness Objective</span>
      </div>

      <div className="mt-4">
        <span className="text-xl font-bold text-white tracking-tight">{goalType} Program</span>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-zinc-500">
          <Calendar className="h-3.5 w-3.5 text-zinc-600" />
          <span>Timeline Frame: {deadlineWeeks} Weeks Plan</span>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-zinc-500">Current: <strong className="text-zinc-200">{currentValue} {unit}</strong></span>
          <span className="text-orange-400 font-semibold uppercase flex items-center gap-1">
            <Award className="h-3 w-3" /> Target: {targetValue} {unit}
          </span>
        </div>
        
        {/* Horizontal linear progress slider */}
        <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden border border-white/[0.02]">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        <div className="flex justify-between text-[10px] text-zinc-500">
          <span>Starting</span>
          <span>{Math.round(percentage)}% of target met</span>
          <span>Sustain</span>
        </div>
      </div>
    </GlassCard>
  );
}
