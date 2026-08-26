'use client';

import React from 'react';

export default function VerificationBadge({ badge }) {
  if (!badge) return null;

  const configs = {
    gold: {
      text: '👑 ARTELLIUM GOLD',
      className: 'bg-art-gold text-art-black border border-art-gold-dark',
    },
    heritage: {
      text: '🏆 HERITAGE CERTIFIED',
      className: 'bg-amber-600 text-white border border-amber-700',
    },
    verified: {
      text: '✅ VERIFIED ARTIST',
      className: 'bg-emerald-600 text-white border border-emerald-700',
    },
  };

  const config = configs[badge];
  if (!config) return null;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${config.className}`}
    >
      {config.text}
    </span>
  );
}
