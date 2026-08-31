'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/store-context';
import VerificationBadge from '@/components/VerificationBadge';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Trash2,
  RefreshCw,
  Zap,
  Package,
  ShieldCheck,
  Award,
  DollarSign,
  Search,
  Filter,
  Plus,
  Eye,
  TrendingUp,
  Tag
} from 'lucide-react';

export default function AdminDemoTransitionSuite() {
  const {
    artworks = [],
    realArtworks = [],
    demoTransitionMode = 'progressive',
    setDemoTransitionMode,
    purgeAllDemoArtworks,
    restoreDemoArtworks,
    updateArtwork,
    deleteArtwork,
    setArtworkStatusSold,
    addArtwork,
    realArtworksCount = 0,
    demoArtworksCount = 0,
    realSoldArtworksCount = 0,
    formatCurrency
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, real, demo, sold
  const [isQuickAddModalOpen, setIsQuickAddModalOpen] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  const [quickArtForm, setQuickArtForm] = useState({
    title: '',
    artistName: 'Ebuka Eke Echo',
    category: 'Painters',
    medium: 'Oil on Canvas',
    dimensions: '120 x 90 cm',
    price: 1500000,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000',
    description: 'Masterpiece created with cultural depth and authentic pigments.',
    country: 'Nigeria',
    city: 'Lagos',
    countryFlag: '🇳🇬',
    verificationBadge: 'gold'
  });

  const totalCatalogCount = artworks.length;
  const realCount = artworks.filter(a => !a.isDemo).length;
  const demoCount = artworks.filter(a => a.isDemo).length;
  const soldCount = artworks.filter(a => a.status === 'sold').length;
  const conversionRate = totalCatalogCount > 0 ? Math.round((realCount / totalCatalogCount) * 100) : 0;

  const filteredItems = useMemo(() => {
    return artworks.filter(art => {
      if (filterType === 'real' && art.isDemo) return false;
      if (filterType === 'demo' && !art.isDemo) return false;
      if (filterType === 'sold' && art.status !== 'sold') return false;

      if (!searchTerm.trim()) return true;
      const t = searchTerm.toLowerCase();
      return (
        art.title?.toLowerCase().includes(t) ||
        art.artistName?.toLowerCase().includes(t) ||
        art.category?.toLowerCase().includes(t) ||
        art.medium?.toLowerCase().includes(t) ||
        art.country?.toLowerCase().includes(t)
      );
    });
  }, [artworks, filterType, searchTerm]);

  const showNotification = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const handleQuickAddSubmit = (e) => {
    e.preventDefault();
    if (!quickArtForm.title || !quickArtForm.price) return;
    addArtwork({
      ...quickArtForm,
      price: parseFloat(quickArtForm.price),
      isDemo: false,
      isNewlyListed: true,
      created_at: new Date().toISOString()
    });
    setIsQuickAddModalOpen(false);
    showNotification(`✅ Successfully published "${quickArtForm.title}" by ${quickArtForm.artistName} to live catalog!`);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Flash Notification Toast */}
      {notificationMsg && (
        <div className="p-4 bg-emerald-950/90 border-2 border-emerald-500 rounded-2xl text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-emerald-glow animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#171A21] via-[#1E232E] to-[#171A21] rounded-3xl border border-art-gold/30 p-6 sm:p-8 space-y-3 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 font-mono">
          <span className="p-1.5 rounded-lg bg-art-gold/20 text-art-gold border border-art-gold/40">
            <Sparkles className="w-5 h-5 text-art-gold animate-pulse" />
          </span>
          <span className="text-xs font-bold text-art-gold uppercase tracking-widest">
            CATALOGUE & DEMO PHASE-OUT ENGINE PLUGIN
          </span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Progressive Demo Replacement & Catalog Governance
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          This engine guarantees that artworks uploaded by real registered artists (such as test listings under <strong>Ebuka Eke Echo</strong>) automatically lead at index #0 across <strong>Newly Listed</strong>, <strong>Curated Marketplace</strong>, <strong>Recently Sold</strong>, and <strong>Explore</strong> pages, progressively displacing demo mock artworks.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <span className="text-xs px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-full font-mono">
            Active Mode: <strong className="uppercase">{demoTransitionMode}</strong>
          </span>
          <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full font-mono">
            Live Conversion: <strong>{conversionRate}%</strong>
          </span>
        </div>
      </div>

      {/* Real-time Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Real Artworks Card */}
        <div className="bg-white rounded-2xl border-2 border-emerald-200 p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Live Real Artworks</span>
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-emerald-700">{realCount}</p>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Uploaded by registered artists</span>
          </p>
        </div>

        {/* Demo Artworks Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Transitional Demo Items</span>
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-slate-800">{demoCount}</p>
          <p className="text-[11px] text-slate-500 font-medium">
            Phasing out as real artworks are added
          </p>
        </div>

        {/* Real Sold Artworks */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sold Masterpieces</span>
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-blue-700">{soldCount}</p>
          <p className="text-[11px] text-slate-500 font-medium">
            Logged on Provenance Ledger
          </p>
        </div>

        {/* Phase-Out Conversion Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phase-Out Progress</span>
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-purple-700">{conversionRate}%</p>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-art-gold to-emerald-500 h-full transition-all duration-500"
              style={{ width: `${Math.max(5, conversionRate)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Transition Mode Switcher & Rapid Operational Controls */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-art-gold" />
              <span>Catalog Transition Mode & 1-Click Operations</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control how the public marketplace handles transitional mock data vs real artist uploads.
            </p>
          </div>

          <button
            onClick={() => setIsQuickAddModalOpen(true)}
            className="px-4 py-2 bg-art-gold text-art-black rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow hover:brightness-110 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Quick List Artist Artwork</span>
          </button>
        </div>

        {/* Mode Selector Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Progressive Mode */}
          <div 
            onClick={() => {
              setDemoTransitionMode('progressive');
              showNotification('🔄 Progressive Transition Mode Active: Real artworks lead and replace demo slots.');
            }}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
              demoTransitionMode === 'progressive'
                ? 'border-art-gold bg-amber-50/50 shadow-md ring-2 ring-art-gold/30'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <span>⚡ Progressive Auto-Transition</span>
                </span>
                {demoTransitionMode === 'progressive' && (
                  <span className="text-[10px] bg-art-gold text-art-black font-bold px-2 py-0.5 rounded-full uppercase">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>(Default & Recommended)</strong> Real artist uploads are placed first. As more artist works are added, demo works are smoothly phased out on a 1-to-1 replacement basis.
              </p>
            </div>
            <span className="text-[11px] font-bold text-amber-700">✓ Best for gradual organic launch</span>
          </div>

          {/* 100% Real Live Only Mode */}
          <div 
            onClick={() => {
              setDemoTransitionMode('live_only');
              showNotification('🧹 100% Real Live Only Mode Active: All demo artworks are hidden.');
            }}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
              demoTransitionMode === 'live_only'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/30'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <span>🛡️ 100% Real Live Only</span>
                </span>
                {demoTransitionMode === 'live_only' && (
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Purges all 26 demo items site-wide. The marketplace displays <strong>strictly real uploaded artworks</strong> by registered artists and administrators.
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700">✓ Pure live inventory mode</span>
          </div>

          {/* Hybrid Mode */}
          <div 
            onClick={() => {
              setDemoTransitionMode('hybrid');
              showNotification('📦 Hybrid Mode Active: All real artworks first + demo fallbacks as padding.');
            }}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
              demoTransitionMode === 'hybrid'
                ? 'border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/30'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                  <span>📦 Hybrid Fallback Padding</span>
                </span>
                {demoTransitionMode === 'hybrid' && (
                  <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full uppercase">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Shows all real artist creations first, and keeps all demo artworks at the end as continuous visual catalog padding.
              </p>
            </div>
            <span className="text-[11px] font-bold text-blue-700">✓ Maximum visual density</span>
          </div>

        </div>

        {/* 1-Click Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => {
              purgeAllDemoArtworks();
              showNotification('🧹 1-Click Action Executed: All demo artworks purged from live catalog.');
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge All Demo Artworks (1-Click)</span>
          </button>

          <button
            onClick={() => {
              restoreDemoArtworks();
              showNotification('🔄 Restored transitional demo fallback catalog.');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restore Demo Fallbacks</span>
          </button>
        </div>

      </div>

      {/* Live Artworks Inventory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        
        {/* Table Filters & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-art-gold" />
              <span>Full Inventory Audit & Live Status ({filteredItems.length} items)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Inspect real vs demo status, promote items, or mark as sold.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Type Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg transition ${filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                All ({artworks.length})
              </button>
              <button
                onClick={() => setFilterType('real')}
                className={`px-3 py-1 rounded-lg transition ${filterType === 'real' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Real ({realCount})
              </button>
              <button
                onClick={() => setFilterType('demo')}
                className={`px-3 py-1 rounded-lg transition ${filterType === 'demo' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Demo ({demoCount})
              </button>
              <button
                onClick={() => setFilterType('sold')}
                className={`px-3 py-1 rounded-lg transition ${filterType === 'sold' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Sold ({soldCount})
              </button>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Filter title, artist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-800 w-36 sm:w-48"
              />
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                <th className="pb-3 font-semibold">Masterpiece</th>
                <th className="pb-3 font-semibold">Artist / Studio</th>
                <th className="pb-3 font-semibold">Catalog Type</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold">Market Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((art) => (
                <tr key={art.id} className={`hover:bg-slate-50 transition ${!art.isDemo ? 'bg-emerald-50/20' : ''}`}>
                  
                  {/* Artwork Image & Title */}
                  <td className="py-3.5 pr-4 flex items-center gap-3">
                    <img 
                      src={art.image} 
                      alt={art.title} 
                      className="w-12 h-12 object-cover rounded-xl border border-slate-200 shrink-0" 
                    />
                    <div>
                      <p className="font-serif font-bold text-slate-900 line-clamp-1">{art.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{art.medium} • {art.category}</span>
                    </div>
                  </td>

                  {/* Artist */}
                  <td className="py-3.5 pr-4">
                    <span className="font-semibold text-slate-800">{art.artistName}</span>
                    <span className="text-[10px] text-slate-400 block">{art.city}, {art.country}</span>
                  </td>

                  {/* Real vs Demo Badge */}
                  <td className="py-3.5 pr-4">
                    {!art.isDemo ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Award className="w-3 h-3 text-emerald-600" />
                        <span>Real Artist Upload</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        <span>📦 Transitional Demo</span>
                      </span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="py-3.5 pr-4">
                    <span className="font-mono font-bold text-slate-900">{formatCurrency(art.price)}</span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 pr-4">
                    {art.status === 'sold' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                        SOLD ({art.soldTo || 'Collector'})
                      </span>
                    ) : art.status === 'auction' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 uppercase">
                        AUCTION
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                        AVAILABLE
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 text-right space-x-2">
                    {art.status !== 'sold' && (
                      <button
                        onClick={() => {
                          setArtworkStatusSold(art.id, 'Private Collector', art.price);
                          showNotification(`🏆 Marked "${art.title}" as SOLD and added to Provenance Ledger.`);
                        }}
                        className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-semibold transition"
                      >
                        Mark Sold
                      </button>
                    )}

                    <button
                      onClick={() => {
                        deleteArtwork(art.id);
                        showNotification(`🗑️ Removed "${art.title}" from catalog.`);
                      }}
                      className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-[11px] font-semibold transition"
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Quick Add Modal */}
      {isQuickAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-serif text-lg font-bold text-slate-900">
                Quick List Live Masterpiece
              </h4>
              <button onClick={() => setIsQuickAddModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Artwork Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Ancestral Mask of Oyo"
                  value={quickArtForm.title}
                  onChange={(e) => setQuickArtForm({ ...quickArtForm, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-art-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Artist Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ebuka Eke Echo"
                    value={quickArtForm.artistName}
                    onChange={(e) => setQuickArtForm({ ...quickArtForm, artistName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-art-gold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Price (NGN) *</label>
                  <input
                    type="number"
                    required
                    placeholder="1500000"
                    value={quickArtForm.price}
                    onChange={(e) => setQuickArtForm({ ...quickArtForm, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-art-gold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Category</label>
                  <select
                    value={quickArtForm.category}
                    onChange={(e) => setQuickArtForm({ ...quickArtForm, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-art-gold"
                  >
                    <option value="Painters">Painters (Oil & Acrylic)</option>
                    <option value="Sculpture Makers">Sculptures (Bronze & Wood)</option>
                    <option value="Digital Art">Digital Art & Afrofuturism</option>
                    <option value="Mixed Media">Textiles & Mixed Media</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Medium</label>
                  <input
                    type="text"
                    value={quickArtForm.medium}
                    onChange={(e) => setQuickArtForm({ ...quickArtForm, medium: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-art-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Image URL</label>
                <input
                  type="url"
                  value={quickArtForm.image}
                  onChange={(e) => setQuickArtForm({ ...quickArtForm, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-art-gold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-art-gold text-art-black rounded-xl font-bold uppercase tracking-wider shadow hover:brightness-110"
                >
                  Publish to Live Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
