'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/context/store-context';
import CloudflareTurnstile from '@/components/CloudflareTurnstile';
import { triggerEmailNotification } from '@/lib/email-client';
import {
  Sparkles,
  Lock,
  Mail,
  UserCheck,
  Palette,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  KeyRound,
  Shield
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, isLoggedIn, currentUser } = useStore();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(true);
  const [cloudflareVerified, setCloudflareVerified] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-red-500' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-emerald-500' };
      case 4:
        return { score: 4, label: 'Royal Secure', color: 'bg-art-gold' };
      default:
        return { score: 0, label: '', color: 'bg-slate-700' };
    }
  };

  const passStrength = getPasswordStrength(password);

  const handleLoginSubmit = (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!cloudflareVerified) {
      setAuthError('Please complete the Cloudflare security verification.');
      return;
    }

    if (!email.trim() || !password) {
      setAuthError('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = login(email.trim(), password);
      setIsLoading(false);

      if (res.success) {
        setAuthSuccess(`Welcome back, ${res.user.name || 'Collector'}!`);
        // Dispatch security notification to the user's email
        triggerEmailNotification('login_alert', email.trim(), {
          name: res.user.name || 'Collector',
          role: res.user.role || 'buyer'
        });
        setTimeout(() => {
          if (res.user.role === 'admin') router.push('/admin/dashboard');
          else if (res.user.role === 'artist') router.push('/artist/dashboard');
          else router.push('/buyer/account');
        }, 700);
      } else {
        setAuthError(res.message || 'Invalid email address or password.');
      }
    }, 500);
  };

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
      setAuthError('Passwords do not match. Please re-enter.');
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

  const fillFastDemo = (userType) => {
    setAuthMode('login');
    setAuthError('');
    setAuthSuccess('');
    setCloudflareVerified(true);

    if (userType === 'admin') {
      setEmail('admin@artellium.com');
      setPassword('admin123');
    } else if (userType === 'artist') {
      setEmail('amina.diallo@artellium.com');
      setPassword('artist123');
    } else {
      setEmail('evelyn.carter@heritage.org');
      setPassword('buyer123');
    }
  };

  return (
    <div className="min-h-screen bg-[#07080A] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      
      {/* Ambient Lighting */}
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
                SOVEREIGN AUTHENTICATION
              </span>
            </div>
          </Link>
          <p className="text-xs text-slate-400">
            Secured fine art trading, live auction bidding & curated 3D exhibitions.
          </p>
        </div>

        {/* Main Auth Container */}
        <div className="rounded-3xl bg-[#0c0f17]/90 border border-art-gold/35 shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-5">
          
          {/* Mode Switcher */}
          <div className="flex border-b border-white/10 text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthError('');
                setAuthSuccess('');
              }}
              className={`flex-1 pb-3 text-center font-bold tracking-wider uppercase transition border-b-2 ${
                authMode === 'login'
                  ? 'text-art-gold border-art-gold'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setAuthError('');
                setAuthSuccess('');
              }}
              className={`flex-1 pb-3 text-center font-bold tracking-wider uppercase transition border-b-2 ${
                authMode === 'signup'
                  ? 'text-art-gold border-art-gold'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback Messages */}
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

          {/* ========================================================================= */}
          {/* SIGN IN VIEW                                                              */}
          {/* ========================================================================= */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1.5 font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. collector@artellium.com"
                    className="w-full bg-[#06070a] border border-white/15 rounded-xl py-3 pl-10 pr-3 text-white placeholder-slate-500 focus:border-art-gold focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-300 font-medium">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[11px] text-art-gold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#06070a] border border-white/15 rounded-xl py-3 pl-10 pr-10 text-white placeholder-slate-500 focus:border-art-gold focus:outline-none transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#06070a] border-white/20 text-art-gold focus:ring-0 cursor-pointer"
                  />
                  <span>Remember this device</span>
                </label>
                <span className="text-[10px] text-emerald-400 font-mono">TLS 1.3 Encrypted</span>
              </div>

              {/* Cloudflare Turnstile Bot Security Widget */}
              <CloudflareTurnstile
                verified={cloudflareVerified}
                setVerified={setCloudflareVerified}
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold text-art-black font-bold uppercase tracking-wider rounded-xl transition shadow-gold-glow hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying & Signing In...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to Account</span>
                  </>
                )}
              </button>

              {/* Fast Sandbox Credentials */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider text-center">
                  Instant 1-Click Demo Accounts:
                </span>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => fillFastDemo('buyer')}
                    className="py-2 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-emerald-300 font-semibold text-center transition"
                  >
                    Collector
                  </button>
                  <button
                    type="button"
                    onClick={() => fillFastDemo('artist')}
                    className="py-2 bg-art-gold/10 hover:bg-art-gold/20 border border-art-gold/40 rounded-xl text-art-gold font-semibold text-center transition"
                  >
                    Artist
                  </button>
                  <button
                    type="button"
                    onClick={() => fillFastDemo('admin')}
                    className="py-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 rounded-xl text-amber-300 font-semibold text-center transition"
                  >
                    Admin
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* CREATE ACCOUNT VIEW                                                       */}
          {/* ========================================================================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1.5 font-medium">Full Name</label>
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
          )}

          {/* ========================================================================= */}
          {/* FORGOT PASSWORD VIEW                                                      */}
          {/* ========================================================================= */}
          {authMode === 'forgot' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <span className="font-bold text-white block">Account Recovery Protocol</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Enter your registered email address below. A cryptographic authentication reset link will be dispatched immediately.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-medium">Registered Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. collector@artellium.com"
                    className="w-full bg-[#06070a] border border-white/15 rounded-xl py-3 pl-10 pr-3 text-white placeholder-slate-500 focus:border-art-gold focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Cloudflare Turnstile */}
              <CloudflareTurnstile
                verified={cloudflareVerified}
                setVerified={setCloudflareVerified}
              />

              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-bold transition"
                >
                  Back to Sign In
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!email || !email.includes('@')) {
                      setAuthError('Please enter a valid registered email address.');
                      return;
                    }
                    setIsLoading(true);
                    setAuthError('');
                    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
                    const appOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://artellium.africa';
                    const resetLink = `${appOrigin}/reset-password?code=${resetCode}&email=${encodeURIComponent(email.trim())}`;
                    
                    await triggerEmailNotification('password_reset', email.trim(), {
                      name: 'Art Patron',
                      code: resetCode,
                      resetLink
                    });

                    setIsLoading(false);
                    setAuthSuccess(`Password reset instructions & 6-digit token dispatched to ${email.trim()}!`);
                  }}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-art-gold to-amber-500 text-art-black font-bold uppercase tracking-wider rounded-xl transition shadow-gold-glow hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                  <span>Send Recovery Email</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
