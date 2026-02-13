'use client';

import { Cpu, Hexagon, Shield, Star, Target, Zap } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

export default function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Determine priority loading for the first few items
  const isPriority = index < 4;

  // Pseudo-randomly assign a hero symbol based on name length or index
  const getHeroSymbol = () => {
    const symbols = [
      <Target
        key="t"
        className="h-5 w-5 text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]"
      />,
      <Shield
        key="s"
        className="h-5 w-5 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]"
      />,
      <Star
        key="st"
        className="h-5 w-5 text-yellow-400 drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]"
      />,
      <Zap
        key="z"
        className="h-5 w-5 text-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]"
      />,
      <Cpu
        key="c"
        className="h-5 w-5 text-purple-400 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]"
      />,
      <Hexagon
        key="h"
        className="h-5 w-5 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]"
      />,
    ];
    return symbols[index % symbols.length];
  };

  return (
    <div
      className="group relative h-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ willChange: 'transform' }}
    >
      {/* Sci-Fi / Superhero Card Container */}
      <div
        className={`relative h-full overflow-hidden bg-gray-900/90 transition-all duration-300 border-2 ${
          isHovered
            ? 'border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.4)] translate-y-[-5px]'
            : 'border-blue-900/50'
        }`}
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%)', // Angled "Tech" Corner
        }}
      >
        {/* Background Tech Circuit Pattern (CSS Radial Gradient) */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.1) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Top Accent Bar (Iron Man Red/Gold) */}
        <div
          className={`absolute top-0 left-0 w-full h-1 transition-all duration-300 ${isHovered ? 'bg-gradient-to-r from-red-600 via-yellow-400 to-red-600' : 'bg-blue-900/50'}`}
        />

        {/* Hero Symbol - Top Left */}
        <div className="absolute top-4 left-4 z-20 transition-transform duration-300 group-hover:rotate-180 group-hover:scale-110">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black/40 border border-white/10 backdrop-blur-sm shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            {getHeroSymbol()}
          </div>
        </div>
        {/* Content */}
        <div className="relative p-4 flex flex-col items-center h-full">
          {/* Image Container with Hexagon Mask option or glowing border */}
          <div className="relative mb-3 aspect-square w-full max-w-[240px] overflow-hidden rounded-lg border border-blue-500/30 bg-black/60 transition-all duration-300 group-hover:border-yellow-400/80 shadow-lg">
            {/* Holographic Overlay on Hover */}
            <div
              className={`absolute inset-0 z-10 transition-opacity duration-300 ${isHovered ? 'opacity-10 bg-yellow-400 mix-blend-overlay' : 'opacity-0'}`}
            />

            <Image
              src={member.image}
              alt={member.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={isPriority}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Tech Decoration Lines */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-lg" />

            {/* Simple Scanline on Hover (CSS only) */}
            <div
              className={`absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-[10%] w-full transition-transform duration-[2s] ease-linear ${
                isHovered ? 'translate-y-[1000%]' : '-translate-y-full'
              }`}
            />
          </div>

          {/* Member Name */}
          <h3
            className="mb-1 text-center text-lg md:text-2xl font-bold uppercase text-white transition-colors duration-300 group-hover:text-yellow-400"
            style={{
              fontFamily: 'Metal Mania',
              letterSpacing: '0.05em',
              textShadow: isHovered
                ? '0 0 15px rgba(234, 179, 8, 0.5)'
                : '0 1px 3px rgba(0,0,0,0.8)',
            }}
          >
            {member.name}
          </h3>

          {/* Role Badge - Tech Style */}
          <div className="mt-auto">
            <div className="relative px-4 py-1">
              {/* Bracket decoration */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-cyan-500/50" />
              <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-cyan-500/50" />

              <p
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-cyan-300"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                {member.role}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
