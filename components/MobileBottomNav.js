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
        className="bg-[#0C1017]/92 backdrop-blur-xl border border-art-gold/30 rounded-2xl p-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.75)] flex items-center justify-around relative"
      >
        {/* Subtle top gold accent glow */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-art-gold/60 to-transparent" />

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 active:scale-90 ${
                item.isActive 
                  ? 'text-art-gold bg-art-gold/10 font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${item.isActive ? 'text-art-gold' : 'text-slate-400'}`} />
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
          className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-slate-400 hover:text-art-gold transition-all duration-200 active:scale-90 cursor-pointer"
          aria-label="Open Shopping Bag"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-art-gold" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md border border-[#0C1017]">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium text-slate-300">
            Cart
          </span>
        </button>
      </nav>
    </div>
  );
}
