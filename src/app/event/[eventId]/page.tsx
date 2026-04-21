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
  const eventData = useEvents((state) => state.eventData);
  const eventDetailsLoading = useEvents((state) => state.eventDetailsLoading);
  const setEventsData = useEvents((state) => state.setEventsData);
  const getEventByID = useEvents((state) => state.getEventByID);

  const [hasFetchedById, setHasFetchedById] = useState(false);

  // Fast path: event already in store (navigated from /events list)
  const eventFromList = useMemo(() => {
    return eventsData.find((e) => e.id === eventId);
  }, [eventsData, eventId]);

  useEffect(() => {
    if (eventFromList) return; // Already have it, no fetch needed

    if (!hasFetchedById) {
      setHasFetchedById(true);
      getEventByID(eventId); // Fast: single-row query by PK

      // Background-load all events for the store without blocking the page
      if (eventsData.length === 0 && !eventsLoading) {
        setEventsData(true); // background=true: no loading spinner
      }
    }
  }, [
    eventId,
    eventFromList,
    hasFetchedById,
    getEventByID,
    eventsData.length,
    eventsLoading,
    setEventsData,
  ]);

  const event = eventFromList ?? eventData;
  const isLoading = !eventFromList && (!hasFetchedById || eventDetailsLoading);

  if (isLoading) {
    return <EventLoader />;
  }

  if (!event?.id) {
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
