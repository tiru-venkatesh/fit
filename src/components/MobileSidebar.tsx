import React from 'react';
import { NavLink } from 'react-router-dom';
import { X, Dumbbell } from 'lucide-react';
import { SIDEBAR_LINKS } from './Sidebar';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden animate-fade-in duration-200">
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer content frame */}
      <div className="relative flex w-full max-w-xs flex-col bg-neutral-950/90 backdrop-blur-xl border-r border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
              <Dumbbell className="h-4 w-4" />
            </span>
            <span className="text-base tracking-tight font-extrabold uppercase">
              FitForge<span className="text-orange-500">.AI</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.04] bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-8 space-y-1.5 flex-1">
          {SIDEBAR_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
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
        </nav>
      </div>
    </div>
  );
}
