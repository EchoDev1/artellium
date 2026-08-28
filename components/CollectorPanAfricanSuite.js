'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/store-context';
import { 
  Flame, 
  Crown, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  Award, 
  Clock, 
  ShoppingBag, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  ExternalLink,
  Star,
  Globe,
  MapPin,
  Lock,
  Printer
} from 'lucide-react';
import Link from 'next/link';

export default function CollectorPanAfricanSuite({ onOpenCertModal }) {
  const { 
    flashDeals = [], 
    royalHeirlooms = [], 
    royalInquiries = [], 
    curatorPicks = [], 
    ledgerBlocks = [], 
    orders = [], 
    currency, 
    setCurrency, 
    panAfricanCurrencies = {}, 
    panAfricanRegions = [], 
    formatCurrency, 
    addToCart, 
    currentUser 
  } = useStore();

  const [activeTab, setActiveTab] = useState('claimed_deals'); // 'claimed_deals', 'royal_inquiries', 'provenance_vault', 'curator_library', 'currency_settings'
  const [copiedHash, setCopiedHash] = useState(null);

  // Filter inquiries for current authenticated collector
  const myInquiries = royalInquiries.filter(inq => 
    Boolean(inq.collectorEmail && currentUser?.email && inq.collectorEmail.toLowerCase() === currentUser.email.toLowerCase())
  );

  const myClaimedDeals = [];

  const handleCopyHash = (hash) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Container Box */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-art-gold/10 text-amber-900 text-[10px] font-mono font-bold uppercase border border-art-gold/30">
              <ShieldCheck className="w-3.5 h-3.5 text-art-gold" />
              <span>COLLECTOR PATRONAGE & PROVENANCE VAULT</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Pan-African Acquisitions & Provenance Vault
            </h2>
            <p className="text-xs text-slate-500 max-w-xl">
              Track your claimed flash deals, review private royal heirloom acquisition requests, inspect cryptographic provenance tokens, and set your multi-currency preferences.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Currency: {currency} ({panAfricanCurrencies[currency]?.symbol || '₦'})</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 text-xs font-bold scrollbar-none">
          {[
            { id: 'claimed_deals', label: '⚡ Claimed Flash Deals', count: myClaimedDeals.length },
            { id: 'royal_inquiries', label: '👑 Royal Heirloom Requests', count: myInquiries.length },
            { id: 'provenance_vault', label: '📜 Provenance Certificates', count: ledgerBlocks.length },
            { id: 'curator_library', label: '✨ Curatorial Reviews Library', count: curatorPicks.length },
            { id: 'currency_settings', label: '🌍 Regional Currency & Delivery', count: 'Pan-African' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 rounded-xl transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                activeTab === t.id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span>{t.label}</span>
              <span className="px-1.5 py-0.5 rounded-md bg-white/20 text-[10px] font-mono">{t.count}</span>
            </button>
          ))}
        </div>

        {/* 1. CLAIMED FLASH DEALS */}
        {activeTab === 'claimed_deals' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-slate-900">
                Reserved Direct Atelier Flash Drops ({myClaimedDeals.length})
              </h3>
              <Link href="/flash-deals" className="text-xs text-art-gold font-bold hover:underline flex items-center gap-1">
                <span>Browse All Flash Deals</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myClaimedDeals.map(deal => (
                <div key={deal.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs flex flex-col justify-between">
                  <div className="flex gap-4">
                    <img src={deal.image} alt={deal.title} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-amber-700 font-bold uppercase">{deal.artistName}</span>
                      <h4 className="font-serif font-bold text-slate-900 text-base">{deal.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{deal.medium}</p>
                      <div className="flex items-baseline gap-2 pt-1 font-mono">
                        <span className="font-serif text-base font-bold text-red-600">{formatCurrency(deal.discountedPrice)}</span>
                        <span className="text-xs text-slate-400 line-through">{formatCurrency(deal.originalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-red-50 rounded-xl border border-red-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-red-700 font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Vault Price Hold Guaranteed</span>
                    </span>
                    <button
                      onClick={() => addToCart({
                        id: deal.id,
                        title: deal.title,
                        artistName: deal.artistName,
                        price: deal.discountedPrice,
                        image: deal.image,
                        category: deal.category,
                        medium: deal.medium
                      })}
                      className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Checkout at Discount</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. ROYAL HEIRLOOM INQUIRIES */}
        {activeTab === 'royal_inquiries' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-slate-900">
                Private Treaty Acquisition Requests ({myInquiries.length})
              </h3>
              <Link href="/royal-heirlooms" className="text-xs text-amber-800 font-bold hover:underline flex items-center gap-1">
                <span>Explore Royal Heirlooms</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {myInquiries.map(inq => (
                <div key={inq.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-mono font-bold text-[10px]">
                        TREATY INQUIRY #{inq.id}
                      </span>
                      <h4 className="font-serif font-bold text-slate-900 text-base mt-1">{inq.heirloomTitle}</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Museum Valuation</span>
                      <span className="font-serif text-base font-bold text-amber-900">{formatCurrency(inq.offerAmount)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px]">
                    <div className="p-2.5 bg-white rounded-xl">
                      <span className="text-slate-400 text-[10px] uppercase block">Settlement Protocol</span>
                      <span className="text-slate-800 font-bold">{inq.settlementPreference || 'Wema Bank Verified Settlement'}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl">
                      <span className="text-slate-400 text-[10px] uppercase block">Status</span>
                      <span className="text-emerald-700 font-bold uppercase">{inq.status.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl">
                      <span className="text-slate-400 text-[10px] uppercase block">Private Viewing Notes</span>
                      <span className="text-slate-600 italic">{inq.notes}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. PROVENANCE CERTIFICATES VAULT */}
        {activeTab === 'provenance_vault' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-slate-900">
                Your Authenticated Provenance Ledger Dossiers ({ledgerBlocks.length})
              </h3>
              <Link href="/provenance-ledger" className="text-xs text-teal-800 font-bold hover:underline flex items-center gap-1">
                <span>View Public Network Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              {ledgerBlocks.map(block => (
                <div key={block.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <img src={block.image} alt={block.artworkTitle} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-mono font-bold text-[10px]">
                            {block.blockHeight}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px]">{block.timestamp}</span>
                        </div>
                        <h4 className="font-serif font-bold text-slate-900 text-sm mt-0.5">{block.artworkTitle}</h4>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                      ✓ {block.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
                    <div className="p-3 bg-white rounded-xl space-y-1">
                      <span className="text-slate-400 text-[10px] uppercase block">Certificate Serial Number</span>
                      <span className="text-amber-900 font-bold">{block.physicalCertificateId}</span>
                    </div>

                    <div className="p-3 bg-white rounded-xl space-y-1 truncate">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] uppercase block">Cryptographic Hash</span>
                        <button
                          onClick={() => handleCopyHash(block.provenanceHash)}
                          className="text-[10px] text-teal-700 font-bold hover:underline"
                        >
                          {copiedHash === block.provenanceHash ? 'Copied!' : 'Copy'}
                        </button>
                      </div>
                      <span className="text-teal-800 font-mono text-[10px] truncate block">{block.provenanceHash}</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onOpenCertModal && onOpenCertModal({
                        artworkId: 'art-101',
                        artworkTitle: block.artworkTitle,
                        artistName: block.artistName,
                        collectorName: block.custodian || 'Dr. Evelyn Carter',
                        certificateId: block.physicalCertificateId,
                        provenanceHash: block.provenanceHash,
                        medium: block.medium
                      })}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Certified Physical COA</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CURATORIAL REVIEWS LIBRARY */}
        {activeTab === 'curator_library' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-slate-900">
                Bookmarked Curatorial Review Essays ({curatorPicks.length})
              </h3>
              <Link href="/curator-picks" className="text-xs text-purple-800 font-bold hover:underline flex items-center gap-1">
                <span>Explore All Curator Picks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {curatorPicks.map(pick => (
                <div key={pick.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-purple-700 uppercase">{pick.exhibitionHall}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-bold text-[10px]">
                        ★ {pick.rating}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-slate-900 text-base">{pick.title}</h4>
                    <p className="text-[11px] text-amber-800 font-medium">By {pick.artistName} ({pick.country})</p>
                    <p className="font-serif italic text-slate-700 leading-relaxed pt-1">&ldquo;{pick.curatorCritique}&rdquo;</p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Curated by</span>
                      <span className="text-slate-900 font-bold">{pick.curatorName}</span>
                    </div>
                    <Link
                      href={`/artwork/${pick.artworkId}`}
                      className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold text-xs flex items-center gap-1"
                    >
                      <span>View Work</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. REGIONAL CURRENCY & DELIVERY PREFERENCES */}
        {activeTab === 'currency_settings' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Currency Preference Switcher */}
              <div className="lg:col-span-6 p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div className="space-y-1">
                  <h3 className="font-serif text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>Display Currency Preference</span>
                  </h3>
                  <p className="text-slate-500 text-[11px]">
                    Select your local African or international currency to automatically convert all prices, bids, and settlements.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {Object.keys(panAfricanCurrencies).map(currKey => {
                    const c = panAfricanCurrencies[currKey];
                    const isSelected = currency === currKey;
                    return (
                      <button
                        key={currKey}
                        onClick={() => setCurrency(currKey)}
                        className={`p-3.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div>
                          <span className="text-lg mr-1.5">{c.flag}</span>
                          <span className="font-mono text-xs">{c.code}</span>
                          <span className="block text-[10px] opacity-80">{c.name.split(' (')[0]}</span>
                        </div>
                        <span className="text-base font-serif">{c.symbol}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Regional Delivery Hubs */}
              <div className="lg:col-span-6 p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4 text-xs">
                <h4 className="font-serif text-base font-bold text-art-gold flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-art-gold" />
                  <span>Pan-African Fine Art Delivery Network</span>
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Artellium operates bonded fine art delivery hubs in 9 major African capital cities with temperature-controlled crating and customs clearance.
                </p>

                <div className="space-y-2 pt-2 text-[11px]">
                  {panAfricanRegions.slice(0, 4).map(r => (
                    <div key={r.code} className="p-2.5 bg-slate-800/80 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{r.flag}</span>
                        <span className="font-bold text-white">{r.name}</span>
                        <span className="text-slate-400">({r.hub})</span>
                      </div>
                      <span className="font-mono text-emerald-400">{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
