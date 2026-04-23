'use client';

import EventDetails from '@/components/eventDetails/EventDetails';
import EventLoader from '@/components/eventDetails/EventLoader';
import { InviteJoinModal } from '@/components/eventDetails/InviteJoinModal';
import { useEvents } from '@/lib/stores';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export default function EventPageClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const eventId = params?.eventId as string;
  const invCode = searchParams?.get('inv_code') ?? null;

  const eventsData = useEvents((state) => state.eventsData);
  const eventData = useEvents((state) => state.eventData);
  const getEventByID = useEvents((state) => state.getEventByID);

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [fetchDone, setFetchDone] = useState(false);

  const eventFromList = useMemo(
    () => eventsData.find((e) => e.id === eventId),
    [eventsData, eventId]
  );

  useEffect(() => {
    setFetchDone(false);
    if (eventFromList) {
      setFetchDone(true);
      return;
    }
    getEventByID(eventId).then(() => setFetchDone(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  useEffect(() => {
    if (invCode) setIsInviteModalOpen(true);
  }, [invCode]);

  const eventFromFetch = eventData?.id === eventId ? eventData : null;
  const event = eventFromList ?? eventFromFetch;

  if (!event?.id && !fetchDone) {
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
