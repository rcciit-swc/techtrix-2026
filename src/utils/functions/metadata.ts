import { Metadata } from 'next';

export function constructMetaData({
  title = 'Techtrix 2026',
  description = 'Techtrix is the Official Techno-Management Fest of RCCIIT.',
  authors = {
    name: 'Techtrix RCCIIT Team 2026',
    url: 'https://got.rcciit.org.in/',
  },
  creator = 'Techtrix RCCIIT Team 2026',
  generator = 'Next.js',
  publisher = 'Techtrix',
  icons = '/favicon.ico',
  robots = 'index, follow',
  image = '/assets/home/Techtrix.png',
}: {
  title?: string;
  description?: string;
  image?: string;
  authors?: { name: string; url: string };
  creator?: string;
  generator?: string;
  publisher?: string;
  icons?: string;
  robots?: string;
} = {}): Metadata {
  return {
    title,
    description,
    authors,
    creator,
    generator,
    publisher,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    icons,
    metadataBase: new URL('https://got.rcciit.org.in/'),
    robots,
  };
}
