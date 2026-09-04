'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  Crown, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Building2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { isPriorityArtist, sortArtworksByPriority } from '@/lib/priority-utils';

export default function RoyalHeirloomsPage() {
  const { artworks, currency, royalHeirlooms: storeRoyalHeirlooms = [], submitRoyalInquiry, currentUser, sellers = [], usersList = [] } = useStore();
  const [selectedEpoch, setSelectedEpoch] = useState('All');
  const [inquirySubmitted, setInquirySubmitted] = useState(null);

  const formatPrice = (amount) => {
    if (!amount) return '₦0';
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  // High-value, museum-grade rare royal heirloom masterworks
  const fallbackRoyalHeirlooms = [
    {
      id: 'art-royal-1',
      title: 'Queen Idia Commemorative Bronze Mask',
      artistName: 'Guild of Royal Igun Bronzecasters',
      dynasty: 'Kingdom of Benin (16th Century Lineage Revival)',
      epoch: '16th Century Lineage',
      category: 'Imperial Bronzes',
      medium: 'Hand-Poured Cast Bronze, 24K Gold Inlay & Coral Beads',
      dimensions: '52 × 28 × 18 cm',
      valuation: 14500000, // ₦14.5M
      provenanceHash: 'ROYAL-BEN-IDIA-88942-CERT',
      status: 'Available for Private Treaty',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000',
      description: 'An extraordinary royal commemorative masterpiece created by direct descendants of the court casters of Benin, incorporating ritualistic lost-wax metallurgy, coral bead detailing, and 24K leaf.',
      authenticity: 'Certified by Pan-African Royal Heritage Registry · Dual Physical Hologram Sealed'
    },
    {
      id: 'art-royal-2',
      title: 'The Golden Stool Regalia Pendant',
      artistName: 'Ashanti Court Goldsmiths',
      dynasty: 'Ashanti Empire (Kumasi, Ghana)',
      epoch: 'Imperial Ashanti Epoch',
      category: 'Royal Goldwork',
      medium: 'Solid 22K African Gold & Carved Sacred Cedar',
      dimensions: '40 × 30 × 12 cm',
      valuation: 18200000, // ₦18.2M
      provenanceHash: 'ROYAL-ASH-GOLD-99120-CERT',
      status: 'Vault Custody Reserved',
      image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1000',
      description: 'Sacred ceremonial gold repoussé honoring the Golden Stool (Sika Dwa Kofi), featuring hand-chiseled solar glyphs, consecrated royal crests, and immutable provenance.',
      authenticity: 'Kumasi Cultural Centre Certified · Vault Physical Ledger Verified'
    },
    {
      id: 'art-royal-3',
      title: 'Ceremonial Beaded Throne of the Oba',
      artistName: 'Royal Yoruba Beaders Guild',
      dynasty: 'Oyo Empire Lineage (Oyo, Nigeria)',
      epoch: 'Yoruba Royal Court',
      category: 'Regalia & Furniture',
      medium: 'Over 120,000 Micro-Glass Beads over Seasoned Iroko Timber',
      dimensions: '110 × 65 × 60 cm',
      valuation: 9800000, // ₦9.8M
      provenanceHash: 'ROYAL-OYO-THRONE-77215-CERT',
      status: 'Available for Private Treaty',
      image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&q=80&w=1000',
      description: 'An awe-inspiring royal ceremonial seat laden with multi-chromatic micro-beading depicting sacred chameleons, royal leopards, and ancestral crowns.',
      authenticity: 'Archival Provenance Ledger #77215 · Physical Certificate Included'
    },
    {
      id: 'art-royal-4',
      title: 'Ife Terracotta Crown Head of Ooni',
      artistName: 'Ile-Ife Sacred Kiln Masters',
      dynasty: 'Ancient Ile-Ife Civilization Lineage',
      epoch: 'Ife Classical Epoch',
      category: 'Sacred Ceramics',
      medium: 'High-Fired Sacred Terracotta & Natural Pigment Wash',
      dimensions: '46 × 24 × 26 cm',
      valuation: 12000000, // ₦12.0M
      provenanceHash: 'ROYAL-IFE-OONI-66431-CERT',
      status: 'Available for Private Treaty',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000',
      description: 'Classical striated facial contours with royal diadem crown, sculpted in accordance with ancient Ife spiritual geometry and certified physical lineage documentation.',
      authenticity: 'Ife Heritage Council Approved · Immutable Ledger Certificate'
    }
  ];

  const royalHeirlooms = (storeRoyalHeirlooms && storeRoyalHeirlooms.length > 0) ? storeRoyalHeirlooms : fallbackRoyalHeirlooms;

  const filteredHeirlooms = royalHeirlooms.filter(item => {
    if (selectedEpoch === 'All') return true;
    return (item.epoch || '').toLowerCase().includes(selectedEpoch.toLowerCase()) || (item.category || '').toLowerCase().includes(selectedEpoch.toLowerCase());
  });

  const sortedHeirlooms = sortArtworksByPriority(filteredHeirlooms, { sellers, users: usersList });

  const handleInquiry = (heirloom) => {
    const itemTitle = heirloom?.title || heirloom;
    const valuation = heirloom?.valuation || 15000000;
    
    if (submitRoyalInquiry) {
      submitRoyalInquiry({
        heirloomTitle: itemTitle,
        offerAmount: valuation,
        collectorName: currentUser?.name || 'Sovereign Collector',
        collectorEmail: currentUser?.email || 'collector@artellium.com',
        collectorPhone: '+234 800 000 0000',
        settlementPreference: 'WEMA Tier-1 Fiduciary Custody',
        status: 'under_curatorial_review',
        date: new Date().toISOString(),
        notes: 'Express VIP private treaty inquiry logged directly via royal vault portal.'
      });
    }
    
    setInquirySubmitted(itemTitle);
    setTimeout(() => setInquirySubmitted(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#07080A] text-slate-100 pb-20">
      {/* Toast Notification */}
      {inquirySubmitted && (
        <div className="fixed top-20 right-6 z-50 bg-[#161B26] border-2 border-art-gold text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in">
          <Crown className="w-6 h-6 text-art-gold shrink-0" />
          <div>
            <p className="text-xs font-bold text-art-gold font-mono uppercase">Private Acquisition Request Logged</p>
            <p className="text-sm font-serif font-semibold">An Artellium Senior Curator will contact you regarding &ldquo;{inquirySubmitted}&rdquo;.</p>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative bg-gradient-to-b from-[#241704] via-[#120B02] to-[#07080A] border-b border-art-gold/30 pt-12 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-art-gold/15 border border-art-gold/40 text-art-gold text-xs font-mono font-bold tracking-widest uppercase">
                <Crown className="w-4 h-4 text-art-gold" />
                <span>EXTREMELY RARE PAN-AFRICAN ROYAL HEIRLOOMS</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-wide">
                Royal Heirlooms & Imperial Relics
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-sans leading-relaxed">
                A prestigious vault of museum-grade African royal regalia, lost-wax imperial bronzes, gold repoussé relics, and sacred ceremonial masterworks. Each acquisition is accompanied by an immutable physical provenance dossier and royal ledger certificate.
              </p>
            </div>

            {/* Custody Guarantee Pill */}
            <div className="p-4 rounded-2xl bg-black/60 border border-art-gold/40 space-y-1 text-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-art-gold mx-auto" />
              <span className="text-[10px] font-mono text-slate-300 uppercase block font-bold">100% Vault Custody</span>
              <span className="text-xs font-serif font-bold text-white">Bank-Secured Custody</span>
            </div>
          </div>

          {/* Epoch Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-4 border-t border-white/10 text-xs scrollbar-none">
            {['All', 'Imperial Bronzes', 'Royal Goldwork', 'Regalia & Furniture', 'Sacred Ceramics'].map((epoch) => (
              <button
                key={epoch}
                onClick={() => setSelectedEpoch(epoch)}
                className={`px-4 py-2 rounded-xl font-medium tracking-wide transition shrink-0 cursor-pointer ${
                  selectedEpoch === epoch
                    ? 'bg-art-gold text-art-black font-bold shadow-lg shadow-art-gold/20 border border-amber-300'
                    : 'bg-[#141722] text-slate-300 hover:bg-[#1C2230] border border-white/10'
                }`}
              >
                {epoch === 'All' ? 'All Royal Heirlooms' : epoch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Rare Royal Masterworks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sortedHeirlooms.map((heirloom) => (
            <div
              key={heirloom.id}
              className="group relative rounded-3xl overflow-hidden bg-[#0D1017] border border-art-gold/35 hover:border-art-gold transition-all duration-500 shadow-2xl flex flex-col justify-between"
            >
              {/* Image Frame with Museum Matting */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
                <img
                  src={heirloom.image}
                  alt={heirloom.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1017] via-transparent to-black/40 pointer-events-none" />

                {/* Badges: Royal Dynasty & Priority */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
                  <div className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-art-gold font-mono font-bold text-xs shadow-lg flex items-center gap-1.5 border border-art-gold/40">
                    <Crown className="w-3.5 h-3.5" />
                    <span>{heirloom.dynasty}</span>
                  </div>
                  {isPriorityArtist(heirloom, sellers, usersList) && (
                    <div className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-art-gold via-amber-300 to-art-gold text-art-black font-black text-[9px] shadow-lg flex items-center gap-1 uppercase tracking-wider">
                      <Crown className="w-2.5 h-2.5 fill-current" />
                      <span>PRIORITY ARTIST</span>
                    </div>
                  )}
                </div>

                {/* Provenance Hash */}
                <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-black/85 backdrop-blur-md text-slate-300 font-mono text-[9px] border border-white/15">
                  {heirloom.provenanceHash}
                </div>
              </div>

              {/* Heirloom Details */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-art-gold font-bold uppercase tracking-widest block">
                    {heirloom.category} · {heirloom.dimensions}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white group-hover:text-art-gold transition-colors">
                    {heirloom.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-serif italic">
                    Attributed to: {heirloom.artistName}
                  </p>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed pt-1">
                    {heirloom.description}
                  </p>
                </div>

                {/* Authenticity Certificate Box */}
                <div className="p-3.5 rounded-xl bg-black/50 border border-art-gold/20 flex items-start gap-2.5 text-[11px]">
                  <FileText className="w-4 h-4 text-art-gold shrink-0 mt-0.5" />
                  <span className="text-slate-300 font-sans leading-snug">
                    <strong className="text-white">Authentication:</strong> {heirloom.authenticity}
                  </span>
                </div>

                {/* Valuation & Action */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Museum Valuation</span>
                    <span className="font-serif text-xl sm:text-2xl font-bold text-art-gold">
                      {formatPrice(heirloom.valuation)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleInquiry(heirloom.title)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-serif font-bold text-xs uppercase tracking-wider transition shadow-gold-glow flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Private Inquiry</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
