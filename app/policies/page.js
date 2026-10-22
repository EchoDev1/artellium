'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/context/store-context';
import { INITIAL_POLICIES_CONFIG } from '@/lib/mock-data';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  RotateCcw, 
  Shield, 
  FileText, 
  Award, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Mail,
  ChevronRight,
  Globe,
  HelpCircle
} from 'lucide-react';

const ICON_MAP = {
  provenance: Award,
  'wema-banking': Lock,
  consignment: Award,
  refunds: RotateCcw,
  privacy: Shield,
  'seller-conduct': FileText
};

export default function PoliciesPage() {
  const [activeSection, setActiveSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { policiesConfig } = useStore();
  const cfg = policiesConfig || INITIAL_POLICIES_CONFIG;
  const sections = cfg.sections || INITIAL_POLICIES_CONFIG.sections || [];

  // Handle hash scrolling on mount or change
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  const filteredSections = sections.filter(section => {
    if (activeSection !== 'all' && section.id !== activeSection) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (section.title && section.title.toLowerCase().includes(q)) ||
      (section.summary && section.summary.toLowerCase().includes(q)) ||
      (section.details && section.details.some(d => (d.heading && d.heading.toLowerCase().includes(q)) || (d.content && d.content.toLowerCase().includes(q))))
    );
  });

  return (
    <main className="min-h-screen bg-[#07080A] text-slate-300 pb-20">
      {/* Top Banner Header */}
      <section className="relative overflow-hidden border-b border-art-gold/20 bg-gradient-to-b from-[#120d04] via-[#090b10] to-[#07080A] pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Glow Accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-art-gold/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-art-green/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-art-gold/15 text-art-gold text-[10px] font-bold tracking-widest uppercase border border-art-gold/30">
                <ShieldCheck className="w-3.5 h-3.5 text-art-gold" />
                <span>{cfg.headerBadge || 'ARTELLIUM TRUST & LEGAL ARCHITECTURE'}</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
                {cfg.headerTitle || 'Policies & Collector Guarantees'}
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                {cfg.headerSubtitle || 'Protecting African artistic heritage, ensuring immutable provenance, and safeguarding every fine art transaction with WEMA Bank secured corporate settlement.'}
              </p>
            </div>

            {/* Quick Search */}
            <div className="w-full lg:w-80">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search policies (wema banking, provenance, refunds)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0F1117] border border-art-gold/30 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-art-gold transition shadow-inner"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Navigation Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-white/10 mb-10">
          <button
            onClick={() => setActiveSection('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition whitespace-nowrap ${
              activeSection === 'all'
                ? 'bg-art-gold text-art-black shadow-gold-glow'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            All Policies ({sections.length})
          </button>

          {sections.map((sec) => {
            const Icon = ICON_MAP[sec.id] || ShieldCheck;
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  const el = document.getElementById(sec.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap border ${
                  isSelected
                    ? 'bg-art-gold text-art-black border-art-gold font-bold shadow-gold-glow'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.shortTitle || sec.title}</span>
              </button>
            );
          })}
        </div>

        {/* Policy Grid / Articles */}
        <div className="space-y-12">
          {filteredSections.map((sec) => {
            const Icon = ICON_MAP[sec.id] || ShieldCheck;
            return (
              <article
                key={sec.id}
                id={sec.id}
                className="rounded-3xl bg-gradient-to-br from-[#0F1219] to-[#090B10] border border-art-gold/25 p-6 sm:p-10 shadow-2xl space-y-8 scroll-mt-28"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-art-gold via-amber-600 to-art-green p-0.5 shadow-gold-glow shrink-0">
                      <div className="w-full h-full bg-[#080A0E] rounded-[14px] flex items-center justify-center">
                        <Icon className="w-6 h-6 text-art-gold" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase border ${sec.badgeColor || 'bg-art-gold/15 text-art-gold border-art-gold/30'}`}>
                          {sec.badge || 'OFFICIAL COVENANT'}
                        </span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                        {sec.title}
                      </h2>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400 font-mono self-start sm:self-auto">
                    SECTION PROTOCOL #{sec.id.toUpperCase()}
                  </span>
                </div>

                {/* Summary Box */}
                {sec.summary && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-black/40 border border-art-gold/20 text-amber-100/90 text-xs sm:text-sm leading-relaxed font-sans">
                    <strong className="text-art-gold font-mono uppercase tracking-wider block mb-1">
                      Policy Executive Summary:
                    </strong>
                    {sec.summary}
                  </div>
                )}

                {/* Numbered Detailed Clauses */}
                <div className="space-y-6">
                  {(sec.details || []).map((detail, idx) => (
                    <div
                      key={detail.id || idx}
                      className="p-5 sm:p-6 rounded-2xl bg-black/30 border border-white/5 hover:border-art-gold/30 transition space-y-2 group"
                    >
                      <h3 className="font-serif font-bold text-base sm:text-lg text-white group-hover:text-art-gold transition flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{detail.heading}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                        {detail.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Section Footer Verification Link */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Backed by WEMA Bank Fiduciary Architecture & Legal Provenance Register</span>
                  </div>

                  <Link
                    href="/contact"
                    className="text-art-gold hover:underline font-bold flex items-center gap-1"
                  >
                    <span>Request Legal Dossier / Escrow Inquiry</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Trust Contact Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-[#140F05] via-[#0C0E14] to-[#140F05] border border-art-gold/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-art-gold/15 border border-art-gold/30 flex items-center justify-center text-art-gold mx-auto shadow-gold-glow">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-white">Have Questions Regarding Our Policies?</h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Our legal compliance team and curatorial ombudsman are available for private consultations and bespoke acquisition agreements.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-art-gold hover:brightness-110 text-art-black text-xs font-bold uppercase tracking-wider transition shadow-gold-glow"
            >
              <span>Contact Legal & Escrow Bureau</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}
