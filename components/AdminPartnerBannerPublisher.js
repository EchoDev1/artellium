'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/store-context';
import { Building, Film, Image as ImageIcon, Plus, CheckCircle2, Sparkles, Link as LinkIcon } from 'lucide-react';

export default function AdminPartnerBannerPublisher() {
  const { addDirectPriorityBannerPlacement } = useStore();
  const [form, setForm] = useState({
    partnerName: '',
    title: '',
    description: '',
    mediaType: 'image',
    image: '',
    videoUrl: '',
    price: '',
    ctaText: 'Explore Partner Offer',
    ctaLink: '/explore',
    badge: 'OFFICIAL PARTNER SPONSORSHIP · AD'
  });
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title) return;

    addDirectPriorityBannerPlacement({
      isPartnerAd: true,
      partnerName: form.partnerName || 'Official Establishment Partner',
      artistName: form.partnerName || 'Official Establishment Partner',
      title: form.title,
      description: form.description,
      mediaType: form.mediaType,
      image: form.image || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1400',
      videoUrl: form.mediaType === 'video' ? form.videoUrl : '',
      price: form.price ? Number(form.price) : undefined,
      ctaText: form.ctaText || 'Explore Partner Offer',
      ctaLink: form.ctaLink || '/explore',
      badge: form.badge || 'OFFICIAL PARTNER SPONSORSHIP · AD',
      plan: 'partner_sponsorship',
      pricePaid: 0
    });

    setSuccessMsg(`Partner Ad "${form.title}" has been published to the Homepage TV Ad Banner!`);
    setForm({
      partnerName: '',
      title: '',
      description: '',
      mediaType: 'image',
      image: '',
      videoUrl: '',
      price: '',
      ctaText: 'Explore Partner Offer',
      ctaLink: '/explore',
      badge: 'OFFICIAL PARTNER SPONSORSHIP · AD'
    });
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="p-6 bg-amber-50/40 rounded-2xl border border-amber-200 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Building className="w-5 h-5 text-amber-600" />
          <h4 className="font-serif font-bold text-slate-900 text-base">
            Establishment & Corporate Partner Ad Publisher (Photo, Write-Up, or Video Ad)
          </h4>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
          TV Ad Banner Ready
        </span>
      </div>

      <p className="text-xs text-slate-600">
        Partner with luxury establishments, galleries, or corporate sponsors to display a full-bleed product photo, write-up, or short promotional video directly on the homepage TV ad banner.
      </p>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Partner / Establishment Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Eko Hotel & Suites / Sotheby's"
              value={form.partnerName}
              onChange={(e) => setForm({ ...form, partnerName: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Product / Campaign Headline</label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Heritage Luxury Watch Collection"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Ad Media Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, mediaType: 'image' })}
                className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                  form.mediaType === 'image'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Photo Ad</span>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, mediaType: 'video' })}
                className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                  form.mediaType === 'video'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Short Video Ad</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {form.mediaType === 'video' ? 'Cover / Poster Image URL (Optional)' : 'Full-Screen Product / Artwork Photo URL'}
            </label>
            <input
              type="text"
              required={form.mediaType === 'image'}
              placeholder="https://images.unsplash.com/..."
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {form.mediaType === 'video' ? (
            <div>
              <label className="font-bold text-amber-900 block mb-1">Short Ad Video URL (.mp4 or YouTube URL)</label>
              <input
                type="text"
                required
                placeholder="/videos/artist-savannah.mp4 or https://..."
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                className="w-full bg-amber-50 border border-amber-300 rounded-xl p-2.5 text-slate-900 focus:border-amber-600 focus:outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="font-bold text-slate-700 block mb-1">Optional Product Price / Offer Valuation (₦)</label>
              <input
                type="number"
                placeholder="Leave blank if no price needed"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        <div>
          <label className="font-bold text-slate-700 block mb-1">Promotional Write-Up / Ad Description</label>
          <textarea
            rows={2}
            placeholder="Write a compelling promotional summary or product story to appear on the TV banner..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div>
            <label className="font-bold text-slate-700 block mb-1">CTA Button Text</label>
            <input
              type="text"
              value={form.ctaText}
              onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Target Destination Link</label>
            <input
              type="text"
              value={form.ctaLink}
              onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
              placeholder="/explore or https://partner-site.com"
              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-5 bg-gradient-to-r from-amber-600 to-amber-700 hover:brightness-110 text-white font-bold uppercase tracking-wider rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Partner Ad to TV Banner</span>
          </button>
        </div>
      </form>
    </div>
  );
}
