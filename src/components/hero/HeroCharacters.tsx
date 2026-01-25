'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { imageReveal, floating } from './hero-animations';

export function HeroCharacters() {
  // We use a wrapper to trigger the staggered animation for "imageReveal" variants
  return (
    <>
      {/* Left Characters */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={imageReveal}
        className="absolute top-25 left-0 w-150 h-200 z-10"
      >
        <motion.div
          {...floating}
          className="absolute left-30 top-5 w-105 h-105 rounded-xl overflow-hidden"
        >
          <Image src="/hero/hero1.png" alt="" fill />
        </motion.div>
        <motion.div
          {...floating}
          className="absolute left-87.5 top-0 w-105 h-105 rounded-xl overflow-hidden opacity-40"
        >
          <Image src="/hero/hero2.png" alt="" fill />
        </motion.div>
        <motion.div
          {...floating}
          className="absolute left-45 top-75 w-105 h-105 rounded-xl overflow-hidden opacity-60"
        >
          <Image src="/hero/hero4.png" alt="" fill />
        </motion.div>
      </motion.div>

      {/* Right Characters */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={imageReveal}
        transition={{ delay: 0.3 }}
        className="absolute top-25 right-0 w-150] h-200 z-10"
      >
        <motion.div
          {...floating}
          className="absolute -right-15 top-0 w-105 h-105 rounded-xl overflow-hidden opacity-70"
        >
          <Image src="/hero/hero3.png" alt="" fill />
        </motion.div>
        <motion.div
          {...floating}
          className="absolute -right-25 top-75 w-105 h-105 rounded-xl overflow-hidden opacity-70"
        >
          <Image src="/hero/hero5.png" alt="" fill />
        </motion.div>
      </motion.div>
    </>
  );
}
