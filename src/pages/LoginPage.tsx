import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../components/ToastProvider';
import { GlassCard } from '../components/GlassCard';

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, loginWithGoogle, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all credentials fields.');
      toast('Please fill in all credentials fields.', 'error');
      return;
    }

    const success = await login(email, password, rememberMe);
    if (success) {
      toast('Authenticated successfully! Welcome to FitForge AI.', 'success');
      navigate('/dashboard');
    } else {
      const errorMsg = useAuthStore.getState().error || 'Invalid credentials.';
      setLocalError(errorMsg);
      toast(errorMsg, 'error');
    }
  };

  const handleGoogleLogin = async () => {
    setLocalError('');
    // Google logins can default to client or restore their previously saved role
    const success = await loginWithGoogle('client');
    if (success) {
      toast('Google authentication completed through Firebase.', 'success');
      navigate('/dashboard');
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
            FITFORGE AUTHORIZATION
          </h2>
          <p className="mt-1 text-xs text-zinc-500 font-semibold tracking-wide uppercase font-mono">
            Enter credentials to audit metrics
          </p>
        </div>

        <GlassCard className="p-8 border border-white/[0.06]">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {localError && (
              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-400 font-semibold">
                {localError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="tiruvenkatesh123@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 pl-10 pr-4 text-xs font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500" htmlFor="password">
                  Security Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[10px] font-bold text-orange-400 hover:text-orange-500 uppercase tracking-wider"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-600">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 pl-10 pr-10 text-xs font-medium text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-white/[0.08] bg-zinc-900 text-orange-500 focus:ring-orange-500"
                />
                <span>Routines Autologin</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-orange-500 py-4 font-bold text-xs uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:bg-orange-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="h-4 w-4" />
              <span>{isLoading ? 'Decrypting Session...' : 'Authenticate Profile'}</span>
            </button>
          </form>

          {/* Google Login button */}
          <div className="mt-6 border-t border-white/[0.04] pt-5">
            <span className="block text-center text-[9px] uppercase font-bold tracking-widest text-zinc-600 mb-4">
              Or Synchronize Federated ID
            </span>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 py-3.5 text-xs text-white font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.743-.08-1.3-.178-1.86H12.24z"/>
              </svg>
              <span>Authenticate using Google</span>
            </button>
          </div>
        </GlassCard>

        <p className="text-center text-xs text-zinc-500">
          Not flagged in system?{' '}
          <Link to="/signup" className="font-semibold text-orange-400 hover:text-orange-500 transition-colors uppercase tracking-wider">
            Register Account
          </Link>
        </p>
      </div>
    </div>
  );
}
