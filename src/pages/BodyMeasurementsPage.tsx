import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, Scale, Camera, Plus, Check, RefreshCw, Eye, Image, Trash2, ArrowRightLeft, LayoutGrid
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileSidebar } from '../components/MobileSidebar';
import { GlassCard } from '../components/GlassCard';
import { useProfileStore } from '../store/profileStore';
import { useToast } from '../components/ToastProvider';

interface MeasurementLog {
  date: string;
  weight: number;
  waist: number;
  chest: number;
  arms: number;
  thighs: number;
  neck: number;
  hips: number;
}

export default function BodyMeasurementsPage() {
  const { toast } = useToast();
  const { profile } = useProfileStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'metrics' | 'photos'>('metrics');

  // Interactive local states for measurements logs
  const [logs, setLogs] = useState<MeasurementLog[]>([
    { date: '2026-05-01', weight: 78.5, waist: 88, chest: 104, arms: 37, thighs: 58, neck: 39, hips: 96 },
    { date: '2026-05-15', weight: 77.2, waist: 86, chest: 103, arms: 37.5, thighs: 57.5, neck: 39, hips: 95 },
    { date: '2026-06-01', weight: 76.0, waist: 84, chest: 102, arms: 38, thighs: 57, neck: 38.5, hips: 94 },
    { date: '2026-06-13', weight: profile.measurements.weight || 75, waist: 82, chest: 102, arms: 38.5, thighs: 56.5, neck: 38.5, hips: 93 },
  ]);

  // Form states
  const [weight, setWeight] = useState(profile.measurements.weight || 75);
  const [waist, setWaist] = useState(82);
  const [chest, setChest] = useState(102);
  const [arms, setArms] = useState(38);
  const [thighs, setThighs] = useState(56);
  const [neck, setNeck] = useState(38);
  const [hips, setHips] = useState(93);

  // Photos State
  const [beforePhoto, setBeforePhoto] = useState<string>('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=60');
  const [afterPhoto, setAfterPhoto] = useState<string>('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=60');
  const [comparisonSlider, setComparisonSlider] = useState<number>(50);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: MeasurementLog = {
      date: new Date().toISOString().split('T')[0],
      weight: Number(weight),
      waist: Number(waist),
      chest: Number(chest),
      arms: Number(arms),
      thighs: Number(thighs),
      neck: Number(neck),
      hips: Number(hips),
    };
    setLogs((prev) => [newLog, ...prev]);
    toast('Physical measurements logged and calculated!', 'success');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'before') setBeforePhoto(url);
      else setAfterPhoto(url);
      toast(`${type === 'after' ? 'After' : 'Before'} snapshot loaded successfully!`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 md:pl-72 animate-fade-in duration-300">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-6">
              <div>
                <span className="text-[10px] uppercase font-black text-orange-500 tracking-widest flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" /> BIOMETRIST COMPARISONS
                </span>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 uppercase">Body Measurements & Photos</h1>
                <p className="text-xs text-zinc-500 mt-1 font-medium">Log structural body ratios and upload before/after photos to trace muscular expansion.</p>
              </div>

              {/* Sub Navigation Tabs */}
              <div className="flex p-0.5 rounded-xl bg-zinc-950 border border-white/[0.04] shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('metrics')}
                  className={`px-4 py-2 text-[10px] uppercase font-black tracking-wider rounded-lg transition-all ${
                    activeTab === 'metrics' ? 'bg-orange-500 text-white' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Ratios Ledgers
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('photos')}
                  className={`px-4 py-2 text-[10px] uppercase font-black tracking-wider rounded-lg transition-all ${
                    activeTab === 'photos' ? 'bg-orange-500 text-white' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  Progress Photos
                </button>
              </div>
            </div>

            {activeTab === 'metrics' ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Manual Intake Form */}
                <GlassCard className="p-5 border border-white/[0.04] md:col-span-4 col-span-1 space-y-4">
                  <h3 className="text-xs font-black uppercase text-white tracking-wider border-b border-white/[0.03] pb-2 flex items-center gap-2">
                    <Scale className="h-4 w-4 text-orange-500" /> Log Dimensions
                  </h3>

                  <form onSubmit={handleAddLog} className="space-y-3.5">
                    <div>
                      <label className="block text-[8px] font-black uppercase text-zinc-500">Weight (kg)</label>
                      <input
                        type="number"
                        value={weight}
                        step={0.1}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full rounded-xl bg-zinc-950 border border-white/10 px-2.5 py-2 text-xs font-bold text-white mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[8px] font-black uppercase text-zinc-500">Waist (cm)</label>
                        <input
                          type="number"
                          value={waist}
                          onChange={(e) => setWaist(Number(e.target.value))}
                          className="w-full rounded-xl bg-zinc-950 border border-white/10 px-2.5 py-2 text-xs font-bold text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase text-zinc-500">Chest (cm)</label>
                        <input
                          type="number"
                          value={chest}
                          onChange={(e) => setChest(Number(e.target.value))}
                          className="w-full rounded-xl bg-zinc-950 border border-white/10 px-2.5 py-2 text-xs font-bold text-white mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[8px] font-black uppercase text-zinc-500">Arms (cm)</label>
                        <input
                          type="number"
                          value={arms}
                          onChange={(e) => setArms(Number(e.target.value))}
                          className="w-full rounded-xl bg-zinc-950 border border-white/10 px-2.5 py-2 text-xs font-bold text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase text-zinc-500">Thighs (cm)</label>
                        <input
                          type="number"
                          value={thighs}
                          onChange={(e) => setThighs(Number(e.target.value))}
                          className="w-full rounded-xl bg-zinc-950 border border-white/10 px-2.5 py-2 text-xs font-bold text-white mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[8px] font-black uppercase text-zinc-500">Neck (cm)</label>
                        <input
                          type="number"
                          value={neck}
                          onChange={(e) => setNeck(Number(e.target.value))}
                          className="w-full rounded-xl bg-zinc-950 border border-white/10 px-2.5 py-2 text-xs font-bold text-white mt-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] font-black uppercase text-zinc-500">Hips (cm)</label>
                        <input
                          type="number"
                          value={hips}
                          onChange={(e) => setHips(Number(e.target.value))}
                          className="w-full rounded-xl bg-zinc-950 border border-white/10 px-2.5 py-2 text-xs font-bold text-white mt-1"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 font-black p-3 text-xs uppercase tracking-wider text-white mt-2 cursor-pointer"
                    >
                      Lock Dimensions
                    </button>
                  </form>
                </GlassCard>

                {/* Historical Comparison Ledger Dashboard */}
                <div className="md:col-span-8 space-y-4">
                  <h3 className="text-xs font-black uppercase text-orange-400 pl-1 tracking-wider">Historical Comparison Dashboard</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {logs.map((logItem, logIdx) => (
                      <GlassCard key={logIdx} className="p-4 border border-white/[0.04] hover:bg-zinc-900/40 transition-colors">
                        <div className="flex items-center justify-between border-b border-white/[0.02] pb-2 mb-3">
                          <span className="text-[10px] font-black text-white">{new Date(logItem.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                          <span className="bg-zinc-950 border border-white/[0.04] text-[8px] font-bold uppercase text-zinc-400 px-2 py-0.5 rounded-full">
                            Weight: {logItem.weight} kg
                          </span>
                        </div>

                        <div className="grid grid-cols-6 gap-2 text-center">
                          <div className="p-1.5 bg-zinc-950/40 rounded-lg">
                            <span className="block text-[7px] text-zinc-500 uppercase font-bold">Waist</span>
                            <span className="block text-[11px] font-black text-white mt-0.5">{logItem.waist}cm</span>
                          </div>
                          <div className="p-1.5 bg-zinc-950/40 rounded-lg">
                            <span className="block text-[7px] text-zinc-500 uppercase font-bold">Chest</span>
                            <span className="block text-[11px] font-black text-white mt-0.5">{logItem.chest}cm</span>
                          </div>
                          <div className="p-1.5 bg-zinc-950/40 rounded-lg">
                            <span className="block text-[7px] text-zinc-500 uppercase font-bold">Arms</span>
                            <span className="block text-[11px] font-black text-white mt-0.5">{logItem.arms}cm</span>
                          </div>
                          <div className="p-1.5 bg-zinc-950/40 rounded-lg">
                            <span className="block text-[7px] text-zinc-500 uppercase font-bold">Thighs</span>
                            <span className="block text-[11px] font-black text-white mt-0.5">{logItem.thighs}cm</span>
                          </div>
                          <div className="p-1.5 bg-zinc-950/40 rounded-lg">
                            <span className="block text-[7px] text-zinc-500 uppercase font-bold">Neck</span>
                            <span className="block text-[11px] font-black text-white mt-0.5">{logItem.neck}cm</span>
                          </div>
                          <div className="p-1.5 bg-zinc-950/40 rounded-lg">
                            <span className="block text-[7px] text-zinc-500 uppercase font-bold">Hips</span>
                            <span className="block text-[11px] font-black text-white mt-0.5">{logItem.hips}cm</span>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Upload Section Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                  <GlassCard className="p-5 border border-white/[0.04] text-center space-y-4">
                    <h4 className="text-xs font-black uppercase text-zinc-400">Set BEFORE Photo</h4>
                    
                    <div className="h-44 w-full bg-zinc-950 rounded-2xl overflow-hidden border border-white/[0.04] relative group">
                      <img src={beforePhoto} alt="before" className="h-full w-full object-cover grayscale opacity-80" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                          Select Photo
                          <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'before')} className="hidden" />
                        </label>
                      </div>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[8px] font-bold text-white uppercase tracking-widest">BEFORE REGIME</span>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-5 border border-white/[0.04] text-center space-y-4">
                    <h4 className="text-xs font-black uppercase text-zinc-400">Set AFTER Photo</h4>
                    
                    <div className="h-44 w-full bg-zinc-950 rounded-2xl overflow-hidden border border-white/[0.04] relative group">
                      <img src={afterPhoto} alt="after" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                          Select Photo
                          <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, 'after')} className="hidden" />
                        </label>
                      </div>
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-orange-500 text-[8px] font-black text-white uppercase tracking-widest">ACTIVE ATHLETE</span>
                    </div>
                  </GlassCard>
                </div>

                {/* Overlaid Slided Comparison Preview */}
                <GlassCard className="p-6 border border-orange-500/10 space-y-4 max-w-2xl mx-auto">
                  <h4 className="text-xs font-black uppercase text-white tracking-wider text-center flex items-center justify-center gap-2">
                    <ArrowRightLeft className="h-4 w-4 text-orange-500" /> Interactive Before/After Sliding Comparison
                  </h4>
                  <p className="text-[10px] text-zinc-500 text-center select-none">Slide the controller down below to swipe back and forth between active progress landmarks.</p>

                  <div className="h-80 w-full relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-950">
                    {/* Before Image on bottom background */}
                    <img src={beforePhoto} alt="Before overlay" className="absolute inset-0 h-full w-full object-cover grayscale" referrerPolicy="no-referrer" />
                    
                    {/* After Image split on top with width bounded by comparison percentage slider */}
                    <div 
                      className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-orange-500 shadow-xl"
                      style={{ width: `${comparisonSlider}%` }}
                    >
                      <img 
                        src={afterPhoto} 
                        alt="After overlay" 
                        className="absolute top-0 left-0 h-80 w-[42rem] max-w-none object-cover" 
                        style={{ width: '42rem' }}
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="absolute h-full w-0.5 bg-orange-500 shadow-lg pointer-events-none" style={{ left: `${comparisonSlider}%` }} />
                  </div>

                  {/* Range input slider */}
                  <div className="pt-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={comparisonSlider}
                      onChange={(e) => setComparisonSlider(Number(e.target.value))}
                      className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase mt-2">
                      <span>Before Baseline (100% left)</span>
                      <span>Swipe Slider</span>
                      <span>Current Shape (100% right)</span>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}
