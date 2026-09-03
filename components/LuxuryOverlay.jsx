'use client';

import React from 'react';

/**
 * AfricanLuxuryDivider
 * Returns null on the server — only renders after the browser mounts,
 * which completely prevents any hydration mismatch.
 */
export default function LuxuryOverlay() {
  return (
    <div className="w-full overflow-hidden my-0 select-none" aria-hidden="true" suppressHydrationWarning>

      {/* ── TOP KENTE RIBBON (Compact & Mobile-Responsive) ───────────── */}
      <div className="relative w-full h-[28px] sm:h-[36px] bg-[#07080A] flex flex-col justify-center overflow-hidden">
        {/* Kente SVG stripe band */}
        <svg
          viewBox="0 0 1200 36"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base black bar */}
          <rect width="1200" height="36" fill="#07080A" />

          {/* Dark-green wide bands */}
          <rect y="5" width="1200" height="9" fill="#062319" />
          <rect y="22" width="1200" height="9" fill="#062319" />

          {/* Gold thin stripes on green bands */}
          <rect y="5" width="1200" height="1.5" fill="#D4AF37" />
          <rect y="13" width="1200" height="1" fill="#D4AF37" />
          <rect y="22" width="1200" height="1" fill="#D4AF37" />
          <rect y="30" width="1200" height="1.5" fill="#D4AF37" />

          {/* Crimson accent line */}
          <rect y="16.5" width="1200" height="3" fill="#8B0000" />

          {/* Kente diamond repeat */}
          {Array.from({ length: 40 }).map((_, i) => {
            const x = i * 30 + 15;
            return (
              <g key={i} transform={`translate(${x}, 18)`}>
                <polygon points="0,-5 4.5,0 0,5 -4.5,0" fill="#D4AF37" opacity="0.9" />
                <rect x="-1.5" y="-1.5" width="3" height="3" fill="#07080A" />
              </g>
            );
          })}

          {/* Vertical separators */}
          {Array.from({ length: 20 }).map((_, i) => (
            <rect
              key={`v${i}`}
              x={i * 60 + 59}
              y="0"
              width="1.5"
              height="36"
              fill="#D4AF37"
              opacity="0.2"
            />
          ))}
        </svg>

        {/* Gold shimmer overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent pointer-events-none" />
      </div>

      {/* ── EMERALD GREEN HERITAGE STATEMENT BAR (Compact & Mobile-Optimized) ─ */}
      <div className="relative w-full bg-gradient-to-r from-[#062319] via-[#0F3D2E] to-[#062319] py-2 sm:py-3 px-3 sm:px-4 flex items-center justify-center gap-2 sm:gap-6 border-y border-[#D4AF37]/40 overflow-hidden">
        {/* Subtle background adinkra-like circle pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="adinkra-circle" width="48" height="48" patternUnits="userSpaceOnUse">
              <circle cx="24" cy="24" r="16" stroke="#D4AF37" strokeWidth="1.2" fill="none" />
              <circle cx="24" cy="24" r="9" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
              <circle cx="24" cy="24" r="3" fill="#D4AF37" />
              <line x1="24" y1="8" x2="24" y2="40" stroke="#D4AF37" strokeWidth="0.8" />
              <line x1="8" y1="24" x2="40" y2="24" stroke="#D4AF37" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#adinkra-circle)" />
        </svg>

        {/* Left ornament (hidden on ultra-small mobile, subtle on sm) */}
        <div className="hidden xs:flex items-center gap-1 sm:gap-1.5 shrink-0">
          <div className="w-4 sm:w-10 h-[1px] bg-[#D4AF37]/60" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
          <div className="w-2 sm:w-6 h-[1px] bg-[#D4AF37]/60" />
        </div>

        {/* Central text */}
        <div className="text-center relative z-10 px-1">
          <p className="font-serif text-[10px] sm:text-xs tracking-[0.18em] sm:tracking-[0.3em] uppercase text-[#D4AF37] font-semibold leading-tight">
            Rooted in Heritage · Forged in Excellence
          </p>
          <p className="text-[8.5px] sm:text-[10px] text-emerald-300/75 tracking-wider sm:tracking-widest uppercase mt-0.5 font-sans">
            African Fine Art · Authenticated · Immutable
          </p>
        </div>

        {/* Right ornament (hidden on ultra-small mobile, subtle on sm) */}
        <div className="hidden xs:flex items-center gap-1 sm:gap-1.5 shrink-0">
          <div className="w-2 sm:w-6 h-[1px] bg-[#D4AF37]/60" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
          <div className="w-4 sm:w-10 h-[1px] bg-[#D4AF37]/60" />
        </div>
      </div>

      {/* ── BOTTOM KENTE RIBBON (Compact) ────────────────────────────── */}
      <div className="relative w-full h-[10px] sm:h-[12px] bg-[#07080A] overflow-hidden">
        <svg
          viewBox="0 0 1200 12"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="1200" height="12" fill="#07080A" />
          <rect y="2" width="1200" height="3" fill="#062319" />
          <rect y="7" width="1200" height="3" fill="#062319" />
          <rect y="2" width="1200" height="0.8" fill="#D4AF37" />
          <rect y="5.5" width="1200" height="1" fill="#8B0000" />
          <rect y="7" width="1200" height="0.8" fill="#D4AF37" />
          <rect y="9.5" width="1200" height="0.8" fill="#D4AF37" />
        </svg>
      </div>

    </div>
  );
}
