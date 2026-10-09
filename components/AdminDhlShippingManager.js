'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/store-context';
import { 
  Truck, 
  Globe, 
  DollarSign, 
  ShieldCheck, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ExternalLink,
  Package,
  Layers,
  Sparkles,
  Zap,
  Building,
  Key,
  Shield,
  FileCheck
} from 'lucide-react';
import { WORLD_COUNTRIES, SHIPPING_ZONES, INITIAL_SHIPPING_SETTINGS, calculateDhlShippingRate } from '@/lib/dhl-shipping';

export default function AdminDhlShippingManager() {
  const { 
    shippingSettings, 
    updateShippingSettings, 
    usdExchangeRate = 1480,
    formatCurrency 
  } = useStore();

  const cfg = shippingSettings || INITIAL_SHIPPING_SETTINGS;

  // Local state for editing zone base rates
  const [zoneRates, setZoneRates] = useState({
    domestic_ng: cfg.zoneRates?.domestic_ng || 35000,
    west_africa: cfg.zoneRates?.west_africa || 85000,
    east_africa: cfg.zoneRates?.east_africa || 110000,
    central_africa: cfg.zoneRates?.central_africa || 120000,
    southern_africa: cfg.zoneRates?.southern_africa || 130000,
    north_africa: cfg.zoneRates?.north_africa || 145000,
    uk_europe: cfg.zoneRates?.uk_europe || 175000,
    north_america: cfg.zoneRates?.north_america || 195000,
    middle_east: cfg.zoneRates?.middle_east || 185000,
    asia_pacific: cfg.zoneRates?.asia_pacific || 220000,
    latin_america: cfg.zoneRates?.latin_america || 240000,
    rest_of_world: cfg.zoneRates?.rest_of_world || 260000
  });

  // Local state for DHL Plugin Credentials
  const [pluginConfig, setPluginConfig] = useState({
    pluginEnabled: cfg.pluginEnabled !== false,
    pricingMode: cfg.pricingMode || 'admin_managed',
    carrierName: cfg.carrierName || 'DHL Express Fine Art',
    dhlAccountNumber: cfg.dhlAccountNumber || 'DHL-AFR-8849201',
    dhlApiKey: cfg.dhlApiKey || '',
    dhlApiSecret: cfg.dhlApiSecret || '',
    dhlApiEnvironment: cfg.dhlApiEnvironment || 'sandbox',
    dhlDefaultDispatchHub: cfg.dhlDefaultDispatchHub || 'Lagos Atelier Central Hub, Nigeria (Artellium HQ)',
    freeShippingThresholdNGN: cfg.freeShippingThresholdNGN || 0,
    standaloneCratingFeeNGN: cfg.standaloneCratingFeeNGN || 25000,
    insuranceRatePercent: cfg.insuranceRatePercent || 1.5
  });

  // Local state for Per-Country Custom Overrides
  const [countryOverrides, setCountryOverrides] = useState(cfg.countryOverrides || {
    NG: 35000,
    GH: 75000,
    GB: 175000,
    US: 195000,
    ZA: 130000,
    AE: 185000
  });

  // New Override Form State
  const [selectedCountryToAdd, setSelectedCountryToAdd] = useState('US');
  const [overridePriceInput, setOverridePriceInput] = useState(200000);
  const [countryFilterText, setCountryFilterText] = useState('');
  const [testSimulatorCountry, setTestSimulatorCountry] = useState('US');
  const [saveToastMsg, setSaveToastMsg] = useState('');

  const formatPriceNgn = (amount) => `₦${Number(amount || 0).toLocaleString()}`;
  const formatPriceUsd = (amount) => `$${Math.round(Number(amount || 0) / (usdExchangeRate || 1480)).toLocaleString()}`;

  const handleZoneRateChange = (zoneId, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setZoneRates(prev => ({ ...prev, [zoneId]: num }));
  };

  const handleAddCountryOverride = (e) => {
    e.preventDefault();
    if (!selectedCountryToAdd || overridePriceInput <= 0) return;
    setCountryOverrides(prev => ({
      ...prev,
      [selectedCountryToAdd]: Number(overridePriceInput)
    }));
    const country = WORLD_COUNTRIES.find(c => c.code === selectedCountryToAdd);
    setSaveToastMsg(`Custom delivery rate for ${country?.name || selectedCountryToAdd} set to ${formatPriceNgn(overridePriceInput)}! Click "Save & Apply Rates" to persist.`);
    setTimeout(() => setSaveToastMsg(''), 4000);
  };

  const handleRemoveCountryOverride = (countryCode) => {
    setCountryOverrides(prev => {
      const copy = { ...prev };
      delete copy[countryCode];
      return copy;
    });
  };

  const handleSaveAllSettings = () => {
    const updated = {
      ...cfg,
      ...pluginConfig,
      zoneRates,
      countryOverrides
    };
    updateShippingSettings(updated);
    setSaveToastMsg('✅ All DHL Delivery Prices & Plugin Settings successfully saved and applied to Checkout site-wide!');
    setTimeout(() => setSaveToastMsg(''), 5000);
  };

  const handleResetToBaseline = () => {
    if (confirm('Reset all shipping rates and zones to DHL baseline recommended pricing?')) {
      setZoneRates(INITIAL_SHIPPING_SETTINGS.zoneRates);
      setCountryOverrides(INITIAL_SHIPPING_SETTINGS.countryOverrides);
      setPluginConfig({
        pluginEnabled: true,
        pricingMode: 'admin_managed',
        carrierName: 'DHL Express Fine Art',
        dhlAccountNumber: 'DHL-AFR-8849201',
        dhlApiKey: '',
        dhlApiSecret: '',
        dhlApiEnvironment: 'sandbox',
        dhlDefaultDispatchHub: 'Lagos Atelier Central Hub, Nigeria (Artellium HQ)',
        freeShippingThresholdNGN: 0,
        standaloneCratingFeeNGN: 25000,
        insuranceRatePercent: 1.5
      });
      updateShippingSettings(INITIAL_SHIPPING_SETTINGS);
      setSaveToastMsg('🔄 Reverted to default DHL recommended baseline rates.');
      setTimeout(() => setSaveToastMsg(''), 4000);
    }
  };

  // Test Simulator Quote
  const simulatorQuote = calculateDhlShippingRate(testSimulatorCountry, 1500000, 1, {
    ...cfg,
    ...pluginConfig,
    zoneRates,
    countryOverrides
  });

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Toast Notification */}
      {saveToastMsg && (
        <div className="p-4 bg-emerald-950/90 border-2 border-emerald-500 rounded-2xl text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-emerald-glow animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{saveToastMsg}</span>
          </div>
          <button onClick={() => setSaveToastMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#171A21] via-[#1E232E] to-[#171A21] rounded-3xl border border-art-gold/30 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-mono">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Truck className="w-5 h-5 text-amber-400 animate-pulse" />
              </span>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                DHL EXPRESS FINE ART LOGISTICS & DELIVERY PRICING ENGINE
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Global Shipping & Custom Country Pricing Manager
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Administrators have complete, sovereign control over delivery pricing. Set base rates per continental zone, specify granular custom prices for any country, configure DHL Express API integration, and govern archival packaging surcharges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleResetToBaseline}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/10 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Baseline</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAllSettings}
              className="px-5 py-2.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold-dark hover:brightness-110 text-art-black rounded-xl text-xs font-bold uppercase tracking-wider transition shadow-gold-glow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Delivery Rates</span>
            </button>
          </div>
        </div>

        {/* Quick Telemetry Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
            <span className="text-slate-400 text-[10px] block font-mono uppercase">Global Zones Configured</span>
            <span className="text-white font-bold text-base">{SHIPPING_ZONES.length} Regional Zones</span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
            <span className="text-slate-400 text-[10px] block font-mono uppercase">Sovereign Countries</span>
            <span className="text-white font-bold text-base">{WORLD_COUNTRIES.length} Countries</span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
            <span className="text-slate-400 text-[10px] block font-mono uppercase">Custom Country Overrides</span>
            <span className="text-amber-400 font-bold text-base">{Object.keys(countryOverrides).length} Active Rates</span>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
            <span className="text-slate-400 text-[10px] block font-mono uppercase">Pricing Control Mode</span>
            <span className="text-emerald-400 font-bold text-base">
              {pluginConfig.pricingMode === 'admin_managed' ? 'Admin Dashboard' : 'DHL Live API'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: REGIONAL ZONE BASE DELIVERY PRICES */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-600" />
              <span>Continental Zone Base Delivery Rates (Admin Managed)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These rates apply automatically to all countries in each respective zone unless a specific country override is configured.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold text-slate-500">Fixed USD Rate:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono text-xs font-bold">
              ₦{usdExchangeRate.toLocaleString()} / $1.00
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHIPPING_ZONES.map((zone) => {
            const currentPrice = zoneRates[zone.id] !== undefined ? zoneRates[zone.id] : zone.defaultPriceNGN;
            return (
              <div 
                key={zone.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-amber-400 transition bg-slate-50/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-serif text-sm font-bold text-slate-900">{zone.name}</h4>
                    <span className="text-[11px] text-amber-700 font-mono font-semibold block">{zone.estimatedDays}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono font-bold shrink-0">
                    {zone.id}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                  {zone.description}
                </p>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-mono text-slate-500 uppercase font-semibold">Delivery Price (NGN)</label>
                    <div className="relative mt-0.5">
                      <span className="absolute left-2.5 top-2 text-xs font-bold text-slate-500">₦</span>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={currentPrice}
                        onChange={(e) => handleZoneRateChange(zone.id, e.target.value)}
                        className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  </div>

                  <div className="text-right shrink-0 pt-3">
                    <span className="text-[10px] text-slate-400 block font-mono">USD Eqv:</span>
                    <span className="text-xs font-mono font-bold text-emerald-700">
                      {formatPriceUsd(currentPrice)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: PER-COUNTRY CUSTOM DELIVERY PRICE OVERRIDES */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>Specific Country Delivery Price Overrides</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any specific country from the worldwide directory to set an explicit custom delivery price that supersedes the regional zone default.
            </p>
          </div>

          <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-full text-xs font-mono font-bold">
            {Object.keys(countryOverrides).length} Active Country Overrides
          </span>
        </div>

        {/* Add New Country Override Form */}
        <form onSubmit={handleAddCountryOverride} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Country from Directory *</label>
            <select
              value={selectedCountryToAdd}
              onChange={(e) => setSelectedCountryToAdd(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
            >
              {WORLD_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.code}) - {c.region}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">Custom Delivery Rate (NGN) *</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-500">₦</span>
              <input
                type="number"
                min="0"
                step="1000"
                required
                value={overridePriceInput}
                onChange={(e) => setOverridePriceInput(e.target.value)}
                className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                placeholder="e.g. 195000"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Set Country Price</span>
            </button>
          </div>
        </form>

        {/* Active Overrides Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Active Country Rate Overrides
            </span>
            <div className="w-64 relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={countryFilterText}
                onChange={(e) => setCountryFilterText(e.target.value)}
                placeholder="Filter overrides..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-600"
              />
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-500 font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Country</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Regional Zone</th>
                  <th className="py-3 px-4">Custom Delivery Price (NGN)</th>
                  <th className="py-3 px-4">USD Eqv</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {Object.entries(countryOverrides)
                  .filter(([code]) => {
                    if (!countryFilterText) return true;
                    const c = WORLD_COUNTRIES.find(item => item.code === code);
                    return code.toLowerCase().includes(countryFilterText.toLowerCase()) ||
                           (c && c.name.toLowerCase().includes(countryFilterText.toLowerCase()));
                  })
                  .map(([code, price]) => {
                    const country = WORLD_COUNTRIES.find(c => c.code === code) || { name: code, flag: '🌐', zone: 'unknown' };
                    const zoneObj = SHIPPING_ZONES.find(z => z.id === country.zone);
                    return (
                      <tr key={code} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                          <span className="text-lg">{country.flag}</span>
                          <span>{country.name}</span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-600">{code}</td>
                        <td className="py-3 px-4 text-slate-500 font-sans">{zoneObj?.name || country.zone}</td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-700">
                          {formatPriceNgn(price)}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-emerald-700">
                          {formatPriceUsd(price)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveCountryOverride(code)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                            title="Remove custom override and revert to zone default"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 3: DHL DELIVERY PLUGIN INTEGRATION & CREDENTIALS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span>DHL Express Fine Art Delivery Plugin Configuration</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Connect Artellium with official DHL Express accounts. Choose whether to rely on Admin Dashboard prices or live DHL Express API rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Pricing Mode Toggle */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">Pricing Engine Mode *</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPluginConfig({ ...pluginConfig, pricingMode: 'admin_managed' })}
                className={`p-4 rounded-2xl border-2 text-left space-y-1 transition cursor-pointer ${
                  pluginConfig.pricingMode === 'admin_managed'
                    ? 'border-amber-600 bg-amber-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Admin Managed</span>
                  {pluginConfig.pricingMode === 'admin_managed' && (
                    <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Admin has 100% control over prices entered above. Collectors pay exactly what admin sets.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPluginConfig({ ...pluginConfig, pricingMode: 'dhl_api_live' })}
                className={`p-4 rounded-2xl border-2 text-left space-y-1 transition cursor-pointer ${
                  pluginConfig.pricingMode === 'dhl_api_live'
                    ? 'border-amber-600 bg-amber-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">DHL Express API</span>
                  {pluginConfig.pricingMode === 'dhl_api_live' && (
                    <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Fetches dynamic live quotes from DHL Express servers with Admin rates as guaranteed fallback.
                </p>
              </button>
            </div>
          </div>

          {/* DHL Account Number */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">DHL Account Number (Contract Number) *</label>
            <input
              type="text"
              value={pluginConfig.dhlAccountNumber}
              onChange={(e) => setPluginConfig({ ...pluginConfig, dhlAccountNumber: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600"
              placeholder="e.g. DHL-AFR-8849201"
            />
            <p className="text-[11px] text-slate-400">
              Corporate DHL Express account used for automated air waybill generation and billing.
            </p>
          </div>

          {/* Dispatch Hub Atelier */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">Primary DHL Consignment Origin Hub</label>
            <select
              value={pluginConfig.dhlDefaultDispatchHub}
              onChange={(e) => setPluginConfig({ ...pluginConfig, dhlDefaultDispatchHub: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
            >
              <option value="Lagos Atelier Central Hub, Nigeria (Artellium HQ)">Lagos Atelier Central Hub, Nigeria (Artellium HQ)</option>
              <option value="Accra Curatorial Bureau, Ghana">Accra Curatorial Bureau, Ghana</option>
              <option value="Nairobi East Africa Desk, Kenya">Nairobi East Africa Desk, Kenya</option>
              <option value="Johannesburg Regional Bureau, South Africa">Johannesburg Regional Bureau, South Africa</option>
              <option value="Cairo Nile Gallery & Foundry, Egypt">Cairo Nile Gallery & Foundry, Egypt</option>
            </select>
          </div>

          {/* Free Shipping Threshold */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Free Global Shipping Threshold (0 to disable)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-xs font-bold text-slate-500">₦</span>
              <input
                type="number"
                min="0"
                step="500000"
                value={pluginConfig.freeShippingThresholdNGN}
                onChange={(e) => setPluginConfig({ ...pluginConfig, freeShippingThresholdNGN: Number(e.target.value) })}
                className="w-full pl-7 pr-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                placeholder="e.g. 15000000 (Free for high-value orders)"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Orders matching or exceeding this amount automatically receive free insured worldwide delivery.
            </p>
          </div>

        </div>
      </div>

      {/* SECTION 4: LIVE RATE SIMULATOR */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 text-white space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-art-gold" />
              <span>Checkout Live Rate Simulator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verify what collectors from any country in the world will see at checkout with your currently configured delivery rates.
            </p>
          </div>

          <div className="w-64">
            <select
              value={testSimulatorCountry}
              onChange={(e) => setTestSimulatorCountry(e.target.value)}
              className="w-full bg-slate-800 border border-art-gold/40 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-art-gold"
            >
              {WORLD_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name} ({c.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Destination Country:</span>
            <span className="font-bold text-sm text-white mt-1 block">
              {simulatorQuote.country.flag} {simulatorQuote.country.name}
            </span>
            <span className="text-[11px] text-slate-400">{simulatorQuote.country.region}</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Delivery Carrier & Service:</span>
            <span className="font-bold text-sm text-amber-400 mt-1 block">
              {simulatorQuote.carrier}
            </span>
            <span className="text-[11px] text-slate-400">{simulatorQuote.estimatedDays}</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Calculated Delivery Price (NGN):</span>
            <span className="font-serif text-2xl font-bold text-art-gold mt-1 block">
              {simulatorQuote.isFreeShipping ? 'FREE' : formatPriceNgn(simulatorQuote.priceNGN)}
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">
              ≈ {formatPriceUsd(simulatorQuote.priceNGN)} USD
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Packaging & Crating:</span>
            <span className="font-bold text-sm text-emerald-400 mt-1 block">
              Museum Timber Crate
            </span>
            <span className="text-[11px] text-slate-400">Dual Shock Sensors Included</span>
          </div>
        </div>
      </div>

    </div>
  );
}
