import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Star, Sparkles, Building, Briefcase } from 'lucide-react';
import { GlassCard } from './GlassCard';

export function PricingSection() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Member Plan',
      price: billingCycle === 'monthly' ? 39 : 351, // 25% discount
      description: 'Perfect for individual athletes looking to log, calculate, and target peak physical goals.',
      features: [
        'Complete Biometrics Calculator Suite',
        'Multi-set Workout Training Logs',
        '7-day Historical Progress Charts',
        'Unlimited local storage sessions',
        'Basic AI Coach Insights (3 per day)',
      ],
      icon: Star,
      popular: false,
    },
    {
      name: 'Trainer Plan',
      price: billingCycle === 'monthly' ? 99 : 891,
      description: 'Ideal for independent personal trainers handling up to 10 active clients on-screen.',
      features: [
        'Everything in Member Plan',
        'Track up to 10 different Client profiles',
        'Priority server-side Gemini assessing',
        'PDF Performance Report Exports',
        'Custom workout plan generator',
      ],
      icon: Sparkles,
      popular: true,
    },
    {
      name: 'Gym Owner',
      price: billingCycle === 'monthly' ? 499 : 4491,
      description: 'Configured for boutique studios who require full biometric screening desks.',
      features: [
        'Everything in Trainer Plan',
        'Multi-user client assessment logins',
        'Personal Brand landing configurations',
        'Weekly automated team assessment reports',
        'Dedicated 24/7 technical consultant link',
      ],
      icon: Briefcase,
      popular: false,
    },
    {
      name: 'Multi Branch',
      price: billingCycle === 'monthly' ? 1499 : 13491,
      description: 'Enterprise tier built for commercial gym networks requesting centralized metrics panels.',
      features: [
        'Everything in Gym Owner Plan',
        'Unlimited local branches configurations',
        'Unified biometric intelligence panel',
        'Employee check-in logging terminals',
        'Highest priority API execution lanes',
      ],
      icon: Building,
      popular: false,
    },
    {
      name: 'White Label',
      price: billingCycle === 'monthly' ? 4999 : 44991,
      description: 'For absolute corporate scaling. Integrate our calculation engine with your branded mobile application.',
      features: [
        'Everything in Multi Branch Plan',
        'Complete White-Label custom domain',
        'Full access to raw API calculator services',
        'Custom trained server-side model nodes',
        'Source-code escrow options',
      ],
      icon: Sparkles,
      popular: false,
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="mx-auto max-w-7xl">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500">PRICING TIERS</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            CHOOSE YOUR ATHLETIC FLIGHT PATH
          </h2>
          <p className="text-sm text-zinc-500 font-medium">
            SaaS pricing adapted to individual performers, coaches, studios, and massive enterprise gym networks.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-6 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold leading-normal transition-colors duration-200 ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-900 border border-white/[0.08]"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-orange-500 transition-transform duration-200 ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-xs font-bold leading-normal transition-colors duration-200 flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-orange-400' : 'text-zinc-500'}`}>
              Yearly <span className="bg-orange-500/10 text-orange-400 text-[10px] uppercase font-black px-1.5 py-0.5 rounded">Save 25%</span>
            </span>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-center">
          {plans.map((plan, idx) => (
            <GlassCard
              key={idx}
              className={`flex flex-col justify-between p-6 relative ${
                plan.popular ? 'border-orange-500/30 bg-zinc-950/80 shadow-[0_20px_50px_rgba(249,115,22,0.06)] scale-[1.02]' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white text-[9px] uppercase font-black px-2.5 py-1 rounded-md tracking-wider flex items-center gap-0.5 shadow-lg">
                  <Star className="h-3 w-3 fill-current" /> MOST POPULAR
                </div>
              )}

              <div>
                <div className="flex font-bold text-lg items-center gap-2 text-white">
                  <plan.icon className="h-4.5 w-4.5 text-orange-500 shrink-0" />
                  <span>{plan.name}</span>
                </div>
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed mt-2">{plan.description}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">₹{plan.price}</span>
                  <span className="text-xs font-medium text-zinc-500">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>

                <div className="mt-6 border-t border-white/[0.04] pt-5 space-y-3">
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-zinc-400">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="font-medium leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => navigate('/signup')}
                  className={`w-full py-3.5 rounded-xl text-center text-xs font-extrabold uppercase tracking-wider transition-all duration-200 active:scale-98 text-white ${
                    plan.popular
                      ? 'bg-orange-500 hover:bg-orange-600 shadow-[0_4px_20px_rgba(249,115,22,0.3)]'
                      : 'bg-zinc-900 border border-white/[0.06] hover:bg-zinc-800'
                  }`}
                >
                  Join Under {plan.name}
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
