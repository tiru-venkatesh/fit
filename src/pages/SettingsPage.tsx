import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings, User, Bell, Shield, ShieldAlert, Sparkles, Scale, RefreshCw, Trash2, Check
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { useSettingsStore } from '../store/settingsStore';
import { useToast } from '../components/ToastProvider';
import { GlassCard } from '../components/GlassCard';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { MobileSidebar } from '../components/MobileSidebar';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, switchUserRole } = useAuthStore();
  const { profile, updateProfile, updateMeasurements, updateGoals } = useProfileStore();
  const { unitSystem, setUnitSystem, emailNotifications, setEmailNotifications, pushNotifications, setPushNotifications, privacyMode, setPrivacyMode, themeMode, setThemeMode } = useSettingsStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'units' | 'notifications' | 'privacy' | 'role' | 'subscription'>('profile');
  const [selectedPlan, setSelectedPlan] = useState<string>('Free');
  const [stripeSimulate, setStripeSimulate] = useState<{ plan: string; price: string } | null>(null);
  const [paymentSimulating, setPaymentSimulating] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');

  // Local Form structures
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [age, setAge] = useState(profile.age || 26);
  const [weight, setWeight] = useState(profile.measurements.weight || 84);
  const [height, setHeight] = useState(profile.measurements.height || 178);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName, age: Number(age) });
    updateMeasurements({ weight: Number(weight), height: Number(height) });
    toast('Physical baseline settings synchronized!', 'success');
  };

  const handleDeleteAccount = () => {
    const confirmation = window.confirm('DANGER! This action deletes all local storage states. Are you sure?');
    if (confirmation) {
      logout();
      toast('Account purged. All biometrics erased.', 'info');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col justify-between">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <MobileSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-grow flex">
        <Sidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 md:pl-72 animate-fade-in duration-300">
          <div className="max-w-4xl mx-auto space-y-8">
            
            <div className="border-b border-white/[0.04] pb-6">
              <span className="text-[10px] uppercase font-black text-orange-500 tracking-widest">SYSTEM PREFERENCES</span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1 uppercase">Account Preferences Matrix</h1>
              <p className="text-xs text-zinc-500 mt-1 font-medium">Reconfigure system units, physical constants, and data safety options.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              
              {/* Tab options side column */}
              <div className="md:col-span-4 space-y-1 bg-zinc-900/30 rounded-2xl border border-white/[0.03] p-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'profile' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/10' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Profile variables</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('units')}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'units' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/10' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  <Scale className="h-4 w-4" />
                  <span>Systems & Units</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'notifications' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/10' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  <span>Alert flags</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'privacy' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/10' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  <span>Safety & purge</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('role')}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'role' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/10' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Access Role switch</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('subscription')}
                  className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all ${
                    activeTab === 'subscription' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/10' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-orange-500" />
                  <span>Billing & Subscription</span>
                </button>
              </div>

              {/* Tab contexts */}
              <div className="md:col-span-8">
                <GlassCard className="p-6 border border-white/[0.04]">
                  
                  {/* Active 1: Profile */}
                  {activeTab === 'profile' && (
                    <form className="space-y-5" onSubmit={handleSaveProfile}>
                      <span className="block text-xs font-bold uppercase text-zinc-400 border-b border-white/[0.02] pb-2">Profile variables</span>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-zinc-500">Athletic Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3.5 px-4 text-xs font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Biological Age</label>
                          <input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                            className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3 px-4 text-xs font-medium"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Weight</label>
                          <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(Number(e.target.value))}
                            className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3 px-4 text-xs font-medium"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-zinc-500">Height</label>
                          <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            className="block w-full rounded-xl bg-zinc-900 border border-white/[0.04] py-3 px-4 text-xs font-medium"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="rounded-xl bg-orange-500 hover:bg-orange-600 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white select-none active:scale-95"
                      >
                        Synchronize Parameters
                      </button>
                    </form>
                  )}

                  {/* Active 2: Systems & Units */}
                  {activeTab === 'units' && (
                    <div className="space-y-6">
                      <span className="block text-xs font-bold uppercase text-zinc-400 border-b border-white/[0.02] pb-2">Unit Systems configuration</span>

                      <div className="space-y-4">
                        {([
                          { key: 'metric', label: 'Metric System standard', desc: 'Sustains kilograms (kg) and centimeters (cm) calculations.' },
                          { key: 'imperial', label: 'Imperial System standard', desc: 'Switches into pounds (lbs) and feet/inches (ft/in) representations.' }
                        ] as const).map((unit) => (
                          <div
                            key={unit.key}
                            onClick={() => {
                              setUnitSystem(unit.key);
                              toast(`Switched scale system into ${unit.key}!`, 'success');
                            }}
                            className={`group cursor-pointer rounded-xl border p-4 flex justify-between items-center transition-all ${
                              unitSystem === unit.key ? 'border-orange-500 bg-orange-500/5 text-white' : 'border-white/[0.04] bg-zinc-900/50 hover:bg-zinc-900'
                            }`}
                          >
                            <div>
                              <h5 className="text-xs font-bold">{unit.label}</h5>
                              <p className="mt-1 text-[11px] text-zinc-500 font-semibold">{unit.desc}</p>
                            </div>
                            <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${unitSystem === unit.key ? 'border-orange-500 bg-orange-500' : 'border-zinc-700'}`}>
                              {unitSystem === unit.key && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3.5 bg-orange-500/5 border border-orange-500/10 rounded-xl text-xs text-orange-200 leading-relaxed">
                        Toggling unit scales will automatically translate bodyweight figures inside all metabolic equations in real-time.
                      </div>
                    </div>
                  )}

                  {/* Active 3: Alert flags */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <span className="block text-xs font-bold uppercase text-zinc-400 border-b border-white/[0.02] pb-2">Reminder schedules alerts</span>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/20 border border-white/[0.01]">
                          <div>
                            <h5 className="text-xs font-bold text-zinc-300">Email reminder digests</h5>
                            <p className="text-[10px] text-zinc-500 mt-0.5">Receive weekly physical assessments digests.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setEmailNotifications(!emailNotifications)}
                            className={`w-12 h-6 rounded-full border transition-all relative ${emailNotifications ? 'bg-orange-500 border-orange-500' : 'bg-zinc-900 border-zinc-700'}`}
                          >
                            <span className={`absolute top-1/2 -translate-y-1/2 h-4.5 w-4.5 rounded-full bg-white transition-all ${emailNotifications ? 'right-0.5' : 'left-0.5'}`} />
                          </button>
                        </div>

                        <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/20 border border-white/[0.01]">
                          <div>
                            <h5 className="text-xs font-bold text-zinc-300">Push screen notifications</h5>
                            <p className="text-[10px] text-zinc-500 mt-0.5">Hydration reminders and training check-ins.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPushNotifications(!pushNotifications)}
                            className={`w-12 h-6 rounded-full border transition-all relative ${pushNotifications ? 'bg-orange-500 border-orange-500' : 'bg-zinc-900 border-zinc-700'}`}
                          >
                            <span className={`absolute top-1/2 -translate-y-1/2 h-4.5 w-4.5 rounded-full bg-white transition-all ${pushNotifications ? 'right-0.5' : 'left-0.5'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active 4: Privacy & safety purge */}
                  {activeTab === 'privacy' && (
                    <div className="space-y-6">
                      <span className="block text-xs font-bold uppercase text-rose-500 border-b border-white/[0.02] pb-2">Destructive Operations Console</span>

                      <div className="rounded-xl border border-rose-500/10 bg-rose-500/[0.01] p-4 space-y-4">
                        <div className="flex items-start gap-2.5 text-xs text-rose-400">
                          <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5 animate-pulse" />
                          <div>
                            <h5 className="font-bold uppercase tracking-wider">PURGE LOCAL STORAGE DATA</h5>
                            <p className="mt-1 text-[11px] text-zinc-500 font-medium leading-relaxed">
                              This operation immediately zeroes active streak logs, physical configurations, training diaries, and biometric assessment targets permanently.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleDeleteAccount}
                          className="rounded-xl bg-rose-500 hover:bg-rose-600 px-5 py-3 text-xs font-black uppercase text-white shadow-lg active:scale-95"
                        >
                          Eliminate My Local Profile State
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Active 5: Dynamic Role Switch */}
                  {activeTab === 'role' && (
                    <div className="space-y-6">
                      <span className="block text-xs font-bold uppercase text-zinc-400 border-b border-white/[0.02] pb-2">Partition Workspace Roles Switching</span>
                      
                      <div className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/10 space-y-3">
                        <h4 className="text-xs font-black text-white text-[11px] uppercase tracking-wider flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-orange-500" />
                          Live workspace credentials shifting
                        </h4>
                        <p className="text-[10px] text-zinc-400 leading-relaxed">
                          Toggle between Member database or Owners admin panel instantly. Shifting is saved on Firestore doc, changing accessible routes dynamically.
                        </p>

                        <div className="grid grid-cols-2 p-1 gap-1 rounded-xl bg-zinc-950 border border-white/[0.04] mt-2">
                          <button
                            type="button"
                            onClick={async () => {
                              await switchUserRole('client');
                              toast('Swapped to Gym Client successfully.', 'success');
                              navigate('/dashboard');
                            }}
                            className={`py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${
                              user?.role === 'client' 
                                ? 'bg-orange-500 text-white shadow-md' 
                                : 'text-zinc-400 hover:text-white bg-transparent'
                            }`}
                          >
                            Gym Member
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              await switchUserRole('owner');
                              toast('Swapped to Gym Owner successfully.', 'success');
                              navigate('/dashboard');
                            }}
                            className={`py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${
                              user?.role === 'owner' 
                                ? 'bg-orange-500 text-white shadow-md' 
                                : 'text-zinc-400 hover:text-white bg-transparent'
                            }`}
                          >
                            Gym Owner
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active 6: Billing & Subscription */}
                  {activeTab === 'subscription' && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-white/[0.02] pb-2">
                        <span className="block text-xs font-bold uppercase text-zinc-400">Manage SAAS Tiers & Stripe Payments</span>
                        <span className="text-[10px] uppercase font-black text-orange-500 bg-orange-500/10 px-2.5 py-0.5 rounded border border-orange-500/10">Active: {selectedPlan} Plan</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Free */}
                        <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${selectedPlan === 'Free' ? 'border-orange-500 bg-orange-500/[0.01]' : 'border-white/[0.04] bg-zinc-950/40'}`}>
                          <div>
                            <h4 className="text-xs font-black text-white uppercase">Free plan</h4>
                            <p className="text-[9px] text-zinc-500 mt-1">Standard bodyweight logbooks and historical analytics trends.</p>
                            <span className="block text-lg font-black text-white mt-3">$0<span className="text-[10px] text-zinc-500 lowercase font-medium"> / mo</span></span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPlan('Free');
                              toast('Switched back to Free Tier baseline', 'info');
                            }}
                            className="mt-4 w-full py-2 bg-zinc-900 border border-white/[0.05] text-[9px] font-black uppercase text-zinc-300 rounded-lg hover:text-white"
                          >
                            {selectedPlan === 'Free' ? 'Current Active' : 'Downgrade'}
                          </button>
                        </div>

                        {/* Pro */}
                        <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${selectedPlan === 'Pro' ? 'border-orange-500 bg-orange-500/[0.01]' : 'border-white/[0.04] bg-zinc-950/40'}`}>
                          <div>
                            <h4 className="text-xs font-black text-orange-400 uppercase">Pro Athlete</h4>
                            <p className="text-[9px] text-zinc-500 mt-1">Unlimited custom weekly workout generation & Sports Diet Plans.</p>
                            <span className="block text-lg font-black text-white mt-3">$19<span className="text-[10px] text-zinc-500 lowercase font-medium"> / mo</span></span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedPlan === 'Pro') return;
                              setStripeSimulate({ plan: 'Pro Athlete', price: '$19.00' });
                            }}
                            className="mt-4 w-full py-2 bg-orange-500 text-[9px] font-black uppercase text-white rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            {selectedPlan === 'Pro' ? 'Current Active' : 'Subscribe via Stripe'}
                          </button>
                        </div>

                        {/* Elite */}
                        <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${selectedPlan === 'Elite' ? 'border-orange-500 bg-orange-500/[0.01]' : 'border-white/[0.04] bg-zinc-950/40'}`}>
                          <div>
                            <h4 className="text-xs font-black text-yellow-400 uppercase">Elite gymowner</h4>
                            <p className="text-[9px] text-zinc-500 mt-1">Dedicated human coaches, direct SMS alerts & premium branch views.</p>
                            <span className="block text-lg font-black text-white mt-3">$49<span className="text-[10px] text-zinc-500 lowercase font-medium"> / mo</span></span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedPlan === 'Elite') return;
                              setStripeSimulate({ plan: 'Elite Gymowner', price: '$49.00' });
                            }}
                            className="mt-4 w-full py-2 bg-amber-500 text-[9px] font-black uppercase text-white rounded-lg hover:bg-amber-600 transition-colors"
                          >
                            {selectedPlan === 'Elite' ? 'Current Active' : 'Subscribe via Stripe'}
                          </button>
                        </div>
                      </div>

                      {/* Modal Dialogue Simulator for Stripe payments */}
                      {stripeSimulate && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                          <div className="bg-zinc-950 border border-white/10 max-w-sm w-full rounded-2xl p-6 space-y-4 shadow-2xl relative">
                            <span className="text-[8px] font-black uppercase bg-orange-500/10 text-orange-400 border border-orange-500/10 px-2 py-0.5 rounded">
                              STRIPE PAYMENT ENGINE INTEGRATION
                            </span>
                            <h3 className="text-sm font-black text-white uppercase">Checkout: {stripeSimulate.plan}</h3>
                            <p className="text-[10px] text-zinc-400 leading-normal">Confirm subscription of <strong className="text-white">{stripeSimulate.price} / month</strong> on your card.</p>
                            
                            <div className="space-y-2.5">
                              <div>
                                <label className="block text-[8px] font-bold uppercase text-zinc-500">Test Visa Card Number</label>
                                <input
                                  type="text"
                                  value={cardNumber}
                                  onChange={(e) => setCardNumber(e.target.value)}
                                  className="w-full bg-zinc-900 border border-white/5 p-2.5 rounded-xl text-xs text-white"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[8px] font-bold uppercase text-zinc-500">CVV</label>
                                  <input type="text" value="312" readOnly className="w-full bg-zinc-900 border border-white/5 p-2 px-2 text-xs text-white" />
                                </div>
                                <div>
                                  <label className="block text-[8px] font-bold uppercase text-zinc-500">Expiry</label>
                                  <input type="text" value="12/29" readOnly className="w-full bg-zinc-900 border border-white/5 p-2 px-2 text-xs text-white" />
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => setStripeSimulate(null)}
                                className="flex-1 py-2 bg-transparent text-[9px] font-black uppercase border border-white/10 rounded-xl"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={async () => {
                                  setPaymentSimulating(true);
                                  await new Promise((resolve) => setTimeout(resolve, 1400));
                                  setPaymentSimulating(false);
                                  setSelectedPlan(stripeSimulate.plan === 'Pro Athlete' ? 'Pro' : 'Elite');
                                  setStripeSimulate(null);
                                  toast('Stripe Subscription successfully authorized!', 'success');
                                }}
                                className="flex-1 py-2 bg-orange-500 hover:bg-orange-600 text-[9px] font-black uppercase text-white rounded-xl flex items-center justify-center gap-1"
                              >
                                {paymentSimulating ? <RefreshCw className="h-3 w-3 animate-spin" /> : 'Authorize Charge'}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </GlassCard>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
