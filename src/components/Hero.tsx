'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const cinematicEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Background fade + slow settle
const bgReveal = {
  hidden: {
    opacity: 0,
    scale: 1.12,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 2.8,
      ease: cinematicEase,
    },
  },
};

// Hero images (characters)
const imageReveal = {
  hidden: {
    opacity: 0,
    y: 120,
    scale: 0.82,
    rotateX: 22,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 2.2,
      ease: cinematicEase,
    },
  },
};

// Floating effect (after entry)
const floating = {
  animate: {
    y: [0, -12, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

// TECHTRIX title reveal
const titleReveal = {
  hidden: {
    opacity: 0,
    scale: 0.55,
    rotateZ: -14,
    y: 80,
    filter: 'blur(18px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotateZ: 0,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 2.4,
      ease: cinematicEase,
    },
  },
};

// Text fade (tagline, description)
const textReveal = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.96,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.6,
      ease: cinematicEase,
    },
  },
};

// Buttons reveal
const buttonReveal = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1.4,
      ease: cinematicEase,
    },
  },
};

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

export default function Hero() {
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

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      className="relative w-full min-h-screen bg-[#050816] overflow-hidden"
    >
      {/* Background */}
      <motion.div variants={bgReveal} className="absolute inset-0 opacity-40">
        <Image
          src="/hero/hero7.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Countdown */}
      <CountdownTimer timeLeft={timeLeft} />

      {/* Left Characters */}
      <motion.div
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

      {/* Center Content */}
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
          variants={titleReveal}
          className="text-[120px] lg:text-[240px] font-medium text-white leading-none"
          style={{ fontFamily: 'Golden Sentry' }}
        >
          TECHTRIX
        </motion.h1>

        <motion.p
          variants={textReveal}
          transition={{ delay: 0.4 }}
          className="text-[#d4a847] text-2xl italic mt-4"
        >
          Assemble. Innovate. Conquer.
        </motion.p>

        <motion.p
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
            <Image
              src="/hero/registerr.svg"
              alt="icon"
              width={20}
              height={20}
            />
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
    </motion.section>
  );
}
