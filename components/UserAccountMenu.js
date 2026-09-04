'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/store-context';
import CloudflareTurnstile from '@/components/CloudflareTurnstile';
import {
  User,
  ChevronDown,
  ShieldCheck,
  Palette,
  ShoppingBag,
  Heart,
  LogOut,
  Sparkles,
  Lock,
  Mail,
  UserCheck,
  Crown,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  KeyRound,
  Shield,
  X
} from 'lucide-react';

export default function UserAccountMenu() {
  const router = useRouter();
  const {
    currentUser,
    isLoggedIn,
    login,
    logout,
    requestVerificationOtp,
    verifyOtpAndRegister,
    orders = []
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'signup' | 'verify_otp' | 'forgot'
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('buyer');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [termsAgreed, setTermsAgreed] = useState(true);

  // OTP Verification States
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);

  // Cloudflare Turnstile verification state
  const [cloudflareVerified, setCloudflareVerified] = useState(false);

  const menuRef = useRef(null);

  // Countdown timer for OTP Resend
  useEffect(() => {
    let interval;
    if (authTab === 'verify_otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authTab, resendTimer]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Calculate password strength
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

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!cloudflareVerified) {
      setAuthError('Please complete the Cloudflare security verification.');
      return;
    }

    if (!email || !password) {
      setAuthError('Please enter both email address and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email.trim(), password);
      setIsLoading(false);

      if (res.success) {
        setAuthSuccess(`Welcome back, ${res.user.name || 'Collector'}!`);
        setTimeout(() => {
          setIsOpen(false);
          setAuthSuccess('');
          if (res.user.role === 'admin') router.push('/admin/dashboard');
          else if (res.user.role === 'artist') router.push('/artist/dashboard');
          else router.push('/buyer/account');
        }, 600);
      } else {
        setAuthError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError('Network error during sign in. Please retry.');
    }
  };

  // Step 1: Submit Details & Request 6-digit OTP Code via Resend
  const handleSignup = async (e) => {
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
      setAuthError('Please provide a valid email address.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Passwords do not match. Please verify.');
      return;
    }

    if (!termsAgreed) {
      setAuthError('Please agree to Artellium terms and fiduciary policies.');
      return;
    }

    setIsLoading(true);

    try {
      // Trigger 6-digit verification code to recipient's email via Resend
      const otpRes = await requestVerificationOtp(email.trim(), name.trim(), role);
      setIsLoading(false);

      if (otpRes.success) {
        setAuthTab('verify_otp');
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
          setIsOpen(false);
          setAuthSuccess('');
          if (res.user.role === 'admin') router.push('/admin/dashboard');
          else if (res.user.role === 'artist') router.push('/artist/dashboard');
          else router.push('/buyer/account');
        }, 700);
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

  const handleForgotPassword = (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setAuthError('Please enter a valid registered email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setAuthSuccess(`Security password reset link dispatched to ${email}. Check your inbox!`);
      setTimeout(() => {
        setAuthTab('login');
      }, 3500);
    }, 600);
  };

  const getRoleBadge = (userRole) => {
    switch (userRole) {
      case 'admin':
        return { label: 'System Admin', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: ShieldCheck };
      case 'artist':
        return { label: 'Master Artist', bg: 'bg-art-gold/20 text-art-gold border-art-gold/40', icon: Palette };
      default:
        return { label: 'Verified Collector', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: UserCheck };
    }
  };

  const badgeInfo = currentUser ? getRoleBadge(currentUser.role) : null;
  const BadgeIcon = badgeInfo ? badgeInfo.icon : null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Account Menu Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition text-xs font-semibold select-none ${
          isOpen
            ? 'bg-art-gold/20 text-art-gold border border-art-gold'
            : 'bg-art-black-card border border-art-gold/30 hover:border-art-gold text-slate-200 hover:text-white'
        }`}
      >
        {isLoggedIn && currentUser ? (
          <>
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-art-gold via-amber-600 to-art-green p-0.5 flex items-center justify-center shrink-0">
              {currentUser.avatar_url ? (
                <img src={currentUser.avatar_url} alt={currentUser.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full bg-art-black rounded-full flex items-center justify-center text-[10px] font-bold text-art-gold">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="hidden lg:flex flex-col text-left leading-none">
              <span className="font-serif font-bold text-white text-[11px] max-w-[100px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-art-gold font-sans uppercase tracking-wider">
                {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'artist' ? 'Artist' : 'Collector'}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-art-gold' : ''}`} />
          </>
        ) : (
          <>
            <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="hidden sm:inline font-medium">Account</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {/* Account Dropdown Modal / Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-[410px] rounded-2xl bg-[#090b10] border border-art-gold/40 shadow-2xl z-50 overflow-hidden animate-fade-in backdrop-blur-2xl">
          
          {/* Top Security Banner with Cloudflare Indicator */}
          <div className="p-3.5 bg-gradient-to-r from-[#11141a] via-[#161c24] to-[#0d131a] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#f6821f]/20 border border-[#f6821f]/40 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-[#f6821f]" />
              </div>
              <div>
                <span className="font-serif text-xs font-bold text-white tracking-wider block">
                  {isLoggedIn ? 'ARTELLIUM AUTHENTICATED' : 'ARTELLIUM SECURE ACCESS'}
                </span>
                <span className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Cloudflare SSL & DDoS Protected</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isLoggedIn && currentUser ? (
            /* Logged-In User Profile & Actions */
            <div className="p-4 space-y-4">
              {/* User Profile Card */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-art-gold via-amber-600 to-art-green p-0.5 shadow-gold-glow flex-shrink-0">
                  {currentUser.avatar_url ? (
                    <img src={currentUser.avatar_url} alt={currentUser.name} className="w-full h-full object-cover rounded-[10px]" />
                  ) : (
                    <div className="w-full h-full bg-art-black rounded-[10px] flex items-center justify-center font-bold font-serif text-lg text-art-gold">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {badgeInfo && BadgeIcon && (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${badgeInfo.bg}`}>
                        <BadgeIcon className="w-2.5 h-2.5" />
                        <span>{badgeInfo.label}</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif text-sm font-bold text-white truncate">{currentUser.name}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                </div>
              </div>

              {/* Role-Specific Portal Navigation (Strictly Isolated - No Cross-Portal Overlaps) */}
              <div>
                {currentUser.role === 'buyer' && (
                  <Link
                    href="/buyer/account"
                    onClick={() => setIsOpen(false)}
                    className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-teal-950/40 border border-emerald-500/40 hover:border-emerald-400 text-emerald-200 hover:text-white flex items-center justify-between text-xs font-semibold transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                      <span>Collector Portal & Certificates</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                  </Link>
                )}

                {currentUser.role === 'artist' && (
                  <Link
                    href="/artist/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full p-3 rounded-xl bg-gradient-to-r from-art-gold/15 to-amber-950/40 border border-art-gold/40 hover:border-art-gold text-art-gold hover:text-white flex items-center justify-between text-xs font-semibold transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Palette className="w-4 h-4 text-art-gold group-hover:scale-110 transition" />
                      <span>Artist Studio Console</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-art-gold" />
                  </Link>
                )}

                {currentUser.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="w-full p-3 rounded-xl bg-gradient-to-r from-amber-950/60 to-yellow-950/40 border border-amber-500/40 hover:border-amber-400 text-amber-200 hover:text-white flex items-center justify-between text-xs font-semibold transition group"
                  >
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
                      <span>Admin Executive Center</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                )}
              </div>

              {/* Logout Button */}
              <div className="pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-800/30 text-red-300 hover:text-red-200 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Account</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged-Out Sign In / Create Account View - Generous scroll space for mobile */
            <div className="p-4 sm:p-5 space-y-4 max-h-[85vh] overflow-y-auto scrollbar-thin pb-48 sm:pb-16">
              
              {/* Tab Selector */}
              <div className="flex border-b border-white/10 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('login');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`flex-1 pb-2.5 text-center font-bold tracking-wider uppercase transition border-b-2 ${
                    authTab === 'login' ? 'text-art-gold border-art-gold' : 'text-slate-400 border-transparent hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('signup');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className={`flex-1 pb-2.5 text-center font-bold tracking-wider uppercase transition border-b-2 ${
                    authTab === 'signup' || authTab === 'verify_otp' ? 'text-art-gold border-art-gold' : 'text-slate-400 border-transparent hover:text-white'
                  }`}
                >
                  {authTab === 'verify_otp' ? '2. Verify Email' : 'Create Account'}
                </button>
              </div>

              {authError && (
                <div className="p-3 bg-red-950/70 border border-red-500/50 rounded-xl text-red-300 text-xs font-medium flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              {/* ========================================================================= */}
              {/* 1. SIGN IN FORM                                                           */}
              {/* ========================================================================= */}
              {authTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. collector@artellium.com"
                        className="w-full bg-[#06070a] border border-white/15 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-slate-500 focus:border-art-gold focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-300 font-medium">Password</label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('forgot');
                          setAuthError('');
                          setAuthSuccess('');
                        }}
                        className="text-[11px] text-art-gold hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#06070a] border border-white/15 rounded-xl py-2.5 pl-9 pr-10 text-white placeholder-slate-500 focus:border-art-gold focus:outline-none transition font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me Option */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded bg-[#06070a] border-white/20 text-art-gold focus:ring-0 cursor-pointer"
                      />
                      <span>Remember my credentials</span>
                    </label>
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
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Verifying Credentials...</span>
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
              {/* 2. CREATE ACCOUNT (SIGN UP) FORM                                          */}
              {/* ========================================================================= */}
              {authTab === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Full Legal / Artist Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Folake Davies"
                      className="w-full bg-[#06070a] border border-white/15 rounded-xl py-2 px-3 text-white placeholder-slate-500 focus:border-art-gold focus:outline-none transition text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Email Address (For Verification)</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. folake@artellium.com"
                      className="w-full bg-[#06070a] border border-white/15 rounded-xl py-2 px-3 text-white placeholder-slate-500 focus:border-art-gold focus:outline-none transition text-xs"
                    />
                  </div>

                  {/* Role Selector with Visual Explanations */}
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Select Account Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('buyer')}
                        className={`p-2 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                          role === 'buyer'
                            ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                            : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <div>
                          <span className="font-bold text-[11px] block text-white">Collector</span>
                          <span className="text-[8px] text-slate-400 block">Acquire & Bid</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('artist')}
                        className={`p-2 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                          role === 'artist'
                            ? 'bg-art-gold/20 border-art-gold text-art-gold'
                            : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Palette className="w-3.5 h-3.5 text-art-gold shrink-0" />
                        <div>
                          <span className="font-bold text-[11px] block text-white">Artist</span>
                          <span className="text-[8px] text-slate-400 block">Sell & Exhibit</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Create Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#06070a] border border-white/15 rounded-xl py-2 pl-3 pr-10 text-white placeholder-slate-500 focus:border-art-gold focus:outline-none transition font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Confirm Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full bg-[#06070a] border rounded-xl py-2 px-3 text-white placeholder-slate-500 focus:outline-none transition font-mono text-xs ${
                        confirmPassword && confirmPassword !== password
                          ? 'border-red-500'
                          : confirmPassword && confirmPassword === password
                          ? 'border-emerald-500'
                          : 'border-white/15 focus:border-art-gold'
                      }`}
                    />
                  </div>

                  {/* Terms & Conditions */}
                  <label className="flex items-start gap-2 text-[10.5px] text-slate-400 cursor-pointer pt-0.5 select-none">
                    <input
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={(e) => setTermsAgreed(e.target.checked)}
                      className="mt-0.5 rounded bg-[#06070a] border-white/20 text-art-gold focus:ring-0 cursor-pointer"
                    />
                    <span>
                      I agree to the <Link href="/policies" className="text-art-gold hover:underline">Terms of Service</Link>.
                    </span>
                  </label>

                  {/* Cloudflare Turnstile Bot Security Widget */}
                  <CloudflareTurnstile
                    verified={cloudflareVerified}
                    setVerified={setCloudflareVerified}
                  />

                  {/* HIGH-VISIBILITY GOLD CREATE ACCOUNT BUTTON */}
                  <div className="pt-3 pb-2 w-full">
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{ minHeight: '58px' }}
                      className={`w-full py-4 px-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 relative overflow-hidden group shadow-2xl ${
                        cloudflareVerified
                          ? 'bg-gradient-to-r from-[#FFF59D] via-[#FFD700] to-[#F59E0B] text-black border-2 border-amber-200 shadow-[0_0_35px_rgba(255,215,0,0.9)] scale-[1.01] ring-4 ring-amber-300/60'
                          : 'bg-gradient-to-r from-art-gold via-amber-300 to-art-gold text-black border-2 border-amber-200 shadow-[0_0_25px_rgba(212,175,55,0.7)] hover:brightness-110 active:scale-[0.99]'
                      }`}
                    >
                      {/* Animated Shimmer Flare Effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />

                      {isLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-black shrink-0" />
                          <span className="font-black text-black">Sending Verification Code...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-black shrink-0" />
                          <span className="font-black text-black tracking-widest text-sm">
                            {cloudflareVerified ? 'CREATE ACCOUNT NOW' : 'CREATE ACCOUNT'}
                          </span>
                          <ArrowRight className="w-4 h-4 text-black shrink-0 group-hover:translate-x-1.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-1 pb-4">
                    <Link
                      href="/register"
                      onClick={() => setIsOpen(false)}
                      className="text-[11px] text-art-gold hover:underline font-medium inline-flex items-center gap-1"
                    >
                      <span>Or open full registration page</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Extra bottom scroll buffer for mobile */}
                  <div className="h-16 sm:h-6 w-full pointer-events-none select-none" aria-hidden="true" />
                </form>
              )}

              {/* ========================================================================= */}
              {/* STEP 2: 6-DIGIT EMAIL VERIFICATION OTP                                    */}
              {/* ========================================================================= */}
              {authTab === 'verify_otp' && (
                <form onSubmit={handleVerifyOtp} className="space-y-3.5 text-xs text-center animate-fade-in">
                  <div className="w-12 h-12 rounded-2xl bg-art-gold/15 border border-art-gold/40 text-art-gold flex items-center justify-center mx-auto shadow-gold-glow">
                    <Mail className="w-6 h-6 animate-pulse" />
                  </div>

                  <div>
                    <h4 className="font-serif text-sm font-bold text-white">Check Your Inbox</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      We sent a 6-digit verification code to <span className="text-art-gold font-mono font-semibold">{email}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-300 font-medium mb-1.5 text-left">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full text-center text-xl tracking-[0.5em] font-mono font-bold bg-[#06070a] border border-art-gold/50 rounded-xl py-2.5 text-art-gold focus:border-art-gold focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length !== 6}
                    style={{ minHeight: '48px' }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-art-gold to-amber-500 hover:brightness-110 active:scale-[0.99] text-art-black font-black text-xs uppercase tracking-widest rounded-xl transition shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Activating Account...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>Verify & Activate Account</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <button
                      type="button"
                      onClick={() => setAuthTab('signup')}
                      className="text-slate-400 hover:text-white transition"
                    >
                      ← Back to Details
                    </button>

                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendTimer > 0 || isResending}
                      className="text-art-gold hover:underline disabled:opacity-50"
                    >
                      {resendTimer > 0 ? `Resend code in ${resendTimer}s` : isResending ? 'Resending...' : 'Resend Code'}
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================================================= */}
              {/* 3. FORGOT PASSWORD RECOVERY FORM                                          */}
              {/* ========================================================================= */}
              {authTab === 'forgot' && (
                <form onSubmit={handleForgotPassword} className="space-y-3.5 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                    <span className="font-bold text-white block">Account Recovery</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Enter your registered email address below. A cryptographic authentication reset link will be sent to you.
                    </p>
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1 font-medium">Registered Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. collector@artellium.com"
                        className="w-full bg-[#06070a] border border-white/15 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-slate-500 focus:border-art-gold focus:outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Cloudflare Turnstile */}
                  <CloudflareTurnstile
                    verified={cloudflareVerified}
                    setVerified={setCloudflareVerified}
                  />

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setAuthTab('login')}
                      className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-bold transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-2.5 bg-gradient-to-r from-art-gold to-amber-500 text-art-black font-bold uppercase tracking-wider rounded-xl transition shadow-gold-glow hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                      <span>Send Recovery Link</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          )}
        </div>
      )}
    </div>
  );
}
