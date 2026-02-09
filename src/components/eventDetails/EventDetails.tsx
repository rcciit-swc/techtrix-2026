// components/events/EventDetails.tsx
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EventTabs from './EventTabs';
import { EventTab } from './event';
import { events } from '@/lib/types/events';
import { getEventImages } from '@/lib/constants/eventImages';
import { useEvents } from '@/lib/stores';

interface Props {
  event: events;
}

export default function EventDetails({ event }: Props) {
  const [activeTab, setActiveTab] = useState<EventTab>('description');
  const eventsData = useEvents((state) => state.eventsData);

  // Get event images from mapping
  const eventImages = getEventImages(event.event_id || event.id || 'default');

  // Get other events in the same category (for sidebar suggestions)
  const relatedEvents = useMemo(() => {
    if (!event.event_category_id) return [];
    return eventsData.filter(
      (e) =>
        e.event_category_id === event.event_category_id &&
        e.event_id !== event.event_id
    );
  }, [eventsData, event.event_category_id, event.event_id]);

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
        <div className="w-full max-w-[1400px] min-h-[75vh] lg:min-h-[85vh] rounded-[40px] border border-white/10 bg-black/40 backdrop-blur-md mx-4 lg:mx-0 lg:ml-[60px] lg:mr-[380px] mt-24 lg:mt-0">
          {/* Inner Content */}
          <div className="flex flex-col items-center py-8 px-6 lg:py-12 lg:px-12">
            {/* Header Row: Title + Buttons */}
            <div className="w-full flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr] items-center mb-10">
              {/* Left spacer to balance grid */}
              <div className="hidden lg:block"></div>

              {/* Title - Centered */}
              <h1
                className="text-3xl lg:text-5xl text-white tracking-[0.15em] text-center"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                {event.name}
              </h1>

              {/* Buttons - Right Side */}
              <div className="flex items-center justify-center lg:justify-end gap-5">
                {/* Back Button */}
                <Link
                  href="/events"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-black/80 border border-white/40 text-white text-sm hover:bg-black transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  <span style={{ fontFamily: "'Metal Mania'" }}>BACK</span>
                </Link>

                {/* Register Now Button */}
                {event.reg_status && (
                  <Link
                    href={`/register/${event.event_id || event.id}`}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-[#C62828] text-white text-sm hover:bg-[#B71C1C] transition-all shadow-lg"
                  >
                    <span style={{ fontFamily: "'Metal Mania'" }}>
                      {event.registered ? 'Registered' : 'Register Now'}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                )}
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

        {/* Related Events Sidebar (Desktop only) */}
        <div
          className="hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 flex-col gap-3 pl-4"
          style={{ zIndex: 15 }}
        >
          {relatedEvents.slice(0, 4).map((relatedEvent) => {
            const relatedImages = getEventImages(
              relatedEvent.event_id || 'default'
            );
            return (
              <Link
                key={relatedEvent.event_id}
                href={`/event/${relatedEvent.event_id}`}
                className="relative w-[140px] h-[100px] rounded-r-2xl overflow-hidden border-2 border-white/30 hover:border-white hover:scale-105 transition-all group"
              >
                <Image
                  src={relatedImages.bg}
                  alt={relatedEvent.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p
                    className="text-white text-xs font-bold text-center truncate"
                    style={{ fontFamily: "'Metal Mania'" }}
                  >
                    {relatedEvent.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
