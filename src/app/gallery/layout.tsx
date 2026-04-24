import { constructMetaData } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = constructMetaData({
  title: 'Gallery',
  description:
    "Photo gallery from Techtrix — glimpses of the chaos, innovation, and energy from past editions of RCCIIT's Annual Technical Fest.",
  openGraphType: 'website',
  canonical: 'https://techtrix.rcciit.org.in/gallery',
});

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
