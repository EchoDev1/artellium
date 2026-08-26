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

export const metadata = {
  title: 'ARTELLIUM - Premier Pan-African & Global Fine Art Marketplace',
  description:
    'Experience the richness of African creative heritage and global fine art auctions. Platform for master painters, bronze sculptors, and digital creators with live auctions, verified settlement authenticity, and virtual exhibitions.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-art-black text-slate-100 min-h-screen flex flex-col antialiased selection:bg-art-gold selection:text-art-black">
        <LanguageProvider>
          <StoreProvider>
            <GoogleTranslateScript />
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
