// components/events/EventDetails.tsx
'use client';

import { getEventImages } from '@/lib/constants/eventImages';
import { useEvents } from '@/lib/stores';
import { events } from '@/lib/types/events';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import EventSidebar from './EventSidebar';
import EventTabs from './EventTabs';
import RegisterButton from './RegisterButton';
import { EventTab } from './event';

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
    <div className="relative min-h-screen overflow-y-auto">
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

      {/* Content Container - Three Column Layout */}
      <div
        className="relative flex justify-center py-8 px-2 sm:px-4 lg:py-12 lg:px-0"
        style={{ zIndex: 10 }}
      >
        {/* Left Sidebar Spacer - Desktop only */}
        <div className="hidden lg:block w-[280px] xl:w-[300px] flex-shrink-0" />
        {/* Main Content Panel - Centered */}
        <div className="w-full lg:max-w-[700px] xl:max-w-[800px] lg:my-12 rounded-3xl lg:rounded-[40px] border border-white/10 bg-black/40 backdrop-blur-md mx-2 sm:mx-4 lg:mx-6 flex justify-center items-center">
          {/* Inner Content */}
          <div className="w-full flex flex-col items-center py-6 px-3 sm:py-8 sm:px-6 lg:py-10 lg:px-10">
            {/* Header Row: Title + Buttons */}
            <div className="w-full flex flex-row justify-between items-start mb-4 sm:mb-6 lg:mb-8 gap-2">
              {/* Back Button - Left Side */}
              <div className="flex justify-start w-fit">
                <button
                  onClick={() =>
                    router.push(`/events/${event.event_category_id}`)
                  }
                  className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 lg:px-6 lg:py-2.5 rounded-full bg-black/80 border border-white/40 text-white hover:bg-black transition-all cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 group-hover:-translate-x-1 transition-transform" />
                  <span
                    className="hidden sm:inline text-xs sm:text-sm lg:text-base"
                    style={{ fontFamily: "'Metal Mania'" }}
                  >
                    BACK
                  </span>
                </button>
              </div>

              {/* Title - Centered */}
              <div className="flex justify-center flex-1 px-1">
                <h1
                  className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl text-white tracking-[0.1em] lg:tracking-[0.15em] text-center leading-tight"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  {event.name}
                </h1>
              </div>
              <RegisterButton event={event} />
            </div>

            {/* Tabs */}
            <EventTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Mobile-only Poster Image */}
            <div className="mt-6 w-full max-w-xs sm:max-w-sm lg:hidden relative aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-white/10">
              <Image
                src={event.image_url || '/events/poster.png'}
                alt={event.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Tab Content with HTML rendering */}
            <div className="mt-6 sm:mt-8 max-w-full lg:max-w-2xl text-center px-2">
              {getTabContent()}
            </div>

            {/* Schedule Section */}
            {event.schedule && (
              <div className="mt-6 sm:mt-8 w-full max-w-full lg:max-w-2xl px-2">
                <h3
                  className="text-base sm:text-lg lg:text-xl text-white mb-3 sm:mb-4 tracking-wider text-center"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  SCHEDULE & VENUE
                </h3>
                <div className="bg-white/10 rounded-xl p-3 sm:p-4 border border-white/20">
                  <div
                    className="text-white/85 text-sm sm:text-base leading-relaxed prose prose-invert prose-sm sm:prose-base max-w-none text-center"
                    dangerouslySetInnerHTML={{ __html: event.schedule }}
                  />
                </div>
              </div>
            )}

            {/* Registration Info */}
            <div className="mt-6 sm:mt-8 lg:mt-10 text-center text-white space-y-2 px-2">
              <p
                className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em]"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                TEAM SIZE: {event.min_team_size} - {event.max_team_size} members
              </p>
              <p
                className="mt-4 sm:mt-6 text-lg sm:text-xl tracking-wider"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                Registration Fees: ₹{event.registration_fees}/-
              </p>
              {event.prize_pool > 0 && (
                <p
                  className="text-base sm:text-lg tracking-wider text-yellow-400"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  Prize Pool: ₹{event.prize_pool}
                </p>
              )}
            </div>

            {/* Coordinators */}
            {event.coordinators && event.coordinators.length > 0 && (
              <div className="mt-6 sm:mt-8 lg:mt-10 text-center px-2">
                <h3
                  className="text-base sm:text-lg lg:text-xl text-white mb-3 sm:mb-4 tracking-wider"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  COORDINATORS
                </h3>
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                  {event.coordinators.map((coord, index) => (
                    <div
                      key={index}
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-white/10 border border-white/20 hover:border-yellow-400/60 transition-all"
                    >
                      <p className="text-white font-medium text-sm sm:text-base">
                        {coord.name}
                      </p>
                      <Link
                        href={`tel:${coord.phone}`}
                        className="text-white/70 text-xs sm:text-sm hover:text-yellow-400 transition-colors"
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
              <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 px-2">
                {event.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-full bg-white/10 border border-white/30 text-white hover:bg-white/20 transition-all"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Character Spacer - Desktop only */}
        <div className="hidden lg:block w-[280px] xl:w-[300px] flex-shrink-0" />
      </div>

      {/* Character Image - Fixed Right Side (Desktop only) */}
      <div
        className="hidden lg:block fixed right-0 bottom-0 w-[280px] xl:w-[300px] h-[85vh] pointer-events-none"
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

      {/* Event Sidebar - Fixed Left Side */}
      <EventSidebar
        activeId={event.id}
        items={relatedEvents.map((e) => ({
          id: e.id || '',
          title: e.name || '',
          image: getEventImages(e.id || 'default').bg,
        }))}
      />
    </div>
  );
}
