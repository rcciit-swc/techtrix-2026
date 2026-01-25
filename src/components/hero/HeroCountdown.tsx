'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cinematicEase } from './hero-animations';

const CountdownTimer = ({ timeLeft }: any) => {
  const formatNumber = (num: number) => String(num).padStart(2, '0');

  const FlipCard = ({ digit }: { digit: string }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: cinematicEase }}
      className="w-11.25 h-15 bg-linear-to-b from-[#2a1f4e] to-[#1a0f3e] rounded-lg flex items-center justify-center shadow-lg"
    >
      <span className="text-4xl font-bold text-white">{digit}</span>
    </motion.div>
  );

  const Unit = ({ value, label }: any) => (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        <FlipCard digit={formatNumber(value)[0]} />
        <FlipCard digit={formatNumber(value)[1]} />
      </div>
      <span className="text-[10px] text-white/80 tracking-widest">{label}</span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 120, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 2, ease: cinematicEase }}
      className="hidden lg:flex absolute top-5 right-10 bg-linear-to-br from-[#7c3aed] via-[#a855f7] to-[#ec4899] rounded-2xl p-5 gap-4 z-20 shadow-2xl"
    >
      <Unit value={timeLeft.days} label="DAYS" />
      <Unit value={timeLeft.hours} label="HOURS" />
      <Unit value={timeLeft.minutes} label="MINUTES" />
    </motion.div>
  );
};

export function HeroCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 12,
    minutes: 30,
  });

  useEffect(() => {
    const target = new Date();
    target.setHours(target.getHours() + 12);
    target.setMinutes(target.getMinutes() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = target.getTime() - now;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <CountdownTimer timeLeft={timeLeft} />;
}
