import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Building2,
  Lock,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sprout,
  KeyRound,
} from 'lucide-react';
import { UserProfile } from '../types';
import { authService } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
  initialRole?: 'farmer' | 'buyer';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
  initialRole = 'farmer',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [role, setRole] = useState<'farmer' | 'buyer'>(initialRole);
  const [emailOrPhone, setEmailOrPhone] = useState<string>('ramesh.gowda@farmlink.ai');
  const [password, setPassword] = useState<string>('kolar@2026');
  const [name, setName] = useState<string>('Ramesh Gowda');
  const [organizationName, setOrganizationName] = useState<string>('Gowda Organic Farms');
  const [location, setLocation] = useState<string>('Kolar, Karnataka');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (mode === 'login') {
        const user = await authService.login(emailOrPhone, password, role);
        onAuthSuccess(user);
        onClose();
      } else {
        const user = await authService.signup({
          name,
          email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@farmlink.ai`,
          phone: !emailOrPhone.includes('@') ? emailOrPhone : '+91 98450 12849',
          role,
          location,
          organizationName,
          password,
        });
        onAuthSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication error. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (selectedRole: 'farmer' | 'buyer') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (selectedRole === 'farmer') {
        const user = await authService.login('ramesh.gowda@farmlink.ai', 'demo123', 'farmer');
        onAuthSuccess(user);
      } else {
        const user = await authService.login('procurement@abcfoods.com', 'demo123', 'buyer');
        onAuthSuccess(user);
      }
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Quick login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl glass-panel p-6 sm:p-7 shadow-2xl bg-white/95 border border-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
            <Sprout className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg text-slate-900 tracking-tight">
                FarmLink<span className="text-emerald-600">.AI</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Secure Auth
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {mode === 'login' ? 'Sign in to access your direct trade ledger' : 'Create your verified trading account'}
            </p>
          </div>
        </div>

        {/* Mode Toggle (Login vs Sign Up) */}
        <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-xl mb-4 border border-slate-200/80 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/50 font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage(null);
            }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/50 font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Role Switcher */}
        <div className="mb-4">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
            Select Account Role:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setRole('farmer');
                if (mode === 'login') {
                  setEmailOrPhone('ramesh.gowda@farmlink.ai');
                  setName('Ramesh Gowda');
                  setLocation('Kolar, Karnataka');
                  setOrganizationName('Gowda Organic Farms');
                }
              }}
              className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition ${
                role === 'farmer'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${role === 'farmer' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Farmer</div>
                <div className="text-[10px] text-slate-500 leading-tight">Direct Selling & Price Discovery</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('buyer');
                if (mode === 'login') {
                  setEmailOrPhone('procurement@abcfoods.com');
                  setName('ABC Foods Procurement');
                  setLocation('Bengaluru, Karnataka');
                  setOrganizationName('ABC Foods & Hospitality');
                }
              }}
              className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition ${
                role === 'buyer'
                  ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-500'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${role === 'buyer' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Verified Buyer</div>
                <div className="text-[10px] text-slate-500 leading-tight">Institutional Procurement</div>
              </div>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {errorMessage}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name / Contact Person
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Gowda"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <UserCheck className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {role === 'farmer' ? 'Farm / Land Name' : 'Company / Business Name'}
                </label>
                <input
                  type="text"
                  required
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  placeholder={role === 'farmer' ? 'e.g. Gowda Agro Farms' : 'e.g. Metro Retail Depot'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Village / District Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kolar, Karnataka"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
                  />
                  <MapPin className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Email Address or Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="ramesh.gowda@farmlink.ai or +91 98450 12849"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
              <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => alert('For prototype demonstration, use any password or click One-Click Demo Login below.')}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-900 focus:border-emerald-600 focus:outline-none"
              />
              <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to FarmLink' : 'Register Verified Account'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-400">
            <span className="bg-white px-2">Instant Demo Access</span>
          </div>
        </div>

        {/* One-Click Demo Logins */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin('farmer')}
            className="w-full p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between transition"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">🌾</span>
              <span>Quick Login as <strong>Ramesh Gowda (Farmer - Kolar)</strong></span>
            </span>
            <span className="text-[10px] font-bold bg-white text-emerald-800 px-2 py-0.5 rounded shadow-xs">
              1-Click
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin('buyer')}
            className="w-full p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-between transition"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">🏢</span>
              <span>Quick Login as <strong>ABC Foods (Institutional Buyer)</strong></span>
            </span>
            <span className="text-[10px] font-bold bg-white text-slate-700 px-2 py-0.5 rounded shadow-xs">
              1-Click
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
