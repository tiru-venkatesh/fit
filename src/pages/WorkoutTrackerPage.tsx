import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dumbbell, Calendar, Clock, Flame, Plus, Trash2, CheckCircle, ListPlus, FlameKindling, Award
} from 'lucide-react';
import { useWorkoutStore } from '../store/workoutStore';
import { useAnalyticsStore } from '../store/analyticsStore';
import { useToast } from '../components/ToastProvider';
import { GlassCard } from '../components/GlassCard';
import { WorkoutCard } from '../components/WorkoutCard';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileSidebar } from '../components/MobileSidebar';

export default function WorkoutTrackerPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sessions, addSession, deleteSession } = useWorkoutStore();
  const { logWorkoutAction } = useAnalyticsStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);

  // Form parameters
  const [duration, setDuration] = useState(45);
  const [caloriesBurned, setCaloriesBurned] = useState(380);
  const [notes, setNotes] = useState('');

  // Exercises states inside currently composing form
  const [currentExName, setCurrentExName] = useState('Barbell Bench Press');
  const [currentExCategory, setCurrentExCategory] = useState<'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core' | 'Cardio'>('Chest');
  const [exerciseList, setExerciseList] = useState<{ exerciseName: string; category: string; sets: { setNumber: number; weight: number; reps: number }[] }[]>([]);

  // Current composing sets inside forming exercise block
  const [setWeight, setSetWeight] = useState(60);
  const [setReps, setSetReps] = useState(10);
  const [tempSets, setTempSets] = useState<{ setNumber: number; weight: number; reps: number }[]>([]);

  const handleAddTempSet = () => {
    setTempSets((prev) => [
      ...prev,
      { setNumber: prev.length + 1, weight: setWeight, reps: setReps }
    ]);
    toast(`Set ${tempSets.length + 1} added!`, 'success');
  };

  const handleAddExerciseToSession = () => {
    if (tempSets.length === 0) {
      toast('Please log at least 1 set before staging this exercise.', 'error');
      return;
    }
    setExerciseList((prev) => [
      ...prev,
      { exerciseName: currentExName, category: currentExCategory, sets: [...tempSets] }
    ]);
    // Clear exercise composing temporary values
    setTempSets([]);
    toast(`Added ${currentExName} to session lineup!`, 'success');
  };

  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (exerciseList.length === 0) {
      toast('Session must possess at least 1 completed exercise lineup.', 'error');
      return;
    }

    const compiledSession = {
      userId: 'usr-forge-77',
      date: new Date().toISOString(),
      durationMinutes: Number(duration),
      caloriesBurned: Number(caloriesBurned),
      exercises: exerciseList.map((ex, exIdx) => ({
        id: `ex-${exIdx}-${Date.now()}`,
        exerciseName: ex.exerciseName,
        category: ex.category as any,
        sets: ex.sets.map((set, setIdx) => ({
          id: `set-${exIdx}-${setIdx}-${Date.now()}`,
          setNumber: set.setNumber,
          weight: set.weight,
          reps: set.reps,
          completed: true,
        })),
      })),
      notes,
    };

    addSession(compiledSession);
    
    // Log calories burned to analytics trackers
    logWorkoutAction(Number(caloriesBurned), Number(duration));

    toast('Workout locked & synchronized with streak ledger!', 'success');
    
    // Reset form states
    setExerciseList([]);
    setNotes('');
    setShowLogForm(false);
  };

  const removeStagedExercise = (idx: number) => {
    setExerciseList((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 md:pl-72 animate-fade-in duration-300">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-6">
              <div>
                <span className="text-[10px] uppercase font-black text-orange-500 tracking-widest">TRAINING LEDGER</span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 uppercase">Workout Tracker Diary</h1>
                <p className="text-xs text-zinc-500 mt-1 font-medium">Record every active exercise loading volume to guarantee athletic progressions.</p>
              </div>

              {!showLogForm && (
                <button
                  onClick={() => setShowLogForm(true)}
                  className="rounded-xl bg-orange-500 hover:bg-orange-600 px-5 py-3 text-xs font-black uppercase tracking-wider text-white shadow-[0_4px_16px_rgba(249,115,22,0.3)] flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Log New Workout Session</span>
                </button>
              )}
            </div>

            {/* Composing Workout Session Form Drawer block */}
            {showLogForm && (
              <GlassCard className="p-6 border border-orange-500/20 bg-gradient-to-tr from-zinc-950 to-zinc-950/40">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <ListPlus className="h-5 w-5 text-orange-500 animate-pulse" />
                    <h3 className="text-base font-extrabold uppercase text-white tracking-tight">Compose Active Training Session</h3>
                  </div>
                  <button
                    onClick={() => setShowLogForm(false)}
                    className="text-xs font-bold uppercase text-zinc-500 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                <form className="space-y-6" onSubmit={handleSubmitSession}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">Duration (Minutes)</label>
                      <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3 px-4 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-400">Calories Burned (kcal)</label>
                      <input
                        type="number"
                        value={caloriesBurned}
                        onChange={(e) => setCaloriesBurned(Number(e.target.value))}
                        className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3 px-4 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  {/* Exercise Building Console */}
                  <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/[0.04] space-y-4">
                    <span className="block text-[11px] uppercase font-black text-orange-400 tracking-wider">Exercise Composer Console</span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-zinc-500">Exercise Name</label>
                        <input
                          type="text"
                          value={currentExName}
                          onChange={(e) => setCurrentExName(e.target.value)}
                          className="block w-full rounded-xl bg-zinc-900 border border-white/[0.02] py-2.5 px-3 text-xs font-semibold text-white focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-zinc-500">Muscle Categorization</label>
                        <select
                          value={currentExCategory}
                          onChange={(e) => setCurrentExCategory(e.target.value as any)}
                          className="block w-full rounded-xl bg-zinc-900 border border-white/[0.02] py-2.5 px-3 text-xs font-semibold text-white focus:outline-none"
                        >
                          {['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'].map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Set logging items */}
                    <div className="flex gap-4 items-end bg-zinc-950/40 p-3.5 rounded-xl border border-white/[0.02]">
                      <div className="space-y-1 flex-1">
                        <label className="text-[10px] uppercase font-bold text-zinc-500">Load Weight (kg)</label>
                        <input
                          type="number"
                          value={setWeight}
                          onChange={(e) => setSetWeight(Number(e.target.value))}
                          className="block w-full rounded-xl bg-zinc-900 border border-white/[0.02] py-2 px-3 text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <label className="text-[10px] uppercase font-bold text-zinc-500 font-sans">Reps target</label>
                        <input
                          type="number"
                          value={setReps}
                          onChange={(e) => setSetReps(Number(e.target.value))}
                          className="block w-full rounded-xl bg-zinc-900 border border-white/[0.02] py-2 px-3 text-xs font-semibold"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleAddTempSet}
                        className="py-2.5 px-4 rounded-xl bg-zinc-900 text-xs font-black uppercase text-white hover:bg-zinc-805 transition-colors border border-white/[0.04]"
                      >
                        + Set Volume
                      </button>
                    </div>

                    {/* Staged sets lists */}
                    {tempSets.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-zinc-400 font-semibold">
                        {tempSets.map((set) => (
                          <span key={set.setNumber} className="bg-zinc-950 border border-white/[0.02] px-3 py-1.5 rounded-lg">
                            Set {set.setNumber}: {set.weight}kg × {set.reps} reps
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleAddExerciseToSession}
                      className="w-full py-3.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/15 text-orange-400 text-xs font-black uppercase tracking-wider transition-colors border border-orange-500/10"
                    >
                      Stage This Exercise Lineup
                    </button>
                  </div>

                  {/* Staged Exercises queue overview */}
                  {exerciseList.length > 0 && (
                    <div className="space-y-2 border-t border-white/[0.04] pt-5">
                      <span className="block text-[10px] uppercase font-bold text-zinc-500">Staged Session Lineup ({exerciseList.length})</span>
                      <div className="space-y-2">
                        {exerciseList.map((ex, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-zinc-900/40 p-3 rounded-xl border border-white/[0.02]">
                            <div className="text-xs">
                              <span className="font-extrabold text-zinc-200">{ex.exerciseName}</span> <span className="text-[10px] text-zinc-500 uppercase tracking-widest bg-zinc-950 px-1.5 py-0.5 rounded ml-2">{ex.category}</span>
                              <p className="text-[10px] text-zinc-500 mt-1">{ex.sets.length} sets queued</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeStagedExercise(idx)}
                              className="text-zinc-500 hover:text-rose-500 p-2 rounded"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-400">Session Notes / Insights</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Felt strong, energy surplus, slight knee stability drop on squat target set..."
                      rows={2}
                      className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 px-4 text-xs font-medium text-white focus:outline-none placeholder-zinc-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 py-4 text-xs font-black uppercase tracking-wider text-white shadow-xl"
                  >
                    Commit Entire Session to Streak Ledger
                  </button>
                </form>
              </GlassCard>
            )}

            {/* Historical Workout session logs */}
            <div className="space-y-4">
              <span className="block text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-white/[0.04] pb-2">Active Session History ({sessions.length})</span>
              
              {sessions.length === 0 ? (
                <GlassCard className="p-12 text-center text-zinc-500">
                  <FlameKindling className="mx-auto h-8 w-8 text-zinc-650 mb-3" />
                  <p className="text-xs font-semibold uppercase tracking-wider">No completed workouts tracked yet.</p>
                  <p className="text-[10px] text-zinc-600 mt-1 max-w-sm mx-auto">Use the log wizard above to record heavy sets and update active workout streaks immediately.</p>
                </GlassCard>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                  {sessions.map((sess) => (
                    <WorkoutCard
                      key={sess.id}
                      session={sess}
                      onDelete={(id) => {
                        deleteSession(id);
                        toast('Workout session eliminated.', 'info');
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
