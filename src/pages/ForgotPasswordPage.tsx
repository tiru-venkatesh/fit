import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, ArrowLeft, Mail, Compass } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ToastProvider';
import { GlassCard } from '../components/GlassCard';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    await resetPassword(email);
    setSent(true);
    toast('Security key sequence transmitted! Please audit your inbox.', 'info');
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
            RECOVER PASSWORD
          </h2>
          <p className="mt-1 text-xs text-zinc-500 font-semibold tracking-wide uppercase">
            Initiate security key sequence reset
          </p>
        </div>

        <GlassCard className="p-8 border border-white/[0.06]">
          {sent ? (
            <div className="space-y-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
                <Compass className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Verification Key Sent</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We have forwarded a secure password reset link to <strong className="text-zinc-200">{email}</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/reset-password')}
                className="w-full rounded-xl bg-orange-500 py-3 text-xs font-bold uppercase tracking-wider text-white"
              >
                Go to Reset Screen
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="email">
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-650">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="tiruvenkatesh123@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 pl-10 pr-4 text-xs font-medium text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-orange-500 py-4 font-bold text-xs uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? 'Hashing...' : 'Transmit Link'}
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase text-orange-400 hover:text-orange-500 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Return to Login</span>
              </Link>
            </form>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
