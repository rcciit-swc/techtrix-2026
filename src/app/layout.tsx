import Footer from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { RazorpayScript } from '@/components/RazorpayScript';
import SessionProvider from '@/lib/providers/SessionProvider';
import { constructMetaData } from '@/lib/utils';
import type { Metadata } from 'next';
import { Orbitron } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = constructMetaData({
  title: 'Techtrix 2026',
  description: 'The Official Sports Fest of RCCIIT.',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-orbitron',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${orbitron.className} antialiased`}>
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
