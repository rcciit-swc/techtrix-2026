'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Bug } from 'lucide-react';

export default function TeamLoader() {
  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFydmVsfGVufDB8fDB8fHww')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll',
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/90 pointer-events-none" />

      {/* Flickering Blue-Purple Lights */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div
          className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-blue-600/60 rounded-full"
          style={{ filter: 'blur(120px)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-purple-600/60 rounded-full"
          style={{ filter: 'blur(120px)' }}
        />
      </motion.div>

      {/* Loader Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Loading Text */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-center bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 bg-clip-text text-transparent"
          style={{
            fontFamily: 'Agency',
            textShadow: `
              0 0 15px rgba(59, 130, 246, 0.8),
              0 0 25px rgba(168, 85, 247, 0.7),
              0 0 40px rgba(99, 102, 241, 0.6)
            `,
          }}
        >
          LOADING TEAMS
        </motion.h2>

        {/* Animated Icon */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <img
            src="/teams/batlogo.png"
            alt="Batman Logo"
            className="w-16 h-16 object-contain"
            style={{
              filter: 'drop-shadow(0 0 15px rgba(168, 85, 247, 1))',
            }}
          />
        </motion.div>

        {/* Loading Bar */}
        <div className="w-64 h-2 bg-black/50 rounded-full overflow-hidden border border-purple-500/40">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              boxShadow:
                '0 0 20px rgba(168, 85, 247, 0.9), 0 0 30px rgba(59, 130, 246, 0.6)',
            }}
          />
        </div>

        {/* Loading Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-purple-500 rounded-full"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              style={{
                boxShadow:
                  '0 0 12px rgba(168, 85, 247, 1), 0 0 20px rgba(59, 130, 246, 0.6)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
