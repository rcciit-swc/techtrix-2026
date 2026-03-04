'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface PaymentLoadingOverlayProps {
  phase: 'creating-order' | 'verifying-payment';
}

export function PaymentLoadingOverlay({ phase }: PaymentLoadingOverlayProps) {
  const isCreating = phase === 'creating-order';

  return (
    <motion.div
      key="payment-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl"
    >
      {/* Animated icon */}
      <div className="relative mb-6">
        {isCreating ? (
          // Shield / scroll icon for "Tax Department"
          <motion.div
            className="text-5xl"
            animate={{
              rotateY: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotateY: { duration: 2, repeat: Infinity, ease: 'linear' },
              scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            📜
          </motion.div>
        ) : (
          // Coin stack for "Counting Monies"
          <motion.div
            className="text-5xl"
            animate={{
              y: [0, -8, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            🪙
          </motion.div>
        )}

        {/* Orbiting sparkles */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-yellow-400"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [
                Math.cos((i * 2 * Math.PI) / 3) * 30,
                Math.cos((i * 2 * Math.PI) / 3 + Math.PI) * 30,
                Math.cos((i * 2 * Math.PI) / 3) * 30,
              ],
              y: [
                Math.sin((i * 2 * Math.PI) / 3) * 30,
                Math.sin((i * 2 * Math.PI) / 3 + Math.PI) * 30,
                Math.sin((i * 2 * Math.PI) / 3) * 30,
              ],
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Main text */}
      <motion.h3
        className="text-white text-xl md:text-2xl text-center tracking-wider mb-3"
        style={{ fontFamily: "'Metal Mania'" }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {isCreating
          ? 'Talking to the Tax Department...'
          : 'Counting your Monies...'}
      </motion.h3>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-yellow-400/80"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Warning */}
      <motion.div
        className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5"
        animate={{
          borderColor: [
            'rgba(239,68,68,0.3)',
            'rgba(239,68,68,0.6)',
            'rgba(239,68,68,0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span className="text-base">⚠️</span>
        <span
          className="text-red-300 text-xs md:text-sm tracking-wide"
          style={{ fontFamily: "'Metal Mania'" }}
        >
          Don&apos;t close this window
        </span>
      </motion.div>
    </motion.div>
  );
}
