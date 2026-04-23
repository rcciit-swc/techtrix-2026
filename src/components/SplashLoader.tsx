'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface SplashLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export default function SplashLoader({
  isLoading,
  onComplete,
}: SplashLoaderProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <>
      {/* CSS-based spinning rings — no Framer Motion infinite loops */}
      <style>{`
        @keyframes spin-cw  { to { transform: rotate(360deg);  } }
        @keyframes spin-ccw { to { transform: rotate(-360deg); } }
        .ring-cw  { animation: spin-cw  2s linear infinite; }
        .ring-ccw { animation: spin-ccw 3s linear infinite; }
        @keyframes splash-fade-in { from { opacity:0; transform:scale(0.85); } to { opacity:1; transform:scale(1); } }
        .splash-logo { animation: splash-fade-in 0.6s ease-out forwards; }
        @keyframes splash-text-in { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .splash-title { animation: splash-text-in 0.5s ease-out 0.5s both; }
        .splash-sub   { animation: splash-text-in 0.4s ease-out 0.8s both; }
      `}</style>

      <AnimatePresence onExitComplete={() => onComplete?.()}>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.35, ease: 'easeInOut' },
            }}
          >
            {/* Desktop-only ambient particles — none on mobile */}
            {!isMobile && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[
                  { w: 140, h: 140, left: '10%', top: '20%' },
                  { w: 100, h: 100, left: '75%', top: '15%' },
                  { w: 120, h: 120, left: '60%', top: '65%' },
                  { w: 90, h: 90, left: '20%', top: '70%' },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="absolute rounded-full bg-yellow-400/10 blur-2xl"
                    style={{
                      width: p.w,
                      height: p.h,
                      left: p.left,
                      top: p.top,
                    }}
                  />
                ))}
              </div>
            )}

            <div className="relative flex flex-col items-center">
              {/* Logo */}
              <div className="splash-logo relative w-48 h-48 md:w-64 md:h-64">
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-yellow-500/50 shadow-[0_0_40px_rgba(234,179,8,0.4)]">
                  <div className="absolute inset-6 md:inset-8">
                    <Image
                      src="https://i.postimg.cc/j20BjMhq/logo.png"
                      alt="Techtrix Logo"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* CSS spinning rings — no JS animation loop */}
                <div className="ring-cw absolute -inset-3 md:-inset-4 rounded-full border-t-2 border-r-2 border-yellow-400/70" />
                <div className="ring-ccw absolute -inset-6 md:-inset-8 rounded-full border-b-2 border-l-2 border-red-500/40" />
              </div>

              {/* Text */}
              <h1
                className="splash-title mt-6 text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-100 to-yellow-300 tracking-[0.2em] uppercase"
                style={{ fontFamily: "'Metal Mania', cursive" }}
              >
                Techtrix
              </h1>
              <p className="splash-sub mt-1 text-yellow-500/70 text-xs tracking-[0.4em] uppercase">
                2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
