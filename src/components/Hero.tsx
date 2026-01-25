'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Countdown Timer with flip card design matching reference
const CountdownTimer = ({
  timeLeft,
}: {
  timeLeft: { days: number; hours: number; minutes: number };
}) => {
  const formatNumber = (num: number) => String(num).padStart(2, '0');

  const FlipCard = ({ digit }: { digit: string }) => (
    <div className="w-11.25 h-[60px] bg-linear-to-b from-[#2a1f4e] to-[#1a0f3e] rounded-lg flex items-center justify-center relative overflow-hidden shadow-lg">
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/30" />
      <span className="text-4xl font-bold text-white drop-shadow-md">
        {digit}
      </span>
    </div>
  );

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        <FlipCard digit={formatNumber(value).charAt(0)} />
        <FlipCard digit={formatNumber(value).charAt(1)} />
      </div>
      <div className="text-[10px] font-semibold tracking-[0.15em] text-white/80 uppercase">
        {label}
      </div>
    </div>
  );

  return (
    <div className="hidden lg:flex absolute top-[20px] right-[40px] bg-linear-to-br from-[#7c3aed] via-[#a855f7] to-[#ec4899] rounded-2xl p-5 gap-4 z-20 shadow-2xl shadow-purple-500/30">
      <TimeUnit value={timeLeft.days} label="DAYS" />
      <TimeUnit value={timeLeft.hours} label="HOURS" />
      <TimeUnit value={timeLeft.minutes} label="MINUTES" />
    </div>
  );
};

