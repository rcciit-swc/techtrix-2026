'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import Link from 'next/link';
import { useEvents } from '@/lib/stores';
import { Sparkles } from './hero/Sparkles';
import { events } from '@/lib/types/events';

export default function EventCardsCluster() {
  const params = useParams();
  const categoryId = params?.categorieId as string | undefined;

  const eventsData = useEvents((state) => state.eventsData);
  const eventsLoading = useEvents((state) => state.eventsLoading);

  // Filter events by category if categoryId is present
  const filteredEvents = useMemo(() => {
    if (!categoryId) return eventsData;
    return eventsData.filter((event) => event.event_category_id === categoryId);
  }, [eventsData, categoryId]);

  // Calculate arc positions for any number of events
  const getArcPosition = (index: number, total: number) => {
    if (total === 1) {
      return { left: 50, top: 30 };
    }

    // Arc spans from -70° to -110° (top arc of semicircle)
    const startAngle = -110 * (Math.PI / 180); // left side
    const endAngle = -70 * (Math.PI / 180); // right side
    const arcSpan = Math.PI; // 180 degrees for full semicircle bottom

    // Distribute events along a semicircle arc (bottom arc)
    const angleStep = arcSpan / (total - 1);
    const angle = Math.PI + index * angleStep; // Start from left (180°) to right (0°)

    // Radius as percentage of container (adjust for visual appeal)
    const radiusX = 38; // horizontal radius
    const radiusY = 35; // vertical radius (slightly flatter)

    // Center of the arc
    const centerX = 50;
    const centerY = 55;

    const left = centerX + radiusX * Math.cos(angle);
    const top = centerY + radiusY * Math.sin(angle);

    return { left, top };
  };

  if (eventsLoading) {
    return (
      <div
        className="relative w-full max-w-400 mx-auto overflow-hidden flex items-center justify-center min-h-[400px] md:min-h-0"
        style={{ aspectRatio: '1600 / 735' }}
      >
        <Sparkles colors={['rgba(0, 255, 0,']} />
        <p className="text-white text-xl">Loading events...</p>
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div
        className="relative w-full max-w-400 mx-auto overflow-hidden flex items-center justify-center min-h-[400px] md:min-h-0"
        style={{ aspectRatio: '1600 / 735' }}
      >
        <Sparkles colors={['rgba(0, 255, 0,']} />
        <p className="text-white text-xl">No events found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: Arc layout */}
      <div
        className="relative w-full max-w-400 mx-auto overflow-hidden hidden md:block"
        style={{ aspectRatio: '1600 / 735' }}
      >
        <Sparkles colors={['rgba(0, 255, 0,']} />
        {filteredEvents.map((event, index) => {
          const position = getArcPosition(index, filteredEvents.length);
          return (
            <EventCardItem
              key={event.event_id || index}
              event={event}
              style={{
                position: 'absolute',
                left: `${position.left}%`,
                top: `${position.top}%`,
                transform: 'translate(-50%, -50%)',
                width: '10.9375%',
              }}
            />
          );
        })}
      </div>

      {/* Mobile: Vertical scroll layout */}
      <div className="md:hidden w-full px-4 py-8">
        <Sparkles colors={['rgba(0, 255, 0,']} />
        <div className="flex flex-col gap-6 items-center">
          {filteredEvents.map((event, index) => (
            <EventCardItem
              key={event.event_id || index}
              event={event}
              style={{
                width: '200px',
              }}
              isMobile
            />
          ))}
        </div>
      </div>
    </>
  );
}

// Inline EventCard component
function EventCardItem({
  event,
  style,
  isMobile = false,
}: {
  event: events;
  style?: React.CSSProperties;
  isMobile?: boolean;
}) {
  return (
    <Link href={`/event/${event.event_id || event.id}`}>
      <div
        className={`
          shadow-[0_4px_15px_rgba(0,0,0,0.25),0_8px_45px_rgba(217,255,0,0.25)] 
          aspect-[175/233] 
          cursor-pointer 
          transition-transform 
          hover:scale-105
          ${isMobile ? 'w-full' : ''}
        `}
        style={style}
      >
        <img
          src={event.image_url || '/events/poster.png'}
          alt={event.name || 'Event Poster'}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 rounded-b-lg">
          <p className="text-white text-xs md:text-sm font-medium truncate text-center">
            {event.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
