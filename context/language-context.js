'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'EN', name: 'English', nativeName: 'English', flag: '🇬🇧', googleCode: 'en' },
  { code: 'FR', name: 'French', nativeName: 'Français', flag: '🇫🇷', googleCode: 'fr' },
  { code: 'SW', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪', googleCode: 'sw' },
  { code: 'YO', name: 'Yoruba', nativeName: 'Yorùbá', flag: '🇳🇬', googleCode: 'yo' },
  { code: 'HA', name: 'Hausa', nativeName: 'Hausa', flag: '🇳🇬', googleCode: 'ha' },
  { code: 'IG', name: 'Igbo', nativeName: 'Asụsụ Igbo', flag: '🇳🇬', googleCode: 'ig' },
  { code: 'AR', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', googleCode: 'ar' },
  { code: 'PT', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', googleCode: 'pt' },
  { code: 'ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', googleCode: 'es' },
  { code: 'DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', googleCode: 'de' }
];

export const TRANSLATIONS = {
  EN: {
    topBarText: 'The Premier Pan-African & Global Fine Art Marketplace',
    brandSubtitle: 'FINE ART & AUCTIONS',
    searchPlaceholder: 'Search painters, bronze sculptors, artwork titles...',
    searchBtn: 'SEARCH',
    liveAuctions: 'Live Auctions',
    exhibitions: 'Exhibitions',
    sellArtwork: 'Sell Artwork',
    categories: 'Categories',
    all: 'All',
    painters: 'Painters',
    sculptures: 'Sculpture Makers',
    digitalArt: 'Digital Art',
    mixedMedia: 'Mixed Media',
    liveArenaBroadcast: 'LIVE ARENA BROADCAST',
    collectorsOnline: 'Active Collectors Online',
    liveAuctionsRooms: 'Live Auctions & 3D Exhibition Rooms',
    auctionFloor: 'Auction Floor',
    exhibitionHalls: 'Exhibition Halls',
    liveLotInPlay: 'Live Lot In Play',
    currentHighestBid: 'Current Highest Bid',
    quickBid: 'Quick Bid (Set Price)',
    powerBid: 'Power Bid (+₦100k)',
    enterAuctionArena: 'Enter Full Auction Arena & Custom Bidding Room →',
    live3dHall: 'Live 3D Gallery Hall',
    stepInside3d: 'Step Inside 3D Virtual Gallery Hall',
    wemaSecured: 'WEMA Secured',
    directSettlement: 'Direct Corporate Settlement',
    cart: 'Cart',
    account: 'Account'
  },
  FR: {
    topBarText: 'Le Premier Marché Panafricain et Mondial des Beaux-Arts',
    brandSubtitle: 'BEAUX-ARTS ET ENCHÈRES',
    searchPlaceholder: 'Rechercher des peintres, sculpteurs, titres d’œuvres...',
    searchBtn: 'RECHERCHER',
    liveAuctions: 'Enchères en Direct',
    exhibitions: 'Expositions',
    sellArtwork: 'Vendre une Œuvre',
    categories: 'Catégories',
    all: 'Tout',
    painters: 'Peintres',
    sculptures: 'Sculpteurs sur Bronze',
    digitalArt: 'Art Numérique',
    mixedMedia: 'Techniques Mixtes',
    liveArenaBroadcast: 'DIFFUSION EN DIRECT',
    collectorsOnline: 'Collectionneurs Actifs en Ligne',
    liveAuctionsRooms: 'Enchères en Direct & Salles 3D',
    auctionFloor: 'Salle des Enchères',
    exhibitionHalls: 'Salles d’Exposition',
    liveLotInPlay: 'Lot Actif en Jeu',
    currentHighestBid: 'Plus Haute Enchère Actuelle',
    quickBid: 'Enchère Rapide (Prix Manuel)',
    powerBid: 'Enchère Éclair (+100k ₦)',
    enterAuctionArena: 'Accéder à l’Arène Complète des Enchères →',
    live3dHall: 'Galerie 3D en Direct',
    stepInside3d: 'Entrer dans la Galerie Virtuelle 3D',
    wemaSecured: 'Sécurisé par WEMA',
    directSettlement: 'Règlement Bancaire Direct',
    cart: 'Panier',
    account: 'Compte'
  },
  SW: {
    topBarText: 'Soko Kuu la Sanaa Bora ya Kiafrika na Ulimwengu',
    brandSubtitle: 'SANAA BORA NA MINADA',
    searchPlaceholder: 'Tafuta wachoraji, wachongaji shaba, majina ya kazi...',
    searchBtn: 'TAFUTA',
    liveAuctions: 'Minada ya Moja kwa Moja',
    exhibitions: 'Maonyesho',
    sellArtwork: 'Uza Sanaa',
    categories: 'Aina za Sanaa',
    all: 'Zote',
    painters: 'Wachoraji',
    sculptures: 'Wachongaji Shaba',
    digitalArt: 'Sanaa ya Kidijitali',
    mixedMedia: 'Mseto wa Sanaa',
    liveArenaBroadcast: 'MATANGAZO YA MOJA KWA MOJA',
    collectorsOnline: 'Wakusanyaji Hewani',
    liveAuctionsRooms: 'Minada na Vyumba vya 3D',
    auctionFloor: 'Uwanja wa Minada',
    exhibitionHalls: 'Majumba ya Maonyesho',
    liveLotInPlay: 'Sanaa Inayoshindaniwa',
    currentHighestBid: 'Dau Kubwa Zaidi Sasa',
    quickBid: 'Weka Dau la Bei',
    powerBid: 'Dau la Nguvu (+₦100k)',
    enterAuctionArena: 'Ingia Uwanja Kamili wa Minada →',
    live3dHall: 'Jumba la Sanaa la 3D',
    stepInside3d: 'Ingia Ndani ya Jumba la 3D',
    wemaSecured: 'Imelindwa na WEMA',
    directSettlement: 'Malipo ya Moja kwa Moja ya Benki',
    cart: 'Kikapu',
    account: 'Akaunti'
  },
  YO: {
    topBarText: 'Ọjà Iṣẹ́ Ọnà Àgbáyé àti Ti Ilẹ̀ Adúláwọ̀ To Gbajúmọ̀ Jùlọ',
    brandSubtitle: 'IṢẸ́ ỌNÀ ÀTI ÌRÈTÉ ỌJÀ',
    searchPlaceholder: 'Ṣàwárí àwọn olùyàwòrán, àwọn agbẹ́rọ idẹ, orúkọ iṣẹ́...',
    searchBtn: 'WÁ IṢẸ́',
    liveAuctions: 'Ìrèté Ọjà Lọ́wọ́lọ́wọ́',
    exhibitions: 'Àfihàn Iṣẹ́ Ọnà',
    sellArtwork: 'Ta Iṣẹ́ Ọnà Rẹ',
    categories: 'Àwọn Ìsọ̀rí',
    all: 'Gbogbo Rẹ̀',
    painters: 'Àwọn Olùyàwòrán',
    sculptures: 'Àwọn Agbẹ́rọ Idẹ',
    digitalArt: 'Iṣẹ́ Ọnà Ayélujára',
    mixedMedia: 'Àdàpọ̀ Iṣẹ́ Ọnà',
    liveArenaBroadcast: 'ÌGBÓHÙNSÁFẸ́FẸ́ LỌ́WỌ́LỌ́WỌ́',
    collectorsOnline: 'Àwọn Olùrà Tó Wà Lórí Ayélujára',
    liveAuctionsRooms: 'Ìrèté Ọjà & Gbọ̀ngàn 3D',
    auctionFloor: 'Gbọ̀ngàn Ìrèté',
    exhibitionHalls: 'Gbọ̀ngàn Àfihàn',
    liveLotInPlay: 'Iṣẹ́ Tó Wà Lórí Ìrèté',
    currentHighestBid: 'Iye Owó Tó Ga Jùlọ',
    quickBid: 'Ṣètò Iye Ìrèté Rẹ',
    powerBid: 'Ìrèté Kíákíá (+₦100k)',
    enterAuctionArena: 'Wọ Gbọ̀ngàn Ìrèté Lẹ́kùnrẹ́rẹ́ →',
    live3dHall: 'Gbọ̀ngàn Àfihàn 3D',
    stepInside3d: 'Wọ Inú Gbọ̀ngàn Àfihàn 3D',
    wemaSecured: 'Àbò WEMA Bank',
    directSettlement: 'Ìsanwó Tààrà sí Báǹkì',
    cart: 'Àpò Ìrajà',
    account: 'Àkọọ́lẹ̀'
  },
  HA: {
    topBarText: 'Babbar Kasuwar Kayayyakin Tarihi da Fasahar Afirka da Duniya',
    brandSubtitle: 'FASAHA DA GINDIRIN KASUWA',
    searchPlaceholder: 'Nemi masu zane, masu sassaƙa, sunayen ayyukan fasaha...',
    searchBtn: 'NEMA',
    liveAuctions: 'Gwanjon Kai Tsaye',
    exhibitions: 'Nunin Fasaha',
    sellArtwork: 'Sayar da Aikin Fasaha',
    categories: 'Rukunai',
    all: 'Duka',
    painters: 'Masu Zane',
    sculptures: 'Masu Sassaƙar Tagulla',
    digitalArt: 'Fasahar Zamani',
    mixedMedia: 'Haɗaɗɗiyar Fasaha',
    liveArenaBroadcast: 'WATSAP KAI TSAYE',
    collectorsOnline: 'Masu Sayayya a Yanar Gizo',
    liveAuctionsRooms: 'Gwanjo da Dakunan 3D',
    auctionFloor: 'Dakin Gwanjo',
    exhibitionHalls: 'Dakunan Nuni',
    liveLotInPlay: 'Aikin da ake Gwanjawa',
    currentHighestBid: 'Farashi Mafi Girma Yanzu',
    quickBid: 'Sanya Farashin Ka',
    powerBid: 'Gwanjo Mai Sauri (+₦100k)',
    enterAuctionArena: 'Shiga Babban Zauren Gwanjo →',
    live3dHall: 'Zauren Nuni na 3D',
    stepInside3d: 'Shiga Cikin Zauren 3D',
    wemaSecured: 'Kariyar WEMA Bank',
    directSettlement: 'Biyan Kudi Kai Tsaye Ta Banki',
    cart: 'Kwando',
    account: 'Asusu'
  },
  IG: {
    topBarText: 'Ebe Azụmahịa Nka Kachasị Ukwuu na Afrịka na Ụwa Niile',
    brandSubtitle: 'EGO NKA NA ỊRE AHỊA ỌNỤ',
    searchPlaceholder: 'Chọọ ndị na-ese ihe, ndị na-akpụ ọla, aha ọrụ nka...',
    searchBtn: 'CHỌỌ',
    liveAuctions: 'Ọrịre Ọnụ Na-aga n’Ihu',
    exhibitions: 'Ihe Ngosi Nka',
    sellArtwork: 'Ree Ọrụ Nka',
    categories: 'Ụdị Dị Iche Iche',
    all: 'Ha Niile',
    painters: 'Ndị Na-ese Ihe',
    sculptures: 'Ndị Na-akpụ Ọla Ọlaedo',
    digitalArt: 'Nka Dijitalụ',
    mixedMedia: 'Ngwakọta Nka',
    liveArenaBroadcast: 'MGBASA OZI NDỊ DỊ NDỤ',
    collectorsOnline: 'Ndị Na-azụ Ihe Na-akparịta Ụka',
    liveAuctionsRooms: 'Ọrịre Ọnụ na Ụlọ 3D',
    auctionFloor: 'Ebe Ọrịre Ọnụ',
    exhibitionHalls: 'Ụlọ Ngosi Ihe',
    liveLotInPlay: 'Ọrụ Nka A Na-azụ',
    currentHighestBid: 'Ọnụ Ahịa Kachasị Elu Ugbu A',
    quickBid: 'Kpebie Ọnụ Ahịa Gị',
    powerBid: 'Ọrịre Ike (+₦100k)',
    enterAuctionArena: 'Banye n’Ebe Ọrịre Niile →',
    live3dHall: 'Ụlọ Ngosi 3D',
    stepInside3d: 'Banye n’Ime Ụlọ Ngosi 3D',
    wemaSecured: 'Nkwado WEMA Bank',
    directSettlement: 'Nkwụghachi Ụgwọ N’ụlọ Akụ',
    cart: 'Nkata',
    account: 'Akaụntụ'
  },
  AR: {
    topBarText: 'السوق الرائد للفنون الجميلة والمزادات في أفريقيا والعالم',
    brandSubtitle: 'الفنون الجميلة والمزادات العلنية',
    searchPlaceholder: 'البحث عن الرسامين، نحاتي البرونز، عناوين الأعمال...',
    searchBtn: 'بحث',
    liveAuctions: 'المزادات الحية',
    exhibitions: 'المعارض',
    sellArtwork: 'بيع عمل فني',
    categories: 'التصنيفات',
    all: 'الكل',
    painters: 'الرسامون',
    sculptures: 'نحاتو البرونز',
    digitalArt: 'الفن الرقمي',
    mixedMedia: 'وسائط متعددة',
    liveArenaBroadcast: 'بث حي ومباشر للمزاد',
    collectorsOnline: 'جامع فنون متصل الآن',
    liveAuctionsRooms: 'مزادات مباشرة وغرف ثلاثية الأبعاد',
    auctionFloor: 'قاعة المزاد',
    exhibitionHalls: 'أجنحة المعارض',
    liveLotInPlay: 'القطعة المعروضة حالياً',
    currentHighestBid: 'أعلى مزايدة حالية',
    quickBid: 'مزايدة مخصصة (تحديد السعر)',
    powerBid: 'مزايدة سريعة (+100 ألف ₦)',
    enterAuctionArena: 'الدخول إلى ساحة المزادات الكاملة ←',
    live3dHall: 'معرض افتراضي ثلاثي الأبعاد',
    stepInside3d: 'ادخل إلى صالة العرض ثلاثية الأبعاد',
    wemaSecured: 'حماية بنك ويما',
    directSettlement: 'تسوية مصرفية مباشرة للمؤسسات',
    cart: 'عربة التسوق',
    account: 'الحساب'
  },
  PT: {
    topBarText: 'O Principal Mercado Pan-Africano e Global de Belas Artes',
    brandSubtitle: 'BELAS ARTES E LEILÕES',
    searchPlaceholder: 'Pesquisar pintores, escultores em bronze, obras...',
    searchBtn: 'PESQUISAR',
    liveAuctions: 'Leilões ao Vivo',
    exhibitions: 'Exposições',
    sellArtwork: 'Vender Obra de Arte',
    categories: 'Categorias',
    all: 'Todos',
    painters: 'Pintores',
    sculptures: 'Escultores em Bronze',
    digitalArt: 'Arte Digital',
    mixedMedia: 'Mídia Mista',
    liveArenaBroadcast: 'TRANSMISSÃO AO VIVO DA ARENA',
    collectorsOnline: 'Colecionadores Ativos Online',
    liveAuctionsRooms: 'Leilões ao Vivo e Salas 3D',
    auctionFloor: 'Piso do Leilão',
    exhibitionHalls: 'Salas de Exposição',
    liveLotInPlay: 'Lote Ativo em Disputa',
    currentHighestBid: 'Maior Lance Atual',
    quickBid: 'Lance Rápido (Definir Preço)',
    powerBid: 'Lance de Poder (+₦100k)',
    enterAuctionArena: 'Entrar na Arena Completa de Leilões →',
    live3dHall: 'Galeria 3D ao Vivo',
    stepInside3d: 'Entrar na Galeria Virtual 3D',
    wemaSecured: 'Garantia WEMA Bank',
    directSettlement: 'Liquidação Bancária Direta',
    cart: 'Carrinho',
    account: 'Conta'
  },
  ES: {
    topBarText: 'El Principal Mercado Panafricano y Global de Bellas Artes',
    brandSubtitle: 'BELLAS ARTES Y SUBASTAS',
    searchPlaceholder: 'Buscar pintores, escultores de bronce, obras...',
    searchBtn: 'BUSCAR',
    liveAuctions: 'Subastas en Vivo',
    exhibitions: 'Exposiciones',
    sellArtwork: 'Vender Obra de Arte',
    categories: 'Categorías',
    all: 'Todos',
    painters: 'Pintores',
    sculptures: 'Escultores de Bronce',
    digitalArt: 'Arte Digital',
    mixedMedia: 'Técnicas Mixtas',
    liveArenaBroadcast: 'TRANSMISIÓN EN VIVO DE LA ARENA',
    collectorsOnline: 'Coleccionistas Activos en Línea',
    liveAuctionsRooms: 'Subastas en Vivo y Salas 3D',
    auctionFloor: 'Sala de Subastas',
    exhibitionHalls: 'Salas de Exposición',
    liveLotInPlay: 'Lote Activo en Juego',
    currentHighestBid: 'Puja Más Alta Actual',
    quickBid: 'Puja Rápida (Fijar Precio)',
    powerBid: 'Super Puja (+₦100k)',
    enterAuctionArena: 'Entrar a la Sala Completa de Subastas →',
    live3dHall: 'Galería 3D en Vivo',
    stepInside3d: 'Entrar a la Galería Virtual 3D',
    wemaSecured: 'Garantizado por WEMA',
    directSettlement: 'Liquidación Bancaria Directa',
    cart: 'Carrito',
    account: 'Cuenta'
  },
  DE: {
    topBarText: 'Der Führende Pan-Afrikanische & Globale Marktplatz für Bildende Kunst',
    brandSubtitle: 'BILDENDE KUNST & AUKTIONEN',
    searchPlaceholder: 'Maler, Bronzebildhauer, Kunstwerke suchen...',
    searchBtn: 'SUCHEN',
    liveAuctions: 'Live-Auktionen',
    exhibitions: 'Ausstellungen',
    sellArtwork: 'Kunstwerk Verkaufen',
    categories: 'Kategorien',
    all: 'Alle',
    painters: 'Maler',
    sculptures: 'Bronzebildhauer',
    digitalArt: 'Digitale Kunst',
    mixedMedia: 'Mischtechnik',
    liveArenaBroadcast: 'LIVE-ARENA-ÜBERTRAGUNG',
    collectorsOnline: 'Aktive Sammler Online',
    liveAuctionsRooms: 'Live-Auktionen & 3D-Räume',
    auctionFloor: 'Auktionssaal',
    exhibitionHalls: 'Ausstellungshallen',
    liveLotInPlay: 'Aktives Kunstwerk im Spiel',
    currentHighestBid: 'Aktuelles Höchstgebot',
    quickBid: 'Schnellgebot (Preis Festlegen)',
    powerBid: 'Power-Gebot (+100k ₦)',
    enterAuctionArena: 'Vollständige Auktionsarena Betreten →',
    live3dHall: 'Live-3D-Galeriehalle',
    stepInside3d: '3D-Virtuelle Galerie Betreten',
    wemaSecured: 'WEMA-Bank Gesichert',
    directSettlement: 'Direkte Bankabwicklung',
    cart: 'Warenkorb',
    account: 'Konto'
  }
};

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguageState] = useState('EN');

  // Load language from storage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('artellium_language');
      if (saved && TRANSLATIONS[saved]) {
        setCurrentLanguageState(saved);
        applyGoogleTranslate(saved);
      }
    } catch (e) {
      console.warn('Language load error:', e);
    }
  }, []);

  const applyGoogleTranslate = (langCode) => {
    if (typeof window === 'undefined') return;

    const langObj = LANGUAGES.find((l) => l.code === langCode);
    const googleCode = langObj ? langObj.googleCode : 'en';

    // Set Google Translate cookie
    const hostname = window.location.hostname;
    document.cookie = `googtrans=/en/${googleCode}; path=/;`;
    if (hostname && hostname !== 'localhost') {
      document.cookie = `googtrans=/en/${googleCode}; path=/; domain=.${hostname};`;
      document.cookie = `googtrans=/en/${googleCode}; path=/; domain=${hostname};`;
    }

    // If Google Translate element exists in DOM, trigger its select
    const selectElem = document.querySelector('.goog-te-combo');
    if (selectElem) {
      selectElem.value = googleCode;
      selectElem.dispatchEvent(new Event('change'));
    }
  };

  const changeLanguage = (newLang) => {
    if (!TRANSLATIONS[newLang]) newLang = 'EN';
    setCurrentLanguageState(newLang);

    try {
      localStorage.setItem('artellium_language', newLang);
      applyGoogleTranslate(newLang);

      // Trigger custom event so any listeners update immediately
      window.dispatchEvent(new CustomEvent('artellium:languageChange', { detail: newLang }));

      // If Google Translate needs a fresh parse for dynamic content
      const langObj = LANGUAGES.find((l) => l.code === newLang);
      const googleCode = langObj ? langObj.googleCode : 'en';
      
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = googleCode;
        combo.dispatchEvent(new Event('change'));
      } else {
        // Fast reload if Google Translate cookie was updated and combo not yet mounted
        const currentCookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
        if (currentCookie && !currentCookie.includes(`/en/${googleCode}`)) {
          window.location.reload();
        }
      }
    } catch (e) {
      console.warn('Error saving language:', e);
    }
  };

  const t = (key, fallback = '') => {
    const dict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.EN;
    return dict[key] || TRANSLATIONS.EN[key] || fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage: changeLanguage,
        t,
        languagesList: LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      currentLanguage: 'EN',
      setLanguage: () => {},
      t: (key, fallback = '') => fallback || key,
      languagesList: LANGUAGES
    };
  }
  return context;
}
