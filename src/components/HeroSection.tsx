import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Dumbbell, Sparkles, Shield, Trophy, Activity, Flame } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-24 px-4 sm:px-6 lg:px-8 bg-transparent">
      {/* Background visual graphics */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[500px] w-full max-w-7xl rounded-full bg-gradient-to-tr from-orange-500/10 to-transparent blur-3xl opacity-50 pointer-events-none" />

      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side Branding */}
        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/10 bg-orange-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-orange-400"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Athletic Intelligence Engineered</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight uppercase font-sans"
          >
            FORGE <span className="text-orange-500 underline decoration-slice decoration-orange-500/20">YOUR BASELINE</span><br />
            WITH MEDICAL-GRADE RIGOR
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
          >
            The premium dashboard integrating biometrics calculation engines, workout logging records, and server-side Gemini intelligence models to map, adapt, and refine your physiological peak.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <button
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto rounded-xl bg-orange-500 px-8 py-4 text-base font-bold text-white shadow-[0_4px_30px_rgba(249,115,22,0.4)] transition-all hover:bg-orange-600 hover:shadow-[0_4px_30px_rgba(249,115,22,0.5)] active:scale-98"
            >
              Analyze Your Bodyweight Free
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="w-full sm:w-auto rounded-xl border border-white/[0.08] hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 px-8 py-4 text-base font-bold text-zinc-300 hover:text-white transition-all active:scale-98"
            >
              Explore Tiers
            </button>
          </motion.div>

          {/* Social proof items */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="pt-6 flex items-center justify-center lg:justify-start gap-8 border-t border-white/[0.04] max-w-md mx-auto lg:mx-0"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-4.5 w-4.5 text-zinc-500" />
              <span className="text-xs font-semibold text-zinc-500">100% Client-Side Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4.5 w-4.5 text-zinc-500" />
              <span className="text-xs font-semibold text-zinc-500">Professional Grade Metrics</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side Glass Frame Preview */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative flex items-center justify-center"
        >
          {/* Main Visual Glass Card */}
          <GlassCard className="w-full p-6 border border-white/[0.06] select-none hover:rotate-1 transition-transform duration-500">
            <div className="flex items-center justify-between border-b border-white/[0.03] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded-full bg-rose-500" />
                <div className="h-4 w-4 rounded-full bg-yellow-500" />
                <div className="h-4 w-4 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 px-2.5 py-1 rounded">FitForge Engine v4.21</span>
            </div>

            {/* Simulated biometrics widget */}
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.02]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-semibold uppercase">TDEE Intake Energy Budget</span>
                  <Activity className="h-4 w-4 text-orange-500" />
                </div>
                <div className="mt-2.5 flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-white">2,840</span>
                  <span className="text-xs font-medium text-zinc-500">kcal / day</span>
                </div>
              </div>

              {/* Progress track */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/[0.02]">
                  <span className="text-[10px] uppercase font-bold text-zinc-500">Physiology BMI</span>
                  <p className="mt-2 text-2xl font-bold text-orange-500">23.5 <span className="text-xs font-semibold text-emerald-400">OPTIMAL</span></p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/40 border border-white/[0.02] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Water target</span>
                    <p className="mt-2 text-2xl font-bold text-white">3.5 <span className="text-xs font-medium text-zinc-500">Liters</span></p>
                  </div>
                  <Flame className="h-5 w-5 text-orange-500/80" />
                </div>
              </div>

              {/* Generative Coaching line snippet */}
              <div className="p-3.5 rounded-xl border border-orange-500/10 bg-orange-500/[0.02] text-xs leading-relaxed text-orange-200">
                <strong className="text-white block font-bold text-[10px] uppercase tracking-wider mb-1">Coach AI Snippet:</strong>
                "Increasing muscular loading weight safely by 2.5kg on squats can enhance functional metabolic turnover by 1.2%..."
              </div>
            </div>
          </GlassCard>

          {/* Floaters */}
          <div className="absolute -bottom-6 -left-6 h-12 w-48 rounded-full bg-zinc-950 border border-white/[0.1] px-4 py-2 flex items-center justify-between text-xs backdrop-blur shadow-xl select-none pointer-events-none md:flex hidden">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-400 font-medium">8,410 Sets Completed Today</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
