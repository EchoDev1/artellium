'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/store-context';
import { 
  Crown, 
  Plus, 
  Trash2, 
  Edit, 
  ShieldCheck, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Eye, 
  X, 
  Sparkles,
  DollarSign,
  Clock,
  UserCheck,
  Building
} from 'lucide-react';

export default function AdminRoyalHeirlooms() {
  const { 
    royalHeirlooms = [], 
    addRoyalHeirloom, 
    updateRoyalHeirloom, 
    deleteRoyalHeirloom,
    royalInquiries = [],
    updateRoyalInquiryStatus,
    currency 
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState('heirlooms'); // 'heirlooms' or 'inquiries'
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHeirloom, setEditingHeirloom] = useState(null);
  const [heirloomForm, setHeirloomForm] = useState({
    title: '',
    artistName: 'Guild of Royal Bronzecasters',
    dynasty: 'Kingdom of Benin (16th Century Lineage)',
    epoch: 'Imperial Antiquity',
    category: 'Imperial Bronzes',
    medium: 'Hand-Poured Cast Bronze & 24K Gold Inlay',
    dimensions: '50 × 30 × 20 cm',
    valuation: 15000000,
    status: 'Available for Private Treaty',
    image: '',
    description: '',
    authenticity: 'Certified by Pan-African Royal Heritage Registry · Dual Sealed'
  });

  const formatPrice = (amount) => {
    if (!amount) return '₦0';
    if (currency === 'USD') return `$${Math.round(amount / 1480).toLocaleString()}`;
    return `₦${amount.toLocaleString()}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingHeirloom) {
      updateRoyalHeirloom(editingHeirloom.id, heirloomForm);
      setEditingHeirloom(null);
    } else {
      addRoyalHeirloom(heirloomForm);
      setIsAddModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-mono font-bold uppercase border border-amber-200">
            <Crown className="w-3.5 h-3.5 text-art-gold" />
            <span>EXTREMELY RARE PAN-AFRICAN ROYAL HEIRLOOMS</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-slate-900">Royal Heirlooms & Custody Vault</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Archive imperial antiquities, manage museum valuations, oversee vault provenance hashes, and adjudicate private treaty inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('heirlooms')}
              className={`px-4 py-2 rounded-lg transition ${
                activeSubTab === 'heirlooms' ? 'bg-amber-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Heirlooms ({royalHeirlooms.length})
            </button>
            <button
              onClick={() => setActiveSubTab('inquiries')}
              className={`px-4 py-2 rounded-lg transition ${
                activeSubTab === 'inquiries' ? 'bg-amber-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Treaty Inquiries ({royalInquiries.length})
            </button>
          </div>

          <button
            onClick={() => {
              setEditingHeirloom(null);
              setIsAddModalOpen(true);
            }}
            className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Archive New Heirloom</span>
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: Heirlooms Catalog */}
      {activeSubTab === 'heirlooms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {royalHeirlooms.map((heirloom) => (
            <div
              key={heirloom.id}
              className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="relative aspect-[16/10] w-full bg-slate-950">
                <img src={heirloom.image} alt={heirloom.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/90 text-art-gold font-mono font-bold text-[10px] shadow border border-art-gold/40 flex items-center gap-1.5">
                  <Crown className="w-3 h-3" />
                  <span>{heirloom.dynasty}</span>
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/90 text-slate-300 font-mono text-[9px] border border-white/10">
                  {heirloom.provenanceHash}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-amber-700 font-bold uppercase block">
                    {heirloom.category} · {heirloom.dimensions}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-slate-900">{heirloom.title}</h3>
                  <p className="text-xs text-slate-500 font-serif italic">Attributed: {heirloom.artistName}</p>
                  <p className="text-xs text-slate-600 line-clamp-2 pt-1">{heirloom.description}</p>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    <span>Authentication Certificate</span>
                  </div>
                  <p className="text-[10px] text-amber-800">{heirloom.authenticity}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Museum Valuation</span>
                    <span className="font-serif text-xl font-bold text-amber-900">{formatPrice(heirloom.valuation)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingHeirloom(heirloom);
                        setHeirloomForm({ ...heirloom });
                        setIsAddModalOpen(true);
                      }}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title="Edit Heirloom"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteRoyalHeirloom(heirloom.id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                      title="Delete Heirloom"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-Tab 2: Treaty Inquiries */}
      {activeSubTab === 'inquiries' && (
        <div className="space-y-4">
          {royalInquiries.map((inq) => (
            <div
              key={inq.id}
              className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                      INQ #{inq.id}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{inq.date}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 mt-1">
                    {inq.heirloomTitle}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Proposed Acquisition Value</span>
                  <span className="font-serif text-lg font-bold text-art-gold">{formatPrice(inq.offerAmount)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Collector Lead</span>
                  <p className="font-bold text-slate-800">{inq.collectorName}</p>
                  <p className="text-slate-500 text-[11px]">{inq.collectorEmail} · {inq.collectorPhone}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Settlement Preference</span>
                  <p className="text-slate-700 font-semibold">{inq.settlementPreference || 'WEMA Bank Verified Settlement'}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Curatorial Notes</span>
                  <p className="text-slate-600 italic text-[11px]">{inq.notes || 'Standard treaty review.'}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase ${
                  inq.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                  inq.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  Status: {inq.status.replace(/_/g, ' ')}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateRoyalInquiryStatus(inq.id, 'approved', 'Private view appointment scheduled.')}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Approve VIP Viewing
                  </button>
                  <button
                    onClick={() => updateRoyalInquiryStatus(inq.id, 'under_curatorial_review')}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    Hold in Review
                  </button>
                  <button
                    onClick={() => updateRoyalInquiryStatus(inq.id, 'declined')}
                    className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 text-xs animate-scale-in space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                {editingHeirloom ? 'Edit Royal Heirloom' : 'Archive Imperial Masterpiece'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Heirloom Relic Title *</label>
                <input
                  type="text"
                  required
                  value={heirloomForm.title}
                  onChange={e => setHeirloomForm({ ...heirloomForm, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  placeholder="e.g. Queen Idia Commemorative Bronze Mask"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Dynasty / Court Lineage *</label>
                  <input
                    type="text"
                    required
                    value={heirloomForm.dynasty}
                    onChange={e => setHeirloomForm({ ...heirloomForm, dynasty: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Historical Epoch</label>
                  <input
                    type="text"
                    value={heirloomForm.epoch}
                    onChange={e => setHeirloomForm({ ...heirloomForm, epoch: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Medium & Metallurgy</label>
                  <input
                    type="text"
                    value={heirloomForm.medium}
                    onChange={e => setHeirloomForm({ ...heirloomForm, medium: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Valuation (₦)</label>
                  <input
                    type="number"
                    required
                    value={heirloomForm.valuation}
                    onChange={e => setHeirloomForm({ ...heirloomForm, valuation: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-amber-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Relic Image URL *</label>
                <input
                  type="url"
                  required
                  value={heirloomForm.image}
                  onChange={e => setHeirloomForm({ ...heirloomForm, image: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Authentication Credentials</label>
                <input
                  type="text"
                  value={heirloomForm.authenticity}
                  onChange={e => setHeirloomForm({ ...heirloomForm, authenticity: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Historical Dossier Description</label>
                <textarea
                  rows={3}
                  value={heirloomForm.description}
                  onChange={e => setHeirloomForm({ ...heirloomForm, description: e.target.value })}
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
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase rounded-xl shadow-md"
                >
                  {editingHeirloom ? 'Update Heirloom' : 'Archive Heirloom'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
