'use client';

import React, { useState } from 'react';
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
  SlidersHorizontal
} from 'lucide-react';

export default function AdminPanAfricanHub() {
  const { 
    panAfricanRegions = [], 
    panAfricanCurrencies = {}, 
    currency, 
    setCurrency, 
    formatCurrency 
  } = useStore();

  const [selectedRegion, setSelectedRegion] = useState(panAfricanRegions[0] || null);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-mono font-bold uppercase border border-blue-200">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>CROSS-CONTINENTAL NETWORK EXPANSION</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Pan-African Operations & Liquidity Hub</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Monitor regional bureaus across 9 African nations, oversee real-time multi-currency conversion rates, and manage local VAT/withholding tax protocols.
          </p>
        </div>

        {/* Global Currency Active Switcher */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 shrink-0 text-xs">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Active Platform Currency</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono font-bold text-slate-900 cursor-pointer shadow-sm"
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
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Live Pan-African FX Settlement Grid (Base: ₦1,000,000 NGN)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-600 font-bold">
            ● Real-Time Settlement Feeds Synchronized
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          {Object.keys(panAfricanCurrencies).map(currKey => {
            const c = panAfricanCurrencies[currKey];
            return (
              <div key={currKey} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>{c.flag}</span>
                    <span>{c.code}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{c.country}</span>
                </div>
                <div className="font-serif text-lg font-bold text-slate-900 pt-1">
                  {formatCurrency(1000000, currKey)}
                </div>
                <span className="text-[10px] text-slate-400 block truncate">
                  Rate: 1 NGN = {c.rate.toFixed(4)} {c.code}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
