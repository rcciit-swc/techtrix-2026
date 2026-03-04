'use client';

import EventDetails from '@/components/eventDetails/EventDetails';
import EventLoader from '@/components/eventDetails/EventLoader';
import { useEvents } from '@/lib/stores';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function EventPage() {
  const params = useParams();
  const eventId = params?.eventId as string;

  const eventsData = useEvents((state) => state.eventsData);
  const eventsLoading = useEvents((state) => state.eventsLoading);
  const setEventsData = useEvents((state) => state.setEventsData);

  // Track if we've attempted to load
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  // Trigger data fetch if not already loaded
  useEffect(() => {
    if (eventsData.length === 0 && !eventsLoading && !hasAttemptedLoad) {
      setEventsData();
      setHasAttemptedLoad(true);
    }
  }, [eventsData.length, eventsLoading, hasAttemptedLoad, setEventsData]);

  // Memoize event lookup to avoid recalculating on every render
  const event = useMemo(() => {
    return eventsData.find((e) => e.id === eventId);
  }, [eventsData, eventId]);

  // Show loading while data is being fetched and we don't have it yet
  if (
    (eventsLoading && eventsData.length === 0) ||
    (eventsData.length === 0 && !hasAttemptedLoad)
  ) {
    return <EventLoader />;
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Event not found</p>
          <a href="/events" className="text-blue-400 hover:underline">
            Back to Events
          </a>
        </div>
      </div>
    );
  }

  return <EventDetails event={event} />;
}
