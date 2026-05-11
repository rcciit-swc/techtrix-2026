'use client';

import { motion } from 'framer-motion';
import { Zap, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  isOfferEvent,
  getOtherOfferEventName,
  getOtherOfferEventPath,
  OFFER_TOTAL,
  OFFER_NAME,
} from '@/lib/constants/avengersOffer';
import { useEvents } from '@/lib/stores';

interface AvengersOfferBannerProps {
  eventId: string;
  isEligibleForSWCFree: boolean;
}

export function AvengersOfferBanner({
  eventId,
  isEligibleForSWCFree,
}: AvengersOfferBannerProps) {
  const eventsData = useEvents((state) => state.eventsData);
  const [offerStatus, setOfferStatus] = useState<{
    otherRegistered: boolean;
    paidFullPrice: boolean;
  } | null>(null);

  // Check offer status on mount
  useEffect(() => {
    if (!isOfferEvent(eventId)) return;

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `/api/payments/check-offer-status?eventId=${eventId}`
        );
        if (res.ok) {
          const data = await res.json();
          setOfferStatus(data);
        }
      } catch (err) {
        console.error(
          '[AvengersOfferBanner] Error checking offer status:',
          err
        );
      }
    };

    checkStatus();
  }, [eventId]);

  // Don't render if not an offer event or SWC-free eligible
  if (!isOfferEvent(eventId) || isEligibleForSWCFree) return null;

  const otherEventName = getOtherOfferEventName(eventId);
  const otherEventPath = getOtherOfferEventPath(eventId);

  // Check current event registration from store
  const currentEvent = eventsData.find(
    (e) => e.id === eventId || e.event_id === eventId
  );
  const isCurrentRegistered = currentEvent?.registered ?? false;

  // Both registered — assembled state
  if (isCurrentRegistered && offerStatus?.otherRegistered) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-green-500/30 bg-green-500/5 p-4 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p
              className="text-green-400 text-sm font-medium tracking-wide"
              style={{ fontFamily: "'Metal Mania', cursive" }}
            >
              Avengers Assembled!
            </p>
            <p
              className="text-white/50 text-xs mt-0.5"
              style={{ fontFamily: "'Maname', serif" }}
            >
              You're registered for both flagship events.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Other event paid full price — this event is FREE
  if (offerStatus?.otherRegistered && offerStatus.paidFullPrice) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-green-500/5 p-4 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-emerald-400" fill="currentColor" />
          </div>
          <div className="flex-1">
            <p
              className="text-emerald-400 text-sm font-medium tracking-wide"
              style={{ fontFamily: "'Metal Mania', cursive" }}
            >
              This event is FREE for you!
            </p>
            <p
              className="text-white/50 text-xs mt-0.5"
              style={{ fontFamily: "'Maname', serif" }}
            >
              You already paid ₹50 for {otherEventName}. Register this one at no
              cost.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Neither registered — promo banner
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-red-500/20 bg-gradient-to-r from-red-500/5 via-yellow-500/5 to-red-500/5 p-4 backdrop-blur-sm"
    >
      <div className="flex items-start sm:items-center gap-3 flex-col sm:flex-row">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-yellow-400" fill="currentColor" />
          </div>
          <div>
            <p
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400 text-sm font-medium tracking-wide"
              style={{ fontFamily: "'Metal Mania', cursive" }}
            >
              {OFFER_NAME}
            </p>
            <p
              className="text-white/50 text-xs mt-0.5"
              style={{ fontFamily: "'Maname', serif" }}
            >
              Register for both events at just{' '}
              <span className="text-yellow-400 font-medium">
                ₹{OFFER_TOTAL}
              </span>{' '}
              <span className="text-white/30 line-through">₹100</span>
            </p>
          </div>
        </div>
        <Link
          href={otherEventPath}
          className="flex items-center gap-1.5 text-xs text-yellow-400/80 hover:text-yellow-400 transition-colors group shrink-0 ml-11 sm:ml-0"
        >
          <span style={{ fontFamily: "'Maname', serif" }}>
            View {otherEventName}
          </span>
          <ArrowRight
            size={12}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </motion.div>
  );
}
