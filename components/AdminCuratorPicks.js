'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/store-context';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit, 
  Award, 
  Star, 
  Quote, 
  CheckCircle2, 
  Eye, 
  X, 
  Building2 
} from 'lucide-react';

export default function AdminCuratorPicks() {
  const { 
    curatorPicks = [], 
    addCuratorPick, 
    updateCuratorPick, 
    deleteCuratorPick, 
    artworks = [], 
    currency 
  } = useStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPick, setEditingPick] = useState(null);
  const [selectedArtworkId, setSelectedArtworkId] = useState('');
  const [pickForm, setPickForm] = useState({
    artworkId: '',
    title: '',
    artistName: '',
    country: 'Ghana 🇬🇭',
    category: 'Painters',
    medium: '',
    price: 1850000,
    curatorName: 'Dr. Nana Osei',
    curatorRole: 'Director of Contemporary African Art, Accra Art Trust',
    rating: 4.9,
    image: '',
    curatorCritique: '',
    exhibitionHall: 'West African Modernism Pavilion'
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
      setPickForm({
        ...pickForm,
        artworkId: art.id,
        title: art.title,
        artistName: art.artistName,
        country: art.country ? `${art.country} ${art.countryFlag || '🌍'}` : 'Ghana 🇬🇭',
        category: art.category || 'Painters',
        medium: art.medium || '',
        price: art.price || 1850000,
        image: art.image || ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPick) {
      updateCuratorPick(editingPick.id, pickForm);
      setEditingPick(null);
    } else {
      addCuratorPick(pickForm);
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-800 text-xs font-mono font-bold uppercase border border-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>INSTITUTIONAL CURATORIAL BOARD</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Curator Picks & Review Essays</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Publish expert curatorial reviews from premier African museum directors, assign artworks to exhibition halls, and manage institutional critique ratings.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingPick(null);
            setIsAddModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Curator Pick</span>
        </button>
      </div>

      {/* Curator Picks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {curatorPicks.map((pick) => (
          <div
            key={pick.id}
            className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
          >
            <div className="relative aspect-video w-full bg-slate-950">
              <img src={pick.image} alt={pick.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/90 text-purple-300 font-mono font-bold text-[10px] shadow border border-purple-500/40">
                {pick.exhibitionHall}
              </div>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-mono font-bold text-[10px] flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                <span>{pick.rating}</span>
              </div>
            </div>

            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-purple-700 font-bold uppercase block">{pick.artistName} ({pick.country})</span>
                <h3 className="font-serif text-xl font-bold text-slate-900">{pick.title}</h3>
                <p className="text-xs text-slate-500">{pick.medium}</p>
              </div>

              {/* Curator Quote Block */}
              <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-2 relative text-xs">
                <Quote className="w-4 h-4 text-purple-400 opacity-60" />
                <p className="font-serif italic text-slate-700 leading-relaxed line-clamp-3">
                  &ldquo;{pick.curatorCritique}&rdquo;
                </p>
                <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-purple-900">{pick.curatorName}</span>
                  <span className="text-slate-500 text-[10px]">{pick.curatorRole}</span>
                </div>
              </div>

              {/* Price & Admin Controls */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Valuation</span>
                  <span className="font-serif text-lg font-bold text-slate-900">{formatPrice(pick.price)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingPick(pick);
                      setPickForm({ ...pick });
                      setIsAddModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Edit Curator Pick"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCuratorPick(pick.id)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                    title="Delete Curator Pick"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-xs animate-scale-in space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                {editingPick ? 'Edit Curatorial Essay' : 'Publish New Curator Spotlight'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Artwork from Catalog</label>
                <select
                  value={selectedArtworkId}
                  onChange={(e) => handleArtworkSelect(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans"
                >
                  <option value="">-- Choose Registered Artwork --</option>
                  {artworks.map(a => (
                    <option key={a.id} value={a.id}>{a.title} by {a.artistName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Masterpiece Title *</label>
                <input
                  type="text"
                  required
                  value={pickForm.title}
                  onChange={e => setPickForm({ ...pickForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Artist Name *</label>
                  <input
                    type="text"
                    required
                    value={pickForm.artistName}
                    onChange={e => setPickForm({ ...pickForm, artistName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Country</label>
                  <input
                    type="text"
                    value={pickForm.country}
                    onChange={e => setPickForm({ ...pickForm, country: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Curator Name *</label>
                  <input
                    type="text"
                    required
                    value={pickForm.curatorName}
                    onChange={e => setPickForm({ ...pickForm, curatorName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. Dr. Nana Osei"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Curator Institutional Role</label>
                  <input
                    type="text"
                    value={pickForm.curatorRole}
                    onChange={e => setPickForm({ ...pickForm, curatorRole: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. Senior Curator, Accra Trust"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Exhibition Pavilion Hall</label>
                  <input
                    type="text"
                    value={pickForm.exhibitionHall}
                    onChange={e => setPickForm({ ...pickForm, exhibitionHall: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rating (1.0 - 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={pickForm.rating}
                    onChange={e => setPickForm({ ...pickForm, rating: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Artwork Image URL *</label>
                <input
                  type="url"
                  required
                  value={pickForm.image}
                  onChange={e => setPickForm({ ...pickForm, image: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Curatorial Critique Essay *</label>
                <textarea
                  rows={4}
                  required
                  value={pickForm.curatorCritique}
                  onChange={e => setPickForm({ ...pickForm, curatorCritique: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-serif italic"
                  placeholder="In-depth analysis of cultural lineage, spiritual symbolism, and artistic mastery..."
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
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold uppercase rounded-xl shadow-md"
                >
                  {editingPick ? 'Update Essay' : 'Publish Curator Pick'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
