'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { MessageCircle } from 'lucide-react';

export function WhatsAppButton() {
  const { language } = useLanguage();
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [madrasaName, setMadrasaName] = useState<string>('Tarbiyah');

  const fetchSettings = () => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.settings) {
          if (d.settings.whatsappNumber) setWhatsappNumber(d.settings.whatsappNumber);
          if (d.settings.madrasaName) setMadrasaName(d.settings.madrasaName);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchSettings();
    // Re-fetch when tab becomes visible again (e.g. after admin saves in another tab)
    const handleFocus = () => fetchSettings();
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') fetchSettings();
    });
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Clean phone number (strip spaces, dashes, parentheses)
  const rawNumber = whatsappNumber || '7559950633';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const targetNumber = cleanNumber.length === 10 ? `91${cleanNumber}` : cleanNumber;

  const messageText = encodeURIComponent(
    language === 'ml'
      ? `അസ്സലാമു അലൈകും, ${madrasaName} മദ്റസയിലെ അഡ്മിഷൻ / വിവരങ്ങൾ അറിയാൻ ആഗ്രഹിക്കുന്നു.`
      : `Assalamu Alaikum, I would like to get information regarding admissions at ${madrasaName}.`
  );

  const whatsappUrl = `https://wa.me/${targetNumber}?text=${messageText}`;

  return (
    <aside 
      aria-label="WhatsApp Contact"
      className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 group flex items-center gap-2"
    >
      {/* Tooltip badge */}
      <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-tarbiyah-950/90 text-white text-xs font-medium shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-emerald-500/30">
        {language === 'ml' ? 'WhatsApp വഴി സംസാരിക്കാം' : 'Chat on WhatsApp'}
      </span>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-xl shadow-[#25D366]/30 hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white dark:border-islamic-dark"
      >
        {/* Subtle Ping Animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

        {/* WhatsApp Official SVG Icon */}
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          stroke="currentColor"
          strokeWidth="0"
          fill="currentColor"
          className="relative z-10 w-7 h-7 fill-white"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.456h.005c6.554 0 11.89-5.336 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </aside>
  );
}
