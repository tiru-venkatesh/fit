import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Dumbbell, LineChart, Target, Settings, BadgeInfo,
  Sparkles, Apple, Droplet, Fuel, Scale, Trophy, Bot, Users
} from 'lucide-react';

interface SidebarLink {
  name: string;
  path: string;
  icon: React.ElementType;
}

const SIDEBAR_LINKS: SidebarLink[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Workout Tracker', path: '/workouts', icon: Dumbbell },
  { name: 'Progress Analytics', path: '/analytics', icon: LineChart },
  { name: 'AI Workout Generator', path: '/ai-workout', icon: Dumbbell },
  { name: 'AI Diet & Nutrition', path: '/ai-diet', icon: Apple },
  { name: 'Water & Sleep Coach', path: '/water-sleep', icon: Droplet },
  { name: 'Dimensions & Photos', path: '/measurements', icon: Scale },
  { name: 'Transformation Roadmap', path: '/roadmap', icon: Target },
  { name: 'Scoreboard & Challenges', path: '/gamification', icon: Trophy },
  { name: 'AI Companion Chat', path: '/ai-chatbot', icon: Bot },
  { name: 'Athlete Community', path: '/community', icon: Users },
  { name: 'Pricing Tiers', path: '/pricing', icon: Target },
  { name: 'Account Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="fixed bottom-0 top-16 z-30 hidden w-64 border-r border-white/10 bg-white/5 backdrop-blur-xl px-4 py-6 md:block">
      <nav className="space-y-1.5 flex flex-col h-full justify-between">
        <div className="space-y-1">
          {SIDEBAR_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200
                ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/10'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent'
                }
              `}
            >
              <link.icon className="h-4.5 w-4.5" />
              <span>{link.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Dynamic Badge details */}
        <div className="rounded-2xl border border-orange-500/10 bg-orange-500/[0.02] p-4 text-center">
          <BadgeInfo className="mx-auto h-5 w-5 text-orange-400" />
          <h5 className="mt-2 text-xs font-bold text-white uppercase tracking-wider">Premium Access Active</h5>
          <p className="mt-1 text-[10px] text-zinc-500 leading-normal">
            Your biometrics algorithms are synced. Re-assess anytime.
          </p>
        </div>
      </nav>
    </aside>
  );
}
export { SIDEBAR_LINKS };
