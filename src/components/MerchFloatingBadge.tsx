'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function MerchFloatingBadge() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  // Don't show on the merchandise page itself
  if (pathname === '/merchandise' || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ delay: 1.2, duration: 0.4, ease: 'easeOut' }}
        className="fixed bottom-28 right-4 z-50 flex items-center gap-2"
      >
        <Link href="/merchandise">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            animate={{
              boxShadow: [
                '0 0 10px rgba(250,204,21,0.3)',
                '0 0 22px rgba(250,204,21,0.65)',
                '0 0 10px rgba(250,204,21,0.3)',
              ],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center gap-2 px-3.5 py-2 bg-yellow-400 text-black rounded-full cursor-pointer select-none"
          >
            <span className="text-base leading-none">🛒</span>
            <div className="flex flex-col leading-tight">
              <span className="font-orbitron font-bold text-[10px] uppercase tracking-wider whitespace-nowrap">
                Merch Available
              </span>
              <span className="font-rajdhani font-semibold text-[10px] tracking-wide">
                ₹299 <span className="line-through opacity-60">₹399</span>
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Dismiss button */}
        <button
          onClick={() => setDismissed(true)}
          className="w-5 h-5 rounded-full bg-white/10 border border-white/20 text-white/50 hover:text-white hover:bg-white/20 text-[10px] flex items-center justify-center transition-colors"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
