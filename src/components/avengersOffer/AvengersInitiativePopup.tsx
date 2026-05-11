'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Zap, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import {
  STARTUP_AUTOPSY_EVENT_ID,
  OFFER_TOTAL,
  OFFER_NAME,
} from '@/lib/constants/avengersOffer';

const SESSION_KEY = 'avengers_initiative_shown';

interface AvengersInitiativePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AvengersInitiativePopup({
  isOpen,
  onClose,
}: AvengersInitiativePopupProps) {
  const router = useRouter();

  const handleAssemble = useCallback(() => {
    onClose();
    router.push(`/event/${STARTUP_AUTOPSY_EVENT_ID}`);
  }, [onClose, router]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="relative w-full max-w-md rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-yellow-500 to-red-600 rounded-2xl" />
            <div className="relative m-[2px] bg-black/95 rounded-[14px] p-6 sm:p-8">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X size={18} />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ rotate: -20, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{
                    type: 'spring',
                    delay: 0.2,
                    stiffness: 200,
                  }}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600/30 to-yellow-500/30 border border-red-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                >
                  <Zap
                    className="w-7 h-7 text-yellow-400"
                    fill="currentColor"
                  />
                </motion.div>
              </div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 tracking-wider mb-2"
                style={{ fontFamily: "'Metal Mania', cursive" }}
              >
                {OFFER_NAME}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-white/60 text-sm mb-6"
                style={{ fontFamily: "'Maname', serif" }}
              >
                Register for both{' '}
                <span className="text-yellow-400 font-medium">
                  Startup Autopsy
                </span>{' '}
                &{' '}
                <span className="text-yellow-400 font-medium">
                  Design It Hard
                </span>{' '}
                together!
              </motion.p>

              {/* Price reveal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-center"
              >
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">
                  Combo Price
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-white/30 line-through text-lg">
                    ₹100
                  </span>
                  <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                    ₹{OFFER_TOTAL}
                  </span>
                  <motion.span
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                    className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30 uppercase tracking-wider font-medium"
                  >
                    50% Off
                  </motion.span>
                </div>
              </motion.div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={handleAssemble}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 text-white font-bold text-sm tracking-wider hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                  style={{ fontFamily: "'Metal Mania', cursive" }}
                >
                  <Zap
                    size={16}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  ASSEMBLE NOW
                </motion.button>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={onClose}
                  className="text-white/30 hover:text-white/60 text-xs text-center py-2 transition-colors cursor-pointer"
                >
                  Maybe Later
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useAvengersPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const shown = sessionStorage.getItem(SESSION_KEY);
    if (!shown) {
      // Small delay to let the page render first
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem(SESSION_KEY, 'true');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}
