import { Metadata } from 'next';

export function constructMetaData({
  title = 'Techtrix 2026 | Official Technical Fest of RCCIIT',
  description = 'Techtrix 2026 is the premier annual technical festival of RCC Institute of Information Technology. Join us for thrilling competitions, exciting events, and unforgettable moments.',
  authors = {
    name: 'Techtrix RCCIIT Team 2026',
    url: 'https://techtrix.rcciit.org.in/',
  },
  creator = 'Techtrix RCCIIT Team 2026',
  generator = 'Next.js',
  publisher = 'RCC Institute of Information Technology',
  icons = '/favicon.jpg',
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
    'Techtrix 2026',
    'Techtrix RCCIIT',
    'RCCIIT Tech Fest',
    'RCC Institute of Information Technology',
    'Technical Fest Kolkata',
    'National Level Technical Festival',
    'Inter College Technical Competition',
    'Engineering Fest Kolkata 2026',
    'College Technical Competition India',
    'Automata Events Kolkata',
    'Robotics Competition RCCIIT',
    'Technical Fest West Bengal',
    'Annual Technical Meet Kolkata',
    'RCCIIT Events 2026',
    'Technical Competition India',
  ],
  category = 'Technical & Events',
  openGraphType = 'website' as const,
  twitterCard = 'summary_large_image' as const,
  canonical = undefined as string | undefined,
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
  canonical?: string;
  verification?: {
    google?: string;
    yandex?: string;
    yahoo?: string;
  };
} = {}): Metadata {
  const metadataBase = new URL('https://techtrix.rcciit.org.in/');
  const imageUrl = new URL(image, metadataBase).toString();

  return {
    metadataBase,
    title: {
      default: title,
      template: '%s | Techtrix 2026',
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
      siteName: 'Techtrix 2026',
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: 'Techtrix 2026 - Official Technical Fest of RCCIIT',
          type: 'image/jpg',
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

    // Additional metadata — only set canonical when explicitly provided
    ...(canonical ? { alternates: { canonical } } : {}),

    // App-specific metadata
    applicationName: 'Techtrix 2026',

    // Format detection
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}
