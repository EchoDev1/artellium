'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/store-context';
import { Crown, CheckCircle2, Award, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ArtistRegisterPage() {
  const router = useRouter();
  const { switchUserRole } = useStore();
  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly vs yearly
  const [selectedPlan, setSelectedPlan] = useState('premium'); // standard vs premium
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    artistCategory: 'Painters',
    country: 'Nigeria',
    bio: '',
    portfolioUrl: '',
  });

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    switchUserRole('artist');
    setTimeout(() => {
      router.push('/artist/dashboard');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-art-gold/10 border border-art-gold/40 text-art-gold text-xs font-bold">
          <Crown className="w-4 h-4" />
          <span>JOIN THE ARTELLIUM ARTIST & SELLER NETWORK</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
          Artist Subscription & Registration
        </h1>

        <p className="text-xs sm:text-sm text-slate-300">
          Sell your paintings, sculptures, and digital art with automated backend tracking and global buyer exposure.
        </p>

        {/* Monthly vs Yearly Toggle */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-art-gold' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-7 bg-art-black-card border border-art-gold/50 rounded-full p-1 transition relative"
          >
            <div
              className={`w-5 h-5 rounded-full bg-art-gold transition transform ${
                billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
          <span className={`text-xs font-semibold ${billingCycle === 'yearly' ? 'text-art-gold' : 'text-slate-400'}`}>
            Yearly Billing <span className="text-[10px] text-emerald-400 font-bold">(Discounted)</span>
          </span>
        </div>
      </div>

      {/* Subscription Cards Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Standard Category */}
        <div
          onClick={() => setSelectedPlan('standard')}
          className={`p-8 rounded-3xl cursor-pointer transition duration-300 relative border flex flex-col justify-between ${
            selectedPlan === 'standard'
              ? 'bg-art-black-card border-art-gold shadow-gold-glow'
              : 'bg-art-black/80 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-white">Standard Category</h3>
              <span className="badge-emerald text-xs px-3 py-0.5 rounded-full font-bold">Standard Tier</span>
            </div>

            <div className="space-y-1">
              {billingCycle === 'monthly' ? (
                <div>
                  <span className="font-serif text-3xl font-bold text-art-gold">₦30,000</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
              ) : (
                <div>
                  <span className="font-serif text-3xl font-bold text-art-gold">₦200,000</span>
                  <span className="text-xs text-slate-400"> / year (Discounted)</span>
                </div>
              )}
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-white/10">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-art-gold shrink-0" />
                <span>Upload up to 15 Artworks per month</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-art-gold shrink-0" />
                <span>Personalized Artist Profile & Brief Bio</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-art-gold shrink-0" />
                <span>Standard Marketplace Listing</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <div
              className={`w-full py-3 rounded-xl text-center text-xs font-bold uppercase transition ${
                selectedPlan === 'standard'
                  ? 'bg-art-gold text-art-black'
                  : 'bg-white/10 text-slate-300'
              }`}
            >
              {selectedPlan === 'standard' ? 'Selected Plan' : 'Select Standard'}
            </div>
          </div>
        </div>

        {/* Premium Category */}
        <div
          onClick={() => setSelectedPlan('premium')}
          className={`p-8 rounded-3xl cursor-pointer transition duration-300 relative border flex flex-col justify-between ${
            selectedPlan === 'premium'
              ? 'glass-card-gold border-art-gold shadow-gold-glow'
              : 'bg-art-black/80 border-white/10 hover:border-white/20'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-white">Premium Category</h3>
              <span className="badge-gold text-xs px-3 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-art-gold" />
                <span>Gold Crest</span>
              </span>
            </div>

            <div className="space-y-1">
              {billingCycle === 'monthly' ? (
                <div>
                  <span className="font-serif text-3xl font-bold text-art-gold">₦50,000</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
              ) : (
                <div>
                  <span className="font-serif text-3xl font-bold text-art-gold">₦350,000</span>
                  <span className="text-xs text-slate-400"> / year (Discounted)</span>
                </div>
              )}
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-white/10">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-art-gold shrink-0" />
                <span>Unlimited High-Resolution Art Uploads</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-art-gold shrink-0" />
                <span>Priority Homepage Hero Spotlight Placement</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-art-gold shrink-0" />
                <span>Access to ARTELLIUM Live Auction Arena</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-art-gold shrink-0" />
                <span>Pop-up Video Interview Inclusion</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <div
              className={`w-full py-3 rounded-xl text-center text-xs font-bold uppercase transition ${
                selectedPlan === 'premium'
                  ? 'bg-art-gold text-art-black shadow-gold-glow'
                  : 'bg-white/10 text-slate-300'
              }`}
            >
              {selectedPlan === 'premium' ? 'Selected Premium Plan' : 'Select Premium'}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleRegistrationSubmit} className="max-w-2xl mx-auto bg-art-black-card p-8 rounded-3xl border border-white/10 space-y-4">
        <h3 className="font-serif text-xl font-bold text-white mb-2">Artist Profile Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Full Name / Studio Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Kofi Mensah"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-art-black border border-white/10 rounded-xl p-3 text-white focus:border-art-gold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. kofi@artellium.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-art-black border border-white/10 rounded-xl p-3 text-white focus:border-art-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 mb-1 font-medium">Primary Art Category</label>
            <select
              value={formData.artistCategory}
              onChange={(e) => setFormData({ ...formData, artistCategory: e.target.value })}
              className="w-full bg-art-black border border-white/10 rounded-xl p-3 text-white focus:border-art-gold focus:outline-none cursor-pointer"
            >
              <option value="Painters">Oil & Canvas Painter</option>
              <option value="Sculpture Makers">Bronze / Wood Sculptor</option>
              <option value="Digital Art">Afrofuturist Digital Creator</option>
              <option value="Mixed Media">Mixed Media / Textile</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-medium">Country of Origin</label>
            <input
              type="text"
              required
              placeholder="e.g. Ghana, Nigeria, Kenya"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full bg-art-black border border-white/10 rounded-xl p-3 text-white focus:border-art-gold focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-300 mb-1 font-medium">Brief Bio & Creative Statement</label>
          <textarea
            rows="4"
            required
            placeholder="Share your artistic background, medium specializations, and inspiration..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-art-black border border-white/10 rounded-xl p-3 text-xs text-white focus:border-art-gold focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-gold-glow flex items-center justify-center gap-2"
        >
          {isSubmitted ? 'Processing Account Registration...' : 'Complete Artist Registration & Launch Dashboard'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
