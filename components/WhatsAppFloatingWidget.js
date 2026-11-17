'use client';

import React from 'react';
import { useStore } from '@/context/store-context';

function normalizeWhatsAppPhone(raw = '') {
  const digits = String(raw || '').replace(/[^0-9]/g, '');
  if (!digits) return '';
  // Convert local Nigerian 11-digit number (e.g. 080...) to international 23480...
  if (digits.length === 11 && digits.startsWith('0')) {
    return `234${digits.slice(1)}`;
  }
  return digits;
}

export default function WhatsAppFloatingWidget() {
  const { contactConfig, usersList = [], currentUser } = useStore();

  const adminUser = (usersList || []).find((u) => u && u.role === 'admin');
  const rawAdminPhone =
    contactConfig?.adminWhatsApp ||
    contactConfig?.offices?.[0]?.phone ||
    adminUser?.phone ||
    '';

  const targetPhone = normalizeWhatsAppPhone(rawAdminPhone);

  const defaultMessage = currentUser?.name
    ? `Hello Artellium Admin, my name is ${currentUser.name}. I would like to make an inquiry.`
    : 'Hello Artellium Admin, I would like to make an inquiry on Artellium Africa.';

  const whatsappHref = targetPhone
    ? `https://wa.me/${targetPhone}?text=${encodeURIComponent(defaultMessage)}`
    : `https://api.whatsapp.com/send?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex items-center justify-end pointer-events-auto">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Artellium Customer Care on WhatsApp"
        title="Click to message Artellium Customer Care directly on WhatsApp"
        className="group flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-[0_8px_28px_rgba(37,211,102,0.45)] hover:shadow-[0_10px_34px_rgba(37,211,102,0.65)] border border-white/25 transition-all duration-300 hover:scale-105 cursor-pointer select-none"
      >
        <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-white/15 shrink-0">
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-white ring-2 ring-[#25D366] animate-pulse" />
          <svg
            className="w-5 h-5 fill-current text-white"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20.52 3.48A11.82 11.82 0 0 0 12.04 0C5.46 0 .1 5.36.1 11.94c0 2.1.55 4.16 1.6 5.97L0 24l6.25-1.64a11.9 11.9 0 0 0 5.79 1.48h.01c6.58 0 11.94-5.36 11.94-11.94 0-3.19-1.24-6.19-3.47-8.42zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.85 9.85 0 0 1-1.51-5.25c0-5.44 4.43-9.87 9.88-9.87 2.64 0 5.12 1.03 6.98 2.89a9.81 9.81 0 0 1 2.89 6.98c0 5.45-4.43 9.86-9.88 9.86zm5.41-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35z" />
          </svg>
        </span>

        <div className="flex flex-col text-left leading-tight pr-0.5">
          <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-white/90">
            WhatsApp
          </span>
          <span className="text-xs font-sans font-extrabold text-white tracking-wide">
            Customer Care
          </span>
        </div>
      </a>
    </div>
  );
}
