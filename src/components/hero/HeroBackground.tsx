'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { bgReveal } from './hero-animations';
import { HeroCountdown } from './HeroCountdown';

export function HeroBackground() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={bgReveal}
      className="absolute inset-0 opacity-40"
    >
      <Image
        src="/hero/hero7.png"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="hidden md:block">
        <HeroCountdown />
      </div>
    </motion.div>
  );
}
