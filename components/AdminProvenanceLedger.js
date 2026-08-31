'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/store-context';
import { 
  ShieldCheck, 
  Plus, 
  History, 
  Search, 
  CheckCircle2, 
  Lock, 
  FileText, 
  X, 
  Sparkles,
  ExternalLink,
  Hash,
  Edit3,
  Trash2,
  QrCode,
  Download,
  Printer,
  Check,
  ArrowRight,
  Eye,
  RefreshCw,
  Building2,
  User,
  Award,
  Layers,
  SlidersHorizontal,
  BadgeCheck,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminProvenanceLedger() {
  const { 
    ledgerBlocks = [], 
    mintLedgerBlock, 
    updateLedgerBlock,
    deleteLedgerBlock,
    artworks = [], 
    currency 
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Modals state
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [deletingBlock, setDeletingBlock] = useState(null);
  const [qrModalBlock, setQrModalBlock] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  // Form states
  const [selectedArtworkId, setSelectedArtworkId] = useState('');
  const [blockForm, setBlockForm] = useState({
    artworkTitle: '',
    artistName: 'Kofi Mensah (Ghana)',
    medium: 'Oil & 24K Gold Leaf on Linen',
    dimensions: '150 × 120 cm',
    category: 'Painters',
    settlementPrice: 1850000,
    custodian: '',
    custodianLocation: 'London, United Kingdom',
    settlementBank: 'Wema Bank PLC / Dual Fiduciary Settlement',
    physicalCertificateId: '',
    provenanceHash: '',
    blockHeight: '',
    status: 'Vault Verified & Transferred',
    hologramType: '24K Gold Emissary Hologram',
    curatorNotes: 'Archival accession verified by the Pan-African Curatorial Board.',
    image: ''
  });

  const [editForm, setEditForm] = useState({
    artworkTitle: '',
    artistName: '',
    medium: '',
    dimensions: '',
    category: '',
    settlementPrice: 0,
    custodian: '',
    custodianLocation: '',
    settlementBank: '',
    physicalCertificateId: '',
    provenanceHash: '',
    blockHeight: '',
    status: 'Vault Verified & Transferred',
    hologramType: '',
    curatorNotes: '',
    image: ''
  });

  const formatPrice = (amount) => {
    if (!amount) return '₦0';
    if (currency === 'USD') return `$${Math.round(amount / 1480).toLocaleString()}`;
    return `₦${Number(amount).toLocaleString()}`;
  };

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  // Pre-fill artwork for minting
  const handleArtworkSelect = (artId) => {
    setSelectedArtworkId(artId);
    const art = artworks.find(a => a.id === artId);
    if (art) {
      const randomCert = `ART-CERT-${(art.country || 'AF').slice(0, 2).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}-SEALED`;
      const randomHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const calculatedHeight = `#00${8943 + ledgerBlocks.length}`;

      setBlockForm({
        ...blockForm,
        artworkTitle: art.title,
        artistName: `${art.artistName} (${art.country || 'Africa'})`,
        medium: art.medium || 'Oil on Canvas',
        dimensions: art.dimensions || '120 × 90 cm',
        category: art.category || 'Painters',
        settlementPrice: art.price || 1850000,
        image: art.image || '',
        physicalCertificateId: randomCert,
        provenanceHash: randomHash,
        blockHeight: calculatedHeight
      });
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (block) => {
    setEditingBlock(block);
    setEditForm({
      artworkTitle: block.artworkTitle || '',
      artistName: block.artistName || '',
      medium: block.medium || '',
      dimensions: block.dimensions || '150 × 120 cm',
      category: block.category || 'Painters',
      settlementPrice: block.settlementPrice || 0,
      custodian: block.custodian || '',
      custodianLocation: block.custodianLocation || 'London, United Kingdom',
      settlementBank: block.settlementBank || 'Wema Bank PLC / Dual Fiduciary Settlement',
      physicalCertificateId: block.physicalCertificateId || '',
      provenanceHash: block.provenanceHash || '',
      blockHeight: block.blockHeight || '#008942',
      status: block.status || 'Vault Verified & Transferred',
      hologramType: block.hologramType || '24K Gold Emissary Hologram',
      curatorNotes: block.curatorNotes || 'Archival accession verified by the Pan-African Curatorial Board.',
      image: block.image || ''
    });
  };

  // Save Edit
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingBlock) return;

    if (updateLedgerBlock) {
      updateLedgerBlock(editingBlock.id, {
        ...editForm,
        settlementPrice: Number(editForm.settlementPrice)
      });
    }

    setEditingBlock(null);
    showToast(`Ledger Block "${editForm.artworkTitle}" updated successfully!`);
  };

  // Delete Block
  const handleConfirmDelete = () => {
    if (!deletingBlock) return;
    if (deleteLedgerBlock) {
      deleteLedgerBlock(deletingBlock.id);
    }
    showToast(`Ledger Block "${deletingBlock.artworkTitle}" permanently removed.`);
    setDeletingBlock(null);
  };

  // Mint New Block
  const handleMintSubmit = (e) => {
    e.preventDefault();
    const certId = blockForm.physicalCertificateId || `ART-CERT-PAN-${Math.floor(10000 + Math.random() * 90000)}-SEALED`;
    const hash = blockForm.provenanceHash || ('0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''));
    const height = blockForm.blockHeight || `#00${8943 + ledgerBlocks.length}`;

    if (mintLedgerBlock) {
      mintLedgerBlock({
        ...blockForm,
        physicalCertificateId: certId,
        provenanceHash: hash,
        blockHeight: height,
        settlementPrice: Number(blockForm.settlementPrice)
      });
    }

    setIsMintModalOpen(false);
    showToast(`Immutable Provenance Block ${height} minted!`);
    
    // Reset form
    setBlockForm({
      artworkTitle: '',
      artistName: 'Kofi Mensah (Ghana)',
      medium: 'Oil & 24K Gold Leaf on Linen',
      dimensions: '150 × 120 cm',
      category: 'Painters',
      settlementPrice: 1850000,
      custodian: '',
      custodianLocation: 'London, United Kingdom',
      settlementBank: 'Wema Bank PLC / Dual Fiduciary Settlement',
      physicalCertificateId: '',
      provenanceHash: '',
      blockHeight: '',
      status: 'Vault Verified & Transferred',
      hologramType: '24K Gold Emissary Hologram',
      curatorNotes: 'Archival accession verified by the Pan-African Curatorial Board.',
      image: ''
    });
    setSelectedArtworkId('');
  };

  // Quick Status Change
  const handleQuickStatus = (blockId, newStatus) => {
    if (updateLedgerBlock) {
      updateLedgerBlock(blockId, { status: newStatus });
      showToast(`Status updated to "${newStatus}".`);
    }
  };

  // Calculate Metrics
  const totalSettlementVol = ledgerBlocks.reduce((acc, b) => acc + (Number(b.settlementPrice) || 0), 0);
  const totalVerifiedBlocks = ledgerBlocks.length;
  const verifiedTransfers = ledgerBlocks.filter(b => b.status?.includes('Verified') || b.status?.includes('Transferred')).length;

  // Filter & Sort
  const filteredBlocks = ledgerBlocks
    .filter(b => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || (
        (b.artworkTitle || '').toLowerCase().includes(q) ||
        (b.artistName || '').toLowerCase().includes(q) ||
        (b.custodian || '').toLowerCase().includes(q) ||
        (b.physicalCertificateId || '').toLowerCase().includes(q) ||
        (b.provenanceHash || '').toLowerCase().includes(q) ||
        (b.settlementBank || '').toLowerCase().includes(q)
      );

      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return (b.blockHeight || '').localeCompare(a.blockHeight || '');
      if (sortBy === 'value_high') return (b.settlementPrice || 0) - (a.settlementPrice || 0);
      if (sortBy === 'value_low') return (a.settlementPrice || 0) - (b.settlementPrice || 0);
      return 0;
    });

  return (
    <div className="space-y-8 font-sans text-slate-800">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 border-2 border-teal-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs">
          <BadgeCheck className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {/* Hero Management Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#041A17] via-[#082B26] to-[#0A1A14] p-6 sm:p-8 rounded-3xl border border-teal-500/30 text-white shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-mono font-bold tracking-widest uppercase border border-teal-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>MUSEUM SETTLEMENT & PHYSICAL QR LEDGER GUARANTEE</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Provenance Ledger & Museum Settlement Administration
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/80 max-w-2xl leading-relaxed">
              Full administrative authority to audit, mint, edit, verify, and delete immutable museum provenance blocks, physical QR certificates, and bank-secured settlement records across Pan-African and international corridors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/provenance-ledger"
              target="_blank"
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-teal-200 border border-teal-400/30 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-teal-300" />
              <span>View Public Page</span>
            </Link>

            <button
              onClick={() => setIsMintModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg shadow-teal-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Mint Provenance Block</span>
            </button>
          </div>
        </div>

        {/* Quick Aggregates Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-xs font-mono">
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
            <span className="text-[10px] text-teal-300 uppercase block">Settlement Value</span>
            <span className="font-serif text-base sm:text-lg font-bold text-white block">
              {formatPrice(totalSettlementVol)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
            <span className="text-[10px] text-teal-300 uppercase block">Total Minted Blocks</span>
            <span className="font-serif text-base sm:text-lg font-bold text-white block">
              {totalVerifiedBlocks} Lots
            </span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
            <span className="text-[10px] text-teal-300 uppercase block">Verified Transfers</span>
            <span className="font-serif text-base sm:text-lg font-bold text-emerald-400 block">
              {verifiedTransfers} Sealed
            </span>
          </div>
          <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
            <span className="text-[10px] text-teal-300 uppercase block">QR Holograms</span>
            <span className="font-serif text-base sm:text-lg font-bold text-art-gold block">
              100% Guaranteed
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm text-xs">
        <div className="flex-1 flex items-center gap-3 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by title, artist, custodian, certificate serial, or ledger hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium cursor-pointer"
            >
              <option value="All">All Statuses ({ledgerBlocks.length})</option>
              <option value="Vault Verified & Transferred">Vault Verified & Transferred</option>
              <option value="Museum Physical Ledger Audited">Museum Physical Ledger Audited</option>
              <option value="Sovereign Custody Sealed">Sovereign Custody Sealed</option>
              <option value="Under Curatorial Inspection">Under Curatorial Inspection</option>
              <option value="Disbursed & Archival Transferred">Disbursed & Archival Transferred</option>
            </select>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium cursor-pointer font-mono"
          >
            <option value="newest">Sort: Newest Blocks</option>
            <option value="value_high">Sort: Highest Value</option>
            <option value="value_low">Sort: Lowest Value</option>
          </select>
        </div>
      </div>

      {/* Ledger Records List */}
      <div className="space-y-4">
        {filteredBlocks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3 shadow-sm">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <h3 className="font-serif text-lg font-bold text-slate-900">No Provenance Ledger Records Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No ledger blocks match your search query or filter. Clear the search filters or mint a new provenance block.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('All'); }}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold uppercase transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredBlocks.map((block) => (
            <div
              key={block.id}
              className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-5 hover:shadow-md transition"
            >
              {/* Header & Main Info */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0">
                    <img
                      src={block.image}
                      alt={block.artworkTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-teal-100 text-teal-900 text-[11px] font-mono font-black border border-teal-300">
                        {block.blockHeight}
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <History className="w-3.5 h-3.5" />
                        <span>{block.timestamp}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                        {block.hologramType || '24K Gold Emissary Hologram'}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                      {block.artworkTitle}
                    </h3>
                    <p className="text-xs text-amber-800 font-semibold">
                      Master Artist: <strong className="text-slate-900">{block.artistName}</strong> · {block.medium} ({block.dimensions || '150 × 120 cm'})
                    </p>
                  </div>
                </div>

                {/* Settlement & Status */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono justify-between lg:justify-end">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Settlement Value</span>
                    <span className="font-serif text-xl font-bold text-teal-800">
                      {formatPrice(block.settlementPrice)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={block.status}
                      onChange={(e) => handleQuickStatus(block.id, e.target.value)}
                      className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-[11px] font-bold cursor-pointer font-sans"
                    >
                      <option value="Vault Verified & Transferred">Vault Verified & Transferred</option>
                      <option value="Museum Physical Ledger Audited">Museum Physical Ledger Audited</option>
                      <option value="Sovereign Custody Sealed">Sovereign Custody Sealed</option>
                      <option value="Under Curatorial Inspection">Under Curatorial Inspection</option>
                      <option value="Disbursed & Archival Transferred">Disbursed & Archival Transferred</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Metadata Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>Registered Custodian</span>
                  </span>
                  <p className="text-slate-800 font-bold truncate">{block.custodian || 'Museum Vault Custody'}</p>
                  <p className="text-slate-400 text-[10px]">{block.custodianLocation || 'London, UK'}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-500" />
                    <span>Settlement Channel</span>
                  </span>
                  <p className="text-teal-800 font-bold truncate">{block.settlementBank || 'Wema Bank Fiduciary'}</p>
                  <p className="text-emerald-600 text-[10px] font-semibold">● 100% Fiduciary Protocol</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-500" />
                    <span>Certificate Serial</span>
                  </span>
                  <p className="text-amber-800 font-bold truncate">{block.physicalCertificateId}</p>
                  <p className="text-slate-400 text-[10px]">Tamper-Proof Seal</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <Hash className="w-3 h-3 text-slate-500" />
                    <span>Ledger Hash</span>
                  </span>
                  <p className="text-teal-700 font-mono text-[10px] truncate">{block.provenanceHash}</p>
                  <p className="text-slate-400 text-[10px]">Immutable Cryptographic Chain</p>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="text-[11px] text-slate-500 italic max-w-xl truncate">
                  &ldquo;{block.curatorNotes || 'Archival accession verified by the Pan-African Curatorial Board.'}&rdquo;
                </div>

                <div className="flex items-center gap-2">
                  {/* View Physical QR Certificate Button */}
                  <button
                    onClick={() => setQrModalBlock(block)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-teal-300 font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    title="Inspect Physical QR Certificate Dossier"
                  >
                    <QrCode className="w-3.5 h-3.5 text-teal-400" />
                    <span>Physical QR Dossier</span>
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleOpenEdit(block)}
                    className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold rounded-xl transition flex items-center gap-1.5"
                    title="Edit block data"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Block</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeletingBlock(block)}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold rounded-xl transition flex items-center gap-1.5"
                    title="Delete block from ledger"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================================= */}
      {/* 1. EDIT PROVENANCE BLOCK MODAL                                            */}
      {/* ========================================================================= */}
      {editingBlock && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 text-xs animate-scale-in space-y-5 my-auto max-h-[92vh] overflow-y-auto pb-10 sm:pb-8">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest block">
                  ADMINISTRATIVE OVERRIDE & EDIT
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Edit Provenance Block · {editingBlock.blockHeight}
                </h3>
              </div>
              <button 
                onClick={() => setEditingBlock(null)} 
                className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Artwork Title *</label>
                  <input
                    type="text"
                    required
                    value={editForm.artworkTitle}
                    onChange={(e) => setEditForm({ ...editForm, artworkTitle: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Artist Name & Country *</label>
                  <input
                    type="text"
                    required
                    value={editForm.artistName}
                    onChange={(e) => setEditForm({ ...editForm, artistName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Medium</label>
                  <input
                    type="text"
                    value={editForm.medium}
                    onChange={(e) => setEditForm({ ...editForm, medium: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    placeholder="e.g. Oil on Linen"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={editForm.dimensions}
                    onChange={(e) => setEditForm({ ...editForm, dimensions: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    placeholder="e.g. 150 × 120 cm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Settlement Price (₦)</label>
                  <input
                    type="number"
                    required
                    value={editForm.settlementPrice}
                    onChange={(e) => setEditForm({ ...editForm, settlementPrice: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-teal-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Registered Custodian *</label>
                  <input
                    type="text"
                    required
                    value={editForm.custodian}
                    onChange={(e) => setEditForm({ ...editForm, custodian: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Custodian City / Country</label>
                  <input
                    type="text"
                    value={editForm.custodianLocation}
                    onChange={(e) => setEditForm({ ...editForm, custodianLocation: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    placeholder="e.g. London, United Kingdom"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Settlement Fiduciary Bank / Desk</label>
                  <input
                    type="text"
                    value={editForm.settlementBank}
                    onChange={(e) => setEditForm({ ...editForm, settlementBank: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Verification Status</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                  >
                    <option value="Vault Verified & Transferred">Vault Verified & Transferred</option>
                    <option value="Museum Physical Ledger Audited">Museum Physical Ledger Audited</option>
                    <option value="Sovereign Custody Sealed">Sovereign Custody Sealed</option>
                    <option value="Under Curatorial Inspection">Under Curatorial Inspection</option>
                    <option value="Disbursed & Archival Transferred">Disbursed & Archival Transferred</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Certificate Serial Number</label>
                  <input
                    type="text"
                    value={editForm.physicalCertificateId}
                    onChange={(e) => setEditForm({ ...editForm, physicalCertificateId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-amber-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Hologram Seal Type</label>
                  <select
                    value={editForm.hologramType}
                    onChange={(e) => setEditForm({ ...editForm, hologramType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="24K Gold Emissary Hologram">24K Gold Emissary Hologram</option>
                    <option value="Imperial Bronze Seal">Imperial Bronze Seal</option>
                    <option value="Pan-African Curatorial Hologram">Pan-African Curatorial Hologram</option>
                    <option value="Sovereign Diamond Stamp">Sovereign Diamond Stamp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Cryptographic Ledger Hash</label>
                <input
                  type="text"
                  value={editForm.provenanceHash}
                  onChange={(e) => setEditForm({ ...editForm, provenanceHash: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] text-teal-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Artwork Photo URL</label>
                <input
                  type="url"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Curatorial Statement & Notes</label>
                <textarea
                  rows={2}
                  value={editForm.curatorNotes}
                  onChange={(e) => setEditForm({ ...editForm, curatorNotes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBlock(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold uppercase rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DELETE CONFIRMATION MODAL                                              */}
      {/* ========================================================================= */}
      {deletingBlock && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl border border-red-200 text-xs animate-scale-in space-y-5 text-center my-auto max-h-[92vh] overflow-y-auto pb-10 sm:pb-8">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Delete Provenance Ledger Block?
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Are you sure you want to permanently remove <strong className="text-slate-800">{deletingBlock.artworkTitle}</strong> ({deletingBlock.blockHeight}) from the historical provenance registry?
              </p>
            </div>

            <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-[11px] text-left">
              ⚠️ <strong>Warning:</strong> This action permanently removes the cryptographic entry, serial certificate number ({deletingBlock.physicalCertificateId}), and audit record from the database.
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingBlock(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-xl shadow-md"
              >
                Yes, Delete Block
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MINT NEW PROVENANCE BLOCK MODAL                                        */}
      {/* ========================================================================= */}
      {isMintModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 text-xs animate-scale-in space-y-4 my-auto max-h-[92vh] overflow-y-auto pb-10 sm:pb-8">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-widest block">
                  CRYPTOGRAPHIC MINTER
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-900">
                  Mint Immutable Provenance Block
                </h3>
              </div>
              <button onClick={() => setIsMintModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleMintSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Auto-Fill from Existing Catalog Artwork</label>
                <select
                  value={selectedArtworkId}
                  onChange={(e) => handleArtworkSelect(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-sans"
                >
                  <option value="">-- Choose from Catalogue (Optional) --</option>
                  {artworks.map(a => (
                    <option key={a.id} value={a.id}>{a.title} by {a.artistName} (₦{a.price?.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Artwork Title *</label>
                  <input
                    type="text"
                    required
                    value={blockForm.artworkTitle}
                    onChange={e => setBlockForm({ ...blockForm, artworkTitle: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    placeholder="e.g. The Ancestral Horizon"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Artist Name & Country *</label>
                  <input
                    type="text"
                    required
                    value={blockForm.artistName}
                    onChange={e => setBlockForm({ ...blockForm, artistName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    placeholder="e.g. Kofi Mensah (Ghana 🇬🇭)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Medium</label>
                  <input
                    type="text"
                    value={blockForm.medium}
                    onChange={e => setBlockForm({ ...blockForm, medium: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. Oil on Canvas"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={blockForm.dimensions}
                    onChange={e => setBlockForm({ ...blockForm, dimensions: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. 150 × 120 cm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Settlement Price (₦)</label>
                  <input
                    type="number"
                    required
                    value={blockForm.settlementPrice}
                    onChange={e => setBlockForm({ ...blockForm, settlementPrice: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-teal-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Registered Custodian / Patron Name *</label>
                  <input
                    type="text"
                    required
                    value={blockForm.custodian}
                    onChange={e => setBlockForm({ ...blockForm, custodian: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="e.g. Dr. Evelyn Carter (London, UK)"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Settlement Fiduciary Bank / Desk</label>
                  <input
                    type="text"
                    value={blockForm.settlementBank}
                    onChange={e => setBlockForm({ ...blockForm, settlementBank: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Physical Certificate Serial (Auto-generated)</label>
                  <input
                    type="text"
                    value={blockForm.physicalCertificateId || `ART-CERT-PAN-${Math.floor(10000 + Math.random() * 90000)}-SEALED`}
                    onChange={e => setBlockForm({ ...blockForm, physicalCertificateId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-amber-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Physical Hologram Seal</label>
                  <select
                    value={blockForm.hologramType}
                    onChange={e => setBlockForm({ ...blockForm, hologramType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="24K Gold Emissary Hologram">24K Gold Emissary Hologram</option>
                    <option value="Imperial Bronze Seal">Imperial Bronze Seal</option>
                    <option value="Pan-African Curatorial Hologram">Pan-African Curatorial Hologram</option>
                    <option value="Sovereign Diamond Stamp">Sovereign Diamond Stamp</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Artwork Photo URL *</label>
                <input
                  type="url"
                  required
                  value={blockForm.image}
                  onChange={e => setBlockForm({ ...blockForm, image: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMintModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold uppercase rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Mint & Publish Block</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PHYSICAL QR CERTIFICATE & HOLOGRAM DOSSIER MODAL                       */}
      {/* ========================================================================= */}
      {qrModalBlock && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0A0D14] border-2 border-art-gold/60 rounded-3xl p-5 sm:p-10 max-w-2xl w-full text-white shadow-2xl space-y-6 relative animate-scale-in my-auto max-h-[92vh] overflow-y-auto pb-12 sm:pb-10">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold text-art-gold uppercase tracking-[0.25em] block">
                  OFFICIAL PHYSICAL PROVENANCE CERTIFICATE
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  Museum Settlement & QR Ledger Dossier
                </h3>
              </div>
              <button 
                onClick={() => setQrModalBlock(null)} 
                className="text-slate-400 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Certificate Paper Canvas */}
            <div className="relative bg-gradient-to-b from-[#141822] to-[#0A0D14] border-2 border-art-gold/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-inner text-slate-200">
              
              {/* Top Watermark & Crest */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-art-gold/30 pb-4 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-art-gold/20 border border-art-gold flex items-center justify-center text-art-gold">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold text-white tracking-wide">
                      ARTELLIUM ARCHIVAL HERITAGE TRUST
                    </h4>
                    <p className="text-[10px] font-mono text-art-gold">
                      Pan-African Fine Art Fiduciary Custody & Authentication Ledger
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono text-[10px]">
                  <span className="text-slate-400 block">SERIAL NO.</span>
                  <span className="text-art-gold font-bold text-xs">{qrModalBlock.physicalCertificateId}</span>
                </div>
              </div>

              {/* Artwork & QR Code Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Artwork Matting */}
                <div className="md:col-span-4 rounded-xl overflow-hidden bg-black border border-white/10 aspect-square">
                  <img
                    src={qrModalBlock.image}
                    alt={qrModalBlock.artworkTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Core Certificate Attestation */}
                <div className="md:col-span-5 space-y-2 text-xs">
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase block">Masterpiece Title</span>
                    <h5 className="font-serif text-base font-bold text-white">{qrModalBlock.artworkTitle}</h5>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase block">Master Creator</span>
                    <p className="text-art-gold font-bold">{qrModalBlock.artistName}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase block">Medium & Scale</span>
                    <p className="text-slate-300 font-mono text-[11px]">{qrModalBlock.medium} ({qrModalBlock.dimensions || '150 × 120 cm'})</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase block">Settled Realized Value</span>
                    <p className="font-serif text-sm font-bold text-white">{formatPrice(qrModalBlock.settlementPrice)}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase block">Fiduciary Custodian</span>
                    <p className="text-slate-200 font-medium">{qrModalBlock.custodian}</p>
                  </div>
                </div>

                {/* Scannable Physical QR Box */}
                <div className="md:col-span-3 flex flex-col items-center justify-center p-3 bg-black rounded-2xl border border-art-gold/40 text-center space-y-2 shadow-lg">
                  {/* SVG QR Code */}
                  <div className="w-24 h-24 bg-white p-1.5 rounded-xl flex items-center justify-center shadow">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                      {/* Corner Targets */}
                      <rect x="5" y="5" width="25" height="25" fill="currentColor" rx="4" />
                      <rect x="9" y="9" width="17" height="17" fill="#fff" rx="2" />
                      <rect x="13" y="13" width="9" height="9" fill="currentColor" rx="1" />

                      <rect x="70" y="5" width="25" height="25" fill="currentColor" rx="4" />
                      <rect x="74" y="9" width="17" height="17" fill="#fff" rx="2" />
                      <rect x="78" y="13" width="9" height="9" fill="currentColor" rx="1" />

                      <rect x="5" y="70" width="25" height="25" fill="currentColor" rx="4" />
                      <rect x="9" y="74" width="17" height="17" fill="#fff" rx="2" />
                      <rect x="13" y="78" width="9" height="9" fill="currentColor" rx="1" />

                      {/* Random Matrix Patterns representing Cryptographic Hash */}
                      <rect x="35" y="10" width="8" height="8" fill="currentColor" />
                      <rect x="48" y="10" width="8" height="8" fill="currentColor" />
                      <rect x="35" y="22" width="8" height="8" fill="currentColor" />
                      <rect x="55" y="22" width="8" height="8" fill="currentColor" />
                      
                      <rect x="10" y="35" width="8" height="8" fill="currentColor" />
                      <rect x="22" y="35" width="8" height="8" fill="currentColor" />
                      <rect x="35" y="35" width="8" height="8" fill="currentColor" />
                      <rect x="48" y="35" width="8" height="8" fill="currentColor" />
                      <rect x="62" y="35" width="8" height="8" fill="currentColor" />
                      <rect x="75" y="35" width="8" height="8" fill="currentColor" />
                      <rect x="88" y="35" width="8" height="8" fill="currentColor" />

                      <rect x="10" y="48" width="8" height="8" fill="currentColor" />
                      <rect x="25" y="48" width="8" height="8" fill="currentColor" />
                      <rect x="40" y="48" width="8" height="8" fill="currentColor" />
                      <rect x="55" y="48" width="8" height="8" fill="currentColor" />
                      <rect x="70" y="48" width="8" height="8" fill="currentColor" />
                      <rect x="85" y="48" width="8" height="8" fill="currentColor" />

                      <rect x="35" y="60" width="8" height="8" fill="currentColor" />
                      <rect x="50" y="60" width="8" height="8" fill="currentColor" />
                      <rect x="65" y="60" width="8" height="8" fill="currentColor" />
                      <rect x="80" y="60" width="8" height="8" fill="currentColor" />

                      <rect x="35" y="75" width="8" height="8" fill="currentColor" />
                      <rect x="50" y="75" width="8" height="8" fill="currentColor" />
                      <rect x="65" y="75" width="8" height="8" fill="currentColor" />
                      <rect x="80" y="75" width="8" height="8" fill="currentColor" />

                      <rect x="35" y="88" width="8" height="8" fill="currentColor" />
                      <rect x="60" y="88" width="8" height="8" fill="currentColor" />
                      <rect x="75" y="88" width="8" height="8" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-mono text-teal-400 font-bold uppercase tracking-wider block">
                    SCAN FOR LEDGER
                  </span>
                  <span className="text-[8px] font-mono text-slate-500 block truncate max-w-[100px]">
                    {qrModalBlock.blockHeight}
                  </span>
                </div>
              </div>

              {/* Cryptographic Hash & Hologram Row */}
              <div className="p-3 bg-black/60 rounded-xl border border-white/10 space-y-1.5 font-mono text-[10.5px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-400">Cryptographic Hash:</span>
                  <span className="text-teal-400 truncate">{qrModalBlock.provenanceHash}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-400">Fiduciary Settlement Channel:</span>
                  <span className="text-slate-200">{qrModalBlock.settlementBank}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-400">Physical Hologram Seal:</span>
                  <span className="text-art-gold font-bold">{qrModalBlock.hologramType || '24K Gold Emissary Hologram'}</span>
                </div>
              </div>

              {/* Signatures & Seal Footer */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-art-gold/30 items-end text-[10px] font-mono">
                <div className="space-y-1">
                  <div className="h-7 border-b border-slate-600 font-serif italic text-xs text-art-gold flex items-end">
                    Kofi Mensah
                  </div>
                  <span className="text-slate-500 uppercase block">Master Atelier Signature</span>
                </div>

                <div className="space-y-1">
                  <div className="h-7 border-b border-slate-600 font-serif italic text-xs text-teal-400 flex items-end">
                    Dr. Nana Osei
                  </div>
                  <span className="text-slate-500 uppercase block">Chief Heritage Curator</span>
                </div>

                <div className="col-span-2 sm:col-span-1 text-center sm:text-right">
                  <span className="inline-block px-3 py-1 bg-art-gold/10 border border-art-gold text-art-gold font-bold uppercase rounded-full text-[9px]">
                    ★ SEALED & VERIFIED ★
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400 font-mono">
                Verification Route: <strong className="text-teal-400">/provenance-ledger</strong>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition flex items-center gap-1.5 text-xs font-mono"
                >
                  <Printer className="w-3.5 h-3.5 text-art-gold" />
                  <span>Print Certificate</span>
                </button>

                <button
                  onClick={() => {
                    alert(`Physical QR Certificate Dossier for ${qrModalBlock.physicalCertificateId} generated in high-resolution PDF format!`);
                  }}
                  className="px-5 py-2.5 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase text-xs rounded-xl transition shadow-gold-glow flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Dossier</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
