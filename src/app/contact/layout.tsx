import { constructMetaData } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = constructMetaData({
  title: 'Contact Us',
  description:
    "Get in touch with the Techtrix 2026 team. Find contact details for organizers, coordinators, and venue information for RCCIIT's Annual Technical Fest, Kolkata.",
  openGraphType: 'website',
  canonical: 'https://techtrix.rcciit.org.in/contact',
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
