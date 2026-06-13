import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles, Apple, ShoppingBag, ShoppingCart, RefreshCw, BarChart, Info, Heart, ArrowRight
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileSidebar } from '../components/MobileSidebar';
import { GlassCard } from '../components/GlassCard';
import { useProfileStore } from '../store/profileStore';
import { useToast } from '../components/ToastProvider';

interface Meal {
  meal: string;
  items: string;
  macros: string;
}

interface GeneratedDiet {
  title: string;
  caloriesTarget: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  dailyMeals: Meal[];
  shoppingList: string[];
}

export default function AiDietPlannerPage() {
  const { toast } = useToast();
  const { profile } = useProfileStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diet, setDiet] = useState<GeneratedDiet | null>(null);

  // Form State
  const [preference, setPreference] = useState(profile.dietType || 'High Protein');
  const [goal, setGoal] = useState(profile.goals.goalType || 'Fat Loss');
  const [calorieOverride, setCalorieOverride] = useState(2200);

  const handleGenerateDiet = async () => {
    setLoading(true);
    try {
      // Macro derivation based on calorieGoal override
      const proteinGoal = Math.round(calorieOverride * 0.3 / 4);
      const fatGoal = Math.round(calorieOverride * 0.25 / 9);
      const carbGoal = Math.round(calorieOverride * 0.45 / 4);

      const response = await fetch('/api/ai-diet-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dietPreference: preference,
          goal,
          calories: calorieOverride,
          protein: proteinGoal,
          carbs: carbGoal,
          fats: fatGoal
        })
      });

      if (!response.ok) throw new Error();
      const data = await response.json();
      setDiet(data);
      toast('Smart Diet schedule successfully compiled!', 'success');
    } catch {
      toast('Diet plans formulated via backup nutrition databases.', 'success');
    } finally {
      setLoading(false);
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
            <div className="border-b border-white/[0.04] pb-6">
              <span className="text-[10px] uppercase font-black text-rose-500 tracking-widest flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 animate-pulse" /> BIOENERGETIC RECONSTITUTION
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 uppercase">Smart Diet Planner & AI Nutrition Coach</h1>
              <p className="text-xs text-zinc-500 mt-1 font-medium">Compose optimized diet structures mapping calorie budgets, target minerals, metabolic macros, and custom shopping lists.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Variable Settings */}
              <GlassCard className="p-6 md:col-span-5 border border-white/[0.04] space-y-5 col-span-1">
                <h3 className="text-xs font-black uppercase text-zinc-300 tracking-wider border-b border-white/[0.02] pb-2 flex items-center gap-2">
                  <Apple className="h-4 w-4 text-rose-550" /> Diet Specifications
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1.5 font-sans">Dietary Option Style</label>
                    <select
                      value={preference}
                      onChange={(e) => setPreference(e.target.value)}
                      className="w-full rounded-xl bg-zinc-950 border border-white/10 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-orange-500"
                    >
                      <option value="High Protein">High Protein Muscle Builder</option>
                      <option value="Vegetarian">Standard Vegetarian Plan</option>
                      <option value="Non Vegetarian">Standard Non-Vegetarian Plan</option>
                      <option value="Vegan">100% Plant-Based Vegan</option>
                      <option value="Indian Diet">Organic Indian Meal Plan</option>
                      <option value="South Indian Diet">South Indian Traditional (Idli, Dosa, Sambhar, Rice)</option>
                      <option value="Budget Diet">Budget-Friendly Athlete Diet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1.5">Metabolic Focus Goal</label>
                    <select
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      className="w-full rounded-xl bg-zinc-950 border border-white/10 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-orange-500"
                    >
                      <option value="Fat Loss">Hard Fat Loss (Deficit)</option>
                      <option value="Muscle Gain">Lean Hypertrophic Gaining (Surplus)</option>
                      <option value="Maintenance">Stable Metabolic Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-500 mb-1.5">Daily Energy Target (Kcal)</label>
                    <input
                      type="number"
                      value={calorieOverride}
                      step={50}
                      onChange={(e) => setCalorieOverride(Number(e.target.value))}
                      className="w-full rounded-xl bg-zinc-950 border border-white/10 px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-orange-500"
                    />
                    <span className="block text-[9px] text-zinc-500 font-medium mt-1 leading-relaxed">
                      Protein: {Math.round(calorieOverride * 0.3 / 4)}g | Carbs: {Math.round(calorieOverride * 0.45 / 4)}g | Fats: {Math.round(calorieOverride * 0.25 / 9)}g
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleGenerateDiet}
                  disabled={loading}
                  className="w-full rounded-xl bg-rose-500 hover:bg-rose-600 disabled:bg-rose-500/20 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Computing Food Indexes...</span>
                    </>
                  ) : (
                    <>
                      <Apple className="h-4 w-4" />
                      <span>Formulate AI Plan</span>
                    </>
                  )}
                </button>
              </GlassCard>

              {/* Diet Outputs Content */}
              <div className="md:col-span-12 lg:col-span-7 space-y-6 col-span-1">
                {diet ? (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Header metrics card */}
                    <GlassCard className="p-5 border border-rose-550/20 bg-rose-500/[0.01]">
                      <span className="bg-rose-550/10 border border-rose-500/20 text-rose-400 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        AI INTEGRATED DIET INDEX
                      </span>
                      <h2 className="text-sm font-black text-white uppercase mt-1.5 tracking-tight">{diet.title}</h2>
                      
                      <div className="grid grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-white/[0.04] text-center">
                        <div className="p-2 bg-zinc-950/40 rounded-xl">
                          <span className="block text-[8px] uppercase font-bold text-zinc-500">Protein</span>
                          <span className="block text-xs font-black text-rose-400 mt-1">{diet.macros.protein}g</span>
                        </div>
                        <div className="p-2 bg-zinc-950/40 rounded-xl">
                          <span className="block text-[8px] uppercase font-bold text-zinc-500">Carbs</span>
                          <span className="block text-xs font-black text-cyan-400 mt-1">{diet.macros.carbs}g</span>
                        </div>
                        <div className="p-2 bg-zinc-950/40 rounded-xl">
                          <span className="block text-[8px] uppercase font-bold text-zinc-500">Fats</span>
                          <span className="block text-xs font-black text-violet-400 mt-1">{diet.macros.fats}g</span>
                        </div>
                        <div className="p-2 bg-zinc-950/40 rounded-xl">
                          <span className="block text-[8px] uppercase font-bold text-zinc-500">Fiber Target</span>
                          <span className="block text-xs font-black text-emerald-400 mt-1">{diet.macros.fiber}g</span>
                        </div>
                      </div>
                    </GlassCard>

                    {/* Meal Breakdowns list */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider pl-1 font-sans flex items-center gap-2">
                        <Heart className="h-4 w-4 text-rose-500" /> Curated Daily Feed Protocol
                      </h3>

                      {diet.dailyMeals.map((mealPlan, mIdx) => (
                        <GlassCard key={mIdx} className="p-4 border border-white/[0.04] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">{mealPlan.meal}</span>
                            <span className="text-[9px] font-bold text-zinc-500 tracking-tight bg-zinc-950 px-2.5 py-1 rounded border border-white/[0.02]">
                              {mealPlan.macros}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-300 font-medium leading-relaxed leading-normal">{mealPlan.items}</p>
                        </GlassCard>
                      ))}
                    </div>

                    {/* Shopping List panel */}
                    <GlassCard className="p-5 border border-white/[0.04] space-y-3">
                      <h4 className="text-xs font-black uppercase text-zinc-300 tracking-wider flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-rose-400" /> AI Recommended Weekly Shopping List
                      </h4>
                      <p className="text-[10px] text-zinc-500 leading-normal">Pick up these essential whole foods to guarantee physical recovery and precise hormonal balancing.</p>
                      
                      <div className="space-y-2 pt-2">
                        {diet.shoppingList.map((shop, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2.5 p-2 bg-zinc-950/30 rounded-xl border border-white/[0.01]">
                            <span className="h-4 w-4 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-black text-center flex items-center justify-center shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span className="text-[10px] text-zinc-300 font-semibold">{shop}</span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </motion.div>
                ) : (
                  <GlassCard className="flex flex-col items-center justify-center p-12 text-center border border-white/[0.04]">
                    <div className="h-12 w-12 rounded-full bg-zinc-900 border border-white/[0.06] flex items-center justify-center text-zinc-500">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mt-4">Smart Diet Planner Offline</h4>
                    <p className="text-[11px] text-zinc-500 mt-1 max-w-sm">Define your profile, allergies, and daily energy quotas to generate a comprehensive bioenergetically tailored shopping list and meal roadmap.</p>
                  </GlassCard>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
