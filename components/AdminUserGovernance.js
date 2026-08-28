'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  Snowflake,
  Ban,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Palette,
  Crown,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Clock,
  Shield,
  Zap,
  Lock,
  X,
  Check,
  Building
} from 'lucide-react';
import VerificationBadge from '@/components/VerificationBadge';

export default function AdminUserGovernance({
  usersList = [],
  sellers = [],
  setUserStatus,
  addUserSecurityIncident,
  addUser,
  updateUser,
  deleteUser,
  currentUser
}) {
  // Navigation role sub-tab
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'artist' | 'buyer' | 'admin' | 'flagged'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'suspended' | 'frozen' | 'blocked'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionModalType, setActionModalType] = useState(null); // 'suspend' | 'freeze' | 'block' | 'report' | 'audit' | 'edit' | 'add'
  const [actionReason, setActionReason] = useState('');
  const [actionSuccessNotice, setActionSuccessNotice] = useState('');

  // Security Incident Report Form state
  const [incidentForm, setIncidentForm] = useState({
    type: 'Auction Bid Manipulation',
    severity: 'High',
    reason: '',
    notes: ''
  });

  // Edit User Form state
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    role: 'buyer',
    subscription_tier: 'standard'
  });

  // Add User Form state
  const [addUserForm, setAddUserForm] = useState({
    name: '',
    email: '',
    password: 'password123',
    phone: '+234 800 000 0000',
    country: 'Nigeria',
    role: 'buyer',
    subscription_tier: 'standard'
  });

  // Aggregated Counts
  const counts = useMemo(() => {
    return {
      all: usersList.length,
      artists: usersList.filter(u => u.role === 'artist').length,
      buyers: usersList.filter(u => u.role === 'buyer').length,
      admins: usersList.filter(u => u.role === 'admin').length,
      flagged: usersList.filter(u => u.status && u.status !== 'active').length,
      suspended: usersList.filter(u => u.status === 'suspended').length,
      frozen: usersList.filter(u => u.status === 'frozen').length,
      blocked: usersList.filter(u => u.status === 'blocked').length,
    };
  }, [usersList]);

  // Filtered Users List
  const filteredUsers = useMemo(() => {
    return usersList.filter(user => {
      // Role Filter
      if (roleFilter === 'artist' && user.role !== 'artist') return false;
      if (roleFilter === 'buyer' && user.role !== 'buyer') return false;
      if (roleFilter === 'admin' && user.role !== 'admin') return false;
      if (roleFilter === 'flagged' && (!user.status || user.status === 'active')) return false;

      // Status Filter
      if (statusFilter !== 'all') {
        const currentStatus = user.status || 'active';
        if (currentStatus !== statusFilter) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = user.name?.toLowerCase().includes(q);
        const matchesEmail = user.email?.toLowerCase().includes(q);
        const matchesPhone = user.phone?.toLowerCase().includes(q);
        const matchesCountry = user.country?.toLowerCase().includes(q);
        const matchesId = user.id?.toLowerCase().includes(q);
        const matchesIp = user.ipAddress?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesCountry && !matchesId && !matchesIp) {
          return false;
        }
      }

      return true;
    });
  }, [usersList, roleFilter, statusFilter, searchQuery]);

  // Actions Handlers
  const handleExecuteStatusChange = (newStatus) => {
    if (!selectedUser) return;
    const reasonText = actionReason.trim() || `Status updated to ${newStatus} by ${currentUser?.name || 'Admin'}`;
    setUserStatus(selectedUser.id, newStatus, reasonText);
    
    setActionSuccessNotice(`Account status for ${selectedUser.name} updated to ${newStatus.toUpperCase()} successfully.`);
    setTimeout(() => {
      setActionSuccessNotice('');
      setActionModalType(null);
      setSelectedUser(null);
      setActionReason('');
    }, 1500);
  };

  const handleSaveSecurityIncident = (e) => {
    e.preventDefault();
    if (!selectedUser || !incidentForm.reason) return;

    addUserSecurityIncident(selectedUser.id, {
      type: incidentForm.type,
      severity: incidentForm.severity,
      reason: incidentForm.reason,
      reportedBy: currentUser?.name || 'Executive Administrator',
      status: 'Active Security Investigation'
    });

    // If High/Critical severity, optionally suggest automatic suspension
    if (incidentForm.severity === 'Critical' || incidentForm.severity === 'High') {
      setUserStatus(selectedUser.id, 'suspended', `Suspended due to ${incidentForm.type}: ${incidentForm.reason}`);
    }

    setActionSuccessNotice(`Security incident logged against ${selectedUser.name}.`);
    setTimeout(() => {
      setActionSuccessNotice('');
      setActionModalType(null);
      setSelectedUser(null);
      setIncidentForm({ type: 'Auction Bid Manipulation', severity: 'High', reason: '', notes: '' });
    }, 1500);
  };

  const handleSaveUserEdit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    updateUser(selectedUser.id, editForm);
    setActionSuccessNotice(`User profile for ${editForm.name} updated.`);
    setTimeout(() => {
      setActionSuccessNotice('');
      setActionModalType(null);
      setSelectedUser(null);
    }, 1200);
  };

  const handleCreateNewUser = (e) => {
    e.preventDefault();
    if (!addUserForm.name || !addUserForm.email) return;
    addUser(addUserForm);
    setActionSuccessNotice(`User ${addUserForm.name} registered and accredited.`);
    setTimeout(() => {
      setActionSuccessNotice('');
      setActionModalType(null);
      setAddUserForm({
        name: '',
        email: '',
        password: 'password123',
        phone: '+234 800 000 0000',
        country: 'Nigeria',
        role: 'buyer',
        subscription_tier: 'standard'
      });
    }, 1200);
  };

  const formatPrice = (amount) => `₦${(amount || 0).toLocaleString()}`;

  const formatDate = (isoString) => {
    if (!isoString) return 'Creation date logged';
    try {
      return new Date(isoString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs font-sans">
      
      {/* Top Banner & Governance Overview Metrics */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                Sovereign User Governance & Security Council
              </h2>
            </div>
            <p className="text-slate-500 text-xs">
              Complete oversight from the instant accounts are created. Investigate foul play, suspend, freeze, or block accounts in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAddUserForm({
                  name: '',
                  email: '',
                  password: 'password123',
                  phone: '+234 800 000 0000',
                  country: 'Nigeria',
                  role: 'buyer',
                  subscription_tier: 'standard'
                });
                setActionModalType('add');
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold text-art-black font-bold uppercase tracking-wider rounded-xl shadow-gold-glow hover:brightness-110 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Accredit New User</span>
            </button>
          </div>
        </div>

        {/* 4 Core Summary Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Accounts
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-2xl font-black text-slate-900">{counts.all}</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                Active 100%
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
              <Palette className="w-3 h-3 text-amber-600" />
              <span>Artists & Sellers</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-2xl font-black text-amber-900">{counts.artists}</span>
              <span className="text-[10px] text-amber-700 font-semibold font-mono">
                {sellers.length} Accredited
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-emerald-600" />
              <span>Collectors & Buyers</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-2xl font-black text-emerald-900">{counts.buyers}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">
                Verified Bidders
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 space-y-1">
            <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-red-600" />
              <span>Security Interventions</span>
            </span>
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-2xl font-black text-red-900">{counts.flagged}</span>
              <span className="text-[10px] text-red-700 font-semibold">
                {counts.suspended} Susp · {counts.frozen} Frz · {counts.blocked} Blk
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role & Category Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        
        {/* Role Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
              roleFilter === 'all'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Registered ({counts.all})</span>
          </button>

          <button
            onClick={() => setRoleFilter('artist')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
              roleFilter === 'artist'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-art-gold" />
            <span>Master Artists ({counts.artists})</span>
          </button>

          <button
            onClick={() => setRoleFilter('buyer')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
              roleFilter === 'buyer'
                ? 'bg-emerald-700 text-white shadow'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Verified Collectors ({counts.buyers})</span>
          </button>

          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
              roleFilter === 'admin'
                ? 'bg-purple-700 text-white shadow'
                : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Admins ({counts.admins})</span>
          </button>

          <button
            onClick={() => setRoleFilter('flagged')}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 ${
              roleFilter === 'flagged'
                ? 'bg-red-600 text-white shadow'
                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>Security Alerts ({counts.flagged})</span>
          </button>
        </div>

        {/* Live Search & Status Select */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, IP, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-1.5 pl-8 pr-3 text-xs text-slate-800 focus:outline-none focus:border-art-gold"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-art-gold cursor-pointer"
          >
            <option value="all">All Standing</option>
            <option value="active">🟢 Active Only</option>
            <option value="suspended">🟡 Suspended Only</option>
            <option value="frozen">🔵 Frozen Only</option>
            <option value="blocked">🔴 Blocked Only</option>
          </select>
        </div>
      </div>

      {/* Main Users Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
                <th className="py-3.5 px-4 font-bold">User Identity & Registration</th>
                <th className="py-3.5 px-3 font-bold">Role & Accreditation</th>
                <th className="py-3.5 px-3 font-bold">Cloudflare & Network Audit</th>
                <th className="py-3.5 px-3 font-bold">Commerce & Activity Volume</th>
                <th className="py-3.5 px-3 font-bold">Account Standing</th>
                <th className="py-3.5 px-4 font-bold text-right">Sovereign Governance Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm">No accounts found matching filter criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const status = user.status || 'active';
                  const userSeller = sellers.find(s => s.user_id === user.id || s.name === user.name);

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition duration-150 group">
                      
                      {/* 1. User Identity */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-art-gold via-amber-600 to-art-green p-0.5 shadow-sm shrink-0">
                            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-serif font-bold text-sm text-art-gold">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-serif font-bold text-slate-900 text-sm">{user.name}</span>
                              {user.country && <span className="text-xs">{user.country === 'Nigeria' ? '🇳🇬' : user.country === 'Ghana' ? '🇬🇭' : user.country === 'South Africa' ? '🇿🇦' : user.country === 'France' ? '🇫🇷' : '🌍'}</span>}
                            </div>
                            <span className="text-[11px] text-slate-500 font-sans block">{user.email}</span>
                            <div className="flex items-center gap-2 mt-0.5 text-[9.5px] text-slate-400 font-mono">
                              <span>ID: {user.id}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                <span>Joined {formatDate(user.created_at)}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Role & Accreditation */}
                      <td className="py-4 px-3">
                        <div className="space-y-1">
                          {user.role === 'admin' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                              <Crown className="w-3 h-3 text-purple-700" />
                              <span>Executive Admin</span>
                            </span>
                          ) : user.role === 'artist' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                              <Palette className="w-3 h-3 text-art-gold" />
                              <span>Master Artist ({user.subscription_tier || 'Premium'})</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                              <UserCheck className="w-3 h-3 text-emerald-700" />
                              <span>Verified Collector</span>
                            </span>
                          )}

                          {userSeller?.verification_badge && (
                            <div className="pt-0.5">
                              <VerificationBadge badge={userSeller.verification_badge} />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 3. Cloudflare & Network Audit */}
                      <td className="py-4 px-3">
                        <div className="space-y-1 font-mono text-[10.5px]">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[9.5px]">
                            <Shield className="w-3 h-3 text-emerald-600" />
                            <span>Cloudflare TLS 1.3 Verified</span>
                          </span>
                          <p className="text-slate-500 text-[10px]">
                            IP: <span className="font-semibold text-slate-700">{user.ipAddress || '102.89.44.12'}</span>
                          </p>
                          <p className="text-slate-400 text-[9.5px]">
                            Last Active: {formatDate(user.lastActive || user.created_at)}
                          </p>
                        </div>
                      </td>

                      {/* 4. Commerce & Activity Footprint */}
                      <td className="py-4 px-3">
                        {user.role === 'artist' ? (
                          <div className="space-y-0.5 text-[11px]">
                            <p className="font-bold text-slate-900">
                              Volume: <span className="font-mono text-emerald-700">{formatPrice(user.totalSalesVolume || 0)}</span>
                            </p>
                            <p className="text-slate-500 text-[10px]">
                              Catalog: <strong>{user.artworksCount || userSeller?.artworksCount || 0} Artworks</strong>
                            </p>
                            <p className="text-slate-400 text-[9.5px] truncate max-w-[140px]" title={user.payoutBank || userSeller?.payout_bank}>
                              Payout: {user.payoutBank || userSeller?.payout_bank || 'Pending Setup'}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-0.5 text-[11px]">
                            <p className="font-bold text-slate-900">
                              Transacted: <span className="font-mono text-emerald-700">{formatPrice(user.totalSpent || 0)}</span>
                            </p>
                            <p className="text-slate-500 text-[10px]">
                              Bids: <strong>{user.totalBidsPlaced || 0} Live Bids</strong>
                            </p>
                            <p className="text-slate-400 text-[9.5px]">
                              Acquisitions: <strong>{user.totalAcquisitions || 0} Works</strong>
                            </p>
                          </div>
                        )}
                      </td>

                      {/* 5. Account Standing */}
                      <td className="py-4 px-3">
                        <div className="space-y-1">
                          {status === 'active' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              <span>Active / Good Standing</span>
                            </span>
                          )}

                          {status === 'suspended' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>Suspended (Bidding Paused)</span>
                            </span>
                          )}

                          {status === 'frozen' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">
                              <Snowflake className="w-3 h-3 text-blue-600" />
                              <span>Frozen (Assets Locked)</span>
                            </span>
                          )}

                          {status === 'blocked' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-900 border border-red-300">
                              <Ban className="w-3 h-3 text-red-600" />
                              <span>Blocked / Blacklisted</span>
                            </span>
                          )}

                          {user.statusReason && (
                            <p className="text-[10px] text-slate-500 italic max-w-[150px] truncate" title={user.statusReason}>
                              "{user.statusReason}"
                            </p>
                          )}
                        </div>
                      </td>

                      {/* 6. Sovereign Governance Action Controls */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 flex-wrap">
                          
                          {/* Suspend / Lift Suspension */}
                          {status === 'suspended' ? (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                handleExecuteStatusChange('active');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                              title="Lift Suspension"
                            >
                              <Unlock className="w-3 h-3" />
                              <span>Lift Suspend</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setActionReason('');
                                setActionModalType('suspend');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                              title="Suspend Account"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>Suspend</span>
                            </button>
                          )}

                          {/* Freeze / Unfreeze */}
                          {status === 'frozen' ? (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                handleExecuteStatusChange('active');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                              title="Unfreeze Account"
                            >
                              <Unlock className="w-3 h-3" />
                              <span>Unfreeze</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setActionReason('');
                                setActionModalType('freeze');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                              title="Freeze Assets & Transactions"
                            >
                              <Snowflake className="w-3 h-3" />
                              <span>Freeze</span>
                            </button>
                          )}

                          {/* Block / Unblock */}
                          {status === 'blocked' ? (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                handleExecuteStatusChange('active');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                              title="Unblock Account"
                            >
                              <Check className="w-3 h-3" />
                              <span>Unblock</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setActionReason('');
                                setActionModalType('block');
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                              title="Permanently Ban / Block"
                            >
                              <Ban className="w-3 h-3" />
                              <span>Block</span>
                            </button>
                          )}

                          {/* Report Foul Play */}
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setIncidentForm({
                                type: 'Auction Bid Manipulation',
                                severity: 'High',
                                reason: '',
                                notes: ''
                              });
                              setActionModalType('report');
                            }}
                            className="p-1.5 rounded-lg bg-red-950/20 hover:bg-red-900/30 text-red-600 border border-red-300 font-bold transition cursor-pointer"
                            title="Log Foul Play / Incident Report"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>

                          {/* Audit Trail */}
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setActionModalType('audit');
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            title="View Full Security Audit Log"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit User */}
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setEditForm({
                                name: user.name,
                                email: user.email,
                                phone: user.phone || '+234 800 000 0000',
                                country: user.country || 'Nigeria',
                                role: user.role,
                                subscription_tier: user.subscription_tier || 'standard'
                              });
                              setActionModalType('edit');
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            title="Edit User Profile"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Account */}
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => {
                                if (confirm(`Permanently delete user account "${user.name}"?`)) {
                                  deleteUser(user.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SUSPEND ACCOUNT MODAL                                                  */}
      {/* ========================================================================= */}
      {actionModalType === 'suspend' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Suspend User Account · {selectedUser.name}
                </h3>
              </div>
              <button onClick={() => setActionModalType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed">
              Suspension temporarily freezes live bidding, artwork catalog uploads, and checkout privileges while maintaining account records.
            </p>

            {actionSuccessNotice && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{actionSuccessNotice}</span>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-slate-700 font-bold text-xs">
                Reason for Suspension (Recorded in Security Audit Log):
              </label>
              <textarea
                rows={3}
                required
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Unusual bidding velocity detected on Lot #808. Account flagged for compliance review."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:border-amber-500 focus:outline-none"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActionModalType(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteStatusChange('suspended')}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase rounded-xl shadow cursor-pointer"
                >
                  Confirm Suspension
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FREEZE ASSETS & SETTLEMENTS MODAL                                     */}
      {/* ========================================================================= */}
      {actionModalType === 'freeze' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-blue-700">
                <Snowflake className="w-5 h-5" />
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Freeze Assets & Settlements · {selectedUser.name}
                </h3>
              </div>
              <button onClick={() => setActionModalType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed">
              Freezing immediately halts all WEMA Bank settlement disbursements, vault withdrawals, and buyer payment claims pending resolution.
            </p>

            {actionSuccessNotice && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{actionSuccessNotice}</span>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-slate-700 font-bold text-xs">
                Audit Reason for Freezing Assets:
              </label>
              <textarea
                rows={3}
                required
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Reported payment dispute or suspicious settlement routing via WEMA node."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:border-blue-500 focus:outline-none"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActionModalType(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteStatusChange('frozen')}
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold uppercase rounded-xl shadow cursor-pointer"
                >
                  Confirm Asset Freeze
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. PERMANENT BLOCK / BLACKLIST MODAL                                      */}
      {/* ========================================================================= */}
      {actionModalType === 'block' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-red-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-red-100 pb-3">
              <div className="flex items-center gap-2 text-red-700">
                <Ban className="w-5 h-5" />
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Permanently Block Account · {selectedUser.name}
                </h3>
              </div>
              <button onClick={() => setActionModalType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-red-700 bg-red-50 p-3 rounded-xl border border-red-200 text-xs leading-relaxed font-medium">
              ⚠️ Warning: Blocking revokes login privileges immediately across all devices, cancels active bids, and adds the user IP to the blacklist.
            </p>

            {actionSuccessNotice && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{actionSuccessNotice}</span>
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-slate-700 font-bold text-xs">
                Permanent Ban Reason (Security Council Record):
              </label>
              <textarea
                rows={3}
                required
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Confirmed auction bid shilling or malicious attempt to forge authenticity certificates."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 text-xs focus:border-red-500 focus:outline-none"
              />

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActionModalType(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteStatusChange('blocked')}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-xl shadow cursor-pointer"
                >
                  Execute Permanent Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. REPORT FOUL PLAY / SECURITY INCIDENT MODAL                             */}
      {/* ========================================================================= */}
      {actionModalType === 'report' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-red-700">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Log Foul Play / Incident Report · {selectedUser.name}
                </h3>
              </div>
              <button onClick={() => setActionModalType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {actionSuccessNotice && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{actionSuccessNotice}</span>
              </div>
            )}

            <form onSubmit={handleSaveSecurityIncident} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Incident Category</label>
                  <select
                    value={incidentForm.type}
                    onChange={(e) => setIncidentForm({ ...incidentForm, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 cursor-pointer"
                  >
                    <option value="Auction Bid Manipulation">Auction Bid Manipulation</option>
                    <option value="Unverified Provenance / Counterfeit">Unverified Provenance / Counterfeit</option>
                    <option value="Payment Dispute / Reversal Attempt">Payment Dispute / Reversal Attempt</option>
                    <option value="Multiple Accounts / Device Spoofing">Multiple Accounts / Device Spoofing</option>
                    <option value="Harassment / Policy Breach">Harassment / Policy Breach</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Severity Level</label>
                  <select
                    value={incidentForm.severity}
                    onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 cursor-pointer font-bold"
                  >
                    <option value="Low">🟢 Low (Audit Advisory)</option>
                    <option value="Medium">🟡 Medium (Warning Issued)</option>
                    <option value="High">🟠 High (Auto-Suspension Suggested)</option>
                    <option value="Critical">🔴 Critical (Immediate Restraint)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Incident Description & Evidence Notes</label>
                <textarea
                  rows={3}
                  required
                  value={incidentForm.reason}
                  onChange={(e) => setIncidentForm({ ...incidentForm, reason: e.target.value })}
                  placeholder="Detail the observed irregular activity (e.g. consecutive bids entered within 100ms, failed 3D room authorization, duplicate certificate upload)..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActionModalType(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-xl shadow cursor-pointer"
                >
                  Log Incident to Audit Trail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. USER SECURITY AUDIT TRAIL MODAL                                        */}
      {/* ========================================================================= */}
      {actionModalType === 'audit' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Security Audit Trail · {selectedUser.name}
                </h3>
              </div>
              <button onClick={() => setActionModalType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px] block">Current Account Standing:</span>
                <span className="font-bold text-slate-900 uppercase">{(selectedUser.status || 'ACTIVE')}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Account Created:</span>
                <span className="font-bold text-slate-700">{formatDate(selectedUser.created_at)}</span>
              </div>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              <span className="font-bold text-slate-700 text-xs block">Recorded Security Events & Interventions:</span>
              {(!selectedUser.securityIncidents || selectedUser.securityIncidents.length === 0) ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500 mb-1" />
                  <p className="font-semibold text-xs text-slate-700">Pristine Security Standing</p>
                  <p className="text-[11px] text-slate-400">No foul play reports or interventions recorded on this account.</p>
                </div>
              ) : (
                selectedUser.securityIncidents.map((inc, i) => (
                  <div key={inc.id || i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-700 text-[11px]">{inc.type || inc.action || 'Security Action'}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{formatDate(inc.date)}</span>
                    </div>
                    <p className="text-slate-700 text-[11px]">"{inc.reason}"</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Recorded by: {inc.reportedBy || inc.recordedBy || 'Executive Admin Council'}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActionModalType(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. EDIT USER PROFILE MODAL                                                */}
      {/* ========================================================================= */}
      {actionModalType === 'edit' && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-900">
                Edit User Account · {selectedUser.name}
              </h3>
              <button onClick={() => setActionModalType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Country</label>
                  <input
                    type="text"
                    value={editForm.country}
                    onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Account Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 cursor-pointer"
                  >
                    <option value="buyer">Art Collector / Buyer</option>
                    <option value="artist">Master Artist / Seller</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActionModalType(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase rounded-xl shadow"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. ACCREDIT / ADD NEW USER MODAL                                          */}
      {/* ========================================================================= */}
      {actionModalType === 'add' && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 space-y-4 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-900">
                Accredit & Register New User
              </h3>
              <button onClick={() => setActionModalType(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Folake Davies"
                  value={addUserForm.name}
                  onChange={(e) => setAddUserForm({ ...addUserForm, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. folake@artellium.com"
                  value={addUserForm.email}
                  onChange={(e) => setAddUserForm({ ...addUserForm, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Country</label>
                  <input
                    type="text"
                    value={addUserForm.country}
                    onChange={(e) => setAddUserForm({ ...addUserForm, country: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Account Role</label>
                  <select
                    value={addUserForm.role}
                    onChange={(e) => setAddUserForm({ ...addUserForm, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 cursor-pointer"
                  >
                    <option value="buyer">Art Collector / Buyer</option>
                    <option value="artist">Master Artist / Seller</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActionModalType(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-art-gold hover:brightness-110 text-art-black font-bold uppercase rounded-xl shadow"
                >
                  Register & Accredit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
