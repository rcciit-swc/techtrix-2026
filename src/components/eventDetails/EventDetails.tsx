// components/events/EventDetails.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EventTabs from './EventTabs';
import { EventContent, EventTab } from './event';

interface Props {
  event: EventContent;
}

export default function EventDetails({ event }: Props) {
  const [activeTab, setActiveTab] = useState<EventTab>('description');

  const getTabContent = () => {
    switch (activeTab) {
      case 'rules':
        return event.rules;
      case 'more':
        return event.moreDetails;
      default:
        return event.description;
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image - Fixed */}
      <div
        className="fixed inset-0"
        style={{
          backgroundImage: `url(${event.backgroundImage})`,
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
        <div className="ml-[160px] mr-[240px] w-full max-w-[1400px] min-h-[85vh] rounded-[40px] border border-white/10 bg-black/40 backdrop-blur-md">
          {/* Inner Content */}
          <div className="flex flex-col items-center py-12 px-12">
            {/* Header Row: Title + Buttons */}
            <div className="w-full grid grid-cols-[1fr_auto_1fr] items-center mb-10">
              {/* Left spacer to balance grid */}
              <div></div>

              {/* Title - Centered */}
              <h1
                className="text-4xl lg:text-5xl text-white tracking-[0.15em] text-center"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                {event.title}
              </h1>

              {/* Buttons - Right Side */}
              <div className="flex items-center justify-end gap-5">
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
                <Link
                  href="#register"
                  className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-[#C62828] text-white text-sm hover:bg-[#B71C1C] transition-all shadow-lg"
                >
                  <span style={{ fontFamily: "'Metal Mania'" }}>
                    Register Now
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
              </div>
            </div>

            {/* Tabs */}
            <EventTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Description Content */}
            <div className="mt-8 max-w-2xl text-center">
              <p className="text-white/85 text-base leading-relaxed tracking-wide">
                {getTabContent()}
              </p>
            </div>

            {/* Registration Info */}
            <div className="mt-10 text-center text-white space-y-2">
              <p
                className="text-sm uppercase tracking-[0.2em]"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                LAST DATE OF REGISTRATION: {event.lastDate}
              </p>
              <p
                className="text-sm uppercase tracking-[0.2em]"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                VENUE : {event.venue}
              </p>
              <p
                className="mt-6 text-xl tracking-wider"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                Registration Fees:- {event.fee}
              </p>
            </div>

            {/* Coordinator List Button */}
            <button
              className="mt-10 px-20 py-5 rounded-2xl bg-gradient-to-b from-white/5 to-black/50 border border-white/20 text-white text-2xl tracking-[0.15em] uppercase hover:from-white/10 hover:to-black/60 transition-all"
              style={{ fontFamily: "'Metal Mania'" }}
            >
              COORDINATOR LIST
            </button>
          </div>
        </div>

        {/* Character Image - Fixed Right Side */}
        <div
          className="fixed right-0 bottom-0 w-[380px] h-[90vh] pointer-events-none"
          style={{ zIndex: 5 }}
        >
          <Image
            src={event.characterImage}
            alt="Character"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>
    </div>
  );
}
