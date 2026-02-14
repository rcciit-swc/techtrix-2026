import Footer from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { RazorpayScript } from '@/components/RazorpayScript';
import SessionProvider from '@/lib/providers/SessionProvider';
import { constructMetaData } from '@/lib/utils';
import type { Metadata } from 'next';
import { Cinzel, Orbitron, Rajdhani } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = constructMetaData({
  image: '/favicon.jpg',
  icons: '/favicon.jpg', // Explicitly use the jpg file as favicon
  title: 'Techtrix 2026',
  description:
    'The Annual Inter-College National Level Technical Fest of RCCIIT.',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-orbitron',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cinzel',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.className} ${cinzel.variable} ${rajdhani.variable} antialiased`}
      >
        {children}
        <Navbar />
        <Footer />
        <Toaster position="bottom-right" richColors duration={5000} />
        <SessionProvider />
        <RazorpayScript />
      </body>
    </html>
  );
}
