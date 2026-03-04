'use client';

import { motion } from 'framer-motion';

export default function GenericLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 scale-110">
      <div className="relative w-20 h-20">
        {/* Outer spin circle with gradient-like border */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-yellow-500/20 border-t-yellow-500 border-r-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Middle anti-clockwise spin */}
        <motion.div
          className="absolute inset-2 rounded-full border border-red-500/30 border-b-red-500 border-l-red-500"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Pulsing center glow */}
        <motion.div
          className="absolute inset-7 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.6)]"
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Orbital particle */}
        <motion.div
          className="absolute inset-[-4px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_white]" />
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-yellow-500 font-['Metal_Mania'] text-2xl tracking-[0.5em] uppercase [text-shadow:0_0_15px_rgba(234,179,8,0.5)]">
          Analyzing
        </span>
        <div className="h-[2px] w-28 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent mt-2" />
        <span className="text-gray-500 text-[10px] tracking-[0.3em] font-bold uppercase mt-2">
          Preparing Arena
        </span>
      </div>
    </div>
  );
}
