'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/context/store-context';
import { submitVerificationCode } from '@/lib/email-client';
import { Sparkles, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Mail, ArrowRight } from 'lucide-react';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, currentUser } = useStore();

  const codeParam = searchParams.get('code') || '';
  const emailParam = searchParams.get('email') || currentUser?.email || '';

  const [code, setCode] = useState(codeParam);
  const [email, setEmail] = useState(emailParam);
  const [status, setStatus] = useState('idle'); // idle, validating, success, error
  const [message, setMessage] = useState('');

  // Auto-validate if code is provided in URL query parameters
  useEffect(() => {
    if (codeParam && codeParam.length === 6) {
      handleVerify(codeParam);
    }
  }, [codeParam]);

  const handleVerify = async (codeToVerify) => {
    const targetCode = (codeToVerify || code).trim();
    if (targetCode.length !== 6) {
      setStatus('error');
      setMessage('Please enter a complete 6-digit verification code.');
      return;
    }

    setStatus('validating');
    setMessage('Verifying your sovereign credential token...');

    try {
      const res = await submitVerificationCode(email || 'collector@artellium.com', targetCode);
      if (res.success) {
        setStatus('success');
        setMessage('Your email has been verified! Redirecting...');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setStatus('error');
        setMessage(res.error || 'Invalid or expired verification token.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Network error verifying code.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07080A] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Ambient Glow */}
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
                EMAIL VERIFICATION
              </span>
            </div>
          </Link>
        </div>

        <div className="rounded-3xl bg-[#0c0f17]/90 border border-art-gold/35 shadow-2xl p-7 sm:p-9 backdrop-blur-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-art-gold/15 border border-art-gold/40 text-art-gold flex items-center justify-center mx-auto shadow-gold-glow">
            {status === 'success' ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-art-gold" />
            )}
          </div>

          <div>
            <h2 className="font-serif text-2xl font-bold text-white">
              {status === 'success' ? 'Verification Complete' : 'Verify Email Address'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Confirm your identity on <span className="text-art-gold font-bold">artellium.africa</span> to gain unrestricted access to live fine art auctions.
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
              {status === 'validating' && <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />}
              <span>{message}</span>
            </div>
          )}

          {status !== 'success' && (
            <form onSubmit={(e) => { e.preventDefault(); handleVerify(); }} className="space-y-4">
              <div>
                <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-2 font-mono font-bold">
                  6-Digit Passcode
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full text-center bg-[#06070a] border-2 border-art-gold/50 focus:border-art-gold rounded-2xl py-3 text-2xl tracking-[12px] font-mono font-black text-art-gold focus:outline-none transition shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'validating' || code.length < 6}
                className="w-full py-3.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold text-art-black font-bold uppercase tracking-wider rounded-xl transition shadow-gold-glow hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {status === 'validating' ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Activate</span>
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07080A] flex items-center justify-center text-art-gold">
        <RefreshCw className="w-6 h-6 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
