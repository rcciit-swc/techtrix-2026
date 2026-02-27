'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function EventLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <div className="relative flex flex-col items-center">
        {/* Pulsing Aura */}
        <motion.div
          className="absolute inset-0 rounded-full bg-yellow-500/20 blur-3xl will-change-transform"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Logo Container */}
        <motion.div
          className="relative w-40 h-40 md:w-56 md:h-56"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.3)] bg-black/50 backdrop-blur-sm">
            <div className="absolute inset-4">
              <Image
                src="https://i.postimg.cc/j20BjMhq/logo.png"
                alt="Techtrix Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Spinning Rings */}
          <motion.div
            className="absolute -inset-2 rounded-full border-t-2 border-r-2 border-yellow-400/80 will-change-transform"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -inset-4 rounded-full border-b-2 border-l-2 border-cyan-500/60 will-change-transform"
            animate={{ rotate: -360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          className="mt-8 text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 tracking-wider uppercase"
          style={{
            fontFamily: "'Metal Mania', cursive",
            textShadow: '0 0 10px rgba(234, 179, 8, 0.5)',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Loading Legacy...
        </motion.h2>
      </div>
    </div>
  );
}
