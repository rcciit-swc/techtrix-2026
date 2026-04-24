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
  icons: '/favicon.jpg',
  title: 'Techtrix 2026 | Annual Technical Fest of RCCIIT',
  description:
    'Techtrix 2026 — The Annual Inter-College National Level Technical Fest of RCC Institute of Information Technology, Kolkata. Compete in Automata, Robotics, Flagship events and more.',
  canonical: 'https://techtrix.rcciit.org.in',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-orbitron',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cinzel',
  display: 'swap',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});

import AudioPlayer from '@/components/AudioPlayer';
import { ReferralTracker } from '@/components/ReferralTracker';
import { Suspense } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} ${cinzel.variable} ${rajdhani.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://techtrix.rcciit.org.in/#organization',
                  name: 'Techtrix 2026',
                  url: 'https://techtrix.rcciit.org.in',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://techtrix.rcciit.org.in/favicon.jpg',
                  },
                  description:
                    'Techtrix is the Annual Inter-College National Level Technical Fest of RCC Institute of Information Technology, Kolkata.',
                  parentOrganization: {
                    '@type': 'EducationalOrganization',
                    name: 'RCC Institute of Information Technology',
                    alternateName: 'RCCIIT',
                    address: {
                      '@type': 'PostalAddress',
                      streetAddress: 'Canal South Road, Beliaghata',
                      addressLocality: 'Kolkata',
                      addressRegion: 'West Bengal',
                      postalCode: '700015',
                      addressCountry: 'IN',
                    },
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://techtrix.rcciit.org.in/#website',
                  url: 'https://techtrix.rcciit.org.in',
                  name: 'Techtrix 2026',
                  description:
                    'Official website of Techtrix 2026 — Annual Technical Fest of RCCIIT',
                  publisher: {
                    '@id': 'https://techtrix.rcciit.org.in/#organization',
                  },
                },
                {
                  '@type': 'Event',
                  '@id': 'https://techtrix.rcciit.org.in/#event',
                  name: 'Techtrix 2026',
                  description:
                    'Techtrix 2026 is the premier Annual Inter-College National Level Technical Fest of RCC Institute of Information Technology, Kolkata. Featuring competitions in Automata, Robotics, Flagship events, and more.',
                  url: 'https://techtrix.rcciit.org.in',
                  image: 'https://techtrix.rcciit.org.in/favicon.jpg',
                  eventStatus: 'https://schema.org/EventScheduled',
                  eventAttendanceMode:
                    'https://schema.org/OfflineEventAttendanceMode',
                  location: {
                    '@type': 'Place',
                    name: 'RCC Institute of Information Technology',
                    address: {
                      '@type': 'PostalAddress',
                      streetAddress: 'Canal South Road, Beliaghata',
                      addressLocality: 'Kolkata',
                      addressRegion: 'West Bengal',
                      postalCode: '700015',
                      addressCountry: 'IN',
                    },
                  },
                  organizer: {
                    '@id': 'https://techtrix.rcciit.org.in/#organization',
                  },
                },
              ],
            }),
          }}
        />
        <AudioPlayer />
        <Suspense fallback={null}>
          <ReferralTracker />
        </Suspense>
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
