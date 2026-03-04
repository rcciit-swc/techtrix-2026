'use client';

import { login } from '@/lib/services/auth';
import { useUser } from '@/lib/stores';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { buttonReveal, textReveal, titleReveal } from './hero-animations';
import { HeroCountdown } from './HeroCountdown';

export function HeroContent() {
  const { userData } = useUser();
  return (
    <div className="relative z-30 flex flex-col items-center justify-center text-center">
      {/* RCC Institute Structure */}
      <motion.div
        variants={textReveal}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center gap-3 md:gap-4 mb-2 md:mb-3"
      >
        {/* hero6.png image - contains RCC INSTITUTE OF and INFORMATION TECHNOLOGY */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-40 h-32 md:w-48 md:h-28 lg:w-52 lg:h-30"
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
          className="text-white font-bold mb-2 text-[28px] md:text-[40px] lg:text-[45px]"
          style={{
            fontFamily: 'Metal Mania',
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
        className="text-[100px] sm:text-[90px] md:text-[110px] lg:text-[180px] xl:text-[160px] font-medium text-white leading-none"
        style={{ fontFamily: 'Golden Sentry' }}
      >
        TECHTRIX
      </motion.h1>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={textReveal}
        transition={{ delay: 0.4 }}
        className="text-base md:text-xl lg:text-2xl mt-4 md:mt-0 tracking-[0.3em] uppercase font-bold px-4"
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

      {/* Fest Dates */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={textReveal}
        transition={{ delay: 0.5 }}
        className="mt-5 md:mt-6 px-8 py-2 md:py-3 rounded-[20px] border border-[#EDF526]/30 bg-black/40 backdrop-blur-md shadow-[0_0_20px_rgba(237,245,38,0.2)]"
      >
        <p
          className="text-xl md:text-2xl lg:text-3xl font-bold tracking-[0.15em] text-[#EDF526] text-center"
          style={{
            fontFamily: '"Metal Mania"',
            textShadow: '0 0 12px rgba(237, 245, 38, 0.6)',
          }}
        >
          26th - 29th March 2026
        </p>
      </motion.div>

      <motion.p
        initial="hidden"
        animate="visible"
        variants={textReveal}
        transition={{ delay: 0.6 }}
        className="max-w-2xl mt-4 md:mt-2 px-4 text-sm md:text-base lg:text-lg"
        style={{
          fontFamily: 'Maname',
          color: '#F9FAFB',
          opacity: 0.8,
          fontWeight: 400,
          lineHeight: '1.6',
          letterSpacing: '0.05em',
        }}
      >
        RCCIIT&apos;s Annual Inter-College National Level Techno-Management Fest
      </motion.p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={buttonReveal}
        transition={{ delay: 0.9 }}
        className="flex flex-wrap justify-center gap-4 md:gap-4 mt-6 md:mt-4"
      >
        {userData ? (
          <a
            href="#events"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById('events')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 rounded-[24px] bg-[#EDF526] shadow-[0_10px_30px_-10px_rgba(237,245,38,0.5)] hover:scale-105 transition-all duration-300 overflow-hidden text-base md:text-lg lg:text-xl"
            style={{
              color: '#050816',
              fontFamily: '"Metal Mania"',
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
          </a>
        ) : (
          <button
            onClick={() => login()}
            className="group relative flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 rounded-[24px] bg-[#EDF526] shadow-[0_10px_30px_-10px_rgba(237,245,38,0.5)] hover:scale-105 transition-all duration-300 overflow-hidden text-base md:text-lg lg:text-xl cursor-pointer"
            style={{
              color: '#050816',
              fontFamily: '"Metal Mania"',
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
          </button>
        )}

        <Link
          href="#about"
          className="group flex items-center gap-2 md:gap-3 border-2 border-white/30 px-6 py-3 md:px-8 md:py-4 rounded-[24px] hover:border-white hover:scale-105 transition-all duration-300 text-base md:text-lg lg:text-xl"
          style={{
            color: '#FFF',
            fontFamily: '"Metal Mania"',
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
      <div className=" md:hidden block flex-col items-center justify-center">
        <HeroCountdown />
      </div>
    </div>
  );
}
