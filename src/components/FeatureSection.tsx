import React from 'react';
import { Shield, Sparkles, Activity, FileCheck, Dumbbell, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function FeatureSection() {
  const features = [
    {
      icon: Activity,
      title: 'Advanced Biometric Math',
      description: 'Calculate BMI, BMR, TDEE, Safe Water Intake, Sleep Targets, and custom Macronutrient schedules down to individual fitness levels.',
    },
    {
      icon: Dumbbell,
      title: 'Multi-set Workout Logger',
      description: 'Log and review weights, repetitions, and complete muscular groups with complete history logs, streak alerts, and performance ratings.',
    },
    {
      icon: Sparkles,
      title: 'Gym-Grade AI Coach',
      description: 'Harness the server-side Gemini API models to receive ultra-personalized nutritional menus, training cycles, and direct habit tips.',
    },
    {
      icon: BarChart3,
      title: 'D3/Recharts Analytics',
      description: 'Track weight drops, body fat ratios, muscular volumes, and consistency factors across weekly grids using dynamic responsive charts.',
    },
    {
      icon: RefreshCw,
      title: 'Custom Units Toggle',
      description: 'Switch freely between Imperial (lbs, feet) and Metric (kg, cm) systems instantly. All biometrics equations recalculate live.',
    },
    {
      icon: Shield,
      title: 'Zero Database Leakage',
      description: 'All training session histories and physiological profiles are stored client-side in secure offline local storage structures.',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500">ENGINEERED SUITE</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            DEVELOPED FOR ATHLETES WHO REQUIRE EXACT METRICS
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 font-medium">
            No marketing estimates, no simplified formulas. Clean scientific calculators paired with advanced artificial intelligence models.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <GlassCard key={idx} hoverEffect className="p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/10">
                  <feat.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{feat.title}</h3>
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">{feat.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
