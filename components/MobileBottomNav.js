'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/store-context';
import { 
  Home, 
  Zap, 
  Flame, 
  ShieldCheck, 
  ShoppingBag,
  Sparkles,
  Award
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cart = [], setIsCartOpen } = useStore();

  // Hide mobile bottom nav on authentication pages to maximize screen space for forms & CTA buttons
  if (pathname === '/login' || pathname === '/register' || pathname === '/reset-password') {
    return null;
  }

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: Home,
      isActive: pathname === '/'
    },
    {
      label: 'Flash',
      href: '/flash-deals',
      icon: Zap,
      badge: 'Sale',
      badgeColor: 'bg-red-500',
      isActive: pathname === '/flash-deals'
    },
    {
      label: 'Auctions',
      href: '/auctions',
      icon: Flame,
      badge: 'Live',
      badgeColor: 'bg-amber-500',
      isActive: pathname === '/auctions'
    },
    {
      label: 'Provenance',
      href: '/provenance-ledger',
      icon: ShieldCheck,
      isActive: pathname === '/provenance-ledger'
    }
  ];

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40">
      <nav 
        aria-label="Mobile Bottom Navigation"
        className="bg-gradient-to-r from-[#1F1705]/95 via-[#3E2D07]/95 to-[#1F1705]/95 backdrop-blur-xl border-2 border-art-gold/60 rounded-2xl p-1.5 shadow-[0_12px_36px_rgba(212,175,55,0.35)] flex items-center justify-around relative"
      >
        {/* Subtle top gold accent glow */}
        <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-art-gold/40 to-transparent" />

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 active:scale-90 ${
                item.isActive 
                  ? 'text-white bg-gradient-to-r from-art-gold via-[#9E7720] to-art-gold-dark font-bold shadow-md' 
                  : 'text-amber-100/80 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${item.isActive ? 'text-white' : 'text-amber-200/70'}`} />
                {item.badge && (
                  <span className={`absolute -top-1.5 -right-3 ${item.badgeColor} text-[8px] font-black text-white px-1 py-0.2 rounded-full uppercase leading-none shadow-sm`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Cart Action Button */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-amber-100/80 hover:text-white transition-all duration-200 active:scale-90 cursor-pointer"
          aria-label="Open Shopping Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-art-gold" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md border border-[#1F1705]">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium text-amber-100/90">
            Cart
          </span>
        </button>
      </nav>
    </div>
  );
}
