import { constructMetaData } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = constructMetaData({
  title: 'Events',
  description:
    'Explore all events at Techtrix 2026 — Automata, Robotics, Flagship, Gaming, and Out of the Box competitions at RCCIIT, Kolkata.',
  openGraphType: 'website',
  canonical: 'https://techtrix.rcciit.org.in/events',
});

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
