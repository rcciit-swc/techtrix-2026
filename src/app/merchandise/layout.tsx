import { constructMetaData } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = constructMetaData({
  title: 'Merchandise',
  description:
    'Get the official Techtrix 2026 T-Shirt — premium quality event tee available in Black & White at ₹349. Order now to rep the fest.',
  openGraphType: 'website',
  canonical: 'https://techtrix.rcciit.org.in/merchandise',
});

export default function MerchandiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
