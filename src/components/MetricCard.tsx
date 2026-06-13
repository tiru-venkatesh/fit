import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: string | number;
    isPositive: boolean;
  };
  subtext?: string;
  onClick?: () => void;
}

export function MetricCard({
  id,
  title,
  value,
  unit,
  icon: Icon,
  trend,
  subtext,
  onClick,
}: MetricCardProps) {
  return (
    <GlassCard
      id={id}
      hoverEffect={!!onClick}
      onClick={onClick}
      className={`relative p-5 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900/80 text-orange-500 border border-white/[0.04]">
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>
      
      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-2xl font-bold tracking-tight text-white">{value}</span>
        {unit && <span className="text-sm font-medium text-zinc-500">{unit}</span>}
      </div>

      {(trend || subtext) && (
        <div className="mt-3 flex items-center justify-between text-xs border-t border-white/[0.03] pt-3">
          {trend ? (
            <span className={`inline-flex items-center gap-0.5 font-medium ${trend.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trend.isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {trend.value}
            </span>
          ) : (
            <span className="text-zinc-500">{subtext}</span>
          )}
          {trend && subtext && <span className="text-zinc-500">{subtext}</span>}
        </div>
      )}
    </GlassCard>
  );
}
