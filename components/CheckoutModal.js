'use client';

import React, { useState, useMemo } from 'react';
import { useStore } from '@/context/store-context';
import CloudflareTurnstile from '@/components/CloudflareTurnstile';
import { triggerEmailNotification } from '@/lib/email-client';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Sparkles, 
  Building, 
  Phone, 
  Mail, 
  Award, 
  ArrowRight,
  Truck,
  Globe,
  MapPin,
  Package,
  ExternalLink,
  Shield,
  FileCheck,
  Search,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { WORLD_COUNTRIES, SHIPPING_ZONES, calculateDhlShippingRate } from '@/lib/dhl-shipping';

export default function CheckoutModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartTotal, 
    clearCart, 
    currency, 
    usdExchangeRate = 1480,
    currentUser, 
    createOrderWithPayment,
    paymentSettings,
    shippingSettings,
    getShippingQuote
  } = useStore();

  const [step, setStep] = useState('details'); // details, processing, success
  const [createdOrderRef, setCreatedOrderRef] = useState(null);
  const [createdWaybill, setCreatedWaybill] = useState(null);
  const [cloudflareVerified, setCloudflareVerified] = useState(false);
  const [countrySearchQuery, setCountrySearchQuery] = useState('');
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    // Shipping Details
    address: currentUser?.address || '',
    city: currentUser?.city || 'Lagos',
    state: currentUser?.state || '',
    postalCode: currentUser?.postalCode || '',
    countryCode: currentUser?.countryCode || 'NG',
    deliveryNotes: '',
    paymentMethod: 'wema_bank', // wema_bank, alatpay, card
  });

  const wemaDetails = {
    bankName: paymentSettings?.wemaBankName || 'Wema Bank PLC',
    accountName: paymentSettings?.wemaAccountName || 'Artellium Global Marketplace Ltd',
    accountNumber: paymentSettings?.wemaAccountNumber || '0123456789',
    sortCode: paymentSettings?.wemaSortCode || '035150103',
  };

  React.useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: currentUser.name || prev.fullName,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        address: currentUser.address || prev.address,
        city: currentUser.city || prev.city,
        state: currentUser.state || prev.state,
        countryCode: currentUser.countryCode || prev.countryCode || 'NG'
      }));
    }
  }, [currentUser]);

  // Reactive DHL Shipping Quote based on selected country and cart state
  const shippingQuote = useMemo(() => {
    if (getShippingQuote) {
      return getShippingQuote(formData.countryCode, cartTotal, cart.length);
    }
    return calculateDhlShippingRate(formData.countryCode, cartTotal, cart.length, shippingSettings);
  }, [formData.countryCode, cartTotal, cart.length, getShippingQuote, shippingSettings]);

  const selectedCountry = useMemo(() => {
    return WORLD_COUNTRIES.find(c => c.code === formData.countryCode) || WORLD_COUNTRIES[0];
  }, [formData.countryCode]);

  const filteredCountries = useMemo(() => {
    if (!countrySearchQuery.trim()) return WORLD_COUNTRIES;
    const q = countrySearchQuery.toLowerCase();
    return WORLD_COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.code.toLowerCase().includes(q) ||
      c.region.toLowerCase().includes(q)
    );
  }, [countrySearchQuery]);

  const shippingCost = shippingQuote?.priceNGN || 0;
  const finalTotal = cartTotal + shippingCost;

  if (!isCheckoutOpen) return null;

  const formatPrice = (amount) => {
    if (!amount && amount !== 0) return '₦0';
    if (currency === 'USD') {
      const rate = (usdExchangeRate && usdExchangeRate > 0) ? usdExchangeRate : 1480;
      return `$${Math.round(amount / rate).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setStep('processing');
    
    // Atomically create Order, Payment, and Commission records in the Database with Wema settlement and DHL Shipping
    const res = await createOrderWithPayment({
      buyerId: currentUser?.id || 'user-buyer-1',
      buyerName: formData.fullName,
      buyerEmail: formData.email,
      buyerPhone: formData.phone,
      shippingAddress: formData.address,
      shippingCity: formData.city,
      shippingState: formData.state,
      shippingPostalCode: formData.postalCode,
      shippingCountry: selectedCountry.name,
      shippingCountryCode: selectedCountry.code,
      shippingCost: shippingCost,
      shippingDeliveryNotes: formData.deliveryNotes,
      shippingCarrier: 'DHL Express Fine Art',
      shippingEstimatedDays: shippingQuote?.estimatedDays || '3-5 Business Days',
      totalAmount: finalTotal,
      currency,
      paymentMethod: formData.paymentMethod,
      items: cart
    });

    if (res?.order) {
      setCreatedOrderRef(res.order.id);
      const awbNum = res.order.shipping_details?.waybillNumber || res.order.tracking?.trackingNumber || `ART-DHL-${Date.now().toString().slice(-6)}`;
      setCreatedWaybill(awbNum);

      // 1. Dispatch Official Payment Confirmation Receipt to Buyer via Resend
      if (formData.email) {
        triggerEmailNotification('payment_receipt', formData.email.trim(), {
          name: formData.fullName || 'Collector',
          orderId: res.order.id,
          paymentReference: res.payment?.payment_reference || `WEMA-${Date.now().toString().slice(-6)}`,
          items: cart,
          totalAmount: finalTotal,
          shippingCost: shippingCost,
          shippingDestination: `${formData.address}, ${formData.city}, ${selectedCountry.name}`,
          dhlWaybill: awbNum,
          currency,
          usdExchangeRate,
          settlementBank: wemaDetails.bankName
        });
      }

      // 2. Dispatch Artwork Sold & Payout Notification to each respective Artist
      cart.forEach((art) => {
        const artistEmail = art.artistEmail || `${(art.artistName || 'artist').toLowerCase().replace(/[^a-z0-9]/g, '')}@artellium.com`;
        triggerEmailNotification('artist_sale', artistEmail, {
          artistName: art.artistName || 'Master Artist',
          buyerName: formData.fullName || 'Art Patron',
          artworkTitle: art.title || 'Masterpiece Artwork',
          grossAmount: art.price || 0,
          netPayout: Math.round((art.price || 0) * 0.85),
          platformFee: Math.round((art.price || 0) * 0.15),
          currency,
          usdExchangeRate,
          orderId: res.order.id
        });
      });
    }

    setTimeout(() => {
      setStep('success');
      clearCart();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-art-black-card border border-art-gold/40 rounded-2xl shadow-2xl my-auto max-h-[94vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-art-black border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-art-gold" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-white line-clamp-1">
              {step === 'success' ? 'Masterpiece Acquisition Confirmed' : 'Collector Checkout · DHL Express Fine Art Logistics'}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setStep('details');
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {step === 'details' && (
          <form onSubmit={handleOrderSubmit} className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(94vh-65px)] pb-16 sm:pb-8">
            
            {/* 1. Collector Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[11px] font-mono text-art-gold uppercase tracking-wider block font-semibold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-art-gold/20 text-art-gold flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Collector Contact Information</span>
                </span>
                <span className="text-[10px] text-slate-400 font-sans">Primary patron credentials</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                    placeholder="e.g. Dr. Evelyn Carter"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Email Address (for COA & Receipt) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                    placeholder="collector@gallery.com"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Phone Number (DHL Courier Contact) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                    placeholder="+234 803 123 4567"
                  />
                </div>
              </div>
            </div>

            {/* 2. SHIPPING DETAILS & DHL COUNTRY-BASED DELIVERY SYSTEM */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[11px] font-mono text-art-gold uppercase tracking-wider block font-semibold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-art-gold/20 text-art-gold flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Shipping Details & DHL Global Delivery</span>
                </span>
                <span className="text-[10px] text-amber-300 font-mono font-semibold flex items-center gap-1">
                  <Truck className="w-3 h-3 text-amber-400" />
                  <span>DHL Express Fine Art Worldwide</span>
                </span>
              </div>

              {/* Country Selection Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-slate-300 text-xs font-medium flex items-center justify-between">
                  <span>Destination Country (Worldwide Rate Dropdown) *</span>
                  <span className="text-[10px] text-art-gold font-mono">{WORLD_COUNTRIES.length} Countries Supported</span>
                </label>

                {/* Country Searchable Dropdown Container */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="w-full bg-art-black border border-art-gold/40 hover:border-art-gold rounded-xl p-3 text-white flex items-center justify-between text-xs transition shadow-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl leading-none">{selectedCountry.flag}</span>
                      <span className="font-semibold text-sm">{selectedCountry.name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">({selectedCountry.code})</span>
                      <span className="px-2 py-0.5 rounded-full bg-art-gold/15 text-art-gold text-[10px] font-bold">
                        {selectedCountry.region}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        {shippingQuote?.isFreeShipping ? 'FREE' : formatPrice(shippingCost)}
                      </span>
                      <span className="text-slate-400">▼</span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-[#0E1118] border-2 border-art-gold/60 rounded-xl shadow-2xl overflow-hidden max-h-72 flex flex-col">
                      <div className="p-2 border-b border-white/10 bg-[#07090E] sticky top-0">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                          <input
                            type="text"
                            value={countrySearchQuery}
                            onChange={(e) => setCountrySearchQuery(e.target.value)}
                            placeholder="Search by country name or code (e.g. Ghana, United States, Kenya)..."
                            className="w-full bg-[#141824] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-art-gold"
                            autoFocus
                          />
                        </div>
                      </div>

                      <div className="overflow-y-auto divide-y divide-white/5 scrollbar-thin">
                        {filteredCountries.map((c) => {
                          const quote = calculateDhlShippingRate(c.code, cartTotal, cart.length, shippingSettings);
                          const isSelected = c.code === formData.countryCode;
                          return (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setFormData({ ...formData, countryCode: c.code });
                                setIsCountryDropdownOpen(false);
                                setCountrySearchQuery('');
                              }}
                              className={`w-full p-2.5 px-3.5 text-left text-xs flex items-center justify-between hover:bg-white/10 transition cursor-pointer ${
                                isSelected ? 'bg-art-gold/20 text-art-gold font-bold' : 'text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-lg leading-none">{c.flag}</span>
                                <span className="font-medium">{c.name}</span>
                                <span className="text-slate-500 font-mono text-[10px]">({c.code})</span>
                                <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">· {c.region}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] font-bold text-amber-300">
                                  {quote.isFreeShipping ? 'FREE' : formatPrice(quote.priceNGN)}
                                </span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-art-gold" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Physical Delivery Address Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="md:col-span-2">
                  <label className="block text-slate-300 mb-1 font-medium">Street Address / Vault / Gallery Building *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                    placeholder="e.g. 14 Victoria Island Boulevard, Penthouse Vault Suite"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">City / Metropolitan Area *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                    placeholder="e.g. Lagos, Accra, London, New York"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">State / Province / Region</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                    placeholder="e.g. Lagos State, Greater London, California"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Postal / ZIP Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                    placeholder="e.g. 101241, SW1A 1AA, 90210"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Delivery & Handling Instructions (Optional)</label>
                  <input
                    type="text"
                    value={formData.deliveryNotes}
                    onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                    className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                    placeholder="e.g. Gate code #4912, call upon arrival, climate-controlled"
                  />
                </div>
              </div>

              {/* DHL Express Fine Art Logistics Integration Badge */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#141824] via-[#10131C] to-[#141824] border border-amber-500/30 text-xs space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-500 text-black font-black flex items-center justify-center font-mono text-[10px]">
                      DHL
                    </div>
                    <div>
                      <p className="font-bold text-white text-[11px] font-mono uppercase tracking-wide">
                        DHL Express Fine Art Worldwide Plugin
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Official International Fine Art Carrier & Air Waybill Tracking
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>100% Insured Freight</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[10px]">
                  <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[9px]">Transit Speed:</span>
                    <span className="text-amber-300 font-bold">{shippingQuote?.estimatedDays}</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[9px]">Museum Crating:</span>
                    <span className="text-white font-semibold">Dual Shock Sensors</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[9px]">Air Waybill:</span>
                    <span className="text-art-gold font-bold">Auto-Minted</span>
                  </div>
                  <div className="bg-black/40 p-2 rounded-lg border border-white/5">
                    <span className="text-slate-400 block text-[9px]">Calculated Freight:</span>
                    <span className="text-amber-400 font-bold">
                      {shippingQuote?.isFreeShipping ? 'FREE (VIP)' : formatPrice(shippingCost)}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* 3. Payment Method Selector */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[11px] font-mono text-art-gold uppercase tracking-wider block font-semibold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-art-gold/20 text-art-gold flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Corporate Settlement Method</span>
                </span>
                <span className="text-[10px] text-slate-400">Direct Wema Bank Escrow</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'wema_bank' })}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                    formData.paymentMethod === 'wema_bank'
                      ? 'border-art-gold bg-art-gold/15 text-art-gold font-bold shadow-gold-glow'
                      : 'border-white/10 bg-art-black text-slate-300 hover:border-white/20'
                  }`}
                >
                  <Building className="w-5 h-5 text-art-gold" />
                  <span className="font-semibold">WEMA Bank Transfer</span>
                  <span className="text-[10px] text-slate-400">Direct Corporate Account</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'alatpay' })}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                    formData.paymentMethod === 'alatpay'
                      ? 'border-art-gold bg-art-gold/15 text-art-gold font-bold shadow-gold-glow'
                      : 'border-white/10 bg-art-black text-slate-300 hover:border-white/20'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold">AlatPay by Wema</span>
                  <span className="text-[10px] text-slate-400">Cards & Instant Virtual</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                    formData.paymentMethod === 'card'
                      ? 'border-art-gold bg-art-gold/15 text-art-gold font-bold shadow-gold-glow'
                      : 'border-white/10 bg-art-black text-slate-300 hover:border-white/20'
                  }`}
                >
                  <Lock className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold">Card Gateway</span>
                  <span className="text-[10px] text-slate-400">Visa / Mastercard</span>
                </button>
              </div>

              {/* Wema Bank Corporate Account Box if bank transfer chosen */}
              {formData.paymentMethod === 'wema_bank' && (
                <div className="p-4 rounded-xl bg-art-black border border-art-gold/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-art-gold font-semibold uppercase tracking-wider text-[10px]">
                      Official Corporate Settlement Account
                    </span>
                    <span className="badge-gold text-[9px] px-2 py-0.5 rounded font-bold">WEMA BANK PLC</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Bank Name:</span>
                      <span className="text-white font-semibold">{wemaDetails.bankName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Account Name:</span>
                      <span className="text-white font-semibold truncate block">{wemaDetails.accountName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Account Number:</span>
                      <span className="text-art-gold font-bold">{wemaDetails.accountNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Sort Code:</span>
                      <span className="text-slate-200">{wemaDetails.sortCode}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Complete Itemized Financial Settlement Summary */}
            <div className="bg-art-black p-4 sm:p-5 rounded-xl border border-art-gold/30 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 text-xs">
                <span className="font-semibold text-white">Itemized Checkout Summary</span>
                <span className="text-[10px] text-slate-400 font-mono">{cart.length} Masterpiece Item(s)</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Artworks Subtotal ({cart.length} item{cart.length > 1 ? 's' : ''}):</span>
                  <span className="font-mono font-semibold text-white">{formatPrice(cartTotal)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span>DHL Insured Fine Art Freight ({selectedCountry.name}):</span>
                  </span>
                  <span className="font-mono font-semibold text-amber-400">
                    {shippingQuote?.isFreeShipping ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Museum Archival Crating & Handling:</span>
                  <span className="font-mono text-emerald-400">Included (Complimentary)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Total Settlement Amount:</p>
                  <p className="font-serif text-2xl font-bold text-art-gold">{formatPrice(finalTotal)}</p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>WEMA Bank Direct Escrow</span>
                </div>
              </div>
            </div>

            {/* Cloudflare Security Verification */}
            <CloudflareTurnstile
              verified={cloudflareVerified}
              setVerified={setCloudflareVerified}
            />

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-art-gold via-amber-400 to-art-gold-dark hover:brightness-110 text-art-black font-bold rounded-xl shadow-gold-glow uppercase tracking-wider text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Confirm Acquisition & Direct Settlement</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'processing' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-art-gold border-t-transparent animate-spin" />
            <h4 className="font-serif text-xl font-bold text-white">Settling via WEMA Bank PLC...</h4>
            <p className="text-xs text-slate-400">Generating DHL Express Air Waybill, recording acquisition voucher, and minting digital certificate.</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-950/40 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-emerald-glow">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <h4 className="font-serif text-2xl font-bold text-white">Acquisition Successfully Settled!</h4>
            
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {createdOrderRef && (
                <span className="font-mono text-xs text-art-gold bg-art-black px-3.5 py-1.5 rounded-full border border-art-gold/30">
                  WEMA VOUCHER REF: {createdOrderRef}
                </span>
              )}
              {createdWaybill && (
                <span className="font-mono text-xs text-amber-300 bg-amber-950/40 px-3.5 py-1.5 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>DHL WAYBILL: {createdWaybill}</span>
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
              Your payment has been directly settled to Artellium's corporate account at <strong className="text-white">Wema Bank PLC</strong>. An insured consignment with <strong className="text-amber-400">DHL Express Fine Art</strong> has been registered for delivery to <strong className="text-white">{selectedCountry.name}</strong>.
            </p>

            <div className="pt-2 flex flex-wrap gap-3 justify-center">
              <Link
                href="/buyer/account"
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setStep('details');
                }}
                className="bg-art-gold hover:brightness-110 text-art-black font-bold text-xs px-6 py-3 rounded-xl shadow-gold-glow uppercase tracking-wider inline-flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>View Collection & Track Consignment</span>
              </Link>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setStep('details');
                }}
                className="bg-art-black hover:bg-white/10 border border-white/20 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl uppercase tracking-wider cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
