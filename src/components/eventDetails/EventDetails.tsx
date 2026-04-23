// components/events/EventDetails.tsx
'use client';

import { getEventImages } from '@/lib/constants/eventImages';
import { useEvents, useUser } from '@/lib/stores';
import { events } from '@/lib/types/events';
import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { EventTab } from './event';
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

  // SWC-paid logic
  const { swcData, communityData } = useUser();
  const isSWCPaid = !!swcData;
  const SWC_FREE_CATEGORY_IDS = [
    'fb17b092-1622-4a3d-90a9-650fd860f6a0', // Automata
    '441aa4ca-49ad-4b57-bb7f-6a1c5cc63a32', // Out of the Box
    'a8609025-6132-4d69-8c61-3313ef082db4', // Flagship
  ];
  const isEligibleForSWCFree =
    isSWCPaid && SWC_FREE_CATEGORY_IDS.includes(event?.event_category_id ?? '');

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
                      ? event.min_team_size === event.max_team_size
                        ? event.min_team_size
                        : `${event.min_team_size} - ${event.max_team_size}`
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
                    {isEligibleForSWCFree && event.registration_fees > 0 ? (
                      <span className="flex flex-col items-center gap-0.5">
                        <span>
                          <span className="line-through text-white/40 text-sm sm:text-lg">
                            ₹{event.registration_fees}
                          </span>{' '}
                          <span>₹0</span>
                        </span>
                        <span className="text-[8px] sm:text-[10px] bg-[#00ff41]/20 text-[#00ff41] px-1.5 py-0.5 rounded-full border border-[#00ff41]/30 uppercase tracking-wider font-sans font-medium">
                          SWC Paid
                        </span>
                      </span>
                    ) : event.registration_fees === 0 ? (
                      'FREE'
                    ) : event.registration_fees ? (
                      `₹${event.registration_fees}`
                    ) : (
                      'To be Announced'
                    )}
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
            {/* Share this Event - Only for Community Partners */}
            {communityData && (
              <div className="animate-fadeIn mt-2 sm:mt-4">
                <h3
                  className="text-sm sm:text-lg text-[#EDF526] mb-3 tracking-[0.1em] flex items-center gap-3 drop-shadow-[0_0_5px_rgba(237,245,38,0.5)]"
                  style={{ fontFamily: "'Metal Mania', cursive" }}
                >
                  <span className="inline-block w-1.5 h-5 sm:h-6 bg-gradient-to-b from-[#EDF526] to-[#d4a847] rounded-sm shadow-[0_0_8px_rgba(237,245,38,0.8)]" />
                  SHARE THIS EVENT
                </h3>
                <div className="group relative bg-[#0a0a0a]/70 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-yellow-500/20 overflow-hidden transition-all duration-300 hover:border-yellow-400/40">
                  <p className="text-white/60 text-xs sm:text-sm mb-4 font-[Maname]">
                    Share this event with your community to earn referrals!
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}${window.location.pathname}?ref=${communityData.referral_code}`;
                        const text = `🔥 *TechTrix 2026: ${event.name}* 🔥\n\nDon't miss out on this amazing event! Register now using my link:\n\n🔗 ${shareUrl}\n\nSee you there! 🚀`;
                        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full px-5 py-2 h-auto text-sm flex items-center gap-2 transition-transform active:scale-95"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 0 5.414 0 12.05c0 2.123.553 4.197 1.606 6.023L0 24l6.163-1.617a11.82 11.82 0 005.883 1.567h.004c6.634 0 12.05-5.414 12.05-12.05 0-3.212-1.25-6.232-3.522-8.505" />
                      </svg>
                      Share on WhatsApp
                    </Button>
                    <Button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}${window.location.pathname}?ref=${communityData.referral_code}`;
                        navigator.clipboard.writeText(shareUrl);
                        toast.success('Referral link copied!');
                      }}
                      variant="outline"
                      className="bg-white/5 border-white/20 hover:bg-white/10 text-white rounded-full px-5 py-2 h-auto text-sm flex items-center gap-2 transition-transform active:scale-95"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                        />
                      </svg>
                      Copy Link
                    </Button>
                  </div>
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
      <div className="relative min-h-screen overflow-y-auto py-20 md:py-0">
        {/* Background Image - Fixed */}
        <div className="fixed inset-0" style={{ zIndex: 0 }}>
          <Image
            src={eventImages.bg}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Dark Overlay - Fixed */}
        <div className="fixed inset-0 bg-black/50" style={{ zIndex: 1 }} />

        {/* Content Container - Three Column Layout */}
        <div
          className="relative flex justify-center items-start lg:items-center min-h-[50vh] pt-20 pb-4 px-2 sm:px-4 lg:py-8 lg:px-0"
          style={{ zIndex: 10 }}
        >
          {/* Left Sidebar Spacer - Desktop only */}
          <div className="hidden lg:block w-[200px] xl:w-[220px] flex-shrink-0" />
          {/* Main Content Panel - Centered */}
          <div className="w-full lg:max-w-[950px] xl:max-w-[900px] lg:my-8 rounded-2xl lg:rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md mx-0 sm:mx-4 lg:mx-6 flex justify-center items-center">
            {/* Inner Content */}
            <div className="w-full flex flex-col items-center py-4 px-3 sm:py-6 sm:px-5 lg:py-8 lg:px-8">
              {/* Header Row: Back + Title + Register (single row) */}
              <div className="w-full flex items-center justify-between mb-4 sm:mb-5 gap-2 sm:gap-3">
                {/* Back Button */}
                <button
                  onClick={() =>
                    router.push(`/events/${event.event_category_id}`)
                  }
                  className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/80 border border-white/40 text-white hover:bg-black transition-all cursor-pointer group shrink-0"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                  <span
                    className="hidden sm:inline text-xs sm:text-sm"
                    style={{ fontFamily: "'Metal Mania'" }}
                  >
                    BACK
                  </span>
                </button>

                {/* Title - Centered */}
                <h1
                  className="ml-12 text-lg sm:text-2xl lg:text-3xl xl:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#EDF526] via-white to-[#EDF526] tracking-widest text-center leading-tight flex-1 min-w-0 drop-shadow-[0_0_12px_rgba(237,245,38,0.4)]"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  {event.name}
                </h1>

                {/* Register Button */}
                <div className="shrink-0">
                  <RegisterButton eventId={event.id || ''} event={event} />
                </div>
              </div>

              {/* Side-by-Side Layout: Poster Left, Content Right */}
              <div className="w-full">
                {/* Top Section: Poster + Tabs/Content */}
                <div
                  className={`grid grid-cols-1 gap-4 lg:gap-6 ${event.image_url ? 'lg:grid-cols-[300px_1fr]' : 'lg:grid-cols-1'}`}
                >
                  {/* Left: Event Poster (Only if image exists) */}
                  {event.image_url && (
                    <div
                      className={`w-full max-w-md lg:max-w-none mx-auto lg:mx-0 relative aspect-[3/4] lg:aspect-auto lg:h-[450px] lg:self-start rounded-xl overflow-hidden shadow-lg border border-white/10`}
                    >
                      <Image
                        src={event.image_url}
                        alt={event.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    </div>
                  )}

                  {/* Right: Tabs + Scrollable Content */}
                  <div
                    className={`flex flex-col space-y-3 ${activeTab === 'info' ? 'lg:min-h-[450px]' : 'lg:h-[450px]'}`}
                  >
                    {/* Tabs */}
                    <EventTabs
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                    />

                    {/* Scrollable Content Area */}
                    <div
                      className={`custom-scrollbar ${activeTab === 'info' ? 'lg:pr-2' : 'lg:overflow-y-auto lg:flex-1 lg:pr-2'}`}
                    >
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

        {/* Character Image - Absolute Right Side (Desktop only) */}
        <div className="hidden lg:block absolute right-0 bottom-0 h-[75vh] w-auto pointer-events-none z-[5] max-w-[35vw]">
          <img
            src={eventImages.char}
            alt="Character"
            className="h-full w-auto object-contain object-right-bottom"
          />
        </div>

        {/* Event Sidebar - Absolute Left Side */}
        <div className="absolute left-0 top-0 w-full h-full pointer-events-none z-[20]">
          <EventSidebar
            activeId={event.id}
            items={relatedEvents.map((e) => ({
              id: e.id || '',
              title: e.name || '',
              image: getEventImages(e.id || 'default', e.name).bg,
            }))}
          />
        </div>
      </div>
    </>
  );
}
