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
  const [activeTab, setActiveTab] = useState<EventTab>('info');
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
      case 'info':
        return (
          <div className="space-y-3 sm:space-y-4">
            {/* Registration Info Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* Team Size Card */}
              <div className="group relative bg-white/10 rounded-lg p-2 sm:p-4 border border-white/20 text-center overflow-hidden transition-all duration-300 hover:border-white/40 hover:bg-white/15 hover:scale-105 hover:shadow-lg hover:shadow-white/10">
                {/* Animated gradient border on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-cyan-400/0 to-blue-400/0 group-hover:from-blue-400/20 group-hover:via-cyan-400/20 group-hover:to-blue-400/20 transition-all duration-500 rounded-lg" />
                <div className="relative z-10">
                  <p className="text-[10px] sm:text-xs text-white/60 mb-1 sm:mb-2 font-['Inter',sans-serif] uppercase tracking-wide">
                    Team Size
                  </p>
                  <p className="text-white font-bold text-sm sm:text-lg font-['Inter',sans-serif] group-hover:text-cyan-300 transition-colors">
                    {event.min_team_size} - {event.max_team_size}
                  </p>
                </div>
              </div>

              {/* Entry Fee Card */}
              <div className="group relative bg-white/10 rounded-lg p-2 sm:p-4 border border-white/20 text-center overflow-hidden transition-all duration-300 hover:border-white/40 hover:bg-white/15 hover:scale-105 hover:shadow-lg hover:shadow-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/0 via-emerald-400/0 to-green-400/0 group-hover:from-green-400/20 group-hover:via-emerald-400/20 group-hover:to-green-400/20 transition-all duration-500 rounded-lg" />
                <div className="relative z-10">
                  <p className="text-[10px] sm:text-xs text-white/60 mb-1 sm:mb-2 font-['Inter',sans-serif] uppercase tracking-wide">
                    Entry Fee
                  </p>
                  <p className="text-white font-bold text-sm sm:text-lg font-['Inter',sans-serif] group-hover:text-emerald-300 transition-colors">
                    ₹{event.registration_fees}
                  </p>
                </div>
              </div>

              {/* Prize Pool Card */}
              {event.prize_pool > 0 && (
                <div className="group relative bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-lg p-2 sm:p-4 border border-yellow-400/30 text-center overflow-hidden transition-all duration-300 hover:border-yellow-400/60 hover:from-yellow-400/30 hover:to-yellow-600/30 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/20">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-yellow-600/0 group-hover:from-yellow-400/30 group-hover:to-yellow-600/30 transition-all duration-500 rounded-lg blur-sm" />
                  <div className="relative z-10">
                    <p className="text-[10px] sm:text-xs text-yellow-400/80 mb-1 sm:mb-2 font-['Inter',sans-serif] uppercase tracking-wide">
                      Prize Pool
                    </p>
                    <p className="text-yellow-400 font-bold text-sm sm:text-lg font-['Inter',sans-serif] group-hover:text-yellow-300 transition-colors drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]">
                      ₹{event.prize_pool}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Schedule Section */}
            {event.schedule && (
              <div className="animate-fadeIn">
                <h3
                  className="text-xs sm:text-base text-white mb-2 tracking-wider flex items-center gap-2"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  <span className="inline-block w-1 h-4 sm:h-5 bg-gradient-to-b from-red-500 to-yellow-500 rounded-full" />
                  SCHEDULE & VENUE
                </h3>
                <div className="group relative bg-white/10 rounded-lg p-2 sm:p-3 border border-white/20 overflow-hidden transition-all duration-300 hover:border-white/30 hover:bg-white/15">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div
                    className="relative text-white/90 text-[11px] sm:text-sm leading-relaxed font-['Inter',sans-serif]"
                    dangerouslySetInnerHTML={{ __html: event.schedule }}
                  />
                </div>
              </div>
            )}

            {/* Coordinators */}
            {event.coordinators && event.coordinators.length > 0 && (
              <div className="animate-fadeIn">
                <h3
                  className="text-xs sm:text-base text-white mb-2 tracking-wider flex items-center gap-2"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  <span className="inline-block w-1 h-4 sm:h-5 bg-gradient-to-b from-red-500 to-yellow-500 rounded-full" />
                  COORDINATORS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {event.coordinators.map((coord, index) => (
                    <div
                      key={index}
                      className="group relative px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-white/10 border border-white/20 overflow-hidden transition-all duration-300 hover:border-yellow-400/60 hover:bg-white/15 hover:scale-[1.02] hover:shadow-md hover:shadow-yellow-400/10"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <div className="relative">
                        <p className="text-white font-medium text-xs sm:text-sm font-['Inter',sans-serif] group-hover:text-yellow-300 transition-colors">
                          {coord.name}
                        </p>
                        <Link
                          href={`tel:${coord.phone}`}
                          className="text-white/70 text-[10px] sm:text-xs hover:text-yellow-400 transition-colors font-['Inter',sans-serif] inline-flex items-center gap-1"
                        >
                          <span className="inline-block w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                          {coord.phone}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case 'rules':
        return (
          <div
            className="text-white/90 text-sm sm:text-base leading-relaxed prose prose-invert max-w-none font-['Inter',sans-serif]"
            dangerouslySetInnerHTML={{ __html: event.rules || '' }}
          />
        );
      default:
        return (
          <div
            className="text-white/90 text-sm sm:text-base leading-relaxed prose prose-invert max-w-none font-['Inter',sans-serif]"
            dangerouslySetInnerHTML={{ __html: event.description || '' }}
          />
        );
    }
  };

  return (
    <div className="relative min-h-screen overflow-y-auto py-20 md:py-0">
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
        className="relative flex justify-center py-6 px-2 sm:px-4 lg:py-8 lg:px-0"
        style={{ zIndex: 10 }}
      >
        {/* Left Sidebar Spacer - Desktop only */}
        <div className="hidden lg:block w-[200px] xl:w-[220px] flex-shrink-0" />
        {/* Main Content Panel - Centered */}
        <div className="w-full lg:max-w-[950px] xl:max-w-[900px] lg:my-8 rounded-2xl lg:rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md mx-2 sm:mx-4 lg:mx-6 flex justify-center items-center">
          {/* Inner Content */}
          <div className="w-full flex flex-col items-center py-4 px-3 sm:py-6 sm:px-5 lg:py-8 lg:px-8">
            {/* Header Row: Title + Buttons */}
            <div className="w-full flex flex-row justify-between items-start mb-4 sm:mb-5 gap-2">
              {/* Back Button - Left Side */}
              <div className="flex justify-start w-fit">
                <button
                  onClick={() =>
                    router.push(`/events/${event.event_category_id}`)
                  }
                  className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/80 border border-white/40 text-white hover:bg-black transition-all cursor-pointer group"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                  <span
                    className="hidden sm:inline text-xs sm:text-sm"
                    style={{ fontFamily: "'Metal Mania'" }}
                  >
                    BACK
                  </span>
                </button>
              </div>

              {/* Title - Centered */}
              <div className="flex justify-center flex-1 px-1">
                <h1
                  className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-white tracking-wider text-center leading-tight"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  {event.name}
                </h1>
              </div>
              <RegisterButton eventId={event.id || ''} />
            </div>

            {/* Side-by-Side Layout: Poster Left, Content Right */}
            <div className="w-full">
              {/* Top Section: Poster + Tabs/Content */}
              <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 lg:gap-6">
                {/* Left: Event Poster */}
                <div className="w-full max-w-md lg:max-w-none mx-auto lg:mx-0 relative aspect-[3/4] lg:aspect-auto lg:h-[450px] rounded-xl overflow-hidden shadow-lg border border-white/10">
                  <Image
                    src={event.image_url || '/events/poster.png'}
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Right: Tabs + Scrollable Content */}
                <div className="flex flex-col space-y-3 lg:h-[450px]">
                  {/* Tabs */}
                  <EventTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />

                  {/* Scrollable Content Area */}
                  <div className="lg:overflow-y-auto lg:flex-1 pr-2 custom-scrollbar">
                    {getTabContent()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Character Spacer - Desktop only */}
        <div className="hidden lg:block w-[200px] xl:w-[220px] flex-shrink-0" />
      </div>

      {/* Character Image - Fixed Right Side (Desktop only) */}
      <div
        className="hidden lg:block absolute -right-10 -bottom-10 w-[350px] xl:w-[400px] h-[85vh] pointer-events-none"
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
