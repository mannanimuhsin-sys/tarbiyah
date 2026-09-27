import './globals.css';
import type { Metadata, Viewport } from 'next';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { InstallPWA } from '@/components/common/InstallPWA';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { BottomNav } from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'Tarbiyah - Premium Islamic Education Platform',
  description: 'Learn Quran. Build Character. Grow in Faith. Online Madrasa, Tajweed, Hifz, Live Classes, and Student Character Tracking.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    title: 'Tarbiyah',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#064e3b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <body className="bg-islamic-lightBg dark:bg-islamic-dark text-gray-900 dark:text-gray-100 flex flex-col min-h-screen min-h-[100dvh] antialiased bg-islamic-stars overflow-x-hidden">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <Navbar />
              <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 lg:pb-6 overflow-x-hidden">
                {children}
              </main>
              <BottomNav />
              <WhatsAppButton />
              <InstallPWA />
              <Footer />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
