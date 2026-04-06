'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { cinematicEase } from './hero-animations';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  timeLeft: TimeLeft;
  isMobile?: boolean;
}

const CountdownTimer = ({
  timeLeft,
  isMobile = false,
}: CountdownTimerProps) => {
  const formatNumber = (num: number) => String(num).padStart(2, '0');

  const FlipCard = ({ digit }: { digit: string }) => (
    <motion.div
      key={digit}
      initial={{ rotateX: -90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: cinematicEase }}
      className={`
        ${isMobile ? 'w-8 h-10' : 'w-6 h-10'}
        bg-gradient-to-b from-[#0a0a0a] via-[#0f1f16] to-[#050505]
        rounded-xl flex items-center justify-center
        border border-[#00ff41]/30
        shadow-[0_0_20px_rgba(0,255,65,0.25)]
        relative overflow-hidden
      `}
    >
      {/* Doom Energy Pulse */}
      <motion.div
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-t from-[#00ff41]/10 to-transparent"
      />

      <span
        className={`${isMobile ? 'text-base' : 'text-xl'} font-bold text-[#00ff41] z-10`}
        style={{
          fontFamily: 'Metal Mania',
          textShadow: '0 0 12px rgba(2, 6, 3, 0.8)',
        }}
      >
        {digit}
      </span>
    </motion.div>
  );

  const Unit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        <FlipCard digit={formatNumber(value)[0]} />
        <FlipCard digit={formatNumber(value)[1]} />
      </div>
      <span
        className={`
          ${isMobile ? 'text-[10px]' : 'text-xs'}
          tracking-[0.25em] uppercase text-[#00ff41]/70 font-bold
        `}
        style={{ fontFamily: 'Metal Mania' }}
      >
        {label}
      </span>
    </div>
  );

  const Separator = () => (
    <div
      className={`${isMobile ? 'text-2xl' : 'text-3xl'} text-[#00ff41] font-bold pb-4`}
      style={{ textShadow: '0 0 10px rgba(0,255,65,0.7)' }}
    >
      :
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* DOOM WARNING */}
      <motion.div
        animate={{
          textShadow: [
            '0 0 10px rgba(0,255,65,0.5)',
            '0 0 25px rgba(0,255,65,1)',
            '0 0 10px rgba(0,255,65,0.5)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`${isMobile ? 'text-lg' : 'text-xl'} tracking-[0.3em] uppercase text-[#00ff41] font-bold`}
        style={{ fontFamily: 'Metal Mania' }}
      >
        DOOMSDAY IS COMING
      </motion.div>

      {/* METAL PANEL */}
      <div
        className={`
          relative w-full
          bg-black/70 backdrop-blur-xl
          border border-[#00ff41]/40
          rounded-2xl
          ${isMobile ? 'px-4 py-4' : 'px-6 py-3'}
          shadow-[0_0_50px_rgba(0,255,65,0.2)]
          overflow-hidden
        `}
      >
        {/* Reactor Glow Background */}
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-[#00ff41]/10 via-transparent to-[#00ff41]/5"
        />

        <div
          className={`
            relative z-10 flex justify-center
            ${isMobile ? 'gap-2' : 'gap-4'}
            flex-wrap
          `}
        >
          <Unit value={timeLeft.days} label="Days" />
          <Separator />
          <Unit value={timeLeft.hours} label="Hours" />
          <Separator />
          <Unit value={timeLeft.minutes} label="Mins" />
          <Separator />
          <Unit value={timeLeft.seconds} label="Secs" />
        </div>
      </div>
    </div>
  );
};

export function HeroCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-05-14T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Desktop – Top Right */}
      <div className="hidden md:block absolute top-6 right-6 lg:right-12 z-40 w-fit">
        <CountdownTimer timeLeft={timeLeft} />
      </div>

      {/* Mobile – Normal Flow (Below Register Button) */}
      <div className="md:hidden relative mt-8 w-full px-4">
        <CountdownTimer timeLeft={timeLeft} isMobile />
      </div>
    </>
  );
}
