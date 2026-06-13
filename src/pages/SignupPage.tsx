import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Mail, Lock, User, UserPlus, ShieldAlert, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { useToast } from '../components/ToastProvider';
import { GlassCard } from '../components/GlassCard';

export default function SignupPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signup, loginWithGoogle, isLoading } = useAuthStore();
  const { resetProfile } = useProfileStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'client' | 'owner'>('client');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setLocalError('Please fill in all requested fields.');
      toast('Please fill in all requested fields.', 'error');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      toast('Passwords do not match.', 'error');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      toast('Password must be at least 6 characters.', 'error');
      return;
    }

    const success = await signup(fullName, email, password, selectedRole);
    if (success) {
      if (selectedRole === 'client') {
        await resetProfile();
        toast('Account established! Welcome to FitForge AI.', 'success');
        toast('Starting Fitness Profile Onboarding Setup...', 'info');
        navigate('/onboarding/profile');
      } else {
        toast('Gym Owner database partition provisioned. Welcome Owner!', 'success');
        navigate('/dashboard');
      }
    } else {
      const errorMsg = useAuthStore.getState().error || 'Registration failed.';
      setLocalError(errorMsg);
      toast(errorMsg, 'error');
    }
  };

  const handleGoogleSignup = async () => {
    setLocalError('');
    const success = await loginWithGoogle(selectedRole);
    if (success) {
      if (selectedRole === 'client') {
        const hasOnboarded = useProfileStore.getState().profile.isOnboarded;
        if (!hasOnboarded) {
          await resetProfile();
          toast('Successfully registered with Google!', 'success');
          navigate('/onboarding/profile');
        } else {
          toast('Welcome back to FitForge!', 'success');
          navigate('/dashboard');
        }
      } else {
        toast('Gym Owner portal initialized. Welcome!', 'success');
        navigate('/dashboard');
      }
    } else {
      const errorMsg = useAuthStore.getState().error || 'Google login failed.';
      setLocalError(errorMsg);
      toast(errorMsg, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6">
        <div className="text-center flex flex-col items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              <Dumbbell className="h-5.5 w-5.5" />
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-black text-white tracking-tight uppercase">
            FITFORGE ACCOUNT SETUP
          </h2>
          <p className="mt-1 text-xs text-zinc-500 font-semibold tracking-wide uppercase font-mono">
            Securely Provision Account with Firebase
          </p>
        </div>

        <GlassCard className="p-8 border border-white/[0.06]">
          {/* Role selection tabs */}
          <div className="mb-6">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2">
              Select Your Access Level
            </label>
            <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-950/80 border border-white/[0.04]">
              <button
                type="button"
                onClick={() => setSelectedRole('client')}
                className={`py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${
                  selectedRole === 'client' 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-zinc-400 hover:text-white bg-transparent'
                }`}
              >
                Gym Member
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('owner')}
                className={`py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${
                  selectedRole === 'owner' 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-zinc-400 hover:text-white bg-transparent'
                }`}
              >
                Gym Owner / Staff
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2 font-medium italic">
              {selectedRole === 'client' 
                ? "Gain access to workouts tracking, personal logs, biometric analytics, and coach insights."
                : "Gain access to client lists, bulletin broadcasts, active progress monitors, and loop prescriptions."
              }
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {localError && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs text-rose-400 font-semibold">
                {localError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="fullName">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-650">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  required
                  placeholder="e.g. Tiru Venkatesh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3 pl-10 pr-4 text-xs font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="email">
                Email Address
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
                  className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3 pl-10 pr-4 text-xs font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="password">
                Secure Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-650">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3 pl-10 pr-4 text-xs font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-650">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3 pl-10 pr-4 text-xs font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-xl bg-orange-500 py-3 font-bold text-xs uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="h-4 w-4" />
              <span>{isLoading ? 'Creating Document...' : 'Verify & Launch'}</span>
            </button>

            {/* Google Signup option */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/[0.04]"></div>
              <span className="flex-shrink mx-3 text-[9px] uppercase font-bold text-zinc-500">Or continue with</span>
              <div className="flex-grow border-t border-white/[0.04]"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading}
              className="w-full rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 py-3 text-xs text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.743-.08-1.3-.178-1.86H12.24z"/>
              </svg>
              <span>Setup via Google Firebase</span>
            </button>
          </form>
        </GlassCard>

        <p className="text-center text-xs text-zinc-500">
          Already verified in system?{' '}
          <Link to="/login" className="font-semibold text-orange-400 hover:text-orange-500 transition-colors uppercase tracking-wider">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
