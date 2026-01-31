import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Events page for TechTrix 2026',
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
