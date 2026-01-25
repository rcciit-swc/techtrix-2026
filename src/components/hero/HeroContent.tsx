'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { textReveal, titleReveal, buttonReveal } from './hero-animations';

export function HeroContent() {
  return (
    <div className="relative z-30 flex flex-col items-center justify-center text-center pt-4">
      {/* RCC Institute Structure */}
      <motion.div
        variants={textReveal}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center gap-4 mb-2"
      >
        {/* hero6.png image - contains RCC INSTITUTE OF and INFORMATION TECHNOLOGY */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-59.75 h-33.5"
        >
          <Image
            src="/hero/hero6.png"
            alt="RCC Institute of Information Technology"
            fill
            className="object-contain"
            sizes="239px"
          />
        </motion.div>

        {/* 2026 text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-white font-bold"
          style={{
            fontFamily: 'Metal Mania',
            fontSize: '50px',
            textAlign: 'center',
            fontWeight: 400,
            lineHeight: 'normal',
            letterSpacing: '7px',
            color: 'var(--Text, #F9FAFB)',
          }}
        >
          2026
        </motion.h2>
      </motion.div>

      <motion.h1
        initial="hidden"
        animate="visible"
        variants={titleReveal}
        className="text-[120px] lg:text-[240px] font-medium text-white leading-none"
        style={{ fontFamily: 'Golden Sentry' }}
      >
        TECHTRIX
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={textReveal}
        transition={{ delay: 0.4 }}
        className="text-[#d4a847] text-2xl italic mt-4"
      >
        Assemble. Innovate. Conquer.
      </motion.p>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={textReveal}
        transition={{ delay: 0.6 }}
        className="max-w-xl mt-4"
        style={{
          fontFamily: 'Maname',
          fontSize: '20px',
          color: 'var(--Text, #F9FAFB)',
          fontWeight: 400,
          lineHeight: 'normal',
        }}
      >
        Join the ultimate technical fest where innovation meets heroism.
        Complete in cutting-edge challenges and become a legend.
      </motion.p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={buttonReveal}
        transition={{ delay: 0.9 }}
        className="flex gap-4 mt-10"
      >
        <Link
          href="#register"
          className="flex items-center gap-[10px] px-[20px] py-[16px] rounded-[20px] bg-[#EDF526] shadow-[0_8px_15px_0_rgba(0,0,0,0.25)] hover:scale-110 transition-all duration-300"
          style={{
            color: 'var(--Backgroud, #050816)',
            fontFamily: '"Metal Mania"',
            fontSize: '20px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal',
            letterSpacing: '1px',
          }}
        >
          Register Now
          <Image src="/hero/registerr.svg" alt="icon" width={20} height={20} />
        </Link>

        <Link
          href="#details"
          className="border border-white px-6 py-3 rounded-[20px] hover:scale-110 transition-all duration-300 flex items-center gap-2"
          style={{
            color: '#FFF',
            fontFamily: '"Metal Mania"',
            fontSize: '20px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: 'normal',
            letterSpacing: '1px',
          }}
        >
          More Details <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
}
