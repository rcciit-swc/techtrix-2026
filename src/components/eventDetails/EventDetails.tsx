// components/events/EventDetails.tsx
'use client';

import { getEventImages } from '@/lib/constants/eventImages';
import { useEvents } from '@/lib/stores';
import { events } from '@/lib/types/events';
import { AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { EventTab } from './event';
import EventLoader from './EventLoader';
import EventSidebar from './EventSidebar';
import EventTabs from './EventTabs';
import RegisterButton from './RegisterButton';

interface Props {
  event: events;
}

export default function EventDetails({ event }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<EventTab>('info');
  const eventsData = useEvents((state) => state.eventsData);

  // Get registration status from store (updated after registration)
  const storeEvent = eventsData.find((e) => e.id === event.id);
  const isRegistered = storeEvent?.registered ?? false;

  // Asset loading state
  const [bgLoaded, setBgLoaded] = useState(false);
  const [charLoaded, setCharLoaded] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(!event.image_url);

  const isFullyLoaded = bgLoaded && charLoaded && posterLoaded;

  // Get registration status from store (updated after registration)
  const storeEvent = eventsData.find((e) => e.id === event.id);
  const isRegistered = storeEvent?.registered ?? false;

  // Get event images from mapping
  const eventImages = getEventImages(event.id || 'default', event.name);

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
          <div className="space-y-4 sm:space-y-5">
            {/* Registration Info Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {/* Team Size Card */}
              <div className="group relative bg-[#0a0a0a]/80 backdrop-blur-md rounded-xl p-3 sm:p-5 border border-cyan-500/30 text-center overflow-hidden transition-all duration-300 hover:border-cyan-400 hover:bg-[#0f1a1f]/90 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent group-hover:from-cyan-400/20 transition-all duration-500" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <p
                    className="text-[10px] sm:text-xs text-cyan-400/70 mb-1 sm:mb-2 uppercase tracking-[0.2em]"
                    style={{ fontFamily: "'Maname', serif" }}
                  >
                    Team Size
                  </p>
                  <p
                    className="text-cyan-400 font-normal text-base sm:text-2xl group-hover:text-cyan-300 transition-colors drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                    style={{ fontFamily: "'Metal Mania', cursive" }}
                  >
                    {event?.max_team_size > 1
                      ? `${event.min_team_size} - ${event.max_team_size}`
                      : 'Solo'}
                  </p>
                </div>
              </div>

              {/* Entry Fee Card */}
              <div className="group relative bg-[#0a0a0a]/80 backdrop-blur-md rounded-xl p-3 sm:p-5 border border-[#00ff41]/30 text-center overflow-hidden transition-all duration-300 hover:border-[#00ff41] hover:bg-[#05140a]/90 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(0,255,65,0.25)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#00ff41]/10 via-transparent to-transparent group-hover:from-[#00ff41]/20 transition-all duration-500" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <p
                    className="text-[10px] sm:text-xs text-[#00ff41]/70 mb-1 sm:mb-2 uppercase tracking-[0.2em]"
                    style={{ fontFamily: "'Maname', serif" }}
                  >
                    Entry Fee
                  </p>
                  <p
                    className="text-[#00ff41] font-normal text-base sm:text-2xl group-hover:text-[#00ff41] transition-colors drop-shadow-[0_0_8px_rgba(0,255,65,0.5)] leading-tight"
                    style={{ fontFamily: "'Metal Mania', cursive" }}
                  >
                    {event.registration_fees === 0
                      ? 'FREE'
                      : event.registration_fees
                        ? `₹${event.registration_fees}`
                        : 'To be Announced'}
                  </p>
                </div>
              </div>

              {/* Prize Pool Card */}
              <div className="group relative bg-[#0a0a0a]/80 backdrop-blur-md rounded-xl p-3 sm:p-5 border border-[#EDF526]/30 text-center overflow-hidden transition-all duration-300 hover:border-[#EDF526] hover:bg-[#1f1f0a]/90 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(237,245,38,0.25)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#EDF526]/10 via-transparent to-transparent group-hover:from-[#EDF526]/20 transition-all duration-500" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <p
                    className="text-[10px] sm:text-xs text-[#EDF526]/70 mb-1 sm:mb-2 uppercase tracking-[0.2em]"
                    style={{ fontFamily: "'Maname', serif" }}
                  >
                    Prize Pool
                  </p>
                  <p
                    className="text-[#EDF526] font-normal text-base sm:text-2xl group-hover:text-[#EDF526] transition-colors drop-shadow-[0_0_8px_rgba(237,245,38,0.6)] leading-tight"
                    style={{ fontFamily: "'Metal Mania', cursive" }}
                  >
                    {event.prize_pool
                      ? `₹${event.prize_pool}`
                      : 'To be Announced'}
                  </p>
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            {event.schedule && (
              <div className="animate-fadeIn mt-2 sm:mt-4">
                <h3
                  className="text-sm sm:text-lg text-[#EDF526] mb-3 tracking-[0.1em] flex items-center gap-3 drop-shadow-[0_0_5px_rgba(237,245,38,0.5)]"
                  style={{ fontFamily: "'Metal Mania', cursive" }}
                >
                  <span className="inline-block w-1.5 h-5 sm:h-6 bg-gradient-to-b from-[#EDF526] to-[#d4a847] rounded-sm shadow-[0_0_8px_rgba(237,245,38,0.8)]" />
                  SCHEDULE & VENUE
                </h3>
                <div className="group relative bg-[#0a0a0a]/70 backdrop-blur-md rounded-xl p-3 sm:p-5 border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/30 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EDF526]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div
                    className="relative text-[#F9FAFB]/90 text-xs sm:text-sm md:text-base leading-relaxed"
                    style={{
                      fontFamily: "'Maname', serif",
                      letterSpacing: '0.05em',
                    }}
                    dangerouslySetInnerHTML={{ __html: event.schedule }}
                  />
                </div>
              </div>
            )}
            {/* Convenors */}
            {event.convenors && event.convenors.length > 0 && (
              <div className="animate-fadeIn mt-2 sm:mt-4">
                <h3
                  className="text-sm sm:text-lg text-[#EDF526] mb-3 tracking-[0.1em] flex items-center gap-3 drop-shadow-[0_0_5px_rgba(237,245,38,0.5)]"
                  style={{ fontFamily: "'Metal Mania', cursive" }}
                >
                  <span className="inline-block w-1.5 h-5 sm:h-6 bg-gradient-to-b from-[#EDF526] to-[#d4a847] rounded-sm shadow-[0_0_8px_rgba(237,245,38,0.8)]" />
                  CONVENORS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {event.convenors.map((coord, index) => (
                    <div
                      key={index}
                      className="group relative px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-[#0a0a0a]/70 backdrop-blur-md border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#EDF526]/50 hover:bg-[#1a1a0a]/80 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(237,245,38,0.15)]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EDF526]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <div className="relative">
                        <p
                          className="text-[#F9FAFB] font-medium text-sm sm:text-base group-hover:text-[#EDF526] transition-colors"
                          style={{
                            fontFamily: "'Maname', serif",
                            letterSpacing: '0.03em',
                          }}
                        >
                          {coord.name}
                        </p>
                        <Link
                          href={`tel:${coord.phone}`}
                          className="text-white/60 text-xs sm:text-sm hover:text-cyan-400 transition-colors inline-flex items-center gap-2 mt-1"
                          style={{ fontFamily: "'Maname', serif" }}
                        >
                          <span className="inline-block w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-pulse shadow-[0_0_5px_rgba(0,255,65,0.8)]" />
                          {coord.phone}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Coordinators */}
            {event.coordinators && event.coordinators.length > 0 && (
              <div className="animate-fadeIn mt-2 sm:mt-4">
                <h3
                  className="text-sm sm:text-lg text-[#EDF526] mb-3 tracking-[0.1em] flex items-center gap-3 drop-shadow-[0_0_5px_rgba(237,245,38,0.5)]"
                  style={{ fontFamily: "'Metal Mania', cursive" }}
                >
                  <span className="inline-block w-1.5 h-5 sm:h-6 bg-gradient-to-b from-[#EDF526] to-[#d4a847] rounded-sm shadow-[0_0_8px_rgba(237,245,38,0.8)]" />
                  COORDINATORS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {event.coordinators.map((coord, index) => (
                    <div
                      key={index}
                      className="group relative px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-[#0a0a0a]/70 backdrop-blur-md border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#EDF526]/50 hover:bg-[#1a1a0a]/80 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(237,245,38,0.15)]"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EDF526]/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <div className="relative">
                        <p
                          className="text-[#F9FAFB] font-medium text-sm sm:text-base group-hover:text-[#EDF526] transition-colors"
                          style={{
                            fontFamily: "'Maname', serif",
                            letterSpacing: '0.03em',
                          }}
                        >
                          {coord.name}
                        </p>
                        <Link
                          href={`tel:${coord.phone}`}
                          className="text-white/60 text-xs sm:text-sm hover:text-cyan-400 transition-colors inline-flex items-center gap-2 mt-1"
                          style={{ fontFamily: "'Maname', serif" }}
                        >
                          <span className="inline-block w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-pulse shadow-[0_0_5px_rgba(0,255,65,0.8)]" />
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
            className="text-[#F9FAFB]/90 text-sm sm:text-base leading-relaxed prose prose-invert max-w-none prose-headings:font-['Metal_Mania'] prose-headings:text-[#EDF526] prose-a:text-cyan-400 prose-strong:text-[#00ff41]"
            style={{ fontFamily: "'Maname', serif", letterSpacing: '0.03em' }}
            dangerouslySetInnerHTML={{ __html: event.rules || '' }}
          />
        );
      default:
        return (
          <div
            className="text-[#F9FAFB]/90 text-sm sm:text-base leading-relaxed prose prose-invert max-w-none prose-headings:font-['Metal_Mania'] prose-headings:text-[#EDF526] prose-a:text-cyan-400 prose-strong:text-[#00ff41]"
            style={{ fontFamily: "'Maname', serif", letterSpacing: '0.03em' }}
            dangerouslySetInnerHTML={{ __html: event.description || '' }}
          />
        );
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      <AnimatePresence>{!isFullyLoaded && <EventLoader />}</AnimatePresence>

      <div
        className={`relative min-h-screen overflow-y-auto py-20 md:py-0 transition-opacity duration-700 ${isFullyLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Background Image - Fixed */}
        <div className="fixed inset-0" style={{ zIndex: 0 }}>
          <Image
            src={eventImages.bg}
            alt="Background"
            fill
            className="object-cover"
            onLoad={() => setBgLoaded(true)}
            priority
          />
        </div>

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
              <div className="w-full flex flex-col md:flex-row justify-between items-center sm:items-start mb-4 sm:mb-5 gap-3 md:gap-2">
                {/* Top Row for Mobile (Back + Register), Inline for Desktop */}
                <div className="w-full md:w-auto flex justify-between items-center md:justify-start">
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
                  {/* Show Register Button here on mobile, hide on md+ */}
                  <div className="block md:hidden">
                    <RegisterButton eventId={event.id || ''} />
                  </div>
                </div>

              {/* Title - Centered */}
              <div className="flex flex-col justify-center items-center flex-1 px-1">
                <h1
                  className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-white tracking-wider text-center leading-tight"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  {event.name}
                </h1>
                {isRegistered && (
                  <span className="mt-1 px-3 py-0.5 text-[10px] sm:text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full tracking-wide">
                    ✓ Registered
                  </span>
                )}
              </div>
              <RegisterButton eventId={event.id || ''} />
            </div>
                {/* Title - Centered */}
                <div className="flex justify-center w-full md:flex-1 px-1">
                  <h1
                    className="text-2xl sm:text-xl lg:text-2xl xl:text-3xl text-white tracking-wider text-center leading-tight"
                    style={{ fontFamily: "'Metal Mania'" }}
                  >
                    {event.name}
                  </h1>
                </div>

                {/* Show Register Button here on desktop, hide on mobile */}
                <div className="hidden md:block">
                  <RegisterButton eventId={event.id || ''} />
                </div>
              </div>
              {/* Title - Centered */}
              <div className="flex flex-col justify-center items-center flex-1 px-1">
                <h1
                  className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-white tracking-wider text-center leading-tight"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  {event.name}
                </h1>
                {isRegistered && (
                  <span className="mt-1 px-3 py-0.5 text-[10px] sm:text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full tracking-wide">
                    ✓ Registered
                  </span>
                )}
              </div>
              <RegisterButton eventId={event.id || ''} />
            </div>

              {/* Side-by-Side Layout: Poster Left, Content Right */}
              <div className="w-full">
                {/* Top Section: Poster + Tabs/Content */}
                <div
                  className={`grid grid-cols-1 gap-4 lg:gap-6 ${event.image_url ? 'lg:grid-cols-[300px_1fr]' : 'lg:grid-cols-1'}`}
                >
                  {/* Left: Event Poster (Only if image exists) */}
                  {event.image_url && (
                    <div className="w-full max-w-md lg:max-w-none mx-auto lg:mx-0 relative aspect-[3/4] lg:aspect-auto lg:h-[450px] rounded-xl overflow-hidden shadow-lg border border-white/10">
                      <Image
                        src={event.image_url}
                        alt={event.name}
                        fill
                        className="object-cover"
                        onLoad={() => setPosterLoaded(true)}
                        priority
                      />
                    </div>
                  )}

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
            onLoad={() => setCharLoaded(true)}
            priority
          />
        </div>

        {/* Event Sidebar - Fixed Left Side */}
        <EventSidebar
          activeId={event.id}
          items={relatedEvents.map((e) => ({
            id: e.id || '',
            title: e.name || '',
            image: getEventImages(e.id || 'default', e.name).bg,
          }))}
        />
    </>
  );
}
