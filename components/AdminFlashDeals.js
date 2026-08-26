'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/store-context';
import { 
  Flame, 
  Plus, 
  Trash2, 
  Edit, 
  Percent, 
  Clock, 
  Tag, 
  CheckCircle2, 
  Eye, 
  X, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export default function AdminFlashDeals() {
  const { 
    flashDeals = [], 
    addFlashDeal, 
    updateFlashDeal, 
    deleteFlashDeal, 
    artworks = [], 
    currency 
  } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [selectedArtworkId, setSelectedArtworkId] = useState('');
  const [dealForm, setDealForm] = useState({
    title: '',
    artistName: '',
    country: 'Nigeria 🇳🇬',
    category: 'Painters',
    medium: '',
    originalPrice: 2000000,
    discountedPrice: 1500000,
    discountPercent: 25,
    availableUnits: 2,
    claimedPercent: 50,
    image: '',
    description: '',
    durationHours: 24
  });

  const formatPrice = (amount) => {
    if (!amount) return '₦0';
    if (currency === 'USD') return `$${Math.round(amount / 1480).toLocaleString()}`;
    return `₦${amount.toLocaleString()}`;
  };

  const handleArtworkSelect = (artId) => {
    setSelectedArtworkId(artId);
    const art = artworks.find(a => a.id === artId);
    if (art) {
      const orig = art.price || 2000000;
      const disc = Math.round(orig * 0.75);
      setDealForm({
        ...dealForm,
        artworkId: art.id,
        title: art.title,
        artistName: art.artistName,
        country: art.country ? `${art.country} ${art.countryFlag || '🌍'}` : 'Nigeria 🇳🇬',
        category: art.category || 'Painters',
        medium: art.medium || '',
        originalPrice: orig,
        discountedPrice: disc,
        discountPercent: 25,
        image: art.image || '',
        description: art.description || `Original masterpiece by ${art.artistName}.`
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDeal) {
      updateFlashDeal(editingDeal.id, dealForm);
      setEditingDeal(null);
    } else {
      addFlashDeal({
        ...dealForm,
        endsAt: Date.now() + 1000 * 60 * 60 * (Number(dealForm.durationHours) || 24)
      });
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-mono font-bold uppercase border border-red-200">
            <Flame className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>TIME-LIMITED VAULT DROPS</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Fine Art Flash Deals Control</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Configure slashed-price atelier vault discounts, manage active stock quotas, and adjust countdown closure timers across Africa.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDeal(null);
            setIsAddModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Launch New Flash Deal</span>
        </button>
      </div>

      {/* Grid of Active Flash Deals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flashDeals.map((deal) => (
          <div
            key={deal.id}
            className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
          >
            <div className="relative aspect-video w-full bg-slate-950">
              <img src={deal.image} alt={deal.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-red-600 text-white font-mono font-bold text-[10px] shadow">
                {deal.discountPercent}% OFF
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-amber-300 font-mono font-bold text-[10px]">
                {deal.availableUnits} Available
              </div>
            </div>

            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-mono text-amber-700 font-bold uppercase block">{deal.artistName}</span>
                <h3 className="font-serif text-lg font-bold text-slate-900">{deal.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2">{deal.description}</p>
              </div>

              {/* Progress & Prices */}
              <div className="space-y-2 pt-3 border-t border-slate-100 text-xs font-mono">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{deal.claimedPercent}% Claimed</span>
                  <span className="text-red-600 font-bold">Fast Selling</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${deal.claimedPercent}%` }} />
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <span className="font-serif text-lg font-bold text-red-600">{formatPrice(deal.discountedPrice)}</span>
                  <span className="text-xs text-slate-400 line-through">{formatPrice(deal.originalPrice)}</span>
                </div>

                {/* Admin Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setEditingDeal(deal);
                      setDealForm({ ...deal });
                      setIsAddModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Edit Flash Deal"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteFlashDeal(deal.id)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                    title="Delete Flash Deal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Flash Deal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-xs animate-scale-in space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                {editingDeal ? 'Edit Flash Deal' : 'Launch New Fine Art Flash Deal'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Existing Artwork or Custom */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select from Registered Artworks (Optional)</label>
                <select
                  value={selectedArtworkId}
                  onChange={(e) => handleArtworkSelect(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans"
                >
                  <option value="">-- Choose an Artwork to Auto-populate --</option>
                  {artworks.map(a => (
                    <option key={a.id} value={a.id}>{a.title} by {a.artistName} ({formatPrice(a.price)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  value={dealForm.title}
                  onChange={e => setDealForm({ ...dealForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Spirit of the Mask"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Artist Name *</label>
                  <input
                    type="text"
                    required
                    value={dealForm.artistName}
                    onChange={e => setDealForm({ ...dealForm, artistName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Country</label>
                  <input
                    type="text"
                    value={dealForm.country}
                    onChange={e => setDealForm({ ...dealForm, country: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Original Price (₦)</label>
                  <input
                    type="number"
                    required
                    value={dealForm.originalPrice}
                    onChange={e => {
                      const orig = Number(e.target.value);
                      const disc = Math.round(orig * (1 - (dealForm.discountPercent || 20) / 100));
                      setDealForm({ ...dealForm, originalPrice: orig, discountedPrice: disc });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount (%)</label>
                  <input
                    type="number"
                    required
                    value={dealForm.discountPercent}
                    onChange={e => {
                      const pct = Number(e.target.value);
                      const disc = Math.round((dealForm.originalPrice || 0) * (1 - pct / 100));
                      setDealForm({ ...dealForm, discountPercent: pct, discountedPrice: disc });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Slashed Price (₦)</label>
                  <input
                    type="number"
                    required
                    value={dealForm.discountedPrice}
                    onChange={e => setDealForm({ ...dealForm, discountedPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-red-600 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Available Units</label>
                  <input
                    type="number"
                    min="1"
                    value={dealForm.availableUnits}
                    onChange={e => setDealForm({ ...dealForm, availableUnits: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    value={dealForm.durationHours}
                    onChange={e => setDealForm({ ...dealForm, durationHours: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Artwork Image URL *</label>
                <input
                  type="url"
                  required
                  value={dealForm.image}
                  onChange={e => setDealForm({ ...dealForm, image: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description / Provenance Notes</label>
                <textarea
                  rows={2}
                  value={dealForm.description}
                  onChange={e => setDealForm({ ...dealForm, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-xl shadow-md"
                >
                  {editingDeal ? 'Update Deal' : 'Publish Flash Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
