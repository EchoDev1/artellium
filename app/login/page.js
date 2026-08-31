'use client';

import React, { useState, useRef } from 'react';
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
  const { login, repairMasterAdminCredentials, requestVerificationOtp, verifyOtpAndRegister, isLoggedIn, currentUser } = useStore();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup' | 'verify_otp' | 'forgot'
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

  const submitBtnRef = useRef(null);

  // OTP Verification States
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // One-Click Admin Auto-Repair & Direct Sign In
  const handleAutoRepairAdmin = () => {
    setIsLoading(true);
    setAuthError('');
    setAuthSuccess('Verifying & repairing Master Admin credentials...');

    setTimeout(() => {
      repairMasterAdminCredentials();
      setCloudflareVerified(true);
      setEmail('Ekpendudakore@gmail.com');
      setPassword('ladydakore@artellium90');
      
      const res = login('Ekpendudakore@gmail.com', 'ladydakore@artellium90');
      setIsLoading(false);

      if (res.success) {
        setAuthSuccess('Master Admin access granted! Redirecting to Executive Governance Portal...');
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 500);
      } else {
        setAuthError(res.message || 'Auto-repair initiated. Please submit sign-in.');
      }
    }, 400);
  };

  // Quick Account Preset Fill
  const handleFillCredentials = (presetEmail, presetPass) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setCloudflareVerified(true);
    setAuthError('');
    setAuthSuccess('');
  };

  // Auto-scroll to CREATE ACCOUNT button once Cloudflare verification is completed
  React.useEffect(() => {
    if (cloudflareVerified && authMode === 'signup' && submitBtnRef.current) {
      const timer = setTimeout(() => {
        submitBtnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [cloudflareVerified, authMode]);

  // Countdown timer for OTP Resend
  React.useEffect(() => {
    let interval;
    if (authMode === 'verify_otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authMode, resendTimer]);

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
        setTimeout(() => {
          if (res.user.role === 'admin') router.push('/admin/dashboard');
          else if (res.user.role === 'artist') router.push('/artist/dashboard');
          else router.push('/buyer/account');
        }, 700);
      } else {
        setAuthError(res.message || 'Unable to authenticate. Click "1-Click Auto-Repair & Sign In" below.');
      }
    }, 500);
  };

  // Step 1: Submit Details & Request 6-digit OTP Code via Resend
  const handleSignupSubmit = async (e) => {
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

    try {
      const otpRes = await requestVerificationOtp(email.trim(), name.trim(), role);
      setIsLoading(false);

      if (otpRes.success) {
        setAuthMode('verify_otp');
        setResendTimer(60);
        setAuthSuccess(`Verification email with 6-digit code dispatched to ${email.trim()}!`);
      } else {
        setAuthError(otpRes.error || 'Failed to dispatch verification email. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError('Network error while dispatching verification email.');
    }
  };

  // Step 2: Verify 6-digit OTP Code & Complete Account Creation
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const cleanCode = otpCode.trim();
    if (cleanCode.length !== 6) {
      setAuthError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await verifyOtpAndRegister({
        email: email.trim(),
        code: cleanCode,
        name: name.trim(),
        password,
        role
      });
      setIsLoading(false);

      if (res.success) {
        setAuthSuccess('Account verified and created successfully!');
        setTimeout(() => {
          if (res.user.role === 'admin') router.push('/admin/dashboard');
          else if (res.user.role === 'artist') router.push('/artist/dashboard');
          else router.push('/buyer/account');
        }, 800);
      } else {
        setAuthError(res.error || 'Invalid verification code. Please check your email.');
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError('Error validating verification code.');
    }
  };

  // Resend OTP Code
  const handleResendCode = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setAuthError('');

    const res = await requestVerificationOtp(email.trim(), name.trim(), role);
    setIsResending(false);

    if (res.success) {
      setResendTimer(60);
      setAuthSuccess(`A fresh 6-digit verification code has been dispatched to ${email.trim()}!`);
    } else {
      setAuthError(res.error || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07080A] py-10 pb-44 sm:pb-32 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
      
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
                authMode === 'signup' || authMode === 'verify_otp'
                  ? 'text-art-gold border-art-gold'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              {authMode === 'verify_otp' ? '2. Verify Email' : 'Create Account'}
            </button>
          </div>

          {/* Feedback Messages */}
          {authError && (
            <div className="p-3.5 bg-red-950/80 border border-red-500/60 rounded-2xl text-red-200 text-xs font-medium space-y-2.5 animate-shake">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{authError}</span>
              </div>

              {/* Instant One-Click Credential Repair Button */}
              <div className="pt-1 border-t border-red-500/30 flex items-center justify-between">
                <span className="text-[10px] text-slate-300 font-mono">Encountering sign-in difficulty?</span>
                <button
                  type="button"
                  onClick={handleAutoRepairAdmin}
                  className="px-3 py-1.5 bg-art-gold hover:brightness-110 text-art-black font-bold rounded-lg text-[10.5px] uppercase tracking-wider transition flex items-center gap-1.5 shadow"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>1-Click Auto-Repair & Sign In</span>
                </button>
              </div>
            </div>
          )}

          {authSuccess && (
            <div className="p-3.5 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SIGN IN VIEW                                                              */}
          {/* ========================================================================= */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              
              {/* One-Click Quick Fill Presets Bar */}
              <div className="p-3 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-art-gold font-mono uppercase tracking-wider font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-art-gold" />
                    <span>Quick Master Access</span>
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">1-Click Sign In</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleFillCredentials('Ekpendudakore@gmail.com', 'ladydakore@artellium90');
                      handleAutoRepairAdmin();
                    }}
                    className="p-2 rounded-xl bg-art-gold/15 hover:bg-art-gold/25 border border-art-gold/40 text-left transition flex items-center gap-2 group"
                  >
                    <Shield className="w-4 h-4 text-art-gold shrink-0 group-hover:scale-110 transition" />
                    <div>
                      <p className="font-bold text-white text-[11px] leading-tight">Master Admin</p>
                      <p className="text-[9.5px] text-art-gold font-mono truncate">Ekpendudakore@gmail.com</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFillCredentials('kofi@artellium.com', 'artist123')}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition flex items-center gap-2 group"
                  >
                    <Palette className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition" />
                    <div>
                      <p className="font-bold text-slate-200 text-[11px] leading-tight">Master Artist</p>
                      <p className="text-[9.5px] text-slate-400 font-mono truncate">kofi@artellium.com</p>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1.5 font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. Ekpendudakore@gmail.com"
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
                className="w-full py-4 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold text-art-black font-bold uppercase tracking-wider rounded-xl transition shadow-gold-glow hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-black" />
                    <span>Verifying & Signing In...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-black" />
                    <span>Sign In to Account</span>
                  </>
                )}
              </button>
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
              <div className="pt-1">
                <CloudflareTurnstile
                  verified={cloudflareVerified}
                  setVerified={setCloudflareVerified}
                />
              </div>

              {/* Cloudflare Verification Status Banner */}
              {cloudflareVerified ? (
                <div className="flex items-center justify-center gap-2 py-2 px-3.5 bg-emerald-950/80 border-2 border-emerald-400 rounded-xl text-emerald-200 text-xs font-bold shadow-[0_0_20px_rgba(16,185,129,0.35)] animate-fade-in text-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                  <span>Security Verified! Tap Below to Create Account</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 py-1 px-3 bg-white/[0.03] border border-white/10 rounded-xl text-[11px] text-amber-300/80 font-medium text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-art-gold shrink-0" />
                  <span>Complete Cloudflare verification above to proceed</span>
                </div>
              )}

              {/* Ultra-Visible Guaranteed Create Account Button */}
              <div ref={submitBtnRef} className="pt-2 pb-1 w-full">
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{ minHeight: '62px' }}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60 relative overflow-hidden group shadow-2xl ${
                    cloudflareVerified
                      ? 'bg-gradient-to-r from-[#FFF59D] via-[#FFD700] to-[#F59E0B] text-black border-2 border-amber-200 shadow-[0_0_40px_rgba(255,215,0,0.9)] scale-[1.02] ring-4 ring-amber-300/70 animate-create-account-pulse'
                      : 'bg-gradient-to-r from-art-gold via-amber-300 to-art-gold text-black border-2 border-amber-200 shadow-[0_0_28px_rgba(212,175,55,0.7)] hover:brightness-110 active:scale-[0.99]'
                  }`}
                >
                  {/* Animated Shimmer Flare Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />

                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-black shrink-0" />
                      <span className="font-black text-black">Sending Verification Code...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-black shrink-0 animate-spin-slow" />
                      <span className="font-black text-black tracking-widest text-sm sm:text-base">
                        {cloudflareVerified ? 'CREATE ACCOUNT NOW' : 'CREATE ACCOUNT'}
                      </span>
                      <ArrowRight className="w-5 h-5 text-black shrink-0 group-hover:translate-x-1.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: 6-DIGIT EMAIL VERIFICATION OTP                                    */}
          {/* ========================================================================= */}
          {authMode === 'verify_otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs text-center animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-art-gold/15 border border-art-gold/40 text-art-gold flex items-center justify-center mx-auto shadow-gold-glow">
                <Mail className="w-7 h-7 animate-pulse" />
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-white">Check Your Email</h3>
                <p className="text-xs text-slate-400 mt-1">
                  We sent a 6-digit verification code to <span className="text-art-gold font-mono font-semibold">{email}</span>
                </p>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-2 text-left">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center text-2xl tracking-[0.5em] font-mono font-bold bg-[#06070a] border-2 border-art-gold/60 rounded-xl py-3 text-art-gold focus:border-art-gold focus:outline-none shadow-gold-glow"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otpCode.length !== 6}
                style={{ minHeight: '52px' }}
                className="w-full py-4 px-6 bg-gradient-to-r from-art-gold via-amber-300 to-art-gold hover:brightness-110 active:scale-[0.99] text-art-black font-black text-sm uppercase tracking-widest rounded-xl transition shadow-[0_0_25px_rgba(212,175,55,0.7)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-black" />
                    <span>Activating Account...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-black" />
                    <span>Verify & Activate Account</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('signup')}
                  className="text-slate-400 hover:text-white transition"
                >
                  ← Back to Details
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendTimer > 0 || isResending}
                  className="text-art-gold hover:underline disabled:opacity-50 font-semibold"
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : isResending ? 'Resending...' : 'Resend Code'}
                </button>
              </div>
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
