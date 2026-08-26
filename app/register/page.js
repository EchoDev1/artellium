'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/store-context';
import CloudflareTurnstile from '@/components/CloudflareTurnstile';
import {
  Sparkles,
  Lock,
  Mail,
  UserCheck,
  Palette,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { signup } = useStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [cloudflareVerified, setCloudflareVerified] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1: return { score: 1, label: 'Weak', color: 'bg-red-500' };
      case 2: return { score: 2, label: 'Fair', color: 'bg-amber-500' };
      case 3: return { score: 3, label: 'Good', color: 'bg-emerald-500' };
      case 4: return { score: 4, label: 'Royal Secure', color: 'bg-art-gold' };
      default: return { score: 0, label: '', color: 'bg-slate-700' };
    }
  };

  const passStrength = getPasswordStrength(password);

  const handleSignupSubmit = (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!cloudflareVerified) {
      setAuthError('Please complete the Cloudflare security verification.');
      return;
    }

    if (!name.trim()) {
      setAuthError('Please provide your full legal or artist name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match. Please verify.');
      return;
    }

    if (!termsAgreed) {
      setAuthError('Please accept the Artellium Terms & Conditions to proceed.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = signup(name.trim(), email.trim(), password, role);
      setIsLoading(false);

      if (res.success) {
        setAuthSuccess('Account registered successfully with Cloudflare validation!');
        setTimeout(() => {
          if (res.user.role === 'admin') router.push('/admin/dashboard');
          else if (res.user.role === 'artist') router.push('/artist/dashboard');
          else router.push('/buyer/account');
        }, 700);
      } else {
        setAuthError(res.message || 'Registration failed. Please try again.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07080A] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-art-gold/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f6821f]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-art-gold via-amber-600 to-art-green p-0.5 shadow-gold-glow group-hover:scale-105 transition transform">
              <div className="w-full h-full bg-art-black rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-art-gold" />
              </div>
            </div>
            <div className="text-left">
              <span className="font-serif text-2xl font-black tracking-wider text-white group-hover:text-art-gold transition block leading-none">
                ARTELLIUM
              </span>
              <span className="text-[10px] text-art-gold font-sans tracking-widest uppercase font-semibold">
                CREATE ACCOUNT
              </span>
            </div>
          </Link>
          <p className="text-xs text-slate-400">
            Join collectors, curators and artists across the Pan-African fine art ecosystem.
          </p>
        </div>

        {/* Main Auth Container */}
        <div className="rounded-3xl bg-[#0c0f17]/90 border border-art-gold/35 shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-5">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Register New Account
            </span>
            <Link href="/login" className="text-xs text-art-gold hover:underline">
              Already have an account? Sign in
            </Link>
          </div>

          {authError && (
            <div className="p-3.5 bg-red-950/70 border border-red-500/50 rounded-xl text-red-300 text-xs font-medium flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="p-3.5 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">Full Legal / Artist Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Folake Davies"
                className="w-full bg-[#06070a] border border-white/15 rounded-xl py-2.5 px-3.5 text-white placeholder-slate-500 focus:border-art-gold focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. folake@artellium.com"
                className="w-full bg-[#06070a] border border-white/15 rounded-xl py-2.5 px-3.5 text-white placeholder-slate-500 focus:border-art-gold focus:outline-none transition"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">Select Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('buyer')}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    role === 'buyer'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 shadow-emerald-glow'
                      : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-xs block text-white">Art Collector</span>
                    <span className="text-[9px] text-slate-400 block">Acquire & Bid</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('artist')}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    role === 'artist'
                      ? 'bg-art-gold/20 border-art-gold text-art-gold shadow-gold-glow'
                      : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  <Palette className="w-5 h-5 text-art-gold shrink-0" />
                  <div>
                    <span className="font-bold text-xs block text-white">Master Artist</span>
                    <span className="text-[9px] text-slate-400 block">Sell & Exhibit</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Password & Strength Meter */}
            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#06070a] border border-white/15 rounded-xl py-2.5 pl-3.5 pr-10 text-white placeholder-slate-500 focus:border-art-gold focus:outline-none transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {password && (
                <div className="mt-1.5 space-y-1">
                  <div className="flex items-center justify-between text-[9.5px] font-mono">
                    <span className="text-slate-400">Password Strength:</span>
                    <span className={passStrength.score >= 3 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {passStrength.label}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 transition-colors duration-300 ${
                          passStrength.score >= step ? passStrength.color : 'bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-slate-300 mb-1.5 font-medium">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full bg-[#06070a] border rounded-xl py-2.5 px-3.5 text-white placeholder-slate-500 focus:outline-none transition font-mono ${
                  confirmPassword && confirmPassword !== password
                    ? 'border-red-500'
                    : confirmPassword && confirmPassword === password
                    ? 'border-emerald-500'
                    : 'border-white/15 focus:border-art-gold'
                }`}
              />
            </div>

            {/* Terms Checkbox */}
            <label className="flex items-start gap-2 text-[11px] text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mt-0.5 rounded bg-[#06070a] border-white/20 text-art-gold focus:ring-0 cursor-pointer"
              />
              <span>
                I agree to the <Link href="/policies" className="text-art-gold hover:underline">Terms of Service</Link> and WEMA Fiduciary Policies.
              </span>
            </label>

            {/* Cloudflare Turnstile Bot Security Widget */}
            <CloudflareTurnstile
              verified={cloudflareVerified}
              setVerified={setCloudflareVerified}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold text-art-black font-bold uppercase tracking-wider rounded-xl transition shadow-gold-glow hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Creating Cloudflare Verified Account...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Verified Account</span>
                </>
              )}
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
