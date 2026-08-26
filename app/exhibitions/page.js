'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { 
  Eye, 
  Calendar, 
  User, 
  Sparkles, 
  ArrowRight, 
  X, 
  MapPin, 
  Globe, 
  Award, 
  Leaf, 
  Layers, 
  CheckCircle2, 
  HeartHandshake,
  Compass,
  Clock,
  Flame,
  History,
  Search,
  ExternalLink,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function ExhibitionsPage() {
  const { exhibitions = [] } = useStore();
  
  // Timing Tabs: 'all', 'current', 'upcoming', 'past', 'virtual'
  const [activeTimingTab, setActiveTimingTab] = useState('current');
  
  // Format Sub-Filter
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  // Quick 3D Room Viewer Modal
  const [active3DRoomExhibition, setActive3DRoomExhibition] = useState(null);

  // Timing Tab Configurations
  const timingTabs = [
    { id: 'current', label: 'Current Exhibitions', icon: Flame, badge: 'Live Now' },
    { id: 'upcoming', label: 'Upcoming Exhibitions', icon: Clock, badge: 'Opening Soon' },
    { id: 'past', label: 'Past Exhibitions', icon: History, badge: 'Archived' },
    { id: 'virtual', label: 'Virtual Exhibitions (3D)', icon: Globe, badge: 'Global Access' },
    { id: 'all', label: 'All Curated Programs', icon: Layers, badge: `${exhibitions.length}` },
  ];

  // Format Filter Tabs
  const formatFilters = [
    { id: 'all', label: 'All Formats' },
    { id: 'physical', label: 'Physical Museum Pavilions' },
    { id: 'virtual', label: 'Virtual 3D Spatial Galleries' },
    { id: 'popup', label: 'Pop-Up Curatorial Salons' },
    { id: 'international', label: 'International Biennales' },
  ];

  // Filtered Exhibitions Logic
  const filteredExhibitions = useMemo(() => {
    return exhibitions.filter((ex) => {
      // Timing Match
      let matchTiming = true;
      if (activeTimingTab === 'current') {
        matchTiming = (ex.timingCategory === 'current' || ex.status?.toLowerCase().includes('live'));
      } else if (activeTimingTab === 'upcoming') {
        matchTiming = (ex.timingCategory === 'upcoming' || ex.status?.toLowerCase().includes('upcoming'));
      } else if (activeTimingTab === 'past') {
        matchTiming = (ex.timingCategory === 'past' || ex.status?.toLowerCase().includes('past') || ex.status?.toLowerCase().includes('archive'));
      } else if (activeTimingTab === 'virtual') {
        matchTiming = (ex.timingCategory === 'virtual' || (ex.format || '').toLowerCase().includes('virtual') || ex.virtualGalleryAvailable);
      }

      // Format Match
      let matchFormat = true;
      if (selectedFormat === 'physical') matchFormat = (ex.format || '').toLowerCase().includes('physical');
      if (selectedFormat === 'virtual') matchFormat = (ex.format || '').toLowerCase().includes('virtual');
      if (selectedFormat === 'popup') matchFormat = (ex.format || '').toLowerCase().includes('pop');
      if (selectedFormat === 'international') matchFormat = (ex.format || '').toLowerCase().includes('international');

      // Search Query
      const matchSearch = !searchQuery || 
        ex.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.curator?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.sdgTag?.toLowerCase().includes(searchQuery.toLowerCase());

      // City Filter
      const matchCity = cityFilter === 'all' || (ex.accessibleCities || []).includes(cityFilter) || ex.location?.toLowerCase().includes(cityFilter.toLowerCase());

      return matchTiming && matchFormat && matchSearch && matchCity;
    });
  }, [exhibitions, activeTimingTab, selectedFormat, searchQuery, cityFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 font-sans pb-24 text-slate-100">
      
      {/* Top Curatorial & SDGs Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#071711] via-[#0B1E17] to-[#0A0E17] p-8 sm:p-12 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-art-gold/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[10px] font-mono font-bold tracking-widest uppercase border border-emerald-500/30">
            <Eye className="w-3.5 h-3.5" />
            <span>EXHIBITIONS & GLOBAL CURATORIAL PAVILIONS</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Art Exhibitions & <span className="text-gradient-gold">SDGs Sustainability Forums</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
            “We curate exhibitions that showcase artistic excellence while connecting creators with wider audiences through various SDGs discussions for a sustainable living.”
          </p>

          {/* Global City Access Banner */}
          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-art-gold font-bold">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Worldwide Virtual Gallery Immersion:</span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px]">
              {['Abuja', 'Lagos', 'London', 'New York'].map((city) => (
                <button
                  key={city}
                  onClick={() => setCityFilter(cityFilter === city ? 'all' : city)}
                  className={`px-3 py-1 rounded-xl font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
                    cityFilter === city
                      ? 'bg-art-gold text-art-black shadow-gold-glow'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{city} Virtual Walkthrough</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 1. PRIMARY TIMING TABS: Current, Upcoming, Past, Virtual */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 bg-[#0E1118] p-1.5 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar text-xs">
          {timingTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTimingTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTimingTab(tab.id)}
                className={`px-5 py-3 rounded-xl font-bold uppercase tracking-wider transition shrink-0 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-emerald-glow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                <span>{tab.label}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/40 font-mono text-slate-200">
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-Filters & Search Bar */}
        <div className="p-4 bg-[#0A0D14] rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by exhibition title, curator, SDG..."
              className="w-full pl-9 pr-3 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Format Buttons */}
          <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
            {formatFilters.map((fmt) => (
              <button
                key={fmt.id}
                onClick={() => setSelectedFormat(fmt.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition cursor-pointer text-[11px] ${
                  selectedFormat === fmt.id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. EXHIBITIONS GRID */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-mono uppercase tracking-wider">
            Showing <strong>{filteredExhibitions.length}</strong> Curated Exhibitions
          </span>
          <span className="text-emerald-400 font-bold">
            Interactive Mini-Pages & 3D Spatial Walkthroughs Enabled
          </span>
        </div>

        {filteredExhibitions.length === 0 ? (
          <div className="p-12 text-center bg-[#0A0D14] rounded-3xl border border-dashed border-white/10 space-y-3">
            <Eye className="w-10 h-10 text-slate-500 mx-auto" />
            <p className="font-serif text-lg text-white">No exhibitions found matching your current filter.</p>
            <button
              onClick={() => {
                setActiveTimingTab('all');
                setSelectedFormat('all');
                setSearchQuery('');
                setCityFilter('all');
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredExhibitions.map((ex) => {
              const slug = ex.slug || ex.id;

              return (
                <div
                  key={ex.id}
                  className="group relative rounded-3xl overflow-hidden bg-[#0A0D14] border border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 shadow-2xl flex flex-col justify-between"
                >
                  {/* Exhibition Cover Image */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
                    <img
                      src={ex.coverImage}
                      alt={ex.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/40 to-transparent" />

                    {/* Status & Timing Badge */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow">
                        {ex.status}
                      </span>
                      <span className="bg-black/80 backdrop-blur-md text-art-gold text-[10px] font-bold px-3 py-1 rounded-full border border-art-gold/40">
                        {ex.formatLabel || ex.format}
                      </span>
                    </div>

                    {/* SDG Tag Pill */}
                    {ex.sdgTag && (
                      <div className="absolute top-4 right-4 bg-emerald-950/90 text-emerald-300 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-emerald-700/80 flex items-center gap-1 shadow">
                        <Leaf className="w-3 h-3 text-emerald-400" />
                        <span>{ex.sdgTag}</span>
                      </div>
                    )}

                    {/* Location Bar */}
                    {ex.location && (
                      <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1.5 text-[11px] text-slate-300 bg-black/70 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10">
                        <MapPin className="w-3.5 h-3.5 text-art-gold shrink-0" />
                        <span className="truncate">{ex.location}</span>
                      </div>
                    )}
                  </div>

                  {/* Exhibition Card Content */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      
                      {/* Dates & Featured Count */}
                      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-2">
                        <span className="flex items-center gap-1 font-mono text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{ex.startDate} – {ex.endDate}</span>
                        </span>
                        <span className="font-mono text-emerald-400 font-bold">
                          {ex.featuredArtworksCount || 20}+ Masterworks
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="font-serif text-2xl font-bold text-white group-hover:text-art-gold transition leading-snug">
                        {ex.title}
                      </h2>

                      {/* Curator & SDG */}
                      <div className="space-y-1 text-xs">
                        <p className="text-slate-300">
                          Curator: <strong className="text-white">{ex.curator}</strong> {ex.curatorTitle ? `· ${ex.curatorTitle}` : ''}
                        </p>
                        {ex.sdgDiscussion && (
                          <p className="text-emerald-400 font-mono text-[11px]">
                            {ex.sdgDiscussion}
                          </p>
                        )}
                      </div>

                      {/* Brief Statement / Description */}
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {ex.curatorStatement || ex.description}
                      </p>

                      {/* Participating Artists Row */}
                      {ex.participatingArtists && ex.participatingArtists.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1.5">
                            Featured Master Creators:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {ex.participatingArtists.map((artist, idx) => (
                              <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10.5px] text-slate-200">
                                {artist.name} ({artist.country})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                      
                      {/* View Mini-Page Button */}
                      <Link
                        href={`/exhibitions/${slug}`}
                        className="w-full sm:flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-emerald-glow flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Exhibition Mini-Page</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {/* Quick 3D Room Viewer Button */}
                      <button
                        onClick={() => setActive3DRoomExhibition(ex)}
                        className="w-full sm:w-auto px-4 py-3 bg-art-gold/15 hover:bg-art-gold/25 text-art-gold border border-art-gold/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Enter 3D Spatial Virtual Gallery"
                      >
                        <Globe className="w-4 h-4" />
                        <span>3D Room Walk</span>
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* QUICK 3D VIRTUAL GALLERY SPATIAL WALKTHROUGH MODAL                       */}
      {/* ========================================================================= */}
      {active3DRoomExhibition && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-[#090C12] border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-xs text-slate-100 animate-scale-in">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                  3D SPATIAL VIRTUAL GALLERY · LIVE SIMULATION
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {active3DRoomExhibition.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Virtual Node active across: <strong className="text-art-gold">Abuja • Lagos • London • New York</strong>
                </p>
              </div>
              <button
                onClick={() => setActive3DRoomExhibition(null)}
                className="text-slate-400 hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Simulated 3D WebGL Spatial Room */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-black border border-emerald-500/40 shadow-inner">
              <img
                src={active3DRoomExhibition.coverImage}
                alt="3D Spatial Gallery"
                className="w-full h-full object-cover filter brightness-75 contrast-125"
              />

              {/* 3D Viewport Controls Overlay */}
              <div className="absolute inset-0 bg-radial-gradient flex flex-col justify-between p-6 pointer-events-none">
                <div className="flex justify-between items-start">
                  <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-300 font-mono text-[11px] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>WebGL 3D Room Navigation Active</span>
                  </div>
                  <span className="bg-black/80 px-3 py-1.5 rounded-xl border border-white/10 text-white font-mono text-[11px]">
                    FOV: 90° · 60 FPS Ultra-HD
                  </span>
                </div>

                <div className="text-center space-y-2 max-w-lg mx-auto bg-black/85 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/40 pointer-events-auto">
                  <p className="font-serif font-bold text-base text-white">
                    Explore Exhibited Masterpieces in 3D Space
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Use mouse or touch to pan 360°, teleport between gallery rooms, and inspect physical provenance certificates.
                  </p>
                  <div className="flex justify-center gap-3 pt-1">
                    <Link
                      href={`/exhibitions/${active3DRoomExhibition.slug || active3DRoomExhibition.id}`}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl uppercase tracking-wider text-[11px] transition shadow"
                    >
                      Open Full Exhibition Mini-Page
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-slate-400 font-mono text-[11px]">
                Curator: <strong className="text-white">{active3DRoomExhibition.curator}</strong>
              </span>
              <button
                onClick={() => setActive3DRoomExhibition(null)}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl uppercase"
              >
                Close 3D Viewport
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
