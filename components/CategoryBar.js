'use client';

import React from 'react';
import { useStore } from '@/context/store-context';
import { Palette, Box, Monitor, Sparkles, Layers, Camera, Compass } from 'lucide-react';

export default function CategoryBar() {
  const { selectedCategory, setSelectedCategory } = useStore();

  const categories = [
    { name: 'All', icon: Layers, label: 'All Categories' },
    { name: 'Paintings', icon: Palette, label: 'Paintings' },
    { name: 'Sculptures', icon: Box, label: 'Sculptures' },
    { name: 'Drawings', icon: Sparkles, label: 'Drawings' },
    { name: 'Photography', icon: Camera, label: 'Photography' },
    { name: 'Textiles', icon: Sparkles, label: 'Textiles' },
    { name: 'Pottery', icon: Box, label: 'Pottery' },
    { name: 'Ceramics', icon: Box, label: 'Ceramics' },
    { name: 'Woodworks', icon: Box, label: 'Woodworks' },
    { name: 'Metal works', icon: Box, label: 'Metal Works' },
    { name: 'Handmade crafts', icon: Sparkles, label: 'Handmade Crafts' },
    { name: 'Indigenous artworks', icon: Compass, label: 'Indigenous Art' },
    { name: 'Limited edition collections', icon: Monitor, label: 'Limited Editions' },
  ];

  return (
    <div className="w-full bg-[#0A0D14]/80 backdrop-blur-md border-y border-art-gold/20 py-4 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar font-sans">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-semibold shrink-0 transition ${
                isSelected
                  ? 'bg-art-gold/15 text-art-gold border-art-gold shadow-gold-glow font-bold'
                  : 'bg-art-black-card/80 border-white/10 text-slate-300 hover:border-art-gold/40 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-art-gold' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
