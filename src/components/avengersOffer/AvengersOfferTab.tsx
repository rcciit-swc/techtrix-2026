'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface AvengersOfferTabProps {
  onClick: () => void;
}

export function AvengersOfferTab({ onClick }: AvengersOfferTabProps) {
  return (
    <motion.button
      initial={{ x: 80 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 1.5 }}
      whileHover={{ scale: 1.05, x: -5 }}
      onClick={onClick}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[50] cursor-pointer group"
      title="Avengers Initiative Offer"
    >
      <div className="relative flex items-center bg-gradient-to-b from-red-600 via-red-700 to-red-900 rounded-l-2xl px-3.5 py-7 shadow-[0_0_30px_rgba(239,68,68,0.4)] border-2 border-r-0 border-red-500/50 group-hover:shadow-[0_0_50px_rgba(239,68,68,0.6)] transition-all duration-300">
        {/* Animated Glow Pulse */}
        <div className="absolute inset-0 bg-red-600 rounded-l-2xl animate-pulse opacity-20 group-hover:opacity-40" />

        <div className="relative flex flex-col items-center gap-3">
          <Zap
            size={22}
            className="text-yellow-400 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]"
            fill="currentColor"
          />
          <div className="flex flex-col items-center gap-1">
            <span
              className="text-white text-[11px] tracking-[0.2em] font-black [writing-mode:vertical-lr] [text-orientation:mixed] uppercase"
              style={{ fontFamily: "'Metal Mania', cursive" }}
            >
              AVENGERS
            </span>
            <span
              className="text-yellow-400 text-[10px] tracking-[0.2em] font-bold [writing-mode:vertical-lr] [text-orientation:mixed] uppercase"
              style={{ fontFamily: "'Metal Mania', cursive" }}
            >
              OFFER
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
