import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Techtrix 2026',
    short_name: 'Techtrix',
    description:
      'The Annual Inter-College National Level Technical Fest of RCCIIT.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#EEFF00',
    icons: [
      {
        src: '/favicon.jpg',
        sizes: 'any',
        type: 'image/jpeg',
      },
    ],
  };
}
