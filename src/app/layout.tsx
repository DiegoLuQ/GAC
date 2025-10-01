import type { Metadata } from 'next';
import { Lora, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { cn } from '@/lib/utils';
import { getSettings } from '@/lib/api-client';
import type { Settings } from '@/types';

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lora',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-inter',
});


export const metadata: Metadata = {
  title: 'Recuerdos Eternos',
  description: 'Un catálogo de ánforas para mascotas.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings: Settings = await getSettings();

  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          lora.variable,
          inter.variable
        )}
      >
        <div className="relative flex min-h-dvh flex-col bg-background">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
