'use client';

import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useTeams } from '@/lib/stores/teams';
import { useState, useMemo, useEffect } from 'react';
import { Zap, Flame, Target } from 'lucide-react';
import Image from 'next/image';
import TeamLoader from '@/components/Teams/TeamLoader';
import ElectricBorder from '@/components/Teams/ElectricBorder';

export default function TeamsPage() {
  // Get teams data and actions from the store
  const { teams, teamsLoading, fetchTeams } = useTeams();

  const [selectedTab, setSelectedTab] = useState<string>('');
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  // Fetch teams on component mount
  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Set initial selected tab when teams are loaded
  useEffect(() => {
    if (teams.length > 0 && !selectedTab) {
      setSelectedTab(teams[0].id);
    }
  }, [teams, selectedTab]);

  // Show loader while teams are loading
  if (teamsLoading || teams.length === 0) {
    return <TeamLoader />;
  }

  // Memoize selected team to avoid recalculation
  const selectedTeam = useMemo(
    () => teams.find((team) => team.id === selectedTab),
    [selectedTab, teams]
  );

  // Detect mobile for performance optimizations
  const isMobile = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  }, []);

  // Function to dynamically determine font size based on name length to ensure it fits in one line
  const getNameFontSize = (name: string) => {
    const baseSize = isMobile ? 1.25 : 1.5;
    const len = name.length;
    if (len <= 12) return `${baseSize}rem`;
    const shrinkFactor = isMobile ? 0.025 : 0.035;
    const estimatedSize = baseSize - (len - 12) * shrinkFactor;
    return `${Math.max(isMobile ? 0.8 : 0.9, estimatedSize)}rem`;
  };

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1594344041337-0223bd103abe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3VwZXJtYW58ZW58MHx8MHx8fDA%3D')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: isMobile ? 'scroll' : 'fixed', // scroll on mobile for better performance
      }}
    >
      {/* Dark Overlay for Better Contrast */}
      <div className="absolute inset-0 bg-black/90 pointer-events-none" />

      {/* Intense Flickering Purple Lights - Stranger Things Style */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ willChange: 'opacity' }}
        animate={{
          opacity: isMobile
            ? [0.1, 0.2, 0.1] // Simpler animation on mobile
            : [0.15, 0.35, 0.08, 0.28, 0.15],
        }}
        transition={{
          duration: isMobile ? 3 : 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div
          className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-purple-600/60 rounded-full"
          style={{ filter: `blur(${isMobile ? '120px' : '250px'})` }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-cyan-500/50 rounded-full"
          style={{ filter: `blur(${isMobile ? '120px' : '250px'})` }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-purple-700/40 rounded-full"
          style={{ filter: `blur(${isMobile ? '150px' : '280px'})` }}
        />
      </motion.div>

      {/* VHS Static Noise Overlay - Retro 80s Effect */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Horizontal Scan Lines - VHS Effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 pt-24 md:pt-32 pb-12 md:pb-16">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            {/* Main Title with Stranger Things Neon Effect */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 relative"
              style={{
                fontFamily: 'Agency',
              }}
            >
              <span
                className="relative inline-block"
                style={{
                  color: '#d8ccff', // soft silver-purple

                  textShadow: `
  0 0 8px rgba(216, 204, 255, 1),
  0 0 16px rgba(200, 180, 255, 0.9),
  0 0 24px rgba(185, 160, 255, 0.75),
  0 0 36px rgba(170, 140, 255, 0.6),
  0 0 60px rgba(155, 120, 255, 0.45),
  0 0 90px rgba(140, 100, 255, 0.3)
`,
                }}
              >
                OUR TEAMS
                {/* Intense Glitch layers - Stranger Things Style */}
                <motion.span
                  className="absolute inset-0"
                  style={{
                    color: '#38bdf8',
                    textShadow: `
      0 0 15px rgba(56, 189, 248, 1),
      0 0 30px rgba(56, 189, 248, 0.8),
      0 0 45px rgba(56, 189, 248, 0.6)
    `,
                  }}
                  animate={{
                    opacity: [0, 0.6, 0, 0.4, 0],
                    x: [-4, 4, -3, 3, 0],
                    y: [0, -2, 2, 0, 0],
                  }}
                  transition={{
                    duration: 0.2,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  OUR TEAMS
                </motion.span>
                {/* Secondary glitch layer */}
                <motion.span
                  className="absolute inset-0"
                  style={{
                    color: '#60a5fa',
                    textShadow: `
      0 0 15px rgba(96, 165, 250, 1),
      0 0 30px rgba(96, 165, 250, 0.7)
    `,
                  }}
                  animate={{
                    opacity: [0, 0.5, 0],
                    x: [3, -3, 0],
                  }}
                  transition={{
                    duration: 0.15,
                    repeat: Infinity,
                    repeatDelay: 4,
                  }}
                >
                  OUR TEAMS
                </motion.span>
              </span>
            </motion.h1>

            {/* Decorative Line with Neon Accents */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex items-center justify-center gap-4"
            >
              <div className="h-[3px] w-20 md:w-32 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_rgba(124,58,237,0.8)]" />
              <div className="w-12 h-12 animate-pulse">
                <Image
                  src="/teams/slogo.png"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="drop-shadow-[0_0_18px_rgba(124,58,237,1)]"
                />
              </div>

              <div className="h-[3px] w-20 md:w-32 bg-gradient-to-l from-transparent via-purple-500 to-transparent shadow-[0_0_15px_rgba(124,58,237,0.8)]" />
            </motion.div>
          </motion.div>

          {/* Tab System - Horizontal Scroll with Arrows */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mb-12 relative"
          >
            <div className="max-w-7xl mx-auto relative">
              {/* Left Scroll Arrow */}
              <div className="absolute top-1/2 -left-2 md:left-0 transform -translate-y-1/2 z-20">
                <motion.button
                  onClick={() => {
                    const container = document.getElementById('tabs-container');
                    if (container) container.scrollLeft -= 300;
                  }}
                  className="p-2 rounded-full bg-black/80 border-2 border-purple-500/50 text-purple-500 hover:border-purple-500 hover:bg-black/95 shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                  whileHover={{
                    scale: 1.1,
                    boxShadow: '0 0 25px rgba(124, 58, 237, 0.6)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Right Scroll Arrow */}
              <div className="absolute top-1/2 -right-2 md:right-0 transform -translate-y-1/2 z-20">
                <motion.button
                  onClick={() => {
                    const container = document.getElementById('tabs-container');
                    if (container) container.scrollLeft += 300;
                  }}
                  className="p-2 rounded-full bg-black/80 border-2 border-purple-500/50 text-purple-500 hover:border-purple-500 hover:bg-black/95 shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                  whileHover={{
                    scale: 1.1,
                    boxShadow: '0 0 25px rgba(124, 58, 237, 0.6)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Scrollable Tabs Container */}
              <div
                id="tabs-container"
                className="overflow-x-auto scrollbar-hide pb-4 px-12 md:px-16"
                style={{
                  scrollBehavior: 'smooth',
                  msOverflowStyle: 'none',
                  scrollbarWidth: 'none',
                }}
              >
                <motion.div
                  className="flex space-x-3 min-w-max"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {teams.map((team, index) => (
                    <motion.button
                      key={team.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + index * 0.05 }}
                      onClick={() => setSelectedTab(team.id)}
                      className={`relative p-2 rounded-lg min-w-[75px] font-bold transition-all duration-300 flex flex-col items-center gap-2 ${
                        selectedTab === team.id
                          ? 'bg-black/95 border-2 border-purple-500 text-purple-500 shadow-[0_0_25px_rgba(124,58,237,0.6)]'
                          : 'bg-black/70 border-2 border-purple-500/30 text-gray-400 hover:border-purple-500/60 hover:text-purple-400'
                      }`}
                      style={{
                        fontFamily: "'Courier New', monospace",
                        letterSpacing: '0.08em',
                        textShadow:
                          selectedTab === team.id
                            ? '0 0 12px rgba(124, 58, 237, 1), 0 0 20px rgba(124, 58, 237, 0.6)'
                            : 'none',
                        justifyContent: 'center',
                      }}
                      whileHover={{ y: -3, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Icon */}
                      <motion.div
                        className="text-lg"
                        animate={
                          selectedTab === team.id
                            ? { rotate: [0, 10, -10, 0] }
                            : {}
                        }
                        transition={{
                          duration: 0.6,
                          repeat: selectedTab === team.id ? Infinity : 0,
                          repeatDelay: 2,
                        }}
                      >
                        {team.icon}
                      </motion.div>

                      {/* Category Name */}
                      <span className="text-sm font-black uppercase tracking-wider">
                        {team.category}
                      </span>

                      {/* Active Tab Indicator */}
                      {selectedTab === team.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-purple-500/15 rounded-lg pointer-events-none"
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Neon Glow on Active */}
                      {selectedTab === team.id && (
                        <>
                          <div className="absolute inset-0 bg-purple-500/25 rounded-lg blur-lg pointer-events-none" />
                          {/* Pulsing outer glow */}
                          <motion.div
                            className="absolute inset-0 bg-purple-500/20 rounded-lg blur-xl pointer-events-none"
                            animate={{
                              opacity: [0.3, 0.6, 0.3],
                              scale: [1, 1.05, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          />
                        </>
                      )}

                      {/* VHS Scan Line Effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0 hover:opacity-30 pointer-events-none rounded-lg overflow-hidden"
                        style={{
                          background:
                            'linear-gradient(180deg, transparent 0%, rgba(124, 58, 237, 0.8) 50%, transparent 100%)',
                          height: '2px',
                        }}
                        animate={{ y: [0, 50, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    </motion.button>
                  ))}
                </motion.div>
              </div>

              {/* Decorative Underline */}
              <motion.div
                className="h-[2px] mt-2 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mx-12 md:mx-16"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                style={{
                  boxShadow: '0 0 10px rgba(124, 58, 237, 0.5)',
                }}
              />
            </div>
          </motion.div>

          {/* Team Members Grid */}
          <AnimatePresence mode="wait">
            {selectedTeam && (
              <motion.div
                key={selectedTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto"
              >
                {selectedTeam.members.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: isMobile ? index * 0.05 : index * 0.1, // Faster stagger on mobile
                      duration: 0.5,
                      type: 'spring',
                      stiffness: 100,
                    }}
                    onHoverStart={() => !isMobile && setHoveredMember(index)} // Disable hover on mobile
                    onHoverEnd={() => !isMobile && setHoveredMember(null)}
                    className="group cursor-pointer h-full"
                    style={{ willChange: 'transform, opacity' }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <ElectricBorder
                      color="#8B5CF6"
                      speed={1}
                      chaos={0.5}
                      thickness={2}
                      style={{ borderRadius: 16 }}
                      className="h-full"
                    >
                      {/* Member Card - Sports Jersey Style */}
                      <div
                        className={`relative h-full bg-gradient-to-br from-black/95 via-purple-950/20 to-black/95 ${isMobile ? 'backdrop-blur-sm' : 'backdrop-blur-md'} rounded-2xl overflow-hidden transition-all duration-500`}
                      >
                        {/* Target/Aim Icon - Top Left */}
                        <div className="absolute top-4 left-4 z-20">
                          <motion.div
                            className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                            whileHover={{ scale: 1.2, rotate: 180 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Target
                              className="w-5 h-5 text-cyan-400"
                              style={{
                                filter:
                                  'drop-shadow(0 0 8px rgba(6, 182, 212, 0.8))',
                              }}
                            />
                          </motion.div>
                        </div>

                        {/* Animated Neon Glow Background */}
                        <motion.div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                          animate={
                            hoveredMember === index
                              ? {
                                  background: [
                                    'radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.4) 0%, transparent 50%)',
                                    'radial-gradient(circle at 100% 100%, rgba(6, 182, 212, 0.4) 0%, transparent 50%)',
                                    'radial-gradient(circle at 0% 100%, rgba(124, 58, 237, 0.4) 0%, transparent 50%)',
                                    'radial-gradient(circle at 100% 0%, rgba(168, 85, 247, 0.4) 0%, transparent 50%)',
                                  ],
                                }
                              : {}
                          }
                          transition={{ duration: 3, repeat: Infinity }}
                        />

                        {/* Intense Flickering Light Effect on Hover */}
                        <motion.div
                          className="absolute inset-0 bg-purple-500/10 pointer-events-none"
                          animate={
                            hoveredMember === index
                              ? {
                                  opacity: [0, 0.3, 0, 0.2, 0],
                                }
                              : { opacity: 0 }
                          }
                          transition={{
                            duration: 0.4,
                            repeat: hoveredMember === index ? Infinity : 0,
                            repeatDelay: 0.8,
                          }}
                        />

                        {/* Content */}
                        <div className="relative p-6">
                          {/* Image Container - Sports Card Style */}
                          <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden border-2 border-purple-500/40 group-hover:border-purple-500 transition-all duration-500 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                            {/* Diagonal Stripe Overlay - Sports Jersey Effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-transparent to-cyan-500/30 group-hover:opacity-70 transition-opacity duration-500 z-10" />

                            <Image
                              src={member.image}
                              alt={member.name}
                              width={500}
                              height={500}
                              loading={index < 4 ? 'eager' : 'lazy'} // Eager load first 4, lazy load rest
                              priority={index < 4} // Priority for first 4 images
                              className="object-cover group-hover:scale-115 transition-transform duration-700"
                            />

                            {/* VHS Scan Line on Image */}
                            <motion.div
                              className="absolute inset-0 opacity-0 group-hover:opacity-50 pointer-events-none z-20"
                              style={{
                                background:
                                  'linear-gradient(180deg, transparent 0%, rgba(124, 58, 237, 1) 50%, transparent 100%)',
                                height: '4px',
                                boxShadow: '0 0 20px rgba(124, 58, 237, 1)',
                              }}
                              animate={
                                hoveredMember === index
                                  ? { y: [0, 300, 0] }
                                  : { y: 0 }
                              }
                              transition={{
                                duration: 1.8,
                                repeat: hoveredMember === index ? Infinity : 0,
                                ease: 'linear',
                              }}
                            />

                            {/* Speed Lines - Sports Motion Effect - Disabled on mobile for performance */}
                            {!isMobile && (
                              <motion.div
                                className="absolute inset-0 z-10 pointer-events-none"
                                animate={
                                  hoveredMember === index
                                    ? { opacity: [0, 0.4, 0] }
                                    : { opacity: 0 }
                                }
                                transition={{
                                  duration: 1.5,
                                  repeat:
                                    hoveredMember === index ? Infinity : 0,
                                }}
                              >
                                {[...Array(6)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    className="absolute h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                                    style={{
                                      top: `${15 + i * 15}%`,
                                      left: 0,
                                      right: 0,
                                      boxShadow:
                                        '0 0 10px rgba(6, 182, 212, 0.8)',
                                    }}
                                    animate={{
                                      x: ['-100%', '100%'],
                                    }}
                                    transition={{
                                      duration: 0.8,
                                      delay: i * 0.1,
                                      repeat: Infinity,
                                      repeatDelay: 1,
                                    }}
                                  />
                                ))}
                              </motion.div>
                            )}

                            {/* Energy Pulse - Bottom of Image */}
                            <motion.div
                              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent z-10"
                              animate={
                                hoveredMember === index
                                  ? {
                                      opacity: [0.3, 1, 0.3],
                                      boxShadow: [
                                        '0 0 10px rgba(251, 146, 60, 0.5)',
                                        '0 0 25px rgba(251, 146, 60, 1)',
                                        '0 0 10px rgba(251, 146, 60, 0.5)',
                                      ],
                                    }
                                  : { opacity: 0 }
                              }
                              transition={{
                                duration: 1.5,
                                repeat: hoveredMember === index ? Infinity : 0,
                              }}
                            />
                          </div>

                          {/* Member Name - Stranger Things Font Style */}
                          <h3
                            className="text-2xl md:text-2xl font-bold mb-2 text-center uppercase tracking-widest"
                            style={{
                              fontFamily: "'Courier New', monospace",
                              fontWeight: 900,
                              letterSpacing: '0.15em',
                              color: '#7c3aed',
                              textShadow: `
                              0 0 15px rgba(124, 58, 237, 1),
                              0 0 25px rgba(124, 58, 237, 0.6),
                              2px 2px 4px rgba(0, 0, 0, 0.8),
                              -1px -1px 0 rgba(124, 58, 237, 0.3),
                              1px 1px 0 rgba(124, 58, 237, 0.3)
                            `,
                            }}
                          >
                            {member.name}
                          </h3>

                          {/* Member Role - Neon Badge */}
                          <div className="flex justify-center mb-3">
                            <div className="px-4 py-1 bg-cyan-500/20 border border-cyan-400/60 rounded-full backdrop-blur-sm">
                              <p
                                className="text-cyan-400 text-xs md:text-sm text-center font-semibold uppercase tracking-wider"
                                style={{
                                  textShadow: '0 0 10px rgba(6, 182, 212, 0.8)',
                                  fontFamily: "'Courier New', monospace",
                                  letterSpacing: '0.1em',
                                }}
                              >
                                {member.role}
                              </p>
                            </div>
                          </div>

                          {/* Phone Number (if available) - Contact Badge */}
                          {/* {member.phone && (
                          <div className="flex items-center justify-center gap-2 text-gray-300 text-sm bg-black/50 rounded-lg py-2 px-3 border border-purple-500/30">
                            <Phone
                              className="w-4 h-4 text-purple-400"
                              style={{
                                filter:
                                  'drop-shadow(0 0 6px rgba(124, 58, 237, 0.6))',
                              }}
                            />
                            <span className="font-mono">{member.phone}</span>
                          </div>
                        )} */}
                        </div>

                        {/* Corner Decorations - Enhanced Neon */}
                      </div>
                    </ElectricBorder>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
