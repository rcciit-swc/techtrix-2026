'use client';

import EventDetails from '@/components/eventDetails/EventDetails';
import EventLoader from '@/components/eventDetails/EventLoader';
import { InviteJoinModal } from '@/components/eventDetails/InviteJoinModal';
import { useEvents } from '@/lib/stores';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function EventPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params?.eventId as string;
  const invCode = searchParams?.get('inv_code') ?? null;

  const eventsData = useEvents((state) => state.eventsData);
  const eventData = useEvents((state) => state.eventData);
  const eventDetailsLoading = useEvents((state) => state.eventDetailsLoading);
  const getEventByID = useEvents((state) => state.getEventByID);

  const [hasFetchedById, setHasFetchedById] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Fast path: event already in store (navigated from /events list)
  const eventFromList = useMemo(() => {
    return eventsData.find((e) => e.id === eventId);
  }, [eventsData, eventId]);

  useEffect(() => {
    if (eventFromList) return; // Already have it from store (navigated from /events list)
    if (!hasFetchedById) {
      setHasFetchedById(true);
      getEventByID(eventId);
    }
  }, [eventId, eventFromList, hasFetchedById, getEventByID]);

  // Open invite modal when inv_code is present in URL
  useEffect(() => {
    if (invCode) {
      setIsInviteModalOpen(true);
    }
  }, [invCode]);

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

  return (
    <>
      <EventDetails event={event} />
      {invCode && (
        <InviteJoinModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          invCode={invCode}
          eventId={eventId}
        />
      )}
    </>
  );
}
