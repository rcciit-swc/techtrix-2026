'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { Zap, Plus, Check, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import {
  getOtherOfferEventName,
  OFFER_TOTAL,
  OFFER_PER_EVENT,
  OFFER_NAME,
} from '@/lib/constants/avengersOffer';

interface AvengersOfferCardProps {
  currentEventId: string;
  isEligibleForSWCFree: boolean;
  otherAlreadyRegistered: boolean;
  otherPaidFullPrice: boolean;
  onOfferApplied: () => void;
  onOfferRemoved: () => void;
}

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(100, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => `₹${Math.round(v)}`);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

export function AvengersOfferCard({
  currentEventId,
  isEligibleForSWCFree,
  otherAlreadyRegistered,
  otherPaidFullPrice,
  onOfferApplied,
  onOfferRemoved,
}: AvengersOfferCardProps) {
  const [offerApplied, setOfferApplied] = useState(false);
  const otherEventName = getOtherOfferEventName(currentEventId);

  // Don't render if SWC free or other event already registered
  if (isEligibleForSWCFree || otherAlreadyRegistered) return null;

  const handleApply = useCallback(() => {
    setOfferApplied(true);
    onOfferApplied();
  }, [onOfferApplied]);

  const handleRemove = useCallback(() => {
    setOfferApplied(false);
    onOfferRemoved();
  }, [onOfferRemoved]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div
        className={`relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
          offerApplied
            ? 'border-green-500/50 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
            : 'border-yellow-500/30 bg-gradient-to-br from-red-600/10 via-yellow-600/10 to-red-600/10 shadow-[0_0_30px_rgba(234,179,8,0.15)]'
        }`}
      >
        {/* Glow Effects */}
        {!offerApplied && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 blur-[50px] -mr-16 -mt-16 pointer-events-none" />
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                offerApplied
                  ? 'bg-green-500/20 rotate-[360deg]'
                  : 'bg-gradient-to-br from-red-600 to-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
              }`}
            >
              {offerApplied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Zap className="w-5 h-5 text-black" fill="currentColor" />
              )}
            </div>
            <div>
              <span
                className={`text-lg font-bold tracking-wider block uppercase ${
                  offerApplied
                    ? 'text-green-400'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500'
                }`}
                style={{ fontFamily: "'Metal Mania', cursive" }}
              >
                {offerApplied ? 'OFFER ACTIVATED!' : OFFER_NAME}
              </span>
              {!offerApplied && (
                <span className="text-[10px] text-yellow-400/60 font-bold tracking-[0.2em] uppercase">
                  Limited Time Exclusive
                </span>
              )}
            </div>
          </div>

          {!offerApplied && (
            <div className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md rotate-3 shadow-lg flex items-center gap-1">
              <Zap size={10} fill="currentColor" />
              <span>50% OFF</span>
            </div>
          )}

          {offerApplied && (
            <motion.button
              type="button"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={handleRemove}
              className="bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 transition-all p-1.5 rounded-full cursor-pointer border border-white/10"
              title="Remove offer"
            >
              <X size={16} />
            </motion.button>
          )}
        </div>

        {/* Price breakdown */}
        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <p
              className="text-white/80 text-sm leading-relaxed"
              style={{ fontFamily: "'Maname', serif" }}
            >
              {offerApplied ? (
                <>
                  Epic combo unlocked! Both events for only{' '}
                  <span className="text-green-400 font-bold text-lg">
                    ₹{OFFER_TOTAL}
                  </span>{' '}
                  <span className="text-white/30 line-through text-xs ml-1">
                    ₹100
                  </span>
                </>
              ) : (
                <>
                  Add{' '}
                  <span className="text-yellow-400 font-bold">
                    {otherEventName}
                  </span>{' '}
                  to your quest and pay just{' '}
                  <span className="text-yellow-400 font-bold text-lg">
                    ₹{OFFER_PER_EVENT}
                  </span>{' '}
                  <span className="text-white/40 text-xs">per event!</span>
                </>
              )}
            </p>
          </div>

          {!offerApplied && (
            <button
              type="button"
              onClick={handleApply}
              className="flex items-center gap-2 text-sm font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Plus size={16} strokeWidth={3} />
              <span>ADD TO COMBO</span>
            </button>
          )}
        </div>

        {/* Offer applied badge */}
        {offerApplied && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-green-500/20"
          >
            <div className="flex items-center justify-center gap-2 bg-green-500/10 py-2 rounded-lg">
              <Check className="w-3 h-3 text-green-400" />
              <p
                className="text-green-400/80 text-xs font-medium"
                style={{ fontFamily: "'Maname', serif" }}
              >
                Dual registration ready — Total: ₹{OFFER_TOTAL}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
