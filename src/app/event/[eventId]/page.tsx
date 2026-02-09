'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useEvents } from '@/lib/stores';
import EventDetails from '@/components/eventDetails/EventDetails';

export default function EventPage() {
  const params = useParams();
  const eventId = params?.eventId as string;

  const eventsData = useEvents((state) => state.eventsData);
  const eventsLoading = useEvents((state) => state.eventsLoading);
  const setEventsData = useEvents((state) => state.setEventsData);

  // Track if we've attempted to load
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  // Debug logs
  console.log('[EventPage] eventId:', eventId);
  console.log('[EventPage] eventsData length:', eventsData.length);
  console.log('[EventPage] eventsLoading:', eventsLoading);
  console.log('[EventPage] hasAttemptedLoad:', hasAttemptedLoad);
  if (eventsData.length > 0) {
    console.log('[EventPage] First event sample:', eventsData[0]);
    console.log(
      '[EventPage] All event IDs:',
      eventsData.map((e) => ({ id: e.id, event_id: e.event_id, name: e.name }))
    );
  }

  // Trigger data fetch if not already loaded
  useEffect(() => {
    console.log('[EventPage useEffect] Checking if should fetch...');
    if (eventsData.length === 0 && !eventsLoading && !hasAttemptedLoad) {
      console.log('[EventPage useEffect] Triggering setEventsData...');
      setEventsData();
      setHasAttemptedLoad(true);
    }
  }, [eventsData.length, eventsLoading, hasAttemptedLoad, setEventsData]);

  // Find the event from store (use event_id as that's the field name from DB)
  const event = eventsData.find(
    (e) => e.event_id === eventId || e.id === eventId
  );
  console.log('[EventPage] Found event:', event);

  // Show loading while data is being fetched
  if (eventsLoading || (eventsData.length === 0 && !hasAttemptedLoad)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <p className="text-white text-xl">Loading event...</p>
      </div>
    );
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
