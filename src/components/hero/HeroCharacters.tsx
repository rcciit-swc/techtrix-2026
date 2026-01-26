'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import {
  imageReveal,
  floating,
  floatingSubtle,
  floatingStrong,
} from './hero-animations';

export function HeroCharacters() {
  return (
    <>
      {/* Left Characters */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={imageReveal}
        className="absolute top-25 left-0 w-150 h-200 z-10 pointer-events-none"
      >
        <motion.div
          {...floating}
          whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          className="absolute left-30 top-5 w-105 h-105 rounded-xl overflow-hidden shadow-2xl shadow-blue-500/10 pointer-events-auto"
        >
          <Image src="/hero/hero1.png" alt="" fill className="object-contain" />
        </motion.div>
        <motion.div
          {...floatingSubtle}
          whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          className="absolute left-87.5 top-0 w-105 h-105 rounded-xl overflow-hidden opacity-40 grayscale-[0.5] pointer-events-auto"
        >
          <Image src="/hero/hero2.png" alt="" fill className="object-contain" />
        </motion.div>
        <motion.div
          {...floatingStrong}
          whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          className="absolute left-45 top-75 w-105 h-105 rounded-xl overflow-hidden opacity-60 pointer-events-auto"
        >
          <Image src="/hero/hero4.png" alt="" fill className="object-contain" />
        </motion.div>
      </motion.div>

      {/* Right Characters - Symmetrical to Left */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={imageReveal}
        transition={{ delay: 0.3 }}
        className="absolute top-25 right-0 w-150 h-200 z-10 pointer-events-none"
      >
        <motion.div
          {...floating}
          whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          className="absolute right-30 top-5 w-105 h-105 rounded-xl overflow-hidden shadow-2xl shadow-purple-500/10 pointer-events-auto"
        >
          <Image src="/hero/hero3.png" alt="" fill className="object-contain" />
        </motion.div>
        {/* Symmetrical position for hero5 to match hero4's left-45 top-75 */}
        <motion.div
          {...floatingStrong}
          whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          className="absolute right-45 top-75 w-105 h-105 rounded-xl overflow-hidden opacity-70 pointer-events-auto"
        >
          <Image src="/hero/hero5.png" alt="" fill className="object-contain" />
        </motion.div>
        {/* Adding a placeholder mirror for hero2 if needed, but keeping it to 2 images as requested */}
      </motion.div>
    </>
  );
}
