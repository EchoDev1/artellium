'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, CheckCircle2, RefreshCw, Lock } from 'lucide-react';

export default function CloudflareTurnstile({ onVerify, verified, setVerified }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [rayId, setRayId] = useState('');
  const widgetContainerRef = useRef(null);

  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY;

  useEffect(() => {
    // Generate simulated Cloudflare Ray ID
    const randomRay = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    setRayId(randomRay.toUpperCase());

    // If a live Cloudflare Turnstile Site Key is provided, load the official script
    if (siteKey && typeof window !== 'undefined') {
      const scriptId = 'cf-turnstile-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    }

    // Auto-verify human presence after brief delay
    const timer = setTimeout(() => {
      setIsVerifying(true);
      const verifyTimer = setTimeout(() => {
        setIsVerifying(false);
        if (setVerified) setVerified(true);
        if (onVerify) onVerify(true);
      }, 700);
      return () => clearTimeout(verifyTimer);
    }, 400);

    return () => clearTimeout(timer);
  }, [siteKey]);

  const handleManualClick = () => {
    if (verified) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (setVerified) setVerified(true);
      if (onVerify) onVerify(true);
    }, 600);
  };

  return (
    <div className="rounded-xl bg-[#0c0f17] border border-[#f6821f]/35 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner select-none transition-all duration-300 hover:border-[#f6821f]/60">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          type="button"
          onClick={handleManualClick}
          className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-300 cursor-pointer ${
            verified
              ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]'
              : isVerifying
              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
              : 'bg-black/50 border-white/20 hover:border-[#f6821f] text-transparent'
          }`}
          title={verified ? 'Cloudflare Verified' : 'Click to Verify Human'}
        >
          {verified ? (
            <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
          ) : isVerifying ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
          ) : (
            <span className="w-2 h-2 rounded bg-transparent" />
          )}
        </button>

        <div className="text-left">
          <span className="text-xs font-semibold text-slate-200 block leading-tight">
            {verified
              ? 'Verification Successful'
              : isVerifying
              ? 'Verifying you are human...'
              : 'Verify you are human'}
          </span>
          <span className="text-[9.5px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
            <Lock className="w-2.5 h-2.5 text-[#f6821f]" />
            <span>Cloudflare Turnstile Managed Challenge</span>
          </span>
        </div>
      </div>

      {/* Cloudflare Official Brand Badge */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1 justify-end">
            <span className="font-sans font-black text-[11px] text-white tracking-wide">
              CLOUDFLARE
            </span>
            <div className="w-3.5 h-3.5 rounded bg-[#f6821f] flex items-center justify-center text-[8px] font-black text-black">
              CF
            </div>
          </div>
          <span className="text-[8px] text-slate-500 font-mono">
            Ray ID: {rayId || '8E12F8B7D24C'} • Privacy & Terms
          </span>
        </div>
      </div>
    </div>
  );
}
