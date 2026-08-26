'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Truck, 
  RotateCcw, 
  Shield, 
  FileText, 
  Award, 
  Sparkles, 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Mail,
  ChevronRight,
  Globe,
  HelpCircle
} from 'lucide-react';

export default function PoliciesPage() {
  const [activeSection, setActiveSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const policySections = [
    {
      id: 'provenance',
      title: 'Terms of Provenance & Authenticity',
      shortTitle: 'Provenance & Authenticity',
      icon: Award,
      badge: 'IMMUTABLE GUARANTEE',
      badgeColor: 'bg-art-gold/15 text-art-gold border-art-gold/30',
      summary: 'Every masterpiece listed on ARTELLIUM is backed by verifiable physical and digital certificates of authenticity.',
      details: [
        {
          heading: '1. Curatorial & Studio Verification',
          content: 'Every artwork on ARTELLIUM undergoes verification by accredited regional African curators and master ateliers. Physical works are inspected for medium accuracy, structural integrity, and verified studio origin before being approved for marketplace listing or live auction.'
        },
        {
          heading: '2. Dual Certificate of Authenticity (CoA)',
          content: 'Upon acquisition, each collector receives both a high-security physical Certificate of Authenticity—hand-signed with archival ink by the master creator and platform curator—and an immutable digital provenance certificate cryptographically bound to the artwork ID.'
        },
        {
          heading: '3. Historical Ledger Registration',
          content: 'All transacted masterworks are permanently cataloged in the Artellium Historical Provenance Ledger, establishing an unbreakable chain of custody that protects long-term collector value and museum resale legitimacy.'
        }
      ]
    },
    {
      id: 'wema-banking',
      title: 'WEMA Bank Secured Settlement & Direct Banking Policy',
      shortTitle: 'WEMA Bank Settlement',
      icon: Lock,
      badge: '100% CAPITAL SECURITY',
      badgeColor: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
      summary: 'Collector acquisition funds are processed and settled directly into the Artellium Global Marketplace Corporate Account with Wema Bank PLC.',
      details: [
        {
          heading: '1. Corporate Banking & Fiduciary Structure',
          content: 'All marketplace transactions, buyouts, and live auction lot settlements are routed directly to Artellium Global Marketplace Ltd corporate accounts held at Wema Bank PLC (Account No: 0123456789, Sort Code: 035150103, AlatPay Gateway by Wema). All funds are protected under Nigerian banking and international commercial trade regulations.'
        },
        {
          heading: '2. Instant Payment Verification & Direct Inflow',
          content: 'Direct bank transfers, AlatPay merchant payments, and verified card checkouts are verified in real time. Upon settlement confirmation, the acquiring collector is immediately issued an official corporate payment voucher alongside the permanent Digital Certificate of Authenticity (COA).'
        },
        {
          heading: '3. Transparent Commission Structure & Artist Net Disbursement',
          content: 'Under our curatorial charter, creator net earnings are disbursed directly into the master artist verified local or international bank account under verified fiduciary settlement protocol, while the platform commission covers curation, archival provenance cataloging, and digital certificate custody.'
        }
      ]
    },
    {
      id: 'consignment',
      title: 'Authenticity Guarantee & Consignment Policy',
      shortTitle: 'Authenticity & Consignment',
      icon: Award,
      badge: 'MUSEUM-GRADE ASSURANCE',
      badgeColor: 'bg-art-gold/15 text-art-gold border-art-gold/30',
      summary: 'Verified consignment terms, studio physical inspections, and certified collector ownership transfer.',
      details: [
        {
          heading: '1. Master Studio Consignment Protocol',
          content: 'All original oil canvases, bronze castings, terracotta sculptures, and mixed media works listed on Artellium are consigned directly by verified African master artists or accredited artist estates under binding consignment covenants.'
        },
        {
          heading: '2. Curatorial Inspection & Condition Reporting',
          content: 'Prior to marketplace accreditation, every consignment is evaluated for archival conservation quality, medium purity, and physical stability by regional curatorial partners across the continent.'
        },
        {
          heading: '3. Digital & Physical Ownership Transfer',
          content: 'Once payment is confirmed through our Wema Bank corporate gateway, full legal and artistic title is irrevocably transferred to the collector, accompanied by physical and digital certificates of authenticity.'
        }
      ]
    },
    {
      id: 'refunds',
      title: 'Refunds & Dispute Resolution Policy',
      shortTitle: 'Refunds & Disputes',
      icon: RotateCcw,
      badge: 'COLLECTOR PROTECTION',
      badgeColor: 'bg-red-950/60 text-red-400 border-red-800/60',
      summary: 'Clear, fair refund protocols for material discrepancies or unverified authenticity claims.',
      details: [
        {
          heading: '1. Eligibility for Full Refund',
          content: 'A collector is entitled to a 100% refund if: (a) the physical dimensions, medium, or signature materially differ from the catalog listing; or (b) an accredited curatorial panel challenges the authenticity of the piece.'
        },
        {
          heading: '2. Dispute Filing Procedure',
          content: 'To initiate an inspection dispute, the collector must notify Artellium Curatorial Support within 7 calendar days of receipt via support@artellium.com, submitting high-resolution photographs of the seals and artwork condition.'
        },
        {
          heading: '3. Resolution & Direct Bank Refund',
          content: 'Upon dispute approval, Artellium initiates a complete 100% direct bank refund to the collector account from our WEMA Bank corporate settlement ledger.'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy Policy & Data Protection',
      shortTitle: 'Privacy & Security',
      icon: Shield,
      badge: 'COLLECTOR CONFIDENTIALITY',
      badgeColor: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/60',
      summary: 'Strict confidentiality of high-net-worth collector identities, bidding privacy, and bank-grade data encryption.',
      details: [
        {
          heading: '1. Collector Anonymity & Bourse Discretion',
          content: 'We honor the tradition of fine art discretion. Private buyout offers and auction bids may be submitted under anonymous collector pseudonyms. Your legal identity and residential delivery address are strictly concealed from third parties and competing bidders.'
        },
        {
          heading: '2. Payment Tokenization & PCI Compliance',
          content: 'Artellium never stores raw credit card numbers, CVVs, or online banking passwords on our servers. All financial transactions are tokenized with 256-bit SSL encryption through PCI-DSS Level 1 certified processors.'
        },
        {
          heading: '3. Zero Data Monetization',
          content: 'We will never sell, rent, or lease collector or artist data to external marketing brokers. Information collected is used solely for order fulfillment, provenance verification, certificate issuance, and compliance with anti-money laundering (AML) fine art regulations.'
        }
      ]
    },
    {
      id: 'seller-conduct',
      title: 'Artist & Seller Code of Conduct',
      shortTitle: 'Seller Governance',
      icon: FileText,
      badge: 'ETHICAL MARKETPLACE',
      badgeColor: 'bg-purple-950/60 text-purple-400 border-purple-800/60',
      summary: 'Standards of excellence, intellectual property protection, and authenticity obligations for verified creators.',
      details: [
        {
          heading: '1. Originality & Authorship Guarantee',
          content: 'Sellers must be the direct creators or legally authorized estate representatives of the artworks listed. The upload of plagiarized work, unauthorized AI copies disguised as physical paintings, or forged heritage antiquities results in immediate lifetime ban and legal referral.'
        },
        {
          heading: '2. Listing Accuracy & Studio Timelines',
          content: 'Artists are required to maintain accurate inventory status, ship sold works within 3 business days of sale confirmation, and use only Artellium-approved conservation materials for crate packaging.'
        },
        {
          heading: '3. Fair Pricing & Commission Compliance',
          content: 'Artworks listed on Artellium must reflect fair global gallery pricing. Off-platform transaction circumvention intended to bypass verified settlement protection or platform commission is strictly prohibited.'
        }
      ]
    }
  ];

  const filteredSections = policySections.filter(section => {
    if (activeSection !== 'all' && section.id !== activeSection) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      section.title.toLowerCase().includes(q) ||
      section.summary.toLowerCase().includes(q) ||
      section.details.some(d => d.heading.toLowerCase().includes(q) || d.content.toLowerCase().includes(q))
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
          
          {/* Back Navigation & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-art-gold hover:text-art-black text-slate-400 text-xs font-semibold border border-white/10 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-art-gold font-mono uppercase tracking-wider">Platform Governance</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-art-gold/15 text-art-gold text-[10px] font-bold tracking-widest uppercase border border-art-gold/30">
                <ShieldCheck className="w-3.5 h-3.5 text-art-gold" />
                <span>ARTELLIUM TRUST & LEGAL ARCHITECTURE</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wide">
                Policies & Collector Guarantees
              </h1>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                Protecting African artistic heritage, ensuring immutable provenance, and safeguarding every fine art transaction with WEMA Bank secured corporate settlement.
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
            All Policies (6)
          </button>

          {policySections.map((sec) => {
            const Icon = sec.icon;
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
                <span>{sec.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Policy Grid / Articles */}
        <div className="space-y-12">
          {filteredSections.map((sec) => {
            const Icon = sec.icon;
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
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase border ${sec.badgeColor}`}>
                          {sec.badge}
                        </span>
                      </div>
                      <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                        {sec.title}
                      </h2>
                    </div>
                  </div>

                  <a
                    href={`#${sec.id}`}
                    className="text-xs text-slate-500 hover:text-art-gold font-mono flex items-center gap-1 transition"
                  >
                    <span>#{sec.id}</span>
                  </a>
                </div>

                {/* Summary Highlight Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-art-gold/5 border border-art-gold/20 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-art-gold shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif italic">
                    "{sec.summary}"
                  </p>
                </div>

                {/* Detailed Clauses */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {sec.details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2.5 hover:border-art-gold/30 transition flex flex-col justify-between"
                    >
                      <h3 className="font-serif text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-art-gold" />
                        <span>{detail.heading}</span>
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {detail.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer Assurance Tag */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Enforced across all African regional hubs & international consignments.</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-600">Last Revised: 2026</span>
                </div>
              </article>
            );
          })}

          {filteredSections.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 p-8 space-y-4">
              <AlertCircle className="w-10 h-10 text-art-gold mx-auto" />
              <h3 className="font-serif text-lg font-bold text-white">No Matching Policy Clauses Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No policy items matched "{searchQuery}". Try searching for terms like "settlement", "freight", "refund", or "provenance".
              </p>
              <button
                onClick={() => { setSearchQuery(''); setActiveSection('all'); }}
                className="px-4 py-2 bg-art-gold text-art-black text-xs font-bold uppercase rounded-xl"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </div>

        {/* Curatorial & Legal Inquiries Help Box */}
        <section className="mt-16 rounded-3xl bg-gradient-to-r from-[#120d04] via-[#090b10] to-[#07080A] border border-art-gold/30 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-art-gold/15 text-art-gold font-mono text-[10px] font-bold uppercase tracking-widest border border-art-gold/30">
              <Mail className="w-3.5 h-3.5" />
              <span>LEGAL & CURATORIAL LIAISON</span>
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Have Specific Provenance or Settlement Questions?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Our Curatorial Governance Board is available to assist collectors, institutional galleries, and master ateliers with customized consignment agreements, consular export permits, and private vault arrangements.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <a
                href="mailto:legal@artellium.com"
                className="px-5 py-2.5 rounded-xl bg-art-gold hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider transition shadow-gold-glow flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Legal Board</span>
              </a>
              <Link
                href="/explore"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition border border-white/10"
              >
                <span>Browse Marketplace</span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
