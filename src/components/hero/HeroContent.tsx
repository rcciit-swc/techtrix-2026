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
        className="text-2xl mt-8 tracking-[0.3em] uppercase font-bold px-4"
        style={{
          fontFamily: '"Metal Mania"',
          background:
            'linear-gradient(to right, #FFF 20%, #EDF526 50%, #d4a847 80%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0px 0px 15px rgba(237, 245, 38, 0.4))',
        }}
      >
        Survive the Fall. Engineer the Future.
      </motion.p>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={textReveal}
        transition={{ delay: 0.6 }}
        className="max-w-2xl mt-6 px-4"
        style={{
          fontFamily: 'Maname',
          fontSize: '20px',
          color: '#F9FAFB',
          opacity: 0.8,
          fontWeight: 400,
          lineHeight: '1.6',
          letterSpacing: '0.05em',
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
        className="flex flex-wrap justify-center gap-6 mt-12"
      >
        <Link
          href="#register"
          className="group relative flex items-center gap-[12px] px-[32px] py-[18px] rounded-[24px] bg-[#EDF526] shadow-[0_10px_30px_-10px_rgba(237,245,38,0.5)] hover:scale-105 transition-all duration-300 overflow-hidden"
          style={{
            color: '#050816',
            fontFamily: '"Metal Mania"',
            fontSize: '22px',
            fontWeight: 400,
            letterSpacing: '1px',
          }}
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10 flex items-center gap-3">
            Register Now
            <Image
              src="/hero/registerr.svg"
              alt="icon"
              width={22}
              height={22}
              className="group-hover:rotate-12 transition-transform"
            />
          </span>
        </Link>

        <Link
          href="#details"
          className="group flex items-center gap-3 border-2 border-white/30 px-8 py-4 rounded-[24px] hover:border-white hover:scale-105 transition-all duration-300"
          style={{
            color: '#FFF',
            fontFamily: '"Metal Mania"',
            fontSize: '22px',
            fontWeight: 400,
            letterSpacing: '1px',
          }}
        >
          More Details{' '}
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </motion.div>
    </div>
  );
}
