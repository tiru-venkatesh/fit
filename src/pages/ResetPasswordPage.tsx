import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, ArrowLeft, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ToastProvider';
import { GlassCard } from '../components/GlassCard';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast('Please fill in passwords.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      toast('Passwords do not match.', 'error');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setLoading(false);

    toast('Password successfully reconfigured! Welcome back.', 'success');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6">
        <div className="text-center flex flex-col items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white">
              <Dumbbell className="h-5.5 w-5.5" />
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-black text-white tracking-tight uppercase">
            RESET ACCESS KEY
          </h2>
          <p className="mt-1 text-xs text-zinc-500 font-semibold tracking-wide uppercase">
            Define secondary metrics credential
          </p>
        </div>

        <GlassCard className="p-8 border border-white/[0.06]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                New Security Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 pl-10 pr-4 text-xs font-medium text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Confirm Security Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 pl-10 pr-4 text-xs font-medium text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-orange-500 py-4 font-bold text-xs uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Confirming...' : 'Redefine Password'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase text-orange-400 hover:text-orange-500 transition-colors pt-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Authentication</span>
            </Link>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
