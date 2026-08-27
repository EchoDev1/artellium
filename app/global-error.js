'use client';

import React from 'react';
import { Sparkles, RefreshCw, ShieldAlert } from 'lucide-react';

export default function GlobalLayoutError({ error, reset }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07080A] text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans antialiased">
        <div className="w-full max-w-md bg-[#0c0f17] border border-amber-500/40 rounded-3xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold text-white">
              ARTELLIUM SYSTEM SENTINEL
            </h1>
            <p className="text-xs text-slate-400 mt-2">
              A temporary layout execution exception was caught. Click below to re-initialize your workspace cleanly.
            </p>
          </div>

          <button
            onClick={() => reset()}
            className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold uppercase tracking-wider rounded-xl transition shadow-lg hover:brightness-110 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Re-initialize App Workspace</span>
          </button>
        </div>
      </body>
    </html>
  );
}
