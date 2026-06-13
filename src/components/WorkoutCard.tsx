import React from 'react';
import { Calendar, Clock, Flame, Dumbbell, Trash2 } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { CompleteWorkoutSession } from '../types/workout';

interface WorkoutCardProps {
  session: CompleteWorkoutSession;
  onDelete?: (id: string) => void;
  key?: any;
}

export function WorkoutCard({ session, onDelete }: WorkoutCardProps) {
  const dateObj = new Date(session.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <GlassCard className={`p-5 border ${session.isAssignedByOwner ? 'border-orange-500/30 bg-orange-500/[0.01]' : 'border-white/[0.04]'}`}>
      {session.isAssignedByOwner && (
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 rounded bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-[8px] font-black text-orange-500 uppercase tracking-widest">
            prescribed by trainer
          </span>
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs text-zinc-500 font-medium">{formattedDate}</span>
          <h4 className="text-base font-bold text-white tracking-tight mt-0.5">
            {session.exercises.length > 0 
              ? `${session.exercises[0].category} focused training session`
              : 'Weight training session'
            }
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          {session.caloriesBurned && (
            <div className="flex items-center gap-1 rounded bg-orange-500/10 px-2 py-0.5 text-[10px] font-bold text-orange-400 uppercase">
              <Flame className="h-3 w-3" />
              <span>{session.caloriesBurned} kcal</span>
            </div>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(session.id)}
              className="text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"
              title="Delete session"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-zinc-400 border-b border-white/[0.03] pb-3">
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-zinc-500" />
          <span>{session.durationMinutes} minutes duration</span>
        </div>
        <div className="flex items-center gap-1">
          <Dumbbell className="h-3.5 w-3.5 text-zinc-500" />
          <span>{session.exercises.length} Exercises completes</span>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        {session.exercises.map((ex, idx) => (
          <div key={idx} className="text-xs bg-zinc-950/30 rounded-lg p-2.5 border border-white/[0.02]">
            <div className="flex justify-between font-semibold text-zinc-300">
              <span>{ex.exerciseName}</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest bg-zinc-900 px-1.5 py-0.5 rounded">{ex.category}</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-2 text-[10px] text-zinc-500">
              {ex.sets.map((set, sIdx) => (
                <span key={sIdx} className="bg-zinc-900 border border-white/[0.03] px-2 py-1 rounded">
                  Set {set.setNumber}: {set.weight} kg × {set.reps} reps
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {session.notes && (
        <p className="mt-3 text-xs text-zinc-500 italic bg-zinc-900/10 p-2 rounded">
          Notes: "{session.notes}"
        </p>
      )}
    </GlassCard>
  );
}
