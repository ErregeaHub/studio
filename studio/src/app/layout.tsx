import { Inter, Montserrat } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import BottomNav from '@/components/layout/bottom-nav';
import AppHeader from '@/components/layout/app-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { QueryProvider } from '@/components/providers/query-provider';
import GoogleAnalytics from '@/components/google-analytics';
import { getBaseUrl } from '@/lib/urls';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['600', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: 'RedRAW | Raw Creator Platform',
    template: '%s | RedRAW',
  },
  description: 'A raw and powerful content platform for creators to share photos and videos.',
  keywords: ['content platform', 'creators', 'photo sharing', 'video sharing', 'raw content'],
  authors: [{ name: 'RedRAW Team' }],
  creator: 'RedRAW',
  publisher: 'RedRAW',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: getBaseUrl(),
    siteName: 'RedRAW',
    title: 'RedRAW | Raw Creator Platform',
    description: 'A raw and powerful content platform for creators to share photos and videos.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RedRAW Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RedRAW | Raw Creator Platform',
    description: 'A raw and powerful content platform for creators to share photos and videos.',
    images: ['/og-image.png'],
    creator: '@redraw',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('dark', inter.variable, montserrat.variable)}>
      <body className={cn('font-body antialiased', 'bg-background text-foreground')}>
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
        <QueryProvider>
          <AuthProvider>
            <SidebarProvider defaultOpen={true}>
              <div className="flex min-h-screen w-full justify-center">
                {/* Max-width container for the 3-column layout */}
                <div className="flex w-full max-w-7xl">

                  <div className="flex flex-1 flex-col border-x border-border/50 min-h-screen relative pb-20 md:pb-0">
                    <AppHeader />
                    <main className="flex-1 overflow-y-auto">
                      {children}
                    </main>
                  </div>
                </div>
              </div>
              <BottomNav />
            </SidebarProvider>
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
