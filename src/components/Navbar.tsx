import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, Menu, Bell, Sparkles, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button
              onClick={onToggleSidebar}
              className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white md:hidden active:scale-95 transition-all"
              aria-label="toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 font-black text-white group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] group-hover:rotate-12 transition-transform duration-300">
              <Dumbbell className="h-5 w-5" />
            </span>
            <span className="text-lg tracking-tight font-extrabold uppercase">
              FitForge<span className="text-orange-500">.AI</span>
            </span>
          </Link>
        </div>

        {/* Desktop Landing Links (Only shown when on landing or when unauthenticated) */}
        {!isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-zinc-400">
            <Link to="/" className="hover:text-white transition-colors">Workspace</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>
        )}

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Logged in header actions */}
              <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.04] bg-zinc-900/50 text-zinc-400 hover:text-white transition-colors">
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="hidden sm:flex items-center gap-1 text-xs font-bold uppercase rounded-xl border border-orange-500/10 bg-orange-500/5 hover:bg-orange-500/10 text-orange-400 px-3 py-2 transition-all cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Coach Live</span>
              </button>

              {/* Profile drop downs dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 rounded-full p-0.5 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-zinc-900 border border-white/[0.06] hover:border-zinc-700 transition-colors"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                    alt="avatar"
                  />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/[0.06] bg-zinc-950 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-top-2 duration-250">
                    <div className="px-3 py-2 text-xs font-bold border-b border-white/[0.03] text-zinc-400">
                      Signed as <div className="text-white truncate mt-0.5 font-medium">{user?.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate('/settings');
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Account Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                        navigate('/');
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)] transition-all hover:bg-orange-600 hover:shadow-[0_4px_20px_rgba(249,115,22,0.4)] active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
