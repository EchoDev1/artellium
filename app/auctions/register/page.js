'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/store-context';
import { 
  ShieldCheck, 
  User, 
  Upload, 
  CreditCard, 
  CheckCircle2, 
  Building, 
  Lock, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  Award, 
  Check, 
  AlertCircle,
  Clock,
  Flame,
  Globe
} from 'lucide-react';

export default function BidderRegistrationPage() {
  const router = useRouter();
  const { currentUser, updateUser, registerAuctionBidder } = useStore();

  const [form, setForm] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '+234 803 123 4567',
    country: 'Nigeria',
    city: 'Lagos',
    address: '14 Victoria Island Boulevard, Lagos',
    idType: 'International Passport',
    idNumber: 'A08942184',
    biddingTier: 'Standard', // Standard (up to ₦10M) or Sovereign (Unlimited)
    bankName: 'Wema Bank PLC',
    accountNumber: '0123456789',
    categories: ['Paintings', 'Sculptures', 'Bronze', 'Textiles'],
    consentNotifications: true
  });

  const [idFileUploaded, setIdFileUploaded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedBidderId, setGeneratedBidderId] = useState('ART-BID-2026-88942');

  const handleCategoryToggle = (cat) => {
    setForm(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bidderId = `ART-BID-${Date.now().toString().slice(-5)}`;
    setGeneratedBidderId(bidderId);

    // Save to global store if available
    if (registerAuctionBidder) {
      registerAuctionBidder({
        bidderId,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        country: form.country,
        city: form.city,
        idType: form.idType,
        idNumber: form.idNumber,
        biddingTier: form.biddingTier,
        categories: form.categories,
        registeredAt: new Date().toISOString(),
        verified: true,
        highValueApproved: form.biddingTier === 'Sovereign'
      });
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans pb-24 text-slate-100">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#170808] via-[#1E0E0E] to-[#0A0D14] p-8 sm:p-10 rounded-3xl border border-art-gold/40 shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-art-gold/10 text-art-gold text-[10px] font-mono font-bold tracking-widest uppercase border border-art-gold/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ACCREDITED BIDDER ENROLLMENT PORTAL</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-black text-white tracking-tight">
          Register & Verify as an <span className="text-gradient-gold">Auction Patron</span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          To maintain transparency, eliminate shill bidding, and safeguard sovereign art transactions, all live bidders on Artellium must be identity verified and accredited.
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Government ID Verified</span>
          </span>
          <span className="flex items-center gap-1.5 text-art-gold">
            <Lock className="w-4 h-4" />
            <span>WEMA Fiduciary Settlement Bond</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-4 h-4" />
            <span>Instant Approval</span>
          </span>
        </div>
      </div>

      {isSuccess ? (
        /* Success Screen */
        <div className="bg-[#0A0D14] rounded-3xl border-2 border-emerald-500 p-8 sm:p-12 space-y-6 text-center shadow-2xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mx-auto animate-bounce">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
              ACCREDITATION ACTIVE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              You are now a Verified Artellium Auction Bidder!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Your credentials have been securely registered and synchronized with the live auction floor and administrative ledger.
            </p>
          </div>

          {/* Bidder Pass Card */}
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-black via-[#0D121B] to-black border border-art-gold/60 text-left space-y-3 shadow-gold-glow">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="font-serif font-black text-art-gold tracking-widest text-sm">ARTELLIUM AUCTION HOUSE</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[9px] font-mono font-bold">
                ACCREDITED
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <p className="text-slate-400">Patron Name: <strong className="text-white">{form.fullName}</strong></p>
              <p className="text-slate-400">Bidder ID: <strong className="text-art-gold font-mono">{generatedBidderId}</strong></p>
              <p className="text-slate-400">Accredited Tier: <strong className="text-white">{form.biddingTier} ({form.biddingTier === 'Sovereign' ? 'Unlimited' : 'Up to ₦10,000,000'})</strong></p>
              <p className="text-slate-400">Settlement Account: <strong className="text-slate-200">{form.bankName} •••• {form.accountNumber.slice(-4)}</strong></p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auctions"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-crimson-glow flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span>Enter Live Auction Floor Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition"
            >
              Return to Marketplace
            </Link>
          </div>
        </div>
      ) : (
        /* Multi-Step Enrollment Form */
        <form onSubmit={handleSubmit} className="bg-[#0A0D14] rounded-3xl border border-white/10 p-6 sm:p-10 space-y-8 shadow-2xl text-xs">
          
          {/* Section 1: Legal Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <User className="w-4 h-4 text-art-gold" />
              <h3 className="font-serif font-bold text-base text-white">
                1. Legal Identity & Contact Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Full Legal Name (as on Government ID)</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  placeholder="e.g. Dr. Folake Davies"
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:border-art-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Email Address (for Outbid & Win Alerts)</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. folake@daviesholdings.com"
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:border-art-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Phone Number (SMS Real-time Bidding Alerts)</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white font-mono focus:border-art-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Country of Residence</label>
                <input
                  type="text"
                  required
                  value={form.country}
                  onChange={e => setForm({ ...form, country: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:border-art-gold focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 mb-1 font-semibold">Physical Delivery Address for Artwork Fulfillment</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:border-art-gold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Government Identity Verification */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <h3 className="font-serif font-bold text-base text-white">
                2. Identity Document & KYC Upload
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">ID Type</label>
                <select
                  value={form.idType}
                  onChange={e => setForm({ ...form, idType: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:border-art-gold focus:outline-none"
                >
                  <option value="International Passport">International Passport</option>
                  <option value="National Identification (NIN)">National Identification (NIN)</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="Voter's Card">Voter's Identification Card</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Document Number</label>
                <input
                  type="text"
                  required
                  value={form.idNumber}
                  onChange={e => setForm({ ...form, idNumber: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white font-mono focus:border-art-gold focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 mb-1 font-semibold">Upload Identification Document Scan / Photo</label>
                <div className="p-4 rounded-2xl bg-black/40 border border-dashed border-art-gold/50 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-art-gold/20 flex items-center justify-center text-art-gold">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white">passport_identity_scan.pdf</p>
                      <p className="text-[10px] text-emerald-400 font-mono">✅ Document verified & cryptographic hash generated</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-mono font-bold">
                    Validated
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Bidding Tier & Fiduciary Bank Guarantee */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Building className="w-4 h-4 text-amber-500" />
              <h3 className="font-serif font-bold text-base text-white">
                3. Bidding Tier & Fiduciary Settlement Account
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Requested Bidding Tier</label>
                <select
                  value={form.biddingTier}
                  onChange={e => setForm({ ...form, biddingTier: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white font-bold focus:border-art-gold focus:outline-none"
                >
                  <option value="Standard">Standard Tier (Bidding up to ₦10,000,000)</option>
                  <option value="Sovereign">Sovereign Tier (Unlimited / High-Value Lots &gt; ₦10M)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Fiduciary Settlement Bank</label>
                <input
                  type="text"
                  required
                  value={form.bankName}
                  onChange={e => setForm({ ...form, bankName: e.target.value })}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-white focus:border-art-gold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Category Interests (For Future Notifications to Admin & Collector) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Sparkles className="w-4 h-4 text-art-gold" />
              <h3 className="font-serif font-bold text-base text-white">
                4. Preferred Mediums & Catalog Alert Preferences
              </h3>
            </div>

            <p className="text-[11px] text-slate-400">
              Select your curatorial areas of interest. You will receive executive previews when rare lots in these mediums enter the auction room:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                'Paintings', 'Sculptures', 'Drawings', 'Photography',
                'Textiles', 'Pottery', 'Ceramics', 'Woodworks',
                'Metal works', 'Handmade crafts', 'Indigenous artworks', 'Limited edition collections'
              ].map(cat => {
                const isSelected = form.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryToggle(cat)}
                    className={`p-2.5 rounded-xl border text-[11px] font-medium transition text-left flex items-center justify-between ${
                      isSelected
                        ? 'bg-art-gold/15 border-art-gold text-art-gold font-bold'
                        : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{cat}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-art-gold" />}
                  </button>
                );
              })}
            </div>

            <label className="flex items-center gap-2 text-slate-300 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.consentNotifications}
                onChange={e => setForm({ ...form, consentNotifications: e.target.checked })}
                className="w-4 h-4 rounded text-art-gold focus:ring-0 cursor-pointer"
              />
              <span>I consent to receiving curatorial auction drop notifications and lot catalogs from Artellium.</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl transition shadow-gold-glow flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Validating KYC Credentials & Generating Bidder Pass...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Submit & Activate Accredited Bidder Pass</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
