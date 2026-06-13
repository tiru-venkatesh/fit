import React from 'react';
import { Activity } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { getBMICategory, getBMIMessage } from '../utils/bmi';

export function BMICard({ bmi }: { bmi: number }) {
  const category = getBMICategory(bmi);
  const message = getBMIMessage(bmi);

  // Calculate indicator position percentage
  // Normal ranges are roughly 15 to 35
  const positionPct = Math.min(100, Math.max(0, ((bmi - 15) / 20) * 100));

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 text-zinc-400">
        <Activity className="h-4 w-4 text-orange-500" />
        <span className="text-xs font-semibold uppercase tracking-wider">Physiological Body Mass Index (BMI)</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="text-4xl font-bold tracking-tight text-white">{bmi}</span>
          <span className="ml-2.5 rounded-full bg-zinc-900 border border-white/[0.04] px-3 py-1 text-xs font-medium text-orange-400">
            {category}
          </span>
        </div>
      </div>

      {/* Modern scale bar indicator */}
      <div className="mt-5">
        <div className="relative h-2 w-full rounded-full bg-zinc-900 border border-white/[0.02]">
          {/* Ranges segments indicator guides */}
          <div className="absolute top-0 bottom-0 left-[17.5%] w-0.5 bg-zinc-800" /> {/* normal 18.5 marker */}
          <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-zinc-800" />  {/* overweight 25.0 marker */}
          <div className="absolute top-0 bottom-0 left-[75%] w-0.5 bg-zinc-800" />  {/* obese 30.0 marker */}

          {/* Glowing sliding pointer node */}
          <div
            className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-orange-500 bg-white shadow-[0_0_12px_rgba(249,115,22,0.8)] transition-all duration-500"
            style={{ left: `${positionPct}%` }}
          />
        </div>
        <div className="mt-2.5 flex justify-between text-[10px] font-medium text-zinc-500">
          <span>15.0</span>
          <span>18.5 (Normal)</span>
          <span>25.0 (Overweight)</span>
          <span>35.0</span>
        </div>
      </div>

      <p className="mt-5 text-xs text-zinc-400 leading-relaxed bg-zinc-950/40 p-3 rounded-lg border border-white/[0.03]">
        {message}
      </p>
    </GlassCard>
  );
}
