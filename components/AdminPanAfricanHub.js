'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/store-context';
import { 
  Globe, 
  MapPin, 
  Building, 
  CreditCard, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  ArrowUpRight,
  CheckCircle2,
  Percent,
  SlidersHorizontal,
  Save,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Coins,
  Check,
  Edit3
} from 'lucide-react';

export default function AdminPanAfricanHub() {
  const { 
    panAfricanRegions = [], 
    panAfricanCurrencies = {}, 
    currency, 
    setCurrency, 
    formatCurrency,
    usdExchangeRate = 1480,
    usdRateLastUpdated = 'Today',
    updateUsdExchangeRate,
    updateRegionalCurrencyRate
  } = useStore();

  const [selectedRegion, setSelectedRegion] = useState(panAfricanRegions[0] || null);
  const [rateInput, setRateInput] = useState(usdExchangeRate || 1480);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  
  // Custom Regional Currency Editing
  const [editingCurrencyCode, setEditingCurrencyCode] = useState(null);
  const [regionalRateInput, setRegionalRateInput] = useState('');

  useEffect(() => {
    if (usdExchangeRate) {
      setRateInput(usdExchangeRate);
    }
  }, [usdExchangeRate]);

  const handleSaveUsdRate = (rateVal) => {
    const target = Math.round(Number(rateVal || rateInput));
    if (!target || target < 100) {
      alert('Please enter a valid exchange rate (e.g. 1550).');
      return;
    }
    updateUsdExchangeRate(target);
    setRateInput(target);
    setSaveSuccessMsg(`✅ Daily USD rate successfully fixed at ₦${target.toLocaleString()} / $1.00 USD! All marketplace prices updated dynamically.`);
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  const handleSaveRegionalRate = (currKey) => {
    const val = Number(regionalRateInput);
    if (!val || val <= 0) {
      alert('Please enter a valid rate in Naira.');
      return;
    }
    updateRegionalCurrencyRate(currKey, val);
    setEditingCurrencyCode(null);
    setRegionalRateInput('');
    setSaveSuccessMsg(`✅ Rate for ${currKey} updated to 1 ${currKey} = ₦${val.toLocaleString()} NGN.`);
    setTimeout(() => setSaveSuccessMsg(''), 5000);
  };

  const quickPresets = [1450, 1480, 1500, 1550, 1600, 1650, 1700];

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Success Notification Toast */}
      {saveSuccessMsg && (
        <div className="p-4 bg-emerald-950/90 border-2 border-emerald-500 rounded-2xl text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-emerald-glow animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg('')} className="text-slate-400 hover:text-white ml-2">✕</button>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-mono font-bold uppercase border border-blue-200">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>CROSS-CONTINENTAL NETWORK EXPANSION & FX SETTLEMENT</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Pan-African Operations & Liquidity Hub</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Control daily USD exchange rates to shield against Naira volatility, manage regional African bureaus, and oversee live multi-currency settlement.
          </p>
        </div>

        {/* Global Currency Active Switcher */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 shrink-0 text-xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Active Platform Preview Currency</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono font-bold text-slate-900 cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(panAfricanCurrencies).map(currKey => {
              const c = panAfricanCurrencies[currKey];
              return (
                <option key={currKey} value={currKey}>
                  {c.flag} {c.name} ({c.symbol})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DAILY USD EXCHANGE RATE CONTROLLER & VOLATILITY SHIELD */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-[#10141e] text-white p-6 sm:p-8 rounded-3xl border-2 border-art-gold/40 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-art-gold/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-art-gold/20 text-art-gold border border-art-gold/40">
                <Coins className="w-5 h-5 text-art-gold animate-pulse" />
              </span>
              <span className="text-xs font-mono font-bold text-art-gold uppercase tracking-wider">
                ADMIN DAILY USD EXCHANGE RATE FIXER · VOLATILITY SHIELD
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Daily USD Currency Rate Governance
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Fix and adjust the official platform daily exchange rate. Since the Naira fluctuates constantly against the US Dollar, fixing daily rates ensures that project owners and artists <strong>never operate or sell at a loss</strong>.
            </p>
          </div>

          <div className="text-right shrink-0 bg-black/40 p-3 sm:p-4 rounded-2xl border border-white/10">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Active System Rate</span>
            <div className="font-serif text-2xl font-black text-art-gold">
              $1.00 USD = ₦{usdExchangeRate.toLocaleString()} NGN
            </div>
            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
              Last Fixed: <strong className="text-white">{usdRateLastUpdated}</strong>
            </span>
          </div>
        </div>

        {/* Interactive Rate Setter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-2">
                Set Daily Exchange Rate (Naira per $1.00 USD):
              </label>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-art-gold font-bold font-mono text-base">
                    ₦
                  </span>
                  <input
                    type="number"
                    min="500"
                    max="5000"
                    step="1"
                    value={rateInput}
                    onChange={(e) => setRateInput(e.target.value)}
                    className="w-full bg-black/60 border-2 border-art-gold/50 rounded-xl py-3 pl-9 pr-4 text-white font-mono font-bold text-lg focus:outline-none focus:border-art-gold focus:ring-2 focus:ring-art-gold/30 shadow-inner"
                    placeholder="e.g. 1550"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSaveUsdRate(rateInput)}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-art-gold to-art-gold-dark hover:from-amber-400 hover:to-amber-600 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4 text-black" />
                  <span>Fix & Save Daily Rate</span>
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-semibold">
                Quick One-Click Daily Rate Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {quickPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSaveUsdRate(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition border cursor-pointer ${
                      usdExchangeRate === preset
                        ? 'bg-art-gold text-black border-art-gold shadow-sm'
                        : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10'
                    }`}
                  >
                    ₦{preset.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Dynamic Conversion Preview Card */}
          <div className="lg:col-span-5 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
            <span className="text-[10px] font-mono text-art-gold uppercase tracking-wider font-bold block flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-art-gold" />
              <span>Real-Time Catalog Price Recalculation Preview</span>
            </span>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 bg-black/40 rounded-lg border border-white/5">
                <span className="text-slate-300">Standard Artwork (₦1,000,000):</span>
                <span className="font-bold text-art-gold text-sm">
                  ${Math.round(1000000 / (usdExchangeRate || 1480)).toLocaleString()} USD
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-black/40 rounded-lg border border-white/5">
                <span className="text-slate-300">Bronze Sculpture (₦3,500,000):</span>
                <span className="font-bold text-emerald-400 text-sm">
                  ${Math.round(3500000 / (usdExchangeRate || 1480)).toLocaleString()} USD
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-black/40 rounded-lg border border-white/5">
                <span className="text-slate-300">Royal Heirloom (₦15,000,000):</span>
                <span className="font-bold text-purple-400 text-sm">
                  ${Math.round(15000000 / (usdExchangeRate || 1480)).toLocaleString()} USD
                </span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-tight">
              ✓ All products in Marketplace, Flash Sales, Live Auctions, Cart Drawer, and Checkout dynamically update immediately with zero code changes.
            </p>
          </div>
        </div>
      </div>

      {/* Regional Bureau Hubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {panAfricanRegions.map((region) => (
          <div
            key={region.code}
            className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md cursor-pointer ${
              selectedRegion?.code === region.code
                ? 'bg-blue-50/60 border-blue-400 ring-2 ring-blue-300'
                : 'bg-white border-slate-200'
            }`}
            onClick={() => setSelectedRegion(region)}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{region.flag}</span>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900">{region.name}</h3>
                    <span className="text-[11px] text-slate-500 font-mono">{region.currency} Bureau</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  region.status.includes('HQ') ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {region.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <p className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="font-semibold text-slate-800">{region.hub}</span>
                </p>
                <p className="flex items-center gap-1.5 font-mono text-[11px]">
                  <Percent className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Regional VAT Rate: <strong className="text-slate-900">{region.taxRate}%</strong></span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-4 mt-4 border-t border-slate-100 text-xs font-mono">
              <div className="p-2 bg-slate-50 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase block">Artists</span>
                <span className="font-bold text-slate-800">{region.artistsCount} Masters</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase block">Patrons</span>
                <span className="font-bold text-slate-800">{region.activeCollectors}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Multi-Currency Exchange Rates Matrix */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Live Pan-African FX Settlement Grid (Base: ₦1,000,000 NGN)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>● Real-Time Multi-Currency Rates Synchronized</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {Object.keys(panAfricanCurrencies).map(currKey => {
            const c = panAfricanCurrencies[currKey];
            const isUsd = currKey === 'USD';
            const isEditing = editingCurrencyCode === currKey;
            const currentEquivalentInNgn = c.rate > 0 ? Math.round(1 / c.rate) : 1;

            return (
              <div key={currKey} className={`p-4 rounded-2xl border transition space-y-2 ${
                isUsd ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-200' : 'bg-slate-50 border-slate-200/80'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-base">{c.flag}</span>
                    <span>{c.code}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{c.country}</span>
                </div>

                <div className="font-serif text-xl font-bold text-slate-900 pt-1">
                  {formatCurrency(1000000, currKey)}
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>1 {c.code} equals:</span>
                    <strong className="text-slate-900 font-bold">₦{currentEquivalentInNgn.toLocaleString()} NGN</strong>
                  </div>

                  {isUsd ? (
                    <span className="text-[10px] text-amber-800 font-bold block bg-amber-100/70 px-2 py-0.5 rounded text-center">
                      Controlled via USD Rate Fixer Above
                    </span>
                  ) : isEditing ? (
                    <div className="space-y-1 pt-1">
                      <input
                        type="number"
                        placeholder="Naira equivalent"
                        value={regionalRateInput}
                        onChange={(e) => setRegionalRateInput(e.target.value)}
                        className="w-full bg-white border border-blue-400 rounded-lg p-1.5 text-xs text-slate-900 font-bold focus:outline-none"
                      />
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleSaveRegionalRate(currKey)}
                          className="flex-1 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => { setEditingCurrencyCode(null); setRegionalRateInput(''); }}
                          className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCurrencyCode(currKey);
                        setRegionalRateInput(currentEquivalentInNgn.toString());
                      }}
                      className="w-full py-1 rounded bg-slate-200/60 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-slate-500" />
                      <span>Adjust {currKey} Rate</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

