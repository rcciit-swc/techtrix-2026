import type { Metadata } from 'next';
import './globals.css';
import { constructMetaData } from '@/utils/functions';
import { Orbitron } from 'next/font/google';

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
      <body className={`${orbitron.className} antialiased`}>{children}</body>
    </html>
  );
}
