'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/store-context';
import { 
  Users, 
  ShieldCheck, 
  Search, 
  Flame, 
  Crown, 
  Mail, 
  Phone, 
  Send, 
  Download, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  X, 
  Lock, 
  Unlock, 
  Sparkles, 
  Eye, 
  Calendar, 
  Globe, 
  Tag, 
  ChevronRight,
  History,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

export default function AdminAuctionBidders() {
  const { 
    auctionBidders = [], 
    updateBidderHighValueApproval, 
    deleteAuctionBidder, 
    broadcastNotification, 
    currency,
    artworks = [] 
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedBidder, setSelectedBidder] = useState(null);

  // Broadcast Notification Modal State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState('all');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState('');

  // Direct Message to Single Bidder
  const [directMessageBidder, setDirectMessageBidder] = useState(null);
  const [directMsgText, setDirectMsgText] = useState('');
  const [directMsgSuccess, setDirectMsgSuccess] = useState('');

  const formatPrice = (amount) => {
    if (!amount) return '₦0';
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  // Filtered Bidders
  const filteredBidders = useMemo(() => {
    return auctionBidders.filter(b => {
      const matchSearch = 
        b.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.phone?.includes(searchTerm) ||
        b.bidderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.country?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTier = filterTier === 'all' || b.biddingTier?.toLowerCase() === filterTier.toLowerCase();
      const matchCat = filterCategory === 'all' || b.categories?.some(c => c.toLowerCase() === filterCategory.toLowerCase());

      return matchSearch && matchTier && matchCat;
    });
  }, [auctionBidders, searchTerm, filterTier, filterCategory]);

  // Aggregate Metrics
  const totalBiddersCount = auctionBidders.length;
  const totalSovereignCount = auctionBidders.filter(b => b.highValueApproved || b.biddingTier === 'Sovereign').length;
  const totalVolumeBidded = auctionBidders.reduce((acc, b) => acc + (b.totalVolumeBidded || 0), 0);
  const activeBiddersCount = auctionBidders.filter(b => (b.totalBidsPlaced || 0) > 0).length;

  // Handle Broadcast Send
  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    broadcastNotification(`📢 Auction Drop Alert (${broadcastTarget.toUpperCase()}): ${broadcastMessage}`);
    setBroadcastSuccess(`Alert dispatched to ${broadcastTarget === 'all' ? totalBiddersCount : filteredBidders.length} registered collectors!`);
    
    setTimeout(() => {
      setBroadcastSuccess('');
      setIsBroadcastModalOpen(false);
      setBroadcastMessage('');
    }, 2000);
  };

  // Handle Direct Message
  const handleSendDirectMessage = (e) => {
    e.preventDefault();
    if (!directMsgText.trim() || !directMessageBidder) return;

    broadcastNotification(`VIP Concierge Message sent to ${directMessageBidder.fullName} (${directMessageBidder.email})`);
    setDirectMsgSuccess(`Message transmitted to ${directMessageBidder.fullName}!`);

    setTimeout(() => {
      setDirectMsgSuccess('');
      setDirectMessageBidder(null);
      setDirectMsgText('');
    }, 2000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Bidder ID,Full Name,Email,Phone,Country,Tier,Verified,High Value Approved,Total Bids,Total Volume,Active Lots,Registered At'];
    const rows = auctionBidders.map(b => [
      `"${b.bidderId}"`,
      `"${b.fullName}"`,
      `"${b.email}"`,
      `"${b.phone}"`,
      `"${b.country}"`,
      `"${b.biddingTier}"`,
      `"${b.verified ? 'Yes' : 'No'}"`,
      `"${b.highValueApproved ? 'Yes' : 'No'}"`,
      b.totalBidsPlaced || 0,
      b.totalVolumeBidded || 0,
      `"${(b.activeLots || []).join('; ')}"`,
      `"${b.registeredAt}"`
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `artellium_auction_bidders_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-950 via-slate-900 to-black text-white border border-red-800/40 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-900/60 text-red-300 text-[10px] font-mono font-bold tracking-widest uppercase border border-red-700/60">
            <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>AUCTION PATRON & BIDDER DIRECTORY</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Registered Bidders & <span className="text-gradient-gold">Patron Leads</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Centralized directory capturing every accredited bidder, active lot bids, KYC verification records, and curatorial medium preferences for future auction drop campaigns.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-crimson-glow flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Auction Drop</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-xs rounded-xl transition border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">Total Bidders</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <p className="font-serif text-2xl font-black text-slate-900">{totalBiddersCount}</p>
          <p className="text-[10px] text-emerald-600 font-bold">100% KYC Verified</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">Active Bidders</span>
            <Flame className="w-4 h-4 text-red-500" />
          </div>
          <p className="font-serif text-2xl font-black text-red-600">{activeBiddersCount}</p>
          <p className="text-[10px] text-slate-500">Live In Bidding Arena</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">Sovereign VIPs</span>
            <Crown className="w-4 h-4 text-art-gold" />
          </div>
          <p className="font-serif text-2xl font-black text-amber-600">{totalSovereignCount}</p>
          <p className="text-[10px] text-amber-700 font-bold">High-Value Approved (&gt;₦5M)</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">Cumulative Bid Vol</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="font-serif text-2xl font-black text-emerald-700">{formatPrice(totalVolumeBidded)}</p>
          <p className="text-[10px] text-emerald-600 font-bold">Total Placed Commitments</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone, ID, country..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-red-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Tier Filter */}
          <select
            value={filterTier}
            onChange={e => setFilterTier(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:border-red-500 focus:outline-none"
          >
            <option value="all">All Bidding Tiers</option>
            <option value="sovereign">Sovereign VIP (Unlimited)</option>
            <option value="standard">Standard (Up to ₦10M)</option>
          </select>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:border-red-500 focus:outline-none"
          >
            <option value="all">All Medium Preferences</option>
            <option value="Paintings">Paintings</option>
            <option value="Sculptures">Sculptures / Bronze</option>
            <option value="Textiles">Textiles</option>
            <option value="Ceramics">Ceramics</option>
            <option value="Woodworks">Woodworks</option>
            <option value="Drawings">Drawings</option>
          </select>

          <span className="text-slate-400 font-mono text-[11px]">
            Showing <strong>{filteredBidders.length}</strong> of {totalBiddersCount}
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono uppercase text-[10.5px]">
              <tr>
                <th className="py-3.5 px-4 font-bold">Patron / Bidder</th>
                <th className="py-3.5 px-4 font-bold">Contact & KYC ID</th>
                <th className="py-3.5 px-4 font-bold">Recent Bid Activity</th>
                <th className="py-3.5 px-4 font-bold">Total Volume</th>
                <th className="py-3.5 px-4 font-bold">Preferred Mediums</th>
                <th className="py-3.5 px-4 font-bold text-center">VIP Clearance</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredBidders.map(bidder => {
                const isHighValue = bidder.highValueApproved || bidder.biddingTier === 'Sovereign';

                return (
                  <tr key={bidder.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* Patron Name & ID */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-art-gold flex items-center justify-center font-bold font-serif shrink-0 shadow-sm">
                          {bidder.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <span>{bidder.fullName}</span>
                            {isHighValue && (
                              <span className="p-0.5 rounded bg-amber-100 text-amber-800" title="Sovereign VIP Clearance">
                                <Crown className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-[10px] text-art-gold font-bold bg-slate-900 px-1.5 py-0.5 rounded">
                            {bidder.bidderId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact & KYC */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center gap-1 text-slate-900 font-mono text-[11px]">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{bidder.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 font-mono text-[10.5px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{bidder.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{bidder.idType} ({bidder.country})</span>
                      </div>
                    </td>

                    {/* Recent Bid Activity */}
                    <td className="py-3.5 px-4 space-y-1">
                      {bidder.lastBidPlaced ? (
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {bidder.lastBidPlaced.lotNumber} • {bidder.lastBidPlaced.artworkTitle}
                          </span>
                          <span className="text-red-600 font-mono font-bold text-[11px]">
                            {formatPrice(bidder.lastBidPlaced.amount)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No bids placed yet</span>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono block">
                        {bidder.totalBidsPlaced || 0} Total Bids Recorded
                      </span>
                    </td>

                    {/* Total Volume */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                      {formatPrice(bidder.totalVolumeBidded || 0)}
                    </td>

                    {/* Preferred Mediums */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(bidder.categories || []).map((cat, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* VIP Clearance Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => updateBidderHighValueApproval(bidder.id, !isHighValue)}
                        className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition flex items-center justify-center gap-1 mx-auto ${
                          isHighValue
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {isHighValue ? (
                          <>
                            <Lock className="w-3 h-3 text-emerald-700" />
                            <span>VIP Approved</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-3 h-3 text-slate-400" />
                            <span>Standard</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDirectMessageBidder(bidder)}
                          className="p-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-lg transition"
                          title="Send Direct Curatorial Alert"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedBidder(bidder)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                          title="View Bidder Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove bidder profile for ${bidder.fullName}?`)) {
                              deleteAuctionBidder(bidder.id);
                            }
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-red-100 hover:text-red-800 text-slate-400 rounded-lg transition"
                          title="Delete Bidder Record"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* BROADCAST AUCTION DROP NOTIFICATION MODAL                                */}
      {/* ========================================================================= */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-8 shadow-2xl space-y-4 text-xs my-auto max-h-[92vh] overflow-y-auto pb-10 sm:pb-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-lg">
                <Send className="w-5 h-5 text-red-600" />
                <span>Broadcast Curatorial Auction Drop</span>
              </div>
              <button onClick={() => setIsBroadcastModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-base font-bold p-1">✕</button>
            </div>

            {broadcastSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
                <Check className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
                <p className="text-sm font-bold text-emerald-800">{broadcastSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSendBroadcast} className="space-y-4">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Target Audience Segment</label>
                  <select
                    value={broadcastTarget}
                    onChange={e => setBroadcastTarget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:border-red-500 focus:outline-none"
                  >
                    <option value="all">All Accredited Bidders ({totalBiddersCount} Patrons)</option>
                    <option value="sovereign">Sovereign VIP Bidders Only ({totalSovereignCount} High-Net-Worth Patrons)</option>
                    <option value="paintings">Patrons Interested in Paintings</option>
                    <option value="bronze">Patrons Interested in Bronze & Sculptures</option>
                    <option value="textiles">Patrons Interested in Textiles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Broadcast Message / Catalog Announcement</label>
                  <textarea
                    rows={4}
                    required
                    value={broadcastMessage}
                    onChange={e => setBroadcastMessage(e.target.value)}
                    placeholder="e.g. Rare 18th Century Benin Bronze Queen lot is entering the Live Arena in 24 hours. Pre-register for executive floor access..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-red-500 focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800">
                  ⚡ Notifications will be transmitted directly to collector accounts, SMS alerts, and registered email portals.
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsBroadcastModalOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-bold uppercase rounded-xl shadow"
                  >
                    Transmit Drop Alert
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIRECT MESSAGE TO SINGLE BIDDER MODAL                                     */}
      {/* ========================================================================= */}
      {directMessageBidder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-xs my-auto max-h-[92vh] overflow-y-auto pb-10 sm:pb-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-base">
                <Mail className="w-4 h-4 text-red-600" />
                <span>Direct Alert · {directMessageBidder.fullName}</span>
              </div>
              <button onClick={() => setDirectMessageBidder(null)} className="text-slate-400 hover:text-slate-700 font-bold p-1">✕</button>
            </div>

            {directMsgSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1">
                <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-800">{directMsgSuccess}</p>
              </div>
            ) : (
              <form onSubmit={handleSendDirectMessage} className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-200">
                  <p className="text-slate-600">Patron Email: <strong className="text-slate-900">{directMessageBidder.email}</strong></p>
                  <p className="text-slate-600">Bidder ID: <strong className="text-red-700 font-mono">{directMessageBidder.bidderId}</strong></p>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Custom Message / Auction Update</label>
                  <textarea
                    rows={4}
                    required
                    value={directMsgText}
                    onChange={e => setDirectMsgText(e.target.value)}
                    placeholder="Enter private VIP notification text..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDirectMessageBidder(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold uppercase rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase rounded-xl"
                  >
                    Send VIP Alert
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BIDDER DOSSIER VIEW MODAL                                                 */}
      {/* ========================================================================= */}
      {selectedBidder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-8 shadow-2xl space-y-5 text-xs my-auto max-h-[92vh] overflow-y-auto pb-10 sm:pb-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest block">
                  ACCREDITED PATRON DOSSIER
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900">
                  {selectedBidder.fullName} ({selectedBidder.bidderId})
                </h3>
              </div>
              <button onClick={() => setSelectedBidder(null)} className="text-slate-400 hover:text-slate-700 text-base font-bold p-1">✕</button>
            </div>

            <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Legal Name:</span>
                <span className="text-slate-900 font-bold">{selectedBidder.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email Address:</span>
                <span className="text-slate-900 font-mono">{selectedBidder.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone Number:</span>
                <span className="text-slate-900 font-mono">{selectedBidder.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Country & Location:</span>
                <span className="text-slate-900">{selectedBidder.city}, {selectedBidder.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ID Verification:</span>
                <span className="text-emerald-700 font-bold font-mono">{selectedBidder.idType} ({selectedBidder.idNumber})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bidding Tier:</span>
                <span className="text-art-gold font-bold">{selectedBidder.biddingTier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Bids Placed:</span>
                <span className="text-slate-900 font-bold">{selectedBidder.totalBidsPlaced || 0} Bids</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Volume Committed:</span>
                <span className="text-emerald-700 font-mono font-bold">{formatPrice(selectedBidder.totalVolumeBidded || 0)}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Art Curatorial Preferences:</span>
              <div className="flex flex-wrap gap-1.5">
                {(selectedBidder.categories || []).map((cat, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-red-50 text-red-800 border border-red-200 rounded-lg text-[10.5px] font-medium">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedBidder(null)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold uppercase rounded-xl"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
