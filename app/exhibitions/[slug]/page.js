'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  Eye, 
  Calendar, 
  MapPin, 
  Globe, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Leaf, 
  Award, 
  User, 
  Check, 
  FileText, 
  Share2, 
  Bookmark, 
  Heart, 
  Download, 
  Building,
  Flame,
  CheckCircle2,
  Clock,
  Compass,
  ShoppingBag,
  Crown
} from 'lucide-react';
import { isPriorityArtist, sortArtworksByPriority } from '@/lib/priority-utils';

export default function ExhibitionMiniPage() {
  const params = useParams();
  const router = useRouter();
  const { exhibitions = [], artworks = [], addToCart, addToWishlist, wishlist = [], currency, sellers = [], usersList = [] } = useStore();

  const slug = params?.slug;

  // Find the exhibition by slug or ID
  const exhibition = useMemo(() => {
    return exhibitions.find(
      (e) => e.slug === slug || e.id === slug || e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
    ) || exhibitions[0];
  }, [exhibitions, slug]);

  const [activeTab, setActiveTab] = useState('artworks'); // 'artworks', 'statement', 'artists', 'virtual_3d', 'rsvp'
  const [selectedArtworkDetail, setSelectedArtworkDetail] = useState(null);
  const [rsvpPassGenerated, setRsvpPassGenerated] = useState(false);
  const [rsvpCity, setRsvpCity] = useState('Lagos');

  // Format Price
  const formatPrice = (amount) => {
    if (!amount) return '₦0';
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  if (!exhibition) {
    return (
      <div className="min-h-screen bg-[#07080A] text-slate-100 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Eye className="w-12 h-12 text-emerald-400 mx-auto" />
          <h1 className="font-serif text-2xl font-bold">Exhibition Not Found</h1>
          <Link href="/exhibitions" className="px-6 py-2.5 bg-emerald-600 rounded-xl text-xs font-bold uppercase">
            Return to Exhibitions Pavilion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07080A] text-slate-100 font-sans pb-24">
      
      {/* 1. Hero Cover & Header */}
      <div className="relative w-full h-[55vh] min-h-[420px] max-h-[600px] overflow-hidden bg-black">
        <img
          src={exhibition.coverImage}
          alt={exhibition.title}
          className="w-full h-full object-cover opacity-75 filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07080A] via-[#07080A]/60 to-transparent" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-8">
          
          {/* Top Breadcrumb & Share */}
          <div className="flex items-center justify-between">
            <Link
              href="/exhibitions"
              className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Exhibitions</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Exhibition link copied to clipboard!');
                }}
                className="p-2.5 rounded-xl bg-black/60 backdrop-blur-md text-slate-300 hover:text-white border border-white/10 text-xs transition"
                title="Share Exhibition"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Exhibition Title & Metadata Hero */}
          <div className="space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-600 text-white font-bold text-xs px-3.5 py-1 rounded-full shadow">
                {exhibition.status}
              </span>
              <span className="bg-black/80 backdrop-blur-md text-art-gold font-mono font-bold text-xs px-3.5 py-1 rounded-full border border-art-gold/40">
                {exhibition.formatLabel || exhibition.format}
              </span>
              {exhibition.sdgTag && (
                <span className="bg-emerald-950/90 text-emerald-300 font-mono font-bold text-xs px-3 py-1 rounded-full border border-emerald-700 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{exhibition.sdgTag}</span>
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {exhibition.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{exhibition.startDate} – {exhibition.endDate}</span>
              </span>
              <span className="flex items-center gap-1.5 text-art-gold">
                <MapPin className="w-4 h-4 text-art-gold" />
                <span>{exhibition.location}</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-200">
                <User className="w-4 h-4 text-slate-400" />
                <span>Curated by <strong className="text-white">{exhibition.curator}</strong></span>
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Global Virtual Access Bar (Abuja, Lagos, London, New York) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="p-4 rounded-2xl bg-[#0D121B] border border-emerald-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-bold text-white text-sm">
                Global Virtual Gallery Access Available
              </p>
              <p className="text-[11px] text-slate-300">
                Experience this exhibition online in high-fidelity 3D spatial WebGL from <strong>Abuja, Lagos, London, New York</strong>, or anywhere globally.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('virtual_3d')}
              className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold uppercase tracking-wider rounded-xl transition shadow-emerald-glow flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Enter 3D Virtual Gallery</span>
            </button>
            <button
              onClick={() => setActiveTab('rsvp')}
              className="flex-1 md:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold uppercase rounded-xl transition border border-white/10"
            >
              Book Curatorial Pass
            </button>
          </div>
        </div>
      </div>

      {/* 3. Section Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'artworks', label: `Exhibited Artworks (${(exhibition.exhibitedArtworks || []).length})` },
            { id: 'statement', label: 'Curator’s Statement' },
            { id: 'artists', label: `Participating Master Artists (${(exhibition.participatingArtists || []).length})` },
            { id: 'virtual_3d', label: '🌐 3D Spatial Virtual Room' },
            { id: 'rsvp', label: 'Exhibition Pass & SDG Discussions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider transition shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-art-gold text-art-black shadow-gold-glow'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: EXHIBITED ARTWORKS GALLERY */}
        {activeTab === 'artworks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono uppercase tracking-wider">
                Exhibited Masterpieces & Provenance Certified Pieces
              </span>
              <span className="text-emerald-400 font-bold">Direct Acquisition & Inquiries Available</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortArtworksByPriority(exhibition.exhibitedArtworks || [], { sellers, users: usersList }).map((art) => (
                <div
                  key={art.id}
                  className="rounded-3xl overflow-hidden bg-[#0A0D14] border border-white/10 hover:border-art-gold/60 transition-all duration-300 shadow-xl flex flex-col justify-between p-4 space-y-3 group"
                >
                  <div className="space-y-3">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-white/5">
                      <img
                        src={art.image}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        <span className="bg-black/80 backdrop-blur-md text-art-gold text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-lg border border-art-gold/30">
                          Exhibition Piece
                        </span>
                        {isPriorityArtist(art, sellers, usersList) && (
                          <span className="bg-gradient-to-r from-amber-500 via-art-gold to-yellow-500 text-black font-black text-[9px] px-2 py-0.5 rounded-lg border border-amber-300 flex items-center gap-1 shadow">
                            <Crown className="w-2.5 h-2.5 text-black fill-current" />
                            <span>PRIORITY ARTIST</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-white group-hover:text-art-gold transition">
                        {art.title}
                      </h3>
                      <p className="text-xs text-art-gold font-semibold">{art.artist}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{art.medium} • {art.dimensions}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono uppercase">Valuation</span>
                      <span className="font-serif text-base font-bold text-white">{formatPrice(art.price)}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const existingArt = artworks.find(a => a.id === art.id) || { ...art, artistName: art.artist };
                          addToCart(existingArt);
                        }}
                        className="flex-1 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-bold text-xs uppercase rounded-xl transition shadow flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Acquire</span>
                      </button>
                      <button
                        onClick={() => addToWishlist(art.id)}
                        className={`p-2 rounded-xl border transition ${
                          wishlist.includes(art.id)
                            ? 'bg-red-500/20 text-red-400 border-red-500/50'
                            : 'bg-white/5 text-slate-300 hover:text-white border-white/10'
                        }`}
                        title="Add to Wishlist"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CURATOR'S STATEMENT */}
        {activeTab === 'statement' && (
          <div className="bg-[#0A0D14] rounded-3xl border border-emerald-500/30 p-8 sm:p-12 space-y-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-black border border-art-gold shrink-0">
                  <img src={exhibition.curatorAvatar} alt={exhibition.curator} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                    CURATORIAL ESSAY & THESIS
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {exhibition.curator}
                  </h2>
                  <p className="text-xs text-art-gold font-mono">{exhibition.curatorTitle}</p>
                </div>
              </div>

              <span className="px-3.5 py-1.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-xs font-mono font-bold shrink-0">
                Official Curatorial Text
              </span>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-200 leading-relaxed font-serif max-w-4xl">
              <p className="first-letter:text-5xl first-letter:font-black first-letter:text-art-gold first-letter:float-left first-letter:mr-3 first-letter:pr-1">
                {exhibition.curatorStatement}
              </p>
              <p>
                Through this curatorial arrangement, Artellium bridges the historical continuity of African artistic intellect with contemporary global sustainability imperatives. Our physical galleries and 3D digital corridors provide verifiable provenance and fair creator royalties.
              </p>
            </div>

            <div className="p-4 bg-black/60 rounded-2xl border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-mono block">Opening Hours:</span>
                <span className="text-white font-bold">{exhibition.openingHours || 'Tuesday – Sunday, 10am – 7pm'}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono block">Fiduciary Partner:</span>
                <span className="text-emerald-400 font-bold">WEMA Bank PLC Verified Settlement</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono block">SDG Dialogue Tag:</span>
                <span className="text-art-gold font-bold">{exhibition.sdgDiscussion}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PARTICIPATING MASTER ARTISTS */}
        {activeTab === 'artists' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {(exhibition.participatingArtists || []).map((artist, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#0A0D14] border border-white/10 hover:border-art-gold transition space-y-4 shadow-xl text-center"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-black mx-auto border-2 border-art-gold shadow-gold-glow">
                    <img src={artist.avatar} alt={artist.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white">{artist.name}</h3>
                    <p className="text-xs text-art-gold font-semibold">{artist.role}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{artist.country}</p>
                  </div>
                  <Link
                    href={`/artists/${artist.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="inline-block px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold uppercase transition border border-white/10"
                  >
                    View Artist Atelier Profile
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: 3D SPATIAL VIRTUAL ROOM */}
        {activeTab === 'virtual_3d' && (
          <div className="bg-[#0A0D14] rounded-3xl border border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                  3D WEBGL SPATIAL WALKTHROUGH · GLOBAL NODES
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Interactive Spatial Gallery Simulation
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono text-xs border border-emerald-700">
                Connected Nodes: Abuja • Lagos • London • New York
              </span>
            </div>

            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-emerald-500/40 shadow-inner">
              <img
                src={exhibition.coverImage}
                alt="3D Spatial Gallery"
                className="w-full h-full object-cover filter brightness-75 contrast-125"
              />

              <div className="absolute inset-0 bg-radial-gradient flex flex-col justify-between p-6">
                <div className="flex justify-between items-start">
                  <div className="bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>3D Spatial Teleport Active</span>
                  </div>
                  <span className="bg-black/80 px-3 py-1.5 rounded-xl border border-white/10 text-white font-mono text-xs">
                    60 FPS Spatial Audio
                  </span>
                </div>

                <div className="text-center space-y-2 max-w-lg mx-auto bg-black/90 backdrop-blur-md p-6 rounded-2xl border border-emerald-500/40">
                  <p className="font-serif font-bold text-lg text-white">
                    Experience {exhibition.title} Online
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Walk through the physical museum space in real-time 3D, inspect authentic surface textures, listen to curatorial commentary, and acquire pieces securely.
                  </p>
                  <button
                    onClick={() => alert('3D Spatial WebGL Room loaded in full-screen immersion!')}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition shadow-emerald-glow cursor-pointer mt-2"
                  >
                    Launch Full-Screen 3D Walkthrough
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: EXHIBITION PASS & RSVP */}
        {activeTab === 'rsvp' && (
          <div className="bg-[#0A0D14] rounded-3xl border border-white/10 p-6 sm:p-10 space-y-6 shadow-2xl max-w-2xl mx-auto text-xs">
            <div className="border-b border-white/10 pb-4 text-center space-y-1">
              <span className="text-[10px] font-mono font-bold text-art-gold uppercase tracking-widest block">
                VIP ACCREDITED VISITOR PASS
              </span>
              <h3 className="font-serif text-2xl font-bold text-white">
                Register for Curatorial Pass & SDG Forums
              </h3>
              <p className="text-slate-400">Physical & Virtual VIP pass with verified digital QR badge.</p>
            </div>

            {rsvpPassGenerated ? (
              <div className="p-6 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl text-center space-y-4 animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <div>
                  <h4 className="font-serif text-xl font-bold text-white">VIP Exhibition Pass Activated!</h4>
                  <p className="text-emerald-300 text-xs mt-1">Pass ID: <strong>ART-EX-2026-{Math.floor(Math.random()*90000+10000)}</strong></p>
                  <p className="text-slate-300 text-[11px] mt-1">Valid for Physical Pavilions in {rsvpCity} and 24/7 Global Virtual 3D Rooms.</p>
                </div>
                <button
                  onClick={() => alert('VIP Pass & SDG Discussion Agenda downloaded in PDF format.')}
                  className="px-5 py-2.5 bg-art-gold text-art-black font-bold uppercase rounded-xl text-xs"
                >
                  Download PDF Pass & Agenda
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setRsvpPassGenerated(true); }} className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Your Location / Preferred City Hub</label>
                  <select
                    value={rsvpCity}
                    onChange={(e) => setRsvpCity(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Lagos">Lagos, Nigeria (National Museum Pavilion)</option>
                    <option value="Abuja">Abuja, Nigeria (International Arts Center)</option>
                    <option value="London">London, UK (Diaspora Showcase Hub)</option>
                    <option value="New York">New York, USA (Global Virtual Node)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Pass Type</label>
                  <select className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 focus:outline-none">
                    <option>Collector VIP Pass (Physical + Virtual 3D)</option>
                    <option>SDG Sustainability Discussion Forum Delegate</option>
                    <option>Institutional Curator / Museum Representative</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold uppercase tracking-wider rounded-xl transition shadow-emerald-glow"
                >
                  Confirm Registration & Generate Pass
                </button>
              </form>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
