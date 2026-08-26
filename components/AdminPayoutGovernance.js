'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/store-context';
import { 
  Percent, 
  Sliders, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Building, 
  ArrowRight, 
  DollarSign, 
  RefreshCw, 
  Layers, 
  Award, 
  AlertCircle, 
  BadgeCheck,
  Zap,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export default function AdminPayoutGovernance() {
  const { 
    artistPayoutPercentage = 85, 
    updateArtistPayoutPercentage,
    currency,
    sellers = [],
    commissions = []
  } = useStore();

  const [payoutInput, setPayoutInput] = useState(artistPayoutPercentage);
  const [simulationPrice, setSimulationPrice] = useState(1000000);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const platformFeePercentage = 100 - payoutInput;

  const handleApply = (e) => {
    e?.preventDefault();
    if (updateArtistPayoutPercentage) {
      updateArtistPayoutPercentage(Number(payoutInput));
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handlePresetSelect = (preset) => {
    setPayoutInput(preset);
  };

  const formatPrice = (amount) => {
    if (!amount) return '₦0';
    if (currency === 'USD') return `$${Math.round(amount / 1480).toLocaleString()}`;
    return `₦${Number(amount).toLocaleString()}`;
  };

  const simulatedArtistPayout = Math.round(simulationPrice * (payoutInput / 100));
  const simulatedPlatformFee = Math.round(simulationPrice * (platformFeePercentage / 100));

  return (
    <div className="space-y-6 font-sans text-slate-800">
      
      {/* Toast */}
      {savedSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 border-2 border-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs">
          <BadgeCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold">Artist Payout Rate Applied!</p>
            <p className="text-[10px] text-slate-300">Synchronized to {payoutInput}% across all Verified Artist portals.</p>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 sm:p-8 rounded-3xl border border-slate-700 text-white shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold tracking-widest uppercase border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>EXECUTIVE COMMISSION & ARTIST REMITTANCE GOVERNANCE</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Artist Payout Rate & Platform Commission Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Exclusively set and regulate the master artist net payout percentage. Any adjustment configured here immediately updates checkout order calculations, live auction settlements, and the verified artist studio section.
            </p>
          </div>

          <div className="p-4 bg-black/40 border border-white/10 rounded-2xl text-right shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Current Active Rate</span>
            <div className="flex items-baseline justify-end gap-1.5 mt-1">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-emerald-400">{artistPayoutPercentage}%</span>
              <span className="text-xs text-slate-400 font-mono">Net Artist Payout</span>
            </div>
            <span className="text-[10px] text-art-gold font-mono block mt-0.5">
              ({100 - artistPayoutPercentage}% Platform Retained)
            </span>
          </div>
        </div>
      </div>

      {/* Rate Controller Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Slider & Config */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="space-y-0.5">
              <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Adjust Master Payout Percentage</span>
              </h3>
              <p className="text-xs text-slate-500">
                Move the slider or enter an exact percentage between 1% and 99%.
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
              <input
                type="number"
                min="1"
                max="99"
                value={payoutInput}
                onChange={(e) => setPayoutInput(Math.max(1, Math.min(99, Number(e.target.value) || 1)))}
                className="w-12 bg-transparent text-center font-serif text-lg font-bold text-slate-900 focus:outline-none"
              />
              <span className="font-bold text-slate-500 text-sm">%</span>
            </div>
          </div>

          {/* Interactive Range Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-500">
              <span>50% (Standard Minimum)</span>
              <span className="text-emerald-700 text-sm">{payoutInput}% Selected</span>
              <span>99% (Maximum)</span>
            </div>
            <input
              type="range"
              min="50"
              max="99"
              value={payoutInput}
              onChange={(e) => setPayoutInput(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Preset Quick-Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Quick Preset Rates:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[75, 80, 85, 88, 90, 92, 95].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => handlePresetSelect(rate)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                    payoutInput === rate
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {rate}% Payout
                </button>
              ))}
            </div>
          </div>

          {/* Live Split Graph */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Revenue Distribution Breakdown:
            </span>

            <div className="h-5 w-full bg-slate-200 rounded-xl overflow-hidden flex shadow-inner">
              <div 
                style={{ width: `${payoutInput}%` }} 
                className="bg-emerald-600 text-white flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300"
              >
                Artist: {payoutInput}%
              </div>
              <div 
                style={{ width: `${platformFeePercentage}%` }} 
                className="bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300"
              >
                Platform: {platformFeePercentage}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-800">
                <div className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                <span className="font-medium">Master Artist Net Remittance: <strong>{payoutInput}%</strong></span>
              </div>
              <div className="flex items-center gap-2 text-amber-900">
                <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <span className="font-medium">Artellium Curatorial Fee: <strong>{platformFeePercentage}%</strong></span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-[11px] text-slate-500">
              ⚡ Will instantly reflect across {sellers.length || '1,200+'} master artists.
            </div>

            <button
              type="button"
              onClick={handleApply}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save & Apply Platform-Wide ({payoutInput}%)</span>
            </button>
          </div>
        </div>

        {/* Right Col: Live Simulation Matrix */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-art-gold" />
              <span>Live Transaction Settlement Simulator</span>
            </h3>
            <p className="text-xs text-slate-500">
              Test how this rate impacts artwork sale proceeds.
            </p>
          </div>

          {/* Sample Artwork Sale Input */}
          <div className="space-y-2 text-xs">
            <label className="block text-slate-700 font-bold">Simulated Masterpiece Price</label>
            <div className="grid grid-cols-3 gap-2">
              {[500000, 1000000, 2500000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSimulationPrice(amt)}
                  className={`p-2 rounded-xl text-center font-mono font-bold transition text-[11px] ${
                    simulationPrice === amt
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {formatPrice(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Simulation Outcome Cards */}
          <div className="space-y-3 text-xs font-mono">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
              <div className="flex justify-between text-emerald-800">
                <span className="text-[10px] uppercase font-bold">Master Artist Payout ({payoutInput}%)</span>
                <span className="text-[10px]">Direct Bank Remittance</span>
              </div>
              <p className="font-serif text-2xl font-bold text-emerald-700">
                {formatPrice(simulatedArtistPayout)}
              </p>
              <p className="text-[10px] text-emerald-600 font-sans">
                Transferred directly to verified artist account upon settlement.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
              <div className="flex justify-between text-amber-800">
                <span className="text-[10px] uppercase font-bold">Platform Retained ({platformFeePercentage}%)</span>
                <span className="text-[10px]">Curation & Archival</span>
              </div>
              <p className="font-serif text-2xl font-bold text-amber-800">
                {formatPrice(simulatedPlatformFee)}
              </p>
              <p className="text-[10px] text-amber-700 font-sans">
                Covers digital provenance ledger custody & physical certificate security.
              </p>
            </div>
          </div>

          {/* Compliance & Security Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-[11px]">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Artist Portal Live Sync:</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside font-sans">
              <li>Artists view their dynamic <strong>{payoutInput}%</strong> rate in Studio Analytics</li>
              <li>Calculations automatically sync on order creation & live bidding</li>
              <li>Public homepage visitors are restricted from viewing commission splits</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