// Mobile Countdown Timer with flip card design
const MobileCountdownTimer = ({
  timeLeft,
}: {
  timeLeft: { days: number; hours: number; minutes: number };
}) => {
  const formatNumber = (num: number) => String(num).padStart(2, '0');

  const FlipCard = ({ digit }: { digit: string }) => (
    <div className="w-[35px] h-[48px] bg-gradient-to-b from-[#2a1f4e] to-[#1a0f3e] rounded-md flex items-center justify-center relative overflow-hidden shadow-lg">
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-black/30" />
      <span className="text-2xl font-bold text-white drop-shadow-md">
        {digit}
      </span>
    </div>
  );

  return (
    <div className="lg:hidden relative z-20 flex justify-center mt-4">
      <div className="flex bg-gradient-to-br from-[#7c3aed] via-[#a855f7] to-[#ec4899] rounded-xl p-4 gap-3 shadow-2xl shadow-purple-500/30">
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1">
            <FlipCard digit={formatNumber(timeLeft.days).charAt(0)} />
            <FlipCard digit={formatNumber(timeLeft.days).charAt(1)} />
          </div>
          <div className="text-[8px] font-semibold tracking-wider text-white/80 uppercase">
            DAYS
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1">
            <FlipCard digit={formatNumber(timeLeft.hours).charAt(0)} />
            <FlipCard digit={formatNumber(timeLeft.hours).charAt(1)} />
          </div>
          <div className="text-[8px] font-semibold tracking-wider text-white/80 uppercase">
            HOURS
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1">
            <FlipCard digit={formatNumber(timeLeft.minutes).charAt(0)} />
            <FlipCard digit={formatNumber(timeLeft.minutes).charAt(1)} />
          </div>
          <div className="text-[8px] font-semibold tracking-wider text-white/80 uppercase">
            MINUTES
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 12,
    minutes: 30,
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 0);
    targetDate.setHours(targetDate.getHours() + 12);
    targetDate.setMinutes(targetDate.getMinutes() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({ days, hours, minutes });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-[#050816] overflow-hidden">
      {/* Background Image Layer - hero7.png */}
      <div className="absolute top-0 left-0 w-full h-full opacity-45 overflow-hidden pointer-events-none">
        <Image
          src="/hero/hero7.png"
          alt="Hero background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/20 via-[#1a0d0d]/10 to-black/20 pointer-events-none" />

      {/* Countdown Timer - Top Right */}
      <CountdownTimer timeLeft={timeLeft} />

      {/* RCC Logo with Text - Centered at top */}
      <div className="relative z-50 flex flex-col items-center pt-4">
        <div className="relative w-[80px] h-[80px] mb-1">
          <Image
            src="/hero/hero6.png"
            alt="RCC Institute of Information Technology"
            fill
            className="object-contain"
            sizes="80px"
          />
        </div>
        <p className="text-white/80 text-xs tracking-[0.25em] uppercase">
          <span className="text-purple-400">Info</span>rmation Technology
        </p>
        <h2
          className="text-4xl md:text-5xl text-white mt-1 tracking-[5px] font-bold"
          style={{ fontFamily: 'KungFuMaster' }}
        >
          2026
        </h2>
      </div>

      {/* Character Images - Left Side */}
      <div className="absolute top-[88px] left-0 w-[600px] h-[800px] pointer-events-none z-[5]">
        {/* hero1 - Rectangle 18 */}
        <div
          className="absolute w-[420px] h-[420px] rounded-2xl overflow-hidden shadow-2xl"
          style={{ left: '129px', top: '22px' }}
        >
          <Image src="/hero/hero1.png" alt="" fill className="object-cover" />
        </div>

        {/* hero2 - Rectangle 20 */}
        <div
          className="absolute w-[420px] h-[420px] rounded-2xl overflow-hidden shadow-2xl opacity-40"
          style={{ left: '347px', top: '0px' }}
        >
          <Image src="/hero/hero2.png" alt="" fill className="object-cover" />
        </div>

        {/* hero4 - Rectangle 21 */}
        <div
          className="absolute w-[420px] h-[420px] rounded-2xl overflow-hidden shadow-2xl opacity-55"
          style={{ left: '181px', top: '291px' }}
        >
          <Image src="/hero/hero4.png" alt="" fill className="object-cover" />
        </div>
      </div>

      {/* Character Images - Right Side */}
      <div className="absolute top-[88px] right-0 w-[600px] h-[800px] pointer-events-none z-[5]">
        {/* hero3 - Rectangle 19 */}
        <div
          className="absolute w-[420px] h-[420px] rounded-2xl overflow-hidden shadow-2xl opacity-65"
          style={{ right: '-55px', top: '2px' }}
        >
          <Image src="/hero/hero3.png" alt="" fill className="object-cover" />
        </div>

        {/* hero5 - Rectangle 17 */}
        <div
          className="absolute w-[420px] h-[420px] rounded-2xl overflow-hidden shadow-2xl opacity-65"
          style={{ right: '-103px', top: '291px' }}
        >
          <Image src="/hero/hero5.png" alt="" fill className="object-cover" />
        </div>
      </div>

      {/* Main Hero Content - Centered */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 md:px-8 pt-2 pb-12">
        <div className="max-w-5xl mx-auto text-center w-full">
          {/* Main Title - TECHTRIX - Using Golden Sentry font from Figma */}
          <h1
            className="text-6xl md:text-8xl lg:text-[240px] font-medium text-[#F9FAFB] uppercase mb-4 tracking-tight leading-none text-center"
            style={{ fontFamily: '"Golden Sentry", sans-serif' }}
          >
            TECHTRIX
          </h1>

          {/* Tagline - Italic style */}
          <p
            className="text-xl md:text-2xl lg:text-3xl text-[#d4a847] mb-6 tracking-wide italic font-medium"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Assemble. Innovate. Conquer.
          </p>

          {/* Description - Using Maname font from Figma */}
          <p
            className="text-base md:text-lg lg:text-[20px] text-[#F9FAFB] mb-8 max-w-2xl mx-auto leading-normal text-center font-normal"
            style={{ fontFamily: 'Maname, sans-serif' }}
          >
            Join the ultimate technical fest where innovation meets heroism.
            Complete in cutting-challenges, showcase your superpowers, and
            become a legend in the tech universe.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Register Now Button - Yellow with rounded style */}
            <Link
              href="#register"
              className="group relative bg-[#EEFF00] text-black px-6 py-3 rounded-full font-bold tracking-wider text-sm flex items-center gap-3 hover:bg-[#EDF526] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#EEFF00]/20"
              style={{ fontFamily: 'MetalMania' }}
            >
              Register Now
              <span className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </span>
            </Link>

            {/* More Details Button - Dark with white border */}
            <Link
              href="#details"
              className="group relative bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-bold tracking-wider text-sm flex items-center gap-3 hover:bg-white/10 transition-all duration-300 hover:scale-105"
              style={{ fontFamily: 'MetalMania' }}
            >
              More Details
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                <ArrowRight size={14} className="text-black" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Countdown Timer */}
      <MobileCountdownTimer timeLeft={timeLeft} />
    </section>
  );
};

export default Hero;
