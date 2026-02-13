'use client';

import { motion } from 'motion/react';

interface DynamicBackgroundProps {
  variant?: 'events' | 'sponsors' | 'sponsorship';
}

export function DynamicBackground({
  variant = 'events',
}: DynamicBackgroundProps) {
  const getColors = () => {
    switch (variant) {
      case 'events':
        return {
          primary: '#EDF526',
          secondary: '#EEFF00',
          accent: '#FFD700',
        };
      case 'sponsors':
        return {
          primary: '#00f7ff',
          secondary: '#00ff41',
          accent: '#0ff',
        };
      case 'sponsorship':
        return {
          primary: '#00ff41',
          secondary: '#EDF526',
          accent: '#00f7ff',
        };
    }
  };

  const colors = getColors();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Grid Pattern */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(${colors.primary}22 1px, transparent 1px),
            linear-gradient(90deg, ${colors.primary}22 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Large Glowing Orbs */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-30"
        style={{
          background: `radial-gradient(circle, ${colors.primary}, transparent 70%)`,
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/4 -right-40 w-[500px] h-[500px] rounded-full opacity-25"
        style={{
          background: `radial-gradient(circle, ${colors.secondary}, transparent 70%)`,
          filter: 'blur(90px)',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, ${colors.accent}, transparent 70%)`,
          filter: 'blur(100px)',
        }}
        animate={{
          x: [0, 120, 0],
          y: [0, -60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: colors.primary,
            left: `${i * 12 + 10}%`,
            top: `${i * 8 + 5}%`,
            boxShadow: `0 0 10px ${colors.primary}`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 8 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Diagonal Lines */}
      <motion.div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            ${colors.primary} 0px,
            ${colors.primary} 2px,
            transparent 2px,
            transparent 100px
          )`,
        }}
        animate={{
          backgroundPosition: ['0px 0px', '100px 100px'],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Corner Accents */}
      <div
        className="absolute top-0 left-0 w-64 h-64 opacity-20"
        style={{
          background: `radial-gradient(circle at top left, ${colors.primary}, transparent)`,
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-64 h-64 opacity-20"
        style={{
          background: `radial-gradient(circle at bottom right, ${colors.secondary}, transparent)`,
        }}
      />

      {/* Scanline Effect */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(transparent 50%, ${colors.accent} 50%)`,
          backgroundSize: '100% 4px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '0px 8px'],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
