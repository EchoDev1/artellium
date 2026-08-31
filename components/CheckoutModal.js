'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/store-context';
import CloudflareTurnstile from '@/components/CloudflareTurnstile';
import { triggerEmailNotification } from '@/lib/email-client';
import { X, CheckCircle2, ShieldCheck, Lock, CreditCard, Sparkles, Building, Phone, Mail, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartTotal, 
    clearCart, 
    currency, 
    currentUser, 
    createOrderWithPayment,
    paymentSettings 
  } = useStore();

  const [step, setStep] = useState('details'); // details, processing, success
  const [createdOrderRef, setCreatedOrderRef] = useState(null);
  const [cloudflareVerified, setCloudflareVerified] = useState(false);

  const [formData, setFormData] = useState({
    fullName: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
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
      }));
    }
  }, [currentUser]);

  if (!isCheckoutOpen) return null;

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setStep('processing');
    
    // Atomically create Order, Payment, and Commission records in the Database with Wema settlement
    const res = await createOrderWithPayment({
      buyerId: currentUser?.id || 'user-buyer-1',
      buyerName: formData.fullName,
      buyerEmail: formData.email,
      buyerPhone: formData.phone,
      totalAmount: cartTotal,
      currency,
      paymentMethod: formData.paymentMethod,
      items: cart
    });

    if (res?.order) {
      setCreatedOrderRef(res.order.id);

      // 1. Dispatch Official Payment Confirmation Receipt to Buyer via Resend
      if (formData.email) {
        triggerEmailNotification('payment_receipt', formData.email.trim(), {
          name: formData.fullName || 'Collector',
          orderId: res.order.id,
          paymentReference: res.payment?.payment_reference || `WEMA-${Date.now().toString().slice(-6)}`,
          items: cart,
          totalAmount: cartTotal,
          currency,
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
      <div className="relative w-full max-w-2xl bg-art-black-card border border-art-gold/40 rounded-2xl shadow-2xl my-auto max-h-[94vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-art-black border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-art-gold" />
            <h3 className="font-serif text-base sm:text-lg font-bold text-white line-clamp-1">
              {step === 'success' ? 'Masterpiece Acquisition Confirmed' : 'Collector Checkout · WEMA Bank Direct Settlement'}
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
          <form onSubmit={handleOrderSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[calc(94vh-65px)] pb-16 sm:pb-8">
            
            {/* Collector Contact Info */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono text-art-gold uppercase tracking-wider block font-semibold">
                1. Collector Contact Information
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-art-black border border-white/10 rounded-lg p-2.5 text-white focus:border-art-gold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-1">
              <span className="text-[11px] font-mono text-art-gold uppercase tracking-wider block font-semibold">
                2. Select Corporate Settlement Method
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'wema_bank' })}
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition text-center ${
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
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition text-center ${
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
                  className={`p-3.5 rounded-xl border flex flex-col items-center gap-1.5 transition text-center ${
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

            {/* Order Summary Box */}
            <div className="bg-art-black p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400">Total Settlement Amount:</p>
                <p className="font-serif text-2xl font-bold text-art-gold">{formatPrice(cartTotal)}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>WEMA Bank Direct Settlement</span>
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
            <p className="text-xs text-slate-400">Directly recording acquisition, payment voucher, and digital authenticity certificate.</p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-950/40 text-emerald-400 flex items-center justify-center border border-emerald-500/40 shadow-emerald-glow">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-white">Acquisition Successfully Settled!</h4>
            {createdOrderRef && (
              <span className="font-mono text-xs text-art-gold bg-art-black px-3.5 py-1.5 rounded-full border border-art-gold/30">
                WEMA VOUCHER REF: {createdOrderRef}
              </span>
            )}
            <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
              Your payment has been directly settled to Artellium's corporate account at <strong className="text-white">Wema Bank PLC</strong>. A permanent Digital Certificate of Authenticity is registered to your collector profile.
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
                <span>View Collection & Certificate</span>
              </Link>
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setStep('details');
                }}
                className="bg-art-black hover:bg-white/10 border border-white/20 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl uppercase tracking-wider"
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
