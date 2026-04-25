'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

const ORDER_FORM_URL = 'https://forms.gle/yKR4Zb2ggvY4yQ4i7';

const views = [
  { id: 1, label: 'Front', image: 'https://i.postimg.cc/pTzN4kRk/image.png' },
  { id: 2, label: 'Back', image: 'https://i.postimg.cc/Kzzk5kbh/back2.png' },
];

export default function MerchandisePage() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const current = views[selectedIndex];

  const prev = () =>
    setSelectedIndex((i) => (i - 1 + views.length) % views.length);
  const next = () => setSelectedIndex((i) => (i + 1) % views.length);

  return (
    <div
      className="fixed inset-0 z-40 bg-black text-white overflow-hidden"
      style={{ backgroundImage: "url('/profile/profilebg.jpeg')" }}
    >
      {/* Overlays */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 30%, rgba(250,204,21,0.08) 0%, transparent 65%)',
        }}
      />

      {/* Content — padded so nothing hides under the dock */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 pt-4 pb-24 gap-3 sm:gap-4">
        {/* ── Title ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-1"
        >
          <h1 className="font-orbitron font-bold text-yellow-400 tracking-[0.18em] uppercase text-2xl sm:text-3xl md:text-4xl drop-shadow-[0_0_16px_rgba(250,204,21,0.35)]">
            Merchandise
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '70px' }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent"
          />
        </motion.div>

        {/* ── Main card ── */}
        <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-4 lg:gap-10">
          {/* Image carousel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col items-center gap-2 flex-shrink-0"
          >
            {/* Main image */}
            <div className="relative">
              <button
                onClick={prev}
                className="absolute left-[-14px] sm:left-[-18px] top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-yellow-400 text-black font-bold flex items-center justify-center rounded-sm shadow-[0_0_12px_rgba(250,204,21,0.5)] hover:bg-yellow-300 transition-colors text-xs"
                aria-label="Previous"
              >
                ←
              </button>

              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.28 }}
                className="relative w-[280px] h-[335px] sm:w-[250px] sm:h-[330px] md:w-[300px] md:h-[400px] rounded-xl overflow-hidden border border-yellow-500/30 bg-white/5 shadow-[0_0_32px_rgba(0,0,0,0.7)]"
              >
                <Image
                  src={current.image}
                  alt={`Techtrix 2026 T-Shirt – ${current.label}`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 border border-yellow-400/40 text-yellow-400 text-[9px] font-semibold uppercase tracking-widest backdrop-blur-sm font-orbitron">
                  {current.label}
                </div>
              </motion.div>

              <button
                onClick={next}
                className="absolute right-[-14px] sm:right-[-18px] top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-9 sm:h-9 bg-yellow-400 text-black font-bold flex items-center justify-center rounded-sm shadow-[0_0_12px_rgba(250,204,21,0.5)] hover:bg-yellow-300 transition-colors text-xs"
                aria-label="Next"
              >
                →
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {views.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedIndex(i)}
                  className={`relative w-10 h-13 sm:w-12 sm:h-16 rounded-md overflow-hidden border-2 transition-all duration-300 ${
                    i === selectedIndex
                      ? 'border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)] scale-105'
                      : 'border-white/30 hover:border-white/60 opacity-50 hover:opacity-90'
                  }`}
                  style={{
                    height: i === selectedIndex ? undefined : undefined,
                  }}
                  aria-label={`View ${v.label}`}
                >
                  <Image
                    src={v.image}
                    alt={v.label}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex-1 flex flex-col items-center lg:items-start gap-3 text-center lg:text-left w-full"
          >
            {/* Name */}
            <div>
              <p className="font-rajdhani text-yellow-400/80 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-semibold mb-0.5">
                Official Techtrix 2026
              </p>
              <h2 className="font-cinzel font-bold text-white uppercase tracking-wide leading-tight text-xl sm:text-2xl md:text-3xl">
                Special T-Shirt
              </h2>
              <p className="font-rajdhani text-white/70 text-xs sm:text-sm mt-0.5">
                Premium quality · Black Edition
              </p>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-yellow-400/30 via-yellow-400/15 to-transparent" />

            {/* Price */}
            <div className="flex flex-col gap-1.5">
              <span className="inline-flex items-center gap-1.5 self-center lg:self-start px-3 py-0.5 rounded-full bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 text-[10px] font-semibold uppercase tracking-widest font-orbitron">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                Limited Time Offer
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-orbitron font-bold text-yellow-400 text-3xl sm:text-4xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
                  ₹299
                </span>
                <span className="font-orbitron text-white/55 text-base sm:text-lg line-through">
                  ₹399
                </span>
                <span className="font-rajdhani text-white/55 text-sm">
                  / piece
                </span>
              </div>
              <p className="font-rajdhani text-white/60 text-xs">
                Inclusive of all charges
              </p>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-yellow-400/30 via-yellow-400/15 to-transparent" />

            {/* Color */}
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#111111] border-2 border-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.5)] flex-shrink-0" />
              <p className="font-rajdhani text-white/75 text-xs sm:text-sm font-medium">
                Black — only available color
              </p>
            </div>

            {/* CTA */}
            <motion.button
              onClick={() =>
                window.open(ORDER_FORM_URL, '_blank', 'noopener,noreferrer')
              }
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  '0 6px 18px rgba(250,204,21,0.25)',
                  '0 10px 28px rgba(250,204,21,0.55)',
                  '0 6px 18px rgba(250,204,21,0.25)',
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-fit lg:w-auto px-8 sm:px-10 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-sm sm:text-base uppercase tracking-widest rounded-full font-orbitron"
            >
              🛒 Order Now
            </motion.button>

            <p className="font-rajdhani text-white/50 text-[11px] sm:text-xs text-center lg:text-left">
              You&apos;ll be redirected to our order form to complete your
              purchase.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
