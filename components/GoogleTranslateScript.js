'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { useLanguage } from '@/context/language-context';

export default function GoogleTranslateScript() {
  const { currentLanguage, languagesList } = useLanguage();

  useEffect(() => {
    // Initialize google translate callback on window
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,fr,sw,yo,ha,ig,ar,pt,es,de',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );

        // Sync with current stored language if not English
        const savedLang = localStorage.getItem('artellium_language');
        if (savedLang && savedLang !== 'EN') {
          const langObj = languagesList.find((l) => l.code === savedLang);
          if (langObj) {
            setTimeout(() => {
              const combo = document.querySelector('.goog-te-combo');
              if (combo) {
                combo.value = langObj.googleCode;
                combo.dispatchEvent(new Event('change'));
              }
            }, 800);
          }
        }
      }
    };
  }, [languagesList]);

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }} />
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
