import type { Metadata } from 'next';
import EventSidebar from '@/components/eventDetails/EventSidebar';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Event Details page for TechTrix 2026',
};

// Sidebar events data - this could be fetched from a database
const sidebarEvents = [
  {
    id: 'fandom-quiz',
    title: 'Fandom Quiz',
    image: '/eventDetails/navbar/nav4.png',
  },
  {
    id: 'crack-the-interview',
    title: 'Crack the Interview',
    image: '/eventDetails/navbar/nav3.png',
  },
  {
    id: 'minds-eye',
    title: "Mind's Eye",
    image: '/eventDetails/navbar/nav2.png',
  },
  {
    id: 'tech-quiz',
    title: 'Tech Quiz',
    image: '/eventDetails/navbar/nav1.png',
  },
];

export default async function EventsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <main className="relative">
      {/* Sidebar - mounted at layout level */}
      <EventSidebar items={sidebarEvents} activeId={eventId} />

      {/* Page Content */}
      {children}
    </main>
  );
}
