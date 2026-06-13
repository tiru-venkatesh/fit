import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Trash2, 
  Search, 
  Send, 
  TrendingUp, 
  Dumbbell, 
  Bell, 
  Sparkles,
  Layers,
  Award,
  Clock,
  ChevronRight,
  Filter,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useWorkoutStore, Announcement } from '../store/workoutStore';
import { useProfileStore } from '../store/profileStore';
import { useToast } from '../components/ToastProvider';
import { GlassCard } from '../components/GlassCard';
import { Navbar } from '../components/Navbar';
import { MobileSidebar } from '../components/MobileSidebar';
import { Sidebar } from '../components/Sidebar';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { FitnessProfile } from '../types/profile';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function OwnerDashboardPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, switchUserRole } = useAuthStore();
  const { 
    allClientsWorkouts, 
    announcements, 
    postAnnouncement, 
    deleteAnnouncement, 
    assignWorkoutToClient 
  } = useWorkoutStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clients, setClients] = useState<Array<FitnessProfile & { userId: string }>>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'Beginner' | 'Intermediate' | 'Advanced'>('all');

  // Announcement Form State
  const [bulletinTitle, setBulletinTitle] = useState('');
  const [bulletinContent, setBulletinContent] = useState('');
  const [bulletinUrgency, setBulletinUrgency] = useState<'normal' | 'important' | 'urgent'>('normal');

  // Prescription Form State
  const [selectedClientForPrescription, setSelectedClientForPrescription] = useState<string | null>(null);
  const [pDuration, setPDuration] = useState('45');
  const [pCalories, setPCalories] = useState('350');
  const [pExerciseName, setPExerciseName] = useState('Barbell Squat');
  const [pCategory, setPCategory] = useState<'Chest' | 'Back' | 'Shoulders' | 'Legs' | 'Arms' | 'Core' | 'Cardio'>('Legs');
  const [pSets, setPSets] = useState('3');
  const [pReps, setPReps] = useState('10');
  const [pWeight, setPWeight] = useState('60');
  const [pNotes, setPNotes] = useState('');

  // Fetch all gym client profiles from Firestore
  useEffect(() => {
    async function loadGymClients() {
      setLoadingClients(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'clientProfiles'));
        const list: Array<FitnessProfile & { userId: string }> = [];
        querySnapshot.forEach((doc) => {
          list.push({ userId: doc.id, ...doc.data() } as FitnessProfile & { userId: string });
        });
        setClients(list);
      } catch (err) {
        console.error("Error loading gym clients: ", err);
      } finally {
        setLoadingClients(false);
      }
    }
    loadGymClients();
  }, []);

  const handlePostBulletin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulletinTitle.trim() || !bulletinContent.trim()) {
      toast('Please enter title and content for announcement.', 'error');
      return;
    }
    try {
      await postAnnouncement({
        title: bulletinTitle,
        content: bulletinContent,
        urgency: bulletinUrgency,
      });
      toast('Bulletin broadcasted to all gym member dashboards!', 'success');
      setBulletinTitle('');
      setBulletinContent('');
      setBulletinUrgency('normal');
    } catch {
      toast('Failed to post announcement.', 'error');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await deleteAnnouncement(id);
      toast('Announcement deleted.', 'info');
    } catch {
      toast('Could not delete bulletin.', 'error');
    }
  };

  const handlePrescribeWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientForPrescription) {
      toast('Please select a member to prescribe a workout loop.', 'error');
      return;
    }

    try {
      const targetClient = clients.find(c => c.userId === selectedClientForPrescription);
      if (!targetClient) return;

      const exercisesList = [
        {
          id: 'ex-' + Date.now(),
          exerciseName: pExerciseName,
          category: pCategory,
          sets: Array.from({ length: Number(pSets) }).map((_, idx) => ({
            id: `set-${idx}-${Date.now()}`,
            setNumber: idx + 1,
            weight: Number(pWeight),
            reps: Number(pReps),
            completed: false, // will be completed by client!
          }))
        }
      ];

      await assignWorkoutToClient(selectedClientForPrescription, {
        userId: selectedClientForPrescription,
        creatorId: user?.id || 'owner_gym',
        date: new Date().toISOString(),
        durationMinutes: Number(pDuration),
        caloriesBurned: Number(pCalories),
        exercises: exercisesList,
        notes: `PRESCRIBED BY TRAINER: ${pNotes || 'Focus on depth and form.'}`,
        isAssignedByOwner: true,
      });

      toast(`Workout prescription sent successfully to ${targetClient.fullName}!`, 'success');
      setPNotes('');
      setSelectedClientForPrescription(null);
    } catch {
      toast('Error submitting workout assignment.', 'error');
    }
  };

  // Filter clients based on search query and fitness level selection
  const filteredClients = clients.filter(c => {
    const matchesSearch = c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.goals?.goalType || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || c.fitnessLevel === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  // Calculate high level KPI bento variables
  const totalGymClients = clients.length;
  const workoutsPrescribedThisMonth = allClientsWorkouts.filter(w => w.isAssignedByOwner).length;
  const activeWorkoutsLoggedByClients = allClientsWorkouts.filter(w => !w.isAssignedByOwner).length;
  
  // Aggregate recent graph stats of workout sessions per date
  const chartData = React.useMemo(() => {
    const datesMap: Record<string, number> = {};
    // Last 7 days slots
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      datesMap[str] = 0;
    }

    allClientsWorkouts.forEach(w => {
      const day = w.date.split('T')[0];
      if (day in datesMap) {
        datesMap[day] += 1;
      }
    });

    return Object.keys(datesMap).map(day => ({
      date: day.substring(5), // MM-DD
      "Logs": datesMap[day],
    }));
  }, [allClientsWorkouts]);

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-grow md:pl-64 py-8 px-4 sm:px-6 lg:px-8 space-y-8 z-10 max-w-7xl mx-auto w-full">
          
          {/* Header row with role toggle */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/[0.06] pb-6">
            <div>
              <span className="text-[10px] bg-orange-500/10 border border-orange-500/20 text-orange-500 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                System Administrator Console
              </span>
              <h1 className="text-3xl font-black mt-2 tracking-tight uppercase">
                GYM OWNER PORTAL
              </h1>
              <p className="text-xs text-zinc-400">
                Logged in as <span className="font-bold text-white">{user?.fullName}</span>. Manage member rosters, publish bulletins, and allocate routine prescriptions.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  switchUserRole('client');
                  toast('Switched to Client view!', 'info');
                  navigate('/dashboard');
                }}
                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs text-zinc-300 font-bold transition-all flex items-center gap-2"
              >
                <Layers className="h-4 w-4 text-orange-500" />
                See Client View
              </button>
            </div>
          </div>

          {/* Admin KPIs Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <GlassCard className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Active Gym Members</p>
                  <p className="text-3.5xl font-black text-white mt-2 font-mono">
                    {totalGymClients}
                  </p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-500">
                  <Users className="h-5 w-5" />
                </div>
              </div>
              <div className="text-[10px] mt-4 text-zinc-400 font-medium">
                Clients onboarded in remote database
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Workouts Logged</p>
                  <p className="text-3.5xl font-black text-white mt-2 font-mono">
                    {activeWorkoutsLoggedByClients}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-500">
                  <Dumbbell className="h-5 w-5" />
                </div>
              </div>
              <div className="text-[10px] mt-4 text-zinc-400 font-medium">
                Total completed loops registered by gym database
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Prescribed Workouts</p>
                  <p className="text-3.5xl font-black text-white mt-2 font-mono">
                    {workoutsPrescribedThisMonth}
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20 text-green-500">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <div className="text-[10px] mt-4 text-zinc-400 font-medium">
                Schedules sent directly to individual clients
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Average Active Days</p>
                  <p className="text-3.5xl font-black text-white mt-2 font-mono">
                    3.8 <span className="text-xs text-zinc-500">days/wk</span>
                  </p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </div>
              <div className="text-[10px] mt-4 text-zinc-400 font-medium">
                Gym attendance frequency indicator
              </div>
            </GlassCard>
          </div>

          {/* Activity Graph Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[9px] text-orange-500 font-bold uppercase tracking-widest">
                    Real-time traffic
                  </span>
                  <p className="font-extrabold text-sm uppercase text-white tracking-tight">
                    Workouts Logged Across Gym
                  </p>
                </div>
              </div>
              
              <div className="h-60 w-full font-mono text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 0, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gymColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#52525b" tickLine={false} />
                    <YAxis stroke="#52525b" tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontSize: '10px' }} />
                    <Area type="monotone" dataKey="Logs" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#gymColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <GlassCard className="p-6 flex flex-col justify-between">
              <div>
                <span className="text-[9px] text-orange-500 font-bold uppercase tracking-widest">
                  Quick Broadcast
                </span>
                <p className="font-extrabold text-sm uppercase text-white tracking-tight mb-4">
                  Bulletin Announcement
                </p>

                <form onSubmit={handlePostBulletin} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. New Squat Rack Installed!" 
                      value={bulletinTitle}
                      onChange={(e) => setBulletinTitle(e.target.value)}
                      className="w-full bg-zinc-950/60 rounded-lg border border-white/[0.04] p-2.5 text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Message Content</label>
                    <textarea 
                      placeholder="Enter important details for gym members..." 
                      rows={3}
                      value={bulletinContent}
                      onChange={(e) => setBulletinContent(e.target.value)}
                      className="w-full bg-zinc-950/60 rounded-lg border border-white/[0.04] p-2.5 text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Urgency</label>
                      <select 
                        value={bulletinUrgency}
                        onChange={(e) => setBulletinUrgency(e.target.value as any)}
                        className="w-full bg-zinc-950/60 rounded-lg border border-white/[0.04] p-2 text-xs focus:outline-none"
                      >
                        <option value="normal">Normal</option>
                        <option value="important">Important</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <button 
                      type="submit"
                      className="self-end bg-orange-500 text-white hover:bg-orange-600 transition-all text-[11px] font-bold p-2.5 rounded-lg flex items-center justify-center gap-1"
                    >
                      <Send className="h-3 w-3" />
                      Publish
                    </button>
                  </div>
                </form>
              </div>
            </GlassCard>
          </div>

          {/* Main management columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Registered Gym Members Roster */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/35 border border-white/[0.02] p-4 rounded-2xl">
                <div>
                  <h3 className="font-extrabold uppercase text-white tracking-tight flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-500" />
                    Member Database Directory
                  </h3>
                  <p className="text-[10px] text-zinc-400">Total size: {filteredClients.length} registered system users</p>
                </div>

                <div className="flex gap-2 items-center">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-650" />
                    <input 
                      type="text" 
                      placeholder="Search name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-zinc-950 border border-white/[0.04] text-xs py-2 pl-9 pr-4 rounded-xl focus:outline-none focus:border-orange-500 w-36 sm:w-48"
                    />
                  </div>

                  {/* Filter Select */}
                  <div className="bg-zinc-950 border border-white/[0.04] rounded-xl px-2 py-1.5 flex items-center">
                    <Filter className="h-3 w-3 text-zinc-600 mr-1.5" />
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value as any)}
                      className="bg-transparent text-[10px] text-zinc-300 focus:outline-none border-none pr-3"
                    >
                      <option value="all">levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              {loadingClients ? (
                <div className="space-y-3">
                  <div className="h-16 w-full animate-pulse rounded-2xl bg-white/5 border border-white/[0.02]" />
                  <div className="h-16 w-full animate-pulse rounded-2xl bg-white/5 border border-white/[0.02]" />
                  <div className="h-16 w-full animate-pulse rounded-2xl bg-white/5 border border-white/[0.02]" />
                </div>
              ) : filteredClients.length === 0 ? (
                <GlassCard className="p-12 text-center text-zinc-500">
                  <Users className="mx-auto h-8 w-8 text-zinc-700 mb-3" />
                  <p className="text-xs">No client-members currently match the set parameters.</p>
                </GlassCard>
              ) : (
                <div className="space-y-3">
                  {filteredClients.map((client) => {
                    return (
                      <GlassCard key={client.userId} className="p-4 border border-white/[0.04] bg-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-orange-500/20 transition-all">
                        <div className="flex gap-4 items-start">
                          <div className="h-10 w-10 rounded-full bg-zinc-950 border border-orange-500/30 flex items-center justify-center font-black text-orange-500 text-sm">
                            {client.fullName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-xs">{client.fullName}</span>
                              <span className="text-[9px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
                                {client.fitnessLevel || 'Client'}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-zinc-400 mt-1">
                              <span>Weight: <strong>{client.measurements?.weight}{client.measurements?.weightUnit}</strong></span>
                              <span>Target: <strong>{client.goals?.targetWeight}{client.goals?.targetWeightUnit}</strong></span>
                              <span>Goal: <strong className="text-orange-400">{client.goals?.goalType}</strong></span>
                              <span>Diet: <strong>{client.dietType}</strong></span>
                            </div>
                          </div>
                        </div>

                        {/* Assign Prescription action trigger */}
                        <div className="flex gap-2 self-stretch md:self-auto justify-end border-t border-white/[0.03] pt-3 md:pt-0 md:border-none">
                          <button
                            onClick={() => {
                              setSelectedClientForPrescription(client.userId);
                              toast(`Selected ${client.fullName} for prescription. Fill out the target sheet on the right panel.`, 'info');
                            }}
                            className="bg-orange-500/10 border border-orange-500/20 text-orange-500 hover:bg-orange-500/20 text-[10px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                          >
                            <Dumbbell className="h-3.5 w-3.5" />
                            Prescribe Loop
                          </button>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Prescription Form / Bulletin History */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Prescription Form details */}
              {selectedClientForPrescription ? (
                <GlassCard className="p-5 border border-orange-500/30 bg-orange-500/[0.02]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] text-orange-500 font-black uppercase tracking-widest flex items-center gap-1">
                      <Sparkles className="h-3.5 w-3.5" />
                      Active Assignee Form
                    </span>
                    <button 
                      onClick={() => setSelectedClientForPrescription(null)} 
                      className="text-[10px] uppercase text-zinc-500 font-bold hover:text-zinc-300"
                    >
                      cancel
                    </button>
                  </div>

                  <p className="text-xs text-zinc-300 mb-4 bg-zinc-950 p-2 rounded-lg border border-white/[0.04]">
                    Prescribing workout for:{' '}
                    <strong className="text-white">
                      {clients.find(c => c.userId === selectedClientForPrescription)?.fullName}
                    </strong>
                  </p>

                  <form onSubmit={handlePrescribeWorkout} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Duration (Min)</label>
                        <input 
                          type="number" 
                          value={pDuration}
                          onChange={(e) => setPDuration(e.target.value)}
                          className="w-full bg-zinc-950/60 rounded-md border border-white/[0.04] p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Est. Calories</label>
                        <input 
                          type="number" 
                          value={pCalories}
                          onChange={(e) => setPCalories(e.target.value)}
                          className="w-full bg-zinc-950/60 rounded-md border border-white/[0.04] p-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Exercise Name</label>
                      <input 
                        type="text" 
                        value={pExerciseName}
                        onChange={(e) => setPExerciseName(e.target.value)}
                        className="w-full bg-zinc-950/60 rounded-md border border-white/[0.04] p-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Sets</label>
                        <input 
                          type="number" 
                          value={pSets}
                          onChange={(e) => setPSets(e.target.value)}
                          className="w-full bg-zinc-950/60 rounded-md border border-white/[0.04] p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Reps</label>
                        <input 
                          type="number" 
                          value={pReps}
                          onChange={(e) => setPReps(e.target.value)}
                          className="w-full bg-zinc-950/60 rounded-md border border-white/[0.04] p-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Weight (kg)</label>
                        <input 
                          type="number" 
                          value={pWeight}
                          onChange={(e) => setPWeight(e.target.value)}
                          className="w-full bg-zinc-950/60 rounded-md border border-white/[0.04] p-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Target Instructions / Coach Notes</label>
                      <input 
                        type="text" 
                        placeholder="Focus on slow eccentric tempo..."
                        value={pNotes}
                        onChange={(e) => setPNotes(e.target.value)}
                        className="w-full bg-zinc-950/60 rounded-md border border-white/[0.04] p-2 text-xs text-white"
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-orange-500 text-white font-bold text-xs uppercase p-3 rounded-xl transition-all hover:bg-orange-600 shadow-[0_4px_12px_rgba(249,115,22,0.3)] mt-2"
                    >
                      Assign Workout
                    </button>
                  </form>
                </GlassCard>
              ) : null}

              {/* Broadcast Announcements Stream */}
              <GlassCard className="p-5 border border-white/[0.04] bg-white/5">
                <h4 className="font-extrabold uppercase text-xs text-white tracking-widest flex items-center gap-2 mb-4">
                  <Bell className="h-4 w-4 text-orange-500" />
                  Live Announcement Feed
                </h4>

                {announcements.length === 0 ? (
                  <p className="text-[10px] text-zinc-500 italic text-center py-6">No bulletins have been posted today.</p>
                ) : (
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {announcements.map((ann) => {
                      return (
                        <div key={ann.id} className="bg-zinc-950/40 p-3 rounded-lg border border-white/[0.02] text-xs">
                          <div className="flex justify-between items-start">
                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                              ann.urgency === 'urgent' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                              ann.urgency === 'important' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                              'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                            }`}>
                              {ann.urgency}
                            </span>
                            <button 
                              onClick={() => handleDeleteAnnouncement(ann.id)}
                              className="text-zinc-600 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <p className="font-extrabold text-white text-[11px] mt-1.5">{ann.title}</p>
                          <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{ann.content}</p>
                          <p className="text-[8px] text-zinc-500 mt-2 font-mono">{new Date(ann.date).toLocaleDateString()}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </GlassCard>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
