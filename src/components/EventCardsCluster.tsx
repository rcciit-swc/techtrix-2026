'use client';

import { getEventImages } from '@/lib/constants/eventImages';
import { useEvents } from '@/lib/stores';
import { events } from '@/lib/types/events';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { categories } from './EventsSection';
import GenericLoader from './GenericLoader';

export default function EventCardsCluster() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params?.categorieId as string | undefined;

  const eventsData = useEvents((state) => state.eventsData);
  const eventsLoading = useEvents((state) => state.eventsLoading);

  // Filter events by category if categoryId is present
  const filteredEvents = useMemo(() => {
    if (!categoryId) return eventsData;
    return eventsData.filter((event) => event.event_category_id === categoryId);
  }, [eventsData, categoryId]);

  // Prefetch all event pages so navigation is instant
  useEffect(() => {
    filteredEvents.forEach((event) => {
      router.prefetch(`/event/${event.event_id || event.id}`);
    });
  }, [filteredEvents, router]);

  // Get category name
  const categoryName = useMemo(() => {
    if (!categoryId) return 'All Events';

    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || 'Events';
  }, [categoryId]);

  if (eventsLoading || eventsData.length === 0) {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center">
        <GenericLoader />
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="relative w-full min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl mb-2 font-['Metal_Mania'] tracking-wider">
            No events found in this category
          </p>
          <p className="text-gray-400 font-rajdhani">
            Check back later for upcoming events
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: Grid layout */}
      <div className="hidden md:block relative w-full min-h-screen py-24 px-8">
        {/* Section header */}
        <div className="max-w-7xl mx-auto mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4 font-['Metal_Mania'] tracking-wider uppercase"
          >
            <span className="bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]">
              {categoryName}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-yellow-400/80 text-lg font-semibold tracking-wide"
          >
            Join the Ultimate Tournament Experience
          </motion.p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Responsive grid with better spacing */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.event_id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(index * 0.05, 0.3),
                  ease: 'easeOut',
                }}
              >
                <EventCardItem event={event} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Card carousel style */}
      <div className="md:hidden relative w-full min-h-screen py-16 px-4">
        {/* Mobile header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-2 font-['Metal_Mania'] tracking-wider uppercase">
            <span className="bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 bg-clip-text text-transparent">
              {categoryName}
            </span>
          </h2>
          <p className="text-yellow-400/80 font-semibold">Swipe to explore</p>
        </div>

        <div className="flex flex-col gap-8 items-center max-w-sm mx-auto pb-8">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.event_id || index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: Math.min(index * 0.04, 0.2),
                ease: 'easeOut',
              }}
              className="w-full"
            >
              <EventCardItem event={event} isMobile />
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}

// Marvel-themed EventCard component
function EventCardItem({
  event,
  isMobile = false,
}: {
  event: events;
  isMobile?: boolean;
}) {
  const eventImages = getEventImages(event.id || 'default', event.name);

  return (
    <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }}>
      <Link
        href={`/event/${event.event_id || event.id}`}
        style={{ touchAction: 'manipulation' }}
      >
        <div className="group relative aspect-[3/4] w-full cursor-pointer">
          {/* Comic book panel border effect */}
          <div className="absolute -inset-1 bg-gradient-to-br from-red-600 via-yellow-400 to-red-600 rounded-2xl opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-200 animate-pulse" />

          {/* Main card */}
          <div
            className="relative w-full h-full rounded-2xl overflow-hidden
            bg-gradient-to-br from-gray-900 via-black to-gray-900
            border-4 border-yellow-400/30
            shadow-[0_0_30px_rgba(0,0,0,0.9),inset_0_0_20px_rgba(250,204,21,0.1)]
            group-hover:border-yellow-400
            group-hover:shadow-[0_0_60px_rgba(250,204,21,0.6),0_0_100px_rgba(220,38,38,0.4),inset_0_0_30px_rgba(250,204,21,0.2)]
            group-hover:-translate-y-1
            transition-[border-color,box-shadow,transform] duration-200 ease-out"
          >
            {/* Image container */}
            <div className="relative w-full h-full overflow-hidden">
              <Image
                height={100}
                width={100}
                src={event.image_url || eventImages.bg}
                alt={event.name || 'Event Poster'}
                unoptimized
                className="w-full h-full object-cover
                  group-hover:scale-105
                  transition-transform duration-300 ease-out"
              />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-yellow-400/10 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>

            {/* Top energy beam */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            {/* Bottom energy beam */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            {/* Content section */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-7 z-10">
              <h3
                className="text-white text-xl md:text-2xl font-bold mb-3 line-clamp-2
                drop-shadow-[0_0_10px_rgba(0,0,0,1)]
                group-hover:text-yellow-400
                font-['Metal_Mania'] tracking-wider uppercase
                transition-colors duration-150
                [text-shadow:_2px_2px_0_rgb(220_38_38),_4px_4px_0_rgb(0_0_0)]"
              >
                {event.name}
              </h3>

              <div className="space-y-2 mb-4">
                {event.schedule && (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.6)]">
                      <svg
                        className="w-3 h-3 text-black"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{ __html: event.schedule }}
                      className="text-yellow-400 text-sm font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,1)] tracking-wide"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center shadow-[0_0_10px_rgba(250,204,21,0.6)]">
                    <svg
                      className="w-3 h-3 text-black"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-yellow-400 text-sm font-bold drop-shadow-[0_2px_8px_rgba(0,0,0,1)] tracking-wide">
                    {event.registration_fees === 0
                      ? 'FREE'
                      : event.registration_fees
                        ? `₹${event.registration_fees}`
                        : 'To be Announced'}
                  </span>
                </div>
              </div>

              {/* CTA — always visible on mobile, hover-revealed on desktop */}
              <div
                className={`flex items-center justify-between ${isMobile ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'} transition-[opacity,transform] duration-150`}
              >
                <span className="text-yellow-400 text-sm font-bold tracking-widest uppercase font-['Metal_Mania'] [text-shadow:_1px_1px_0_rgb(220_38_38),_2px_2px_0_rgb(0_0_0)]">
                  Enter Now
                </span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-red-500 flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.6)]">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
