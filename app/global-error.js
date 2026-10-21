'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function GlobalLayoutError({ error, reset }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07080A] text-slate-100 min-h-screen flex items-center justify-center p-4 font-sans antialiased">
        <div className="w-full max-w-md bg-[#0c0f17] border border-white/10 rounded-2xl p-8 text-center space-y-5">
          <h1 className="font-serif text-xl font-bold text-white">Application Notice</h1>
          <p className="text-xs text-slate-400">
            A temporary layout loading issue occurred. Click below to refresh.
          </p>
          <button
            onClick={() => reset ? reset() : window.location.reload()}
            className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase text-xs tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Application</span>
          </button>
        </div>
      </body>
    </html>
  );
}
