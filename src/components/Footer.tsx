import React from 'react';
import { Dumbbell } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-white/5 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex items-center gap-2 font-black text-white group">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.3)]">
            <Dumbbell className="h-4 w-4" />
          </span>
          <span className="text-base tracking-tight font-extrabold uppercase">
            FitForge<span className="text-orange-500">.AI</span>
          </span>
        </div>

        <p className="text-[11px] font-mono text-zinc-500">
          © {currentYear} FITFORGE AI GLOBAL INC. ALL BIOMETRICAL ALGORITHMS DEPLOYED GLOBALLY.
        </p>

        <div className="flex gap-6 text-xs text-zinc-500 font-semibold">
          <a href="#" className="hover:text-white transition-colors">Workspace Agreement</a>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
