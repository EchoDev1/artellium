'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/context/store-context';
import CloudflareTurnstile from '@/components/CloudflareTurnstile';
import { Sparkles, KeyRound, CheckCircle2, AlertCircle, RefreshCw, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { usersList, updateUser } = useStore();

  const codeParam = searchParams.get('code') || '';
  const emailParam = searchParams.get('email') || '';

  const [code, setCode] = useState(codeParam);
  const [email, setEmail] = useState(emailParam);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [cloudflareVerified, setCloudflareVerified] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, processing, success, error
  const [message, setMessage] = useState('');

  const handlePasswordReset = (e) => {
    e.preventDefault();
    setMessage('');

    if (!code || code.trim().length !== 6) {
      setStatus('error');
      setMessage('Please enter a valid 6-digit recovery code.');
      return;
    }

    if (newPassword.length < 6) {
      setStatus('error');
      setMessage('Password must contain at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setStatus('processing');

    setTimeout(() => {
      // Find matching user or update target user in list
      const targetUser = usersList.find(u => u.email.toLowerCase() === email.toLowerCase()) || usersList[0];
      if (targetUser) {
        updateUser(targetUser.id, { password: newPassword });
      }

      setStatus('success');
      setMessage('Password successfully reset! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#07080A] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-art-gold/10 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
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
                PASSWORD RESET
              </span>
            </div>
          </Link>
        </div>

        <div className="rounded-3xl bg-[#0c0f17]/90 border border-art-gold/35 shadow-2xl p-7 sm:p-9 backdrop-blur-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-art-gold/15 border border-art-gold/40 text-art-gold flex items-center justify-center mx-auto shadow-gold-glow">
            <KeyRound className="w-8 h-8 text-art-gold" />
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-white">
              Set New Password
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your recovery code and choose a new secure password for <span className="text-art-gold font-bold">artellium.africa</span>.
            </p>
          </div>

          {message && (
            <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center justify-center gap-2 ${
              status === 'success' ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-300' :
              status === 'error' ? 'bg-red-950/70 border border-red-500/50 text-red-300' :
              'bg-blue-950/70 border border-blue-500/50 text-blue-300'
            }`}>
              {status === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {status === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
              {status === 'processing' && <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />}
              <span>{message}</span>
            </div>
          )}

          {status !== 'success' && (
            <form onSubmit={handlePasswordReset} className="space-y-4 text-left text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Registered Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. collector@artellium.com"
                  className="w-full bg-[#06070a] border border-white/15 rounded-xl py-2.5 px-3.5 text-white placeholder-slate-500 focus:border-art-gold focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">6-Digit Recovery Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="892415"
                  className="w-full bg-[#06070a] border border-white/15 rounded-xl py-2.5 px-3.5 text-white font-mono tracking-widest text-center text-lg focus:border-art-gold focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Confirm New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#06070a] border border-white/15 rounded-xl py-2.5 px-3.5 text-white placeholder-slate-500 focus:border-art-gold focus:outline-none transition font-mono"
                />
              </div>

              <CloudflareTurnstile
                verified={cloudflareVerified}
                setVerified={setCloudflareVerified}
              />

              <button
                type="submit"
                disabled={status === 'processing' || !newPassword || !code}
                className="w-full py-3.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold text-art-black font-bold uppercase tracking-wider rounded-xl transition shadow-gold-glow hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {status === 'processing' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Reset & Secure Password</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-white/10 text-xs text-slate-400">
            <Link href="/login" className="text-art-gold hover:underline font-semibold flex items-center justify-center gap-1">
              <span>Return to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07080A] flex items-center justify-center text-art-gold">
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
