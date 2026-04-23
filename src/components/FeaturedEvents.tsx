'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const featuredEvents = [
  {
    image: 'https://i.postimg.cc/YSMCvj3Z/2-20260313-190345-0000-jpg.jpg',
    link: 'https://www.goavo.ai/events/forms/fillup/?id=69abf9a1e9d8e193f486e39f',
    title: 'Featured Event 1',
  },
  {
    image: 'https://i.postimg.cc/j5kx3cb5/Untitled-design.png',
    link: 'https://www.goavo.ai/events/forms/fillup/?id=69abf9a1e9d8e193f486e39f',
    title: 'Featured Event 2',
  },
];

export default function FeaturedEvents() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      {/* EXHILARATING MARVEL BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Halftone Ben-Day Dots Pattern */}
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `radial-gradient(#EEFF00 1.2px, transparent 1.2px)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Action Comic Rays (Radial Burst) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full animate-spin-slow"
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <polygon
                key={i}
                points="50,50 100,30 100,70"
                fill="#EEFF00"
                style={{
                  transform: `rotate(${i * 15}deg)`,
                  transformOrigin: '50% 50%',
                }}
              />
            ))}
          </svg>
        </div>

        {/* Comic Screen Tone (Screentone Overlays) */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #EEFF00 0, #EEFF00 1px, transparent 1px, transparent 10px)`,
          }}
        />

        {/* Bottom Transition Gradient (to match SponsorSection Cyan) */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#00f7ff]/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#00f7ff] to-transparent opacity-40 blur-sm" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#EEFF00] rounded-full blur-[80px] opacity-[0.08]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block relative z-10"
          >
            <h2
              className="text-5xl md:text-8xl font-bold text-[#EEFF00] uppercase tracking-[0.3em] drop-shadow-[10px_10px_0_rgba(0,0,0,0.5)]"
              style={{ fontFamily: 'KungFuMaster' }}
            >
              Featured Events
            </h2>
            <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-1 bg-[#EEFF00] hidden md:block" />
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-1 bg-[#EEFF00] hidden md:block" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white text-lg md:text-2xl mt-8 tracking-[0.2em] uppercase max-w-2xl mx-auto opacity-70"
            style={{ fontFamily: 'Metal Mania' }}
          >
            Don't miss out on these epic showdowns
          </motion.p>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-w-5xl mx-auto px-4">
          {featuredEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover="hover"
              className="relative group cursor-pointer"
            >
              {/* CLEAN COMIC GLOW (No Shadow) */}
              <div className="absolute -inset-1.5 bg-[#EEFF00] opacity-30 group-hover:opacity-100 transition-all duration-300 rounded-sm group-hover:shadow-[0_0_40px_rgba(238,255,0,0.6)]" />
              <div className="absolute -inset-0.5 bg-black rounded-sm" />

              {/* Image Container with 4:5 Aspect Ratio */}
              <div className="relative z-10 border-2 border-[#EEFF00]/50 overflow-hidden group-hover:border-[#EEFF00] transition-colors duration-300">
                <div className="block relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover filter saturate-[0.8] group-hover:saturate-[1.4] transition-all duration-500 scale-100 group-hover:scale-105"
                    unoptimized
                  />

                  {/* LIGHT SWEEP SHEEN EFFECT */}
                  <motion.div
                    variants={{
                      hover: { x: ['-100%', '200%'] },
                    }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] pointer-events-none"
                  />

                  {/* PUNCHY MARVEL RSVP OVERLAY */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.div
                      variants={{
                        hover: { scale: [0, 1.1, 1], rotate: [-10, -2, -2] },
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 15,
                      }}
                      className="bg-gray-600 text-white px-10 py-5 text-4xl font-black uppercase transform shadow-[10px_10px_0_rgba(0,0,0,1)] border-4 border-black cursor-not-allowed opacity-90"
                      style={{ fontFamily: 'KungFuMaster' }}
                    >
                      RSVP Closed
                    </motion.div>
                  </div>
                </div>

                {/* COMIC PANEL DECORATIVE ACCENTS (Rivets) */}
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-black/40 border border-[#EEFF00]/30 z-20" />
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-black/40 border border-[#EEFF00]/30 z-20" />
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-black/40 border border-[#EEFF00]/30 z-20" />

                {/* Comic Panel Corner Cut */}
                <div className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none z-20 overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-full h-full bg-[#EEFF00] rotate-45 translate-x-1/2 translate-y-1/2 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Extreme Bottom Transition Mask */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-20" />

      {/* Floating Particle Accents in Cyan */}
      <div className="absolute bottom-4 left-0 w-full flex justify-around opacity-30 pointer-events-none px-20">
        <div className="w-1.5 h-1.5 bg-[#00f7ff] rounded-full blur-[2px] animate-pulse" />
        <div className="w-2 h-2 bg-[#00f7ff] rounded-full blur-[1px] animate-bounce delay-75" />
        <div className="w-1 h-1 bg-[#00f7ff] rounded-full blur-[2px] animate-pulse delay-150" />
        <div className="w-2.5 h-2.5 bg-[#00f7ff] rounded-full blur-[3px] animate-bounce delay-300" />
      </div>
    </section>
  );
}
