import React, { useState } from 'react';
import {
  Sprout,
  Globe,
  UserCheck,
  Building2,
  Sparkles,
  LogIn,
  UserPlus,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { LanguageCode, UserProfile } from '../types';

interface NavbarProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  activeRole: 'farmer' | 'buyer';
  onRoleChange: (role: 'farmer' | 'buyer') => void;
  onLoadRameshDemo: () => void;
  isAiConnected: boolean;
  currentUser: UserProfile | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onLanguageChange,
  activeRole,
  onRoleChange,
  onLoadRameshDemo,
  isAiConnected,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'Kannada', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'Telugu', label: 'Telugu', native: 'తెలుగు' },
    { code: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'English', label: 'English', native: 'English' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-emerald-950/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo & Platform identity */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Sprout className="h-6 w-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 font-sans">
                  FarmLink<span className="text-emerald-600">.AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Sparkles className="h-3 w-3" />
                  Price Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Direct Trading & Market Intelligence
              </p>
            </div>
          </div>

          {/* Center Action: Quick One-Click Ramesh Demo */}
          <div className="flex items-center gap-2">
            <button
              id="ramesh-demo-btn"
              onClick={onLoadRameshDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition-all"
              title="Load Ramesh Gowda: Kolar Tomato 1000kg scenario"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span className="hidden md:inline">Demo:</span>
              <span>Ramesh (Kolar)</span>
            </button>

            {/* Role Switcher: Farmer vs Buyer */}
            <div className="bg-slate-100/90 p-0.5 rounded-lg border border-slate-200/80 flex items-center text-xs font-semibold">
              <button
                id="role-farmer-tab"
                onClick={() => onRoleChange('farmer')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
                  activeRole === 'farmer'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Farmer</span>
              </button>
              <button
                id="role-buyer-tab"
                onClick={() => onRoleChange('buyer')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
                  activeRole === 'buyer'
                    ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/50'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Buyer Hub</span>
              </button>
            </div>
          </div>

          {/* Right Tools: Language, AI State, User Auth */}
          <div className="flex items-center gap-2">
            {/* Language Dropdown */}
            <div className="relative group">
              <button
                id="language-selector-btn"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white/90 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                <Globe className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-semibold text-slate-900">{languages.find(l => l.code === currentLanguage)?.native}</span>
              </button>
              
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1 hidden group-hover:block z-50 animate-in fade-in slide-in-from-top-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => onLanguageChange(lang.code)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition ${
                      currentLanguage === lang.code
                        ? 'bg-emerald-50 text-emerald-800 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{lang.native}</span>
                    <span className="text-[10px] text-slate-400">{lang.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Health Badge */}
            <div
              className="hidden xl:flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200"
              title="FarmLink Gemini Multimodal & Decision Core Active"
            >
              <span className={`h-2 w-2 rounded-full ${isAiConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              <span className="font-medium text-slate-600">Gemini 3.8</span>
            </div>

            {/* Authentication Control */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition shadow-xs"
                >
                  <img
                    src={
                      currentUser.avatarUrl ||
                      (currentUser.role === 'farmer'
                        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
                        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80')
                    }
                    alt={currentUser.name}
                    className="h-7 w-7 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {currentUser.name.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-semibold leading-none capitalize">
                      {currentUser.role}
                    </div>
                  </div>
                  <ChevronDown className="h-3 w-3 text-slate-400 ml-0.5" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="p-2 border-b border-slate-100">
                      <div className="font-extrabold text-xs text-slate-900">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                        📍 {currentUser.location}
                      </div>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <button
                        onClick={() => {
                          onRoleChange(currentUser.role === 'farmer' ? 'buyer' : 'farmer');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-between"
                      >
                        <span>Switch to {currentUser.role === 'farmer' ? 'Buyer Hub' : 'Farmer'}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                          Toggle
                        </span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          onLogout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1.5 font-bold"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  id="nav-signin-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  Sign In
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
                >
                  Sign Up
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
