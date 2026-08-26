'use client';

import React from 'react';
import HeroBanner from '@/components/HeroBanner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function OriginalHeroPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-art-gold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 text-slate-400 text-xs">
        This is the preserved original hero banner layout.
      </div>
    </div>
  );
}
