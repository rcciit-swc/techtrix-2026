'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { bgReveal } from './hero-animations';

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
    </motion.div>
  );
}
