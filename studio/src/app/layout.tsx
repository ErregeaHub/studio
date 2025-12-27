import { AuthProvider } from '../context/AuthContext';
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import BottomNav from '@/components/layout/bottom-nav';
import AppHeader from '@/components/layout/app-header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { QueryProvider } from '@/components/providers/query-provider';

export const metadata: Metadata = {
  title: 'RedRAW',
  description: 'A raw and powerful content platform for creators.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', 'bg-background text-foreground')}>
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
