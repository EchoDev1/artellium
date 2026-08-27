'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/store-context';
import CloudflareTurnstile from '@/components/CloudflareTurnstile';
import { requestVerificationOtp, submitVerificationCode, triggerEmailNotification } from '@/lib/email-client';
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
  RefreshCw,
  ArrowRight,
  Send,
  KeyRound
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { requestVerificationOtp, verifyOtpAndRegister } = useStore();

  const [step, setStep] = useState('register'); // 'register' | 'verify_otp' | 'success'
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

  // OTP State
  const [otpCode, setOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [debugOtp, setDebugOtp] = useState('');

  // Countdown timer for OTP Resend
  useEffect(() => {
    let interval;
    if (step === 'verify_otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

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

  // Step 1: Submit Details & Dispatch Verification OTP via Resend
  const handleInitialSubmit = async (e) => {
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

    try {
      // Trigger 6-digit OTP code to recipient's email via Resend
      const otpRes = await requestVerificationOtp(email.trim(), name.trim(), role);
      setIsLoading(false);

      if (otpRes.success) {
        if (otpRes.debugCode) setDebugOtp(otpRes.debugCode);
        setStep('verify_otp');
        setResendTimer(60);
        setAuthSuccess(`Verification email dispatched to ${email.trim()}!`);
      } else {
        setAuthError(otpRes.error || 'Failed to dispatch verification email. Please retry.');
      }
    } catch (err) {
      setIsLoading(false);
      setAuthError('Network error while dispatching verification email.');
    }
  };

  // Step 2: Verify OTP Code & Activate Account
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
        setStep('success');
        setAuthSuccess('Account verified & activated successfully with artellium.africa!');

        setTimeout(() => {
          if (res.user.role === 'admin') router.push('/admin/dashboard');
          else if (res.user.role === 'artist') router.push('/artist/dashboard');
          else router.push('/buyer/account');
        }, 1200);
      } else {
        setAuthError(res.error || 'Invalid verification code. Please check your inbox.');
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
      if (res.debugCode) setDebugOtp(res.debugCode);
      setResendTimer(60);
      setAuthSuccess('A fresh 6-digit verification code has been dispatched to your email!');
    } else {
      setAuthError(res.error || 'Failed to resend code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07080A] py-10 pb-32 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-art-gold/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-900/10 blur-[120px] pointer-events-none" />

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
                FINE ART & AUCTIONS
              </span>
            </div>
          </Link>
          <p className="text-xs text-slate-400">
            {step === 'verify_otp' 
              ? 'Security Email Verification • Artellium Africa'
              : 'Join collectors, curators and artists across the Pan-African fine art ecosystem.'}
          </p>
        </div>

        {/* Main Auth Container */}
        <div className="rounded-3xl bg-[#0c0f17]/90 border border-art-gold/35 shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-5">
          
          {/* STEP 1: REGISTRATION FORM */}
          {step === 'register' && (
            <>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                  Register New Account
                </span>
                <Link href="/login" className="text-xs text-art-gold hover:underline">
                  Already registered? Sign in
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

              <form onSubmit={handleInitialSubmit} className="space-y-3.5 text-xs">
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
                  <label className="block text-slate-300 mb-1.5 font-medium">Email Address (For Verification Code)</label>
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
                      className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
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
                      className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
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
                        {[1, 2, 3, 4].map((s) => (
                          <div
                            key={s}
                            className={`h-full flex-1 transition-colors duration-300 ${
                              passStrength.score >= s ? passStrength.color : 'bg-white/10'
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

                {/* High-Visibility Guaranteed Create Account Button */}
                <div className="pt-3 w-full">
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{ minHeight: '56px' }}
                    className="w-full py-4 px-6 bg-gradient-to-r from-art-gold via-amber-300 to-art-gold hover:brightness-110 active:scale-[0.99] text-art-black font-black text-sm sm:text-base uppercase tracking-widest rounded-xl transition-all shadow-[0_0_30px_rgba(212,175,55,0.7)] border-2 border-amber-200 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin text-black" />
                        <span>Creating Your Account...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-black shrink-0" />
                        <span className="font-black text-black">CREATE ACCOUNT</span>
                        <ArrowRight className="w-5 h-5 text-black shrink-0" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* STEP 2: 6-DIGIT EMAIL VERIFICATION OTP */}
          {step === 'verify_otp' && (
            <div className="space-y-5 animate-fade-in text-center">
              <div className="w-14 h-14 rounded-2xl bg-art-gold/15 border border-art-gold/40 text-art-gold flex items-center justify-center mx-auto shadow-gold-glow">
                <Mail className="w-7 h-7 animate-pulse" />
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  Check Your Inbox
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  We sent a 6-digit verification code from <span className="text-art-gold font-bold">artellium.africa</span> to:
                </p>
                <div className="font-mono text-xs font-bold text-white bg-black/60 border border-white/10 px-3 py-1.5 rounded-lg inline-block mt-2">
                  {email}
                </div>
              </div>

              {authError && (
                <div className="p-3 bg-red-950/70 border border-red-500/50 rounded-xl text-red-300 text-xs font-medium flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{authSuccess}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-2 font-mono font-bold">
                    Enter 6-Digit Passcode
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    autoFocus
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="• • • • • •"
                    className="w-full text-center bg-[#06070a] border-2 border-art-gold/50 focus:border-art-gold rounded-2xl py-3 text-2xl tracking-[12px] font-mono font-black text-art-gold focus:outline-none transition shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpCode.length < 6}
                  className="w-full py-3.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold text-art-black font-bold uppercase tracking-wider rounded-xl transition shadow-gold-glow hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Token...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Confirm & Access Marketplace</span>
                    </>
                  )}
                </button>
              </form>

              {/* Resend Code & Back Controls */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <button
                  type="button"
                  onClick={() => {
                    setStep('register');
                    setAuthError('');
                    setAuthSuccess('');
                  }}
                  className="hover:text-white transition cursor-pointer"
                >
                  ← Edit Email
                </button>

                <button
                  type="button"
                  disabled={resendTimer > 0 || isResending}
                  onClick={handleResendCode}
                  className={`font-semibold cursor-pointer ${
                    resendTimer > 0 ? 'text-slate-500 cursor-not-allowed' : 'text-art-gold hover:underline'
                  }`}
                >
                  {isResending ? 'Sending...' : resendTimer > 0 ? `Resend Code in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-4 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-emerald-glow">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white">
                Account Verified!
              </h3>
              <p className="text-xs text-slate-300">
                Welcome to Artellium Africa. Redirecting to your sovereign workspace...
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
