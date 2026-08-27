import './globals.css';
import { StoreProvider } from '@/context/store-context';
import { LanguageProvider } from '@/context/language-context';
import GoogleTranslateScript from '@/components/GoogleTranslateScript';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import SidebarDrawer from '@/components/SidebarDrawer';
import CustodianModal from '@/components/CustodianModal';
import MobileBottomNav from '@/components/MobileBottomNav';
import SystemHealthGuardian from '@/components/SystemHealthGuardian';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://artellium.africa'),
  title: {
    default: 'ARTELLIUM AFRICA • Premier Pan-African & Global Fine Art Auctions',
    template: '%s | Artellium Africa'
  },
  description:
    'Experience the richness of African creative heritage and global fine art auctions. Curated marketplace for master painters, bronze sculptors, and digital artists with live auctions, Wema Bank verified settlement, and permanent provenance ledger.',
  keywords: [
    'African Art',
    'Fine Art Auctions',
    'Artellium Africa',
    'Pan-African Artists',
    'Contemporary African Painting',
    'Bronze Sculptures',
    'Lagos Art Gallery',
    'Provenance Ledger',
    'Wema Bank Art Settlement',
    'Digital Certificates of Authenticity'
  ],
  authors: [{ name: 'Artellium Global Marketplace Ltd', url: 'https://artellium.africa' }],
  creator: 'Artellium Africa',
  publisher: 'Artellium Global Marketplace Ltd',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'ARTELLIUM AFRICA • Premier Pan-African Fine Art & Live Auctions',
    description:
      'Explore and bid on museum-grade African masterworks. Direct corporate banking settlement, immutable provenance certificates, and verified master artists.',
    url: 'https://artellium.africa',
    siteName: 'Artellium Africa',
    images: [
      {
        url: '/artellium_brand_logo.png',
        width: 1200,
        height: 630,
        alt: 'Artellium Africa Fine Art & Auctions Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARTELLIUM AFRICA • African Fine Art & Auctions',
    description:
      'Bid on certified masterworks from top African painters and sculptors. Verified settlement and immutable provenance ledger.',
    images: ['/artellium_brand_logo.png'],
    creator: '@ArtelliumAfrica',
  },
  icons: {
    icon: '/artellium_brand_logo.png',
    shortcut: '/artellium_brand_logo.png',
    apple: '/artellium_brand_logo.png',
  },
};

export const viewport = {
  themeColor: '#07080A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-art-black text-slate-100 min-h-screen flex flex-col antialiased selection:bg-art-gold selection:text-art-black">
        <LanguageProvider>
          <StoreProvider>
            <GoogleTranslateScript />
            <SystemHealthGuardian />
            <Navbar />
            <main className="flex-1 w-full pb-16 md:pb-0">{children}</main>
            <Footer />
            <CartDrawer />
            <CheckoutModal />
            <SidebarDrawer />
            <CustodianModal />
            <MobileBottomNav />
          </StoreProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
