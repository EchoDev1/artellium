'use client';

import React from 'react';
import { useStore } from '@/context/store-context';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Plus, Minus } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    currency,
    setIsCheckoutOpen,
  } = useStore();

  if (!isCartOpen) return null;

  const formatPrice = (amount) => {
    if (currency === 'USD') {
      return `$${Math.round(amount / 1480).toLocaleString()}`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-art-black-card border-l border-art-gold/30 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 bg-art-black border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-art-gold font-serif font-bold text-lg">
              <ShoppingBag className="w-5 h-5" />
              <span>Your Art Collection Cart ({cart.length})</span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-12">
                <div className="w-16 h-16 rounded-full bg-art-gold/10 text-art-gold flex items-center justify-center mb-4 border border-art-gold/30">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-bold text-white mb-1">Your cart is empty</h3>
                <p className="text-xs max-w-xs mb-6">
                  Explore master oil paintings, bronze sculptures, and afrofuturist digital artworks.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="bg-art-gold hover:brightness-110 text-art-black font-bold text-xs px-6 py-2.5 rounded-xl shadow-gold-glow"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl bg-art-black border border-white/10 relative group"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg border border-white/10"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-white line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-art-gold font-medium">{item.artistName}</p>
                      <p className="text-[11px] text-slate-400">{item.medium}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-white/10 rounded-lg bg-art-black-card overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-slate-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-sm text-art-gold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-500 hover:text-red-400 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 pb-20 sm:pb-6 bg-art-black border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Shipping & Museum Freight</span>
                <span className="text-emerald-400 font-semibold">Calculated at Checkout</span>
              </div>

              <div className="flex items-center justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                <span>Total Amount:</span>
                <span className="text-art-gold font-serif text-xl">{formatPrice(cartTotal)}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-art-green/20 p-2 rounded-lg border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Protected by Fiduciary Authenticity Guarantee</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-art-gold via-amber-500 to-art-gold-dark hover:brightness-110 text-art-black font-bold text-sm rounded-xl transition shadow-gold-glow flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
