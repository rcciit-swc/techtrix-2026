import type { Metadata } from 'next';
import './globals.css';
import { constructMetaData } from '@/utils/functions';

export const metadata: Metadata = constructMetaData({
  title: 'Techtrix 2026',
  description: 'The Official Sports Fest of RCCIIT.',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`$antialiased`}>{children}</body>
    </html>
  );
}
