import React from 'react';
import { User, Shield, Briefcase, ChevronRight, UserCheck } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { FitnessProfile } from '../types/profile';
import { formatHeight, formatWeight } from '../utils/formatter';

export function ProfilePreviewCard({ profile, onEdit }: { profile: FitnessProfile; onEdit?: () => void }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 border border-white/[0.04] text-orange-500">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">{profile.fullName || 'Guest Profile'}</h4>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-zinc-500 mt-0.5">
              <UserCheck className="h-3 w-3 text-orange-400" />
              <span>{profile.gender} • {profile.age} Years Old</span>
            </div>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center justify-center h-8 w-8 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-white/[0.04] active:scale-95 transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.03] pt-4 text-center">
        <div className="bg-zinc-950/20 p-2.5 rounded-xl border border-white/[0.01]">
          <span className="text-[9px] uppercase font-bold text-zinc-500">Bodyweight</span>
          <p className="mt-1 text-sm font-bold text-zinc-200">
            {formatWeight(profile.measurements.weight, profile.measurements.weightUnit)}
          </p>
        </div>

        <div className="bg-zinc-950/20 p-2.5 rounded-xl border border-white/[0.01]">
          <span className="text-[9px] uppercase font-bold text-zinc-500">Stature</span>
          <p className="mt-1 text-sm font-bold text-zinc-200">
            {formatHeight(profile.measurements.height, profile.measurements.heightUnit)}
          </p>
        </div>

        <div className="bg-zinc-950/20 p-2.5 rounded-xl border border-white/[0.01]">
          <span className="text-[9px] uppercase font-bold text-zinc-500">Access</span>
          <p className="mt-1 text-sm font-bold text-orange-400">
            {profile.hasGymAccess ? 'GYM' : 'HOME'}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
