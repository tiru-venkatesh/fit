import React from 'react';
import { motion } from 'motion/react';

interface ProgressRingProps {
  percentage: number; // 0 to 120 (supports overflow!)
  size?: number;
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
}

export function ProgressRing({ percentage, size = 120, strokeWidth = 10, label, subLabel }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Cap percentage representation for drawing but keep original for text
  const safePercentage = Math.max(0, Math.min(percentage, 100));
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-zinc-900 fill-transparent"
          strokeWidth={strokeWidth}
        />
        {/* Animated Accent Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-orange-500 fill-transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      {/* Center Label representation */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label ? (
          <span className="text-xl font-bold tracking-tight text-white">{label}</span>
        ) : (
          <span className="text-xl font-bold tracking-tight text-white">{Math.round(percentage)}%</span>
        )}
        {subLabel && <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{subLabel}</span>}
      </div>
    </div>
  );
}
