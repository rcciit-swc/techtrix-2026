'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import {
  floating,
  floatingStrong,
  floatingSubtle,
  imageReveal,
} from './hero-animations';

export function HeroCharacters() {
  return (
    <>
      {/* Left Characters */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={imageReveal}
        className="hidden lg:block absolute top-25 left-0 w-150 h-200 z-10 pointer-events-none"
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
        className="hidden lg:block absolute top-25 right-0 w-150 h-200 z-10 pointer-events-none"
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

      {/* Mobile Characters - Bottom decorative elements */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.8 }}
        className="block md:hidden absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
      >
        {/* Left bottom character */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            rotate: [0, 2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-0 bottom-0 w-32 h-32 opacity-30"
        >
          <Image src="/hero/hero1.png" alt="" fill className="object-contain" />
        </motion.div>

        {/* Right bottom character */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [0, -2, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute right-0 bottom-0 w-32 h-32 opacity-30"
        >
          <Image src="/hero/hero3.png" alt="" fill className="object-contain" />
        </motion.div>

        {/* Center bottom character - smaller */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute left-1/2 -translate-x-1/2 bottom-2 w-24 h-24 opacity-20"
        >
          <Image src="/hero/hero5.png" alt="" fill className="object-contain" />
        </motion.div>
      </motion.div>
    </>
  );
}
