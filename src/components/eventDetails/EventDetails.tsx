// components/events/EventDetails.tsx
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import EventTabs from './EventTabs';
import RegisterButton from './RegisterButton';
import { EventTab } from './event';
import { events } from '@/lib/types/events';
import { getEventImages } from '@/lib/constants/eventImages';
import { useEvents } from '@/lib/stores';
import { ChevronLeft } from 'lucide-react';
import EventSidebar from './EventSidebar';

interface Props {
  event: events;
}

export default function EventDetails({ event }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EventTab>('description');
  const eventsData = useEvents((state) => state.eventsData);

  // Get event images from mapping
  const eventImages = getEventImages(event.id || 'default');

  // Get other events in the same category (for sidebar suggestions)
  const relatedEvents = useMemo(() => {
    if (!event.event_category_id) return [];
    return eventsData.filter(
      (e) =>
        e.event_category_id === event.event_category_id && e.id !== event.id
    );
  }, [eventsData, event.event_category_id, event.id]);

  const getTabContent = () => {
    switch (activeTab) {
      case 'rules':
        return (
          <div
            className="text-white/85 text-base leading-relaxed tracking-wide prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: event.rules || '' }}
          />
        );
      default:
        return (
          <div
            className="text-white/85 text-base leading-relaxed tracking-wide prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: event.description || '' }}
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image - Fixed */}
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `url(${eventImages.bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
        }}
      />

      {/* Dark Overlay - Fixed */}
      <div className="fixed inset-0 bg-black/50" style={{ zIndex: 1 }} />

      {/* Content Container */}
      <div
        className="relative min-h-screen flex items-center justify-center py-12 px-4"
        style={{ zIndex: 10 }}
      >
        {/* Main Content Panel */}
        <div className="w-full max-w-[1400px] min-h-[75vh] lg:min-h-[85vh] rounded-[40px] border border-white/10 bg-black/40 backdrop-blur-md mx-4 lg:mx-0 lg:ml-[60px] lg:mr-[380px] flex justify-center items-center">
          {/* Inner Content */}
          <div className="w-full flex flex-col items-center py-8 px-4 lg:py-12 lg:px-12">
            {/* Header Row: Title + Buttons */}
            <div className="w-full grid grid-cols-3 items-center mb-6 lg:mb-10 relative">
              {/* Back Button - Left Side */}
              <div className="order-1 flex justify-start w-full">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-4 py-2 lg:px-7 lg:py-3 rounded-full bg-black/80 border border-white/40 text-white hover:bg-black transition-all cursor-pointer group"
                >
                  <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 group-hover:-translate-x-1 transition-transform" />
                  <span
                    className="hidden sm:inline text-sm lg:text-[20px]"
                    style={{ fontFamily: "'Metal Mania'" }}
                  >
                    BACK
                  </span>
                </button>
              </div>

              {/* Title - Centered */}
              <div className="order-2 flex justify-center w-full px-2">
                <h1
                  className="text-xl sm:text-3xl lg:text-5xl text-white tracking-[0.15em] text-center text-ellipsis"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  {event.name}
                </h1>
              </div>

              {/* Register Button - Right Side */}
              <div className="order-3 flex justify-end w-full">
                <div className="scale-75 origin-right sm:scale-90 lg:scale-100">
                  <RegisterButton eventId={event.id || ''} />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <EventTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Mobile-only Poster Image */}
            <div className="mt-8 w-full max-w-sm lg:hidden relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-white/10">
              <Image
                src={event.image_url || '/events/poster.png'}
                alt={event.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Tab Content with HTML rendering */}
            <div className="mt-8 max-w-2xl text-center">{getTabContent()}</div>

            {/* Schedule Section */}
            {event.schedule && (
              <div className="mt-8 w-full max-w-2xl">
                <h3
                  className="text-xl text-white mb-4 tracking-wider text-center"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  SCHEDULE & VENUE
                </h3>
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <div
                    className="text-white/85 text-base leading-relaxed prose prose-invert max-w-none text-center"
                    dangerouslySetInnerHTML={{ __html: event.schedule }}
                  />
                </div>
              </div>
            )}

            {/* Registration Info */}
            <div className="mt-10 text-center text-white space-y-2">
              <p
                className="text-sm uppercase tracking-[0.2em]"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                TEAM SIZE: {event.min_team_size} - {event.max_team_size} members
              </p>
              <p
                className="mt-6 text-xl tracking-wider"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                Registration Fees: ₹{event.registration_fees}/-
              </p>
              {event.prize_pool > 0 && (
                <p
                  className="text-lg tracking-wider text-yellow-400"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  Prize Pool: ₹{event.prize_pool}
                </p>
              )}
            </div>

            {/* Coordinators */}
            {event.coordinators && event.coordinators.length > 0 && (
              <div className="mt-10 text-center">
                <h3
                  className="text-xl text-white mb-4 tracking-wider"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  COORDINATORS
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {event.coordinators.map((coord, index) => (
                    <div
                      key={index}
                      className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:border-yellow-400/60 transition-all"
                    >
                      <p className="text-white font-medium">{coord.name}</p>
                      <Link
                        href={`tel:${coord.phone}`}
                        className="text-white/70 text-sm hover:text-yellow-400 transition-colors"
                      >
                        {coord.phone}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {event.links && event.links.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {event.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Character Image - Fixed Right Side (Desktop only) */}
        <div
          className="hidden lg:block fixed right-0 bottom-0 w-[380px] h-[90vh] pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <Image
            src={eventImages.char}
            alt="Character"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>

        {/* Event Sidebar (Handles both Mobile & Desktop) */}
        <EventSidebar
          activeId={event.id}
          items={relatedEvents.map((e) => ({
            id: e.id || '',
            title: e.name || '',
            image: getEventImages(e.id || 'default').bg,
          }))}
        />
      </div>
    </div>
  );
}
