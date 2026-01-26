import { Metadata } from 'next';

export function constructMetaData({
  title = 'Game of Thrones 2026 | Official Sports Fest of RCCIIT',
  description = 'Game of Thrones 2026 is the premier annual sports festival of RCC Institute of Information Technology. Join us for thrilling competitions, exciting events, and unforgettable moments.',
  authors = {
    name: 'Game of Thrones RCCIIT Team 2026',
    url: 'https://got.rcciit.org.in/',
  },
  creator = 'Game of Thrones RCCIIT Team 2026',
  generator = 'Next.js',
  publisher = 'RCC Institute of Information Technology',
  icons = '/favicon.ico',
  robots = {
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
  image = '/favicon.jpg',
  keywords = [
    'Game of Thrones',
    'GOT 2026',
    'RCCIIT',
    'RCC Institute',
    'Sports Fest',
    'College Sports',
    'Sports Festival',
    'Kolkata Sports Event',
    'College Events',
    'Sports Competition',
    'Annual Sports Meet',
    'RCCIIT Events',
  ],
  category = 'Sports & Events',
  openGraphType = 'website' as const,
  twitterCard = 'summary_large_image' as const,
  verification = {
    google: undefined,
    yandex: undefined,
    yahoo: undefined,
  },
}: {
  title?: string;
  description?: string;
  image?: string;
  authors?: { name: string; url: string };
  creator?: string;
  generator?: string;
  publisher?: string;
  icons?: string;
  robots?: Metadata['robots'];
  keywords?: string[];
  category?: string;
  openGraphType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  verification?: {
    google?: string;
    yandex?: string;
    yahoo?: string;
  };
} = {}): Metadata {
  const metadataBase = new URL('https://got.rcciit.org.in/');
  const imageUrl = new URL(image, metadataBase).toString();

  return {
    metadataBase,
    title: {
      default: title,
      template: '%s | Game of Thrones 2026',
    },
    description,
    keywords,
    authors,
    creator,
    generator,
    publisher,
    category,
    robots,
    icons,
    verification,

    // Open Graph metadata for social sharing
    openGraph: {
      type: openGraphType,
      locale: 'en_IN',
      url: metadataBase,
      siteName: 'Game of Thrones 2026',
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Game of Thrones 2026 - Official Sports Fest of RCCIIT',
          type: 'image/png',
        },
      ],
    },

    // Twitter Card metadata
    twitter: {
      card: twitterCard,
      title,
      description,
      images: [imageUrl],
      creator: '@RCCIIT',
      site: '@RCCIIT',
    },

    // Additional metadata
    alternates: {
      canonical: metadataBase,
    },

    // App-specific metadata
    applicationName: 'Game of Thrones 2026',

    // Format detection
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}
