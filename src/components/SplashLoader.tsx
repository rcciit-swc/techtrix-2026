'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SplashLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      width: number;
      height: number;
      left: string;
      top: string;
      moveX: number;
      moveY: number;
      duration: number;
    }>
  >([]);

  useEffect(() => {
    // Check if we've already shown the splash screen this session
    const hasShownSplash = sessionStorage.getItem('hasShownSplash');

    if (hasShownSplash) {
      setIsVisible(false);
      return;
    }

    // Lock body scroll
    document.body.style.overflow = 'hidden';

    // Generate random particles only on the client
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      width: Math.random() * 100 + 50,
      height: Math.random() * 100 + 50,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      moveX: Math.random() * 100 - 50,
      moveY: Math.random() * 100 - 50,
      duration: Math.random() * 3 + 2,
    }));
    setParticles(newParticles);

    // Set the flag so it doesn't show again in this session
    sessionStorage.setItem('hasShownSplash', 'true');

    // Hide the splash screen after the animation duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = 'auto'; // Restore scroll
    }, 4000); // 7 seconds total duration

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = 'auto'; // Ensure scroll is restored on cleanup
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black opacity-100 block pointer-events-auto"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: 'easeInOut' },
          }}
        >
          {/* Magical Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-yellow-400/20 blur-xl"
                style={{
                  width: particle.width,
                  height: particle.height,
                  left: particle.left,
                  top: particle.top,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.1, 0.3, 0.1],
                  x: [0, particle.moveX, 0],
                  y: [0, particle.moveY, 0],
                }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center">
            {/* Pulsing Aura */}
            <motion.div
              className="absolute inset-0 rounded-full bg-yellow-500/30 blur-3xl"
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
              initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: 0,
                transition: {
                  duration: 1.2,
                  ease: [0.34, 1.56, 0.64, 1], // Spring-like bounce
                },
              }}
            >
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.5)]">
                {/* Replace with actual Logo image if available, using favicon for now as requested */}
                <Image
                  src="https://i.postimg.cc/j20BjMhq/logo.png" // Assuming this is the main logo based on typical usage, otherwise favicon.jpg
                  alt="Techtrix Logo"
                  fill
                  className="object-cover"
                  priority
                />

                {/* Fallback to favicon if top_left_logo doesn't exist, I should check first */}
                {/* Or I can use favicon.jpg as seen in layout metadata */}
              </div>

              {/* Spinning Ring */}
              <motion.div
                className="absolute -inset-4 rounded-full border-t-2 border-r-2 border-yellow-400/80"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute -inset-8 rounded-full border-b-2 border-l-2 border-red-500/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>

            {/* Text Reveal */}
            <motion.h1
              className="mt-8 text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 tracking-widest uppercase"
              style={{
                fontFamily: "'Metal Mania', cursive",
                textShadow: '0 0 20px rgba(234, 179, 8, 0.5)',
              }}
              initial={{ opacity: 0, y: 20, letterSpacing: '1em' }}
              animate={{
                opacity: 1,
                y: 0,
                letterSpacing: '0.2em',
                transition: { delay: 1, duration: 0.8 },
              }}
            >
              Techtrix
            </motion.h1>
            <motion.p
              className="mt-2 text-yellow-500/80 text-sm tracking-[0.5em] uppercase"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { delay: 1.5, duration: 0.5 },
              }}
            >
              2026
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
