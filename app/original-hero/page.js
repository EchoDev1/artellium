'use client';

import React from 'react';
import HeroBanner from '@/components/HeroBanner';

export default function OriginalHeroPage() {
  return (
    <div className="space-y-6 pb-12 pt-6">
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 text-slate-400 text-xs">
        This is the preserved original hero banner layout.
      </div>
    </div>
  );
}
