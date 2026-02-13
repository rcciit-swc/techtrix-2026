import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Event Details page for TechTrix 2026',
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="relative">{children}</main>;
}
