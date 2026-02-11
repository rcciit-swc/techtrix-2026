// app/events/page.tsx
import Background from '@/components/Background';
import EventCardsCluster from '@/components/EventCardsCluster';

export default function EventsPage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <Background />

      <EventCardsCluster />

      <h1
        className="absolute left-1/2 top-[576px] -translate-x-1/2
                   text-white text-[85px] text-center font-kungfu"
      >
        Choose Your Destiny
      </h1>
    </main>
  );
}
