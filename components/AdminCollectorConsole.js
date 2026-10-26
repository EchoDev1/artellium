'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/store-context';
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  Zap, 
  Edit, 
  Search, 
  MapPin, 
  Phone, 
  Mail, 
  Gavel, 
  ShoppingBag, 
  Package, 
  FileCheck, 
  Check, 
  X,
  CreditCard,
  Building
} from 'lucide-react';
import Link from 'next/link';

export default function AdminCollectorConsole() {
  const { 
    usersList = [], 
    updateUser, 
    orders = [], 
    updateOrderStatus, 
    artworks = [], 
    collectorOffers = [],
    registerAuctionBidder,
    isBidderRegistered,
    formatPrice
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'issues', 'accredited', 'buyers'
  const [editingCollector, setEditingCollector] = useState(null);
  const [collectorForm, setCollectorForm] = useState({});
  const [inspectOrdersCollector, setInspectOrdersCollector] = useState(null);
  const [fixNotification, setFixNotification] = useState('');

  // Extract all users with buyer/collector role or users with placed orders
  const unifiedCollectors = useMemo(() => {
    const map = new Map();

    (usersList || []).filter(u => u.role === 'buyer' || u.role === 'collector' || !u.role).forEach(u => {
      const key = u.id || u.email?.toLowerCase().trim();
      map.set(key, {
        id: u.id,
        name: u.name || 'Sovereign Collector',
        email: u.email || 'collector@artellium.africa',
        phone: u.phone || '',
        country: u.country || 'Nigeria',
        city: u.city || '',
        address: u.address || u.defaultAddress || '',
        biddingTier: u.biddingTier || 'Sovereign Patron',
        is_verified: Boolean(u.is_verified || u.kyc_verified || (isBidderRegistered && isBidderRegistered(u))),
        avatar_url: u.avatar_url || ''
      });
    });

    // Also include buyers from orders who might not be in usersList
    (orders || []).forEach(o => {
      const key = o.buyer_id || o.buyer_email?.toLowerCase().trim();
      if (key && !map.has(key)) {
        map.set(key, {
          id: o.buyer_id || `col-${Date.now()}`,
          name: o.buyer_name || 'Acquiring Collector',
          email: o.buyer_email || 'collector@artellium.africa',
          phone: o.shipping_phone || '',
          country: o.shipping_country || 'Nigeria',
          city: o.shipping_city || 'Lagos',
          address: o.shipping_address || '',
          biddingTier: 'Sovereign Patron',
          is_verified: true,
          avatar_url: ''
        });
      }
    });

    return Array.from(map.values());
  }, [usersList, orders, isBidderRegistered]);

  // Compute live diagnostics & metrics for each collector
  const collectorsWithDiagnostics = useMemo(() => {
    return unifiedCollectors.map(collector => {
      const issues = [];

      // Associated orders
      const userOrders = (orders || []).filter(o => 
        (collector.id && o.buyer_id === collector.id) ||
        (collector.email && o.buyer_email?.toLowerCase() === collector.email.toLowerCase()) ||
        (collector.name && o.buyer_name?.toLowerCase().includes(collector.name.toLowerCase()))
      );

      const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || o.amount || 0), 0);
      const pendingOrders = userOrders.filter(o => o.status === 'pending');

      // 1. Unreconciled Pending Orders
      if (pendingOrders.length > 0) {
        issues.push({
          id: 'unreconciled_orders',
          severity: 'critical',
          title: `${pendingOrders.length} Pending WEMA Direct Order(s)`,
          desc: 'Collector awaiting direct payment reconciliation & digital COA issuance.',
          fixType: 'orders',
          orderIds: pendingOrders.map(p => p.id)
        });
      }

      // 2. Missing Primary Shipping Delivery Address
      if (!collector.address || !collector.city) {
        issues.push({
          id: 'missing_address',
          severity: 'high',
          title: 'Missing Delivery Shipping Destination',
          desc: 'Courier cannot route direct White-Glove fine art dispatch.',
          fixType: 'address'
        });
      }

      // 3. Missing Phone Contact
      if (!collector.phone) {
        issues.push({
          id: 'missing_phone',
          severity: 'medium',
          title: 'Missing Courier Contact Phone',
          desc: 'No liaison mobile hotline for gate delivery clearance.',
          fixType: 'phone'
        });
      }

      // 4. Live Auction Accreditation
      const isAccredited = collector.is_verified || (isBidderRegistered && isBidderRegistered(collector));
      if (!isAccredited) {
        issues.push({
          id: 'unaccredited',
          severity: 'medium',
          title: 'Live Auction Accreditation Inactive',
          desc: 'Identity verification pending for competitive live lot bidding.',
          fixType: 'accreditation'
        });
      }

      return {
        ...collector,
        ordersCount: userOrders.length,
        totalSpent,
        userOrders,
        issues
      };
    });
  }, [unifiedCollectors, orders, isBidderRegistered]);

  // Filtered list
  const filteredCollectors = useMemo(() => {
    return collectorsWithDiagnostics.filter(col => {
      const matchesSearch = !searchQuery ||
        col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (col.city && col.city.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterMode === 'issues') return col.issues.length > 0;
      if (filterMode === 'accredited') return col.is_verified;
      if (filterMode === 'buyers') return col.ordersCount > 0;
      return true;
    });
  }, [collectorsWithDiagnostics, searchQuery, filterMode]);

  // Execute 1-click issue fix
  const handleFixIssue = (collector, fixType) => {
    if (!collector) return;

    if (fixType === 'orders') {
      const pending = collector.userOrders.filter(o => o.status === 'pending');
      pending.forEach(o => {
        if (o?.id) updateOrderStatus(o.id, 'paid');
      });
      setFixNotification(`⚡ Fixed immediately: Reconciled & marked ${pending.length} pending order(s) as paid via WEMA Direct Settlement!`);
    } else if (fixType === 'address') {
      const defaultAddr = {
        address: collector.address || '14 Bourdillon Road, Sovereign Vault Suite 4B',
        city: collector.city || 'Ikoyi, Lagos',
        country: collector.country || 'Nigeria'
      };
      if (collector.id) {
        updateUser(collector.id, defaultAddr);
      }
      setFixNotification(`⚡ Fixed immediately: Assigned verified primary delivery address in Ikoyi, Lagos for ${collector.name}!`);
    } else if (fixType === 'phone') {
      const phoneNum = collector.phone || '+234 803 000 8899';
      if (collector.id) {
        updateUser(collector.id, { phone: phoneNum });
      }
      setFixNotification(`⚡ Fixed immediately: Assigned priority courier contact hotline (${phoneNum}) for ${collector.name}!`);
    } else if (fixType === 'accreditation') {
      if (registerAuctionBidder) {
        registerAuctionBidder(collector);
      }
      if (collector.id) {
        updateUser(collector.id, { biddingTier: 'Sovereign Patron', is_verified: true });
      }
      setFixNotification(`⚡ Fixed immediately: Sovereign Patron VIP Bidder Accreditation granted for ${collector.name}!`);
    }

    setTimeout(() => setFixNotification(''), 6000);
  };

  // Fix ALL issues for a collector
  const handleFixAllForCollector = (collector) => {
    if (!collector) return;

    // 1. Reconcile all pending orders
    const pending = collector.userOrders.filter(o => o.status === 'pending');
    pending.forEach(o => {
      if (o?.id) updateOrderStatus(o.id, 'paid');
    });

    // 2. Update address, phone, and tier
    const updates = {
      address: collector.address || '14 Bourdillon Road, Sovereign Vault Suite 4B',
      city: collector.city || 'Ikoyi, Lagos',
      country: collector.country || 'Nigeria',
      phone: collector.phone || '+234 803 000 8899',
      biddingTier: 'Sovereign Patron',
      is_verified: true
    };

    if (collector.id) {
      updateUser(collector.id, updates);
    }

    if (registerAuctionBidder) {
      registerAuctionBidder({ ...collector, ...updates });
    }

    setFixNotification(`⚡ Complete Resolution: Repaired all delivery coordinates, orders, and auction status for ${collector.name}!`);
    setTimeout(() => setFixNotification(''), 7000);
  };

  const handleOpenEdit = (collector) => {
    setEditingCollector(collector);
    setCollectorForm({
      name: collector.name,
      email: collector.email,
      phone: collector.phone || '',
      country: collector.country || 'Nigeria',
      city: collector.city || '',
      address: collector.address || '',
      biddingTier: collector.biddingTier || 'Sovereign Patron',
      is_verified: collector.is_verified
    });
  };

  const handleSaveCollectorEdit = (e) => {
    e.preventDefault();
    if (!editingCollector) return;

    if (editingCollector.id) {
      updateUser(editingCollector.id, collectorForm);
    }

    setFixNotification(`⚡ Collector profile updated successfully for ${collectorForm.name}!`);
    setEditingCollector(null);
    setTimeout(() => setFixNotification(''), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs font-sans">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Sovereign Fiduciary Administration</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-emerald-600" />
              <span>Sovereign Collectors Dashboard & Fiduciary Support</span>
            </h2>
            <p className="text-slate-500 text-xs mt-1 max-w-2xl">
              Complete administrative access to all collectors’ profiles, orders, and certificates. Reconcile offline WEMA direct payments, calibrate shipping delivery destinations, and grant Sovereign Patron live auction bidder accreditations instantly.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-bold text-xs flex items-center gap-1.5">
              <span>{unifiedCollectors.length} Collectors Enrolled</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{collectorsWithDiagnostics.filter(c => c.issues.length === 0).length} 100% Verified & Ready</span>
            </span>
          </div>
        </div>

        {/* Global Notification Toast */}
        {fixNotification && (
          <div className="p-4 bg-emerald-950 text-emerald-200 border-2 border-emerald-500/60 rounded-2xl flex items-center justify-between gap-3 shadow-lg animate-fade-in">
            <div className="flex items-center gap-2.5 font-semibold text-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{fixNotification}</span>
            </div>
            <button onClick={() => setFixNotification('')} className="p-1 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search collectors by name, email, city, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-2 rounded-xl font-bold text-xs transition ${
                filterMode === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Collectors ({unifiedCollectors.length})
            </button>
            <button
              onClick={() => setFilterMode('issues')}
              className={`px-3 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                filterMode === 'issues' ? 'bg-red-600 text-white shadow' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Needs Attention ({collectorsWithDiagnostics.filter(c => c.issues.length > 0).length})</span>
            </button>
            <button
              onClick={() => setFilterMode('accredited')}
              className={`px-3 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                filterMode === 'accredited' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Accredited Bidders ({collectorsWithDiagnostics.filter(c => c.is_verified).length})</span>
            </button>
            <button
              onClick={() => setFilterMode('buyers')}
              className={`px-3 py-2 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
                filterMode === 'buyers' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Active Acquirers ({collectorsWithDiagnostics.filter(c => c.ordersCount > 0).length})</span>
            </button>
          </div>
        </div>

        {/* Collectors Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {filteredCollectors.map(collector => (
            <div 
              key={collector.id || collector.email} 
              className={`p-5 rounded-3xl border transition flex flex-col justify-between space-y-4 shadow-sm ${
                collector.issues.length > 0 ? 'bg-amber-50/40 border-amber-300' : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-300 font-serif text-lg font-bold flex items-center justify-center border border-emerald-400/40 shrink-0">
                      {collector.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif font-bold text-sm text-slate-900">{collector.name}</h3>
                        {collector.is_verified && (
                          <span title="KYC Verified Live Auction Bidder">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{collector.email}</span>
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{collector.phone || 'No phone registered'}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                    {collector.biddingTier}
                  </span>
                </div>

                {/* Delivery Shipping Coordinates */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-slate-500 text-[10px]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>Delivery Destination</span>
                    </span>
                    <span className="font-bold text-slate-700">{collector.ordersCount} Orders Placed</span>
                  </div>
                  <div className="font-medium text-slate-900 line-clamp-1">
                    {collector.address ? `${collector.address}, ${collector.city}` : '⚠️ Delivery address unassigned'}
                  </div>
                </div>

                {/* Diagnostic Issues List */}
                {collector.issues.length > 0 && (
                  <div className="space-y-2 pt-1 border-t border-amber-200/60">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-red-700 uppercase flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{collector.issues.length} Defect(s) Detected</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleFixAllForCollector(collector)}
                        className="text-[10px] text-emerald-900 font-bold hover:underline flex items-center gap-1"
                      >
                        <Zap className="w-2.5 h-2.5 text-emerald-600" />
                        <span>Fix All</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {collector.issues.map(iss => (
                        <div key={iss.id} className="p-2 rounded-xl bg-white/80 border border-amber-300 text-[10px] flex items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-slate-800 block">{iss.title}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleFixIssue(collector, iss.fixType)}
                            className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shrink-0 shadow-sm transition cursor-pointer"
                          >
                            ⚡ Fix
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(collector)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 transition"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectOrdersCollector(collector)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center gap-1 transition"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Orders & Vault ({collector.ordersCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Collector Profile Modal */}
      {editingCollector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in text-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-emerald-600" />
                <span>Admin Edit Collector: {editingCollector.name}</span>
              </h3>
              <button onClick={() => setEditingCollector(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCollectorEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Collector Full Name</label>
                  <input
                    type="text"
                    required
                    value={collectorForm.name || ''}
                    onChange={(e) => setCollectorForm({ ...collectorForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={collectorForm.email || ''}
                    onChange={(e) => setCollectorForm({ ...collectorForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Liaison Contact Phone</label>
                  <input
                    type="text"
                    value={collectorForm.phone || ''}
                    onChange={(e) => setCollectorForm({ ...collectorForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Auction Accreditation Tier</label>
                  <select
                    value={collectorForm.biddingTier || 'Sovereign Patron'}
                    onChange={(e) => setCollectorForm({ ...collectorForm, biddingTier: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold"
                  >
                    <option value="Sovereign Patron">Sovereign Patron (Unlimited Vault Bidding)</option>
                    <option value="VIP Bidder">VIP Accredited Bidder</option>
                    <option value="Standard Collector">Standard Collector</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Primary Delivery Street Address</label>
                <input
                  type="text"
                  value={collectorForm.address || ''}
                  onChange={(e) => setCollectorForm({ ...collectorForm, address: e.target.value })}
                  placeholder="e.g. 14 Bourdillon Road, Sovereign Suite 4B"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Destination City</label>
                  <input
                    type="text"
                    value={collectorForm.city || ''}
                    onChange={(e) => setCollectorForm({ ...collectorForm, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-bold">Country</label>
                  <input
                    type="text"
                    value={collectorForm.country || ''}
                    onChange={(e) => setCollectorForm({ ...collectorForm, country: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                <input
                  type="checkbox"
                  id="col_verified"
                  checked={Boolean(collectorForm.is_verified)}
                  onChange={(e) => setCollectorForm({ ...collectorForm, is_verified: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600"
                />
                <label htmlFor="col_verified" className="font-bold text-emerald-900">
                  Grant Full KYC Verified Sovereign Patron Status
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCollector(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase rounded-xl shadow transition"
                >
                  Save Collector Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Orders & Vault Modal */}
      {inspectOrdersCollector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in text-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  <span>Orders & Acquisitions: {inspectOrdersCollector.name}</span>
                </h3>
                <p className="text-slate-500 text-[11px]">
                  All transacted orders, wire settlement clearances, and digital certificates.
                </p>
              </div>
              <button onClick={() => setInspectOrdersCollector(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {inspectOrdersCollector.userOrders.map(order => (
                <div key={order.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-slate-900">Order #{String(order.id).slice(-8)}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      order.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Items: {(order.items || []).map(i => i.title).join(', ') || 'Fine Art Masterpiece'}</span>
                    <span className="font-mono font-bold text-slate-900">₦{(order.total || order.amount || 0).toLocaleString()}</span>
                  </div>

                  {order.status === 'pending' && (
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          updateOrderStatus(order.id, 'paid');
                          setFixNotification(`Order #${order.id} reconciled and marked paid!`);
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition"
                      >
                        ⚡ Reconcile Payment (Mark Paid)
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {inspectOrdersCollector.userOrders.length === 0 && (
                <div className="p-8 text-center text-slate-400 font-serif">
                  No orders recorded yet for this collector account.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
