import React from 'react';
import { GlassCard } from './GlassCard';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  id?: string;
}

export function ChartCard({ title, subtitle, children, id }: ChartCardProps) {
  return (
    <GlassCard id={id} className="p-5 flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h4>
        {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
      </div>
      <div className="mt-5 h-64 w-full flex items-center justify-center">
        {children}
      </div>
    </GlassCard>
  );
}
