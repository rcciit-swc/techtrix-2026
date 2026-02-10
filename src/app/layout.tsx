import type { Metadata } from 'next';
import './globals.css';
import { constructMetaData } from '@/lib/utils';
import { Orbitron } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import SessionProvider from '@/lib/providers/SessionProvider';
import { Toaster } from 'sonner';
import { RazorpayScript } from '@/components/RazorpayScript';

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
        <Toaster position="bottom-right" richColors duration={5000} />
        <SessionProvider />
        <RazorpayScript />
      </body>
    </html>
  );
}
