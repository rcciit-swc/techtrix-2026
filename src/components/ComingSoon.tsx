'use client';

import { ArrowLeft, Home } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ComingSoon() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen pb-20 w-full bg-black overflow-hidden flex items-center justify-center">
      {/* Animated Background Grid */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(#EDF52622 1px, transparent 1px),
            linear-gradient(90deg, #EDF52622 1px, transparent 1px)
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

      {/* Glowing Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, #EDF526, transparent 70%)',
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
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, #00ff41, transparent 70%)',
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

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <motion.div
            animate={{
              filter: [
                'drop-shadow(0 0 20px rgba(237, 245, 38, 0.6))',
                'drop-shadow(0 0 40px rgba(237, 245, 38, 0.9))',
                'drop-shadow(0 0 20px rgba(237, 245, 38, 0.6))',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <Image
              src="https://i.postimg.cc/j20BjMhq/logo.png"
              alt="Techtrix Logo"
              width={200}
              height={200}
              className="w-32 h-auto md:w-48"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Coming Soon Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#EDF526] mb-4 uppercase tracking-wider"
            style={{ fontFamily: 'Metal Mania' }}
          >
            Coming Soon
          </h1>

          <motion.div
            animate={{
              textShadow: [
                '0 0 20px rgba(237, 245, 38, 0.5)',
                '0 0 40px rgba(237, 245, 38, 0.8)',
                '0 0 20px rgba(237, 245, 38, 0.5)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <p
              className="text-2xl md:text-4xl text-white mb-8"
              style={{ fontFamily: 'KungFuMaster' }}
            >
              This Page is Under Construction
            </p>
          </motion.div>

          <p
            className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto"
            style={{ fontFamily: 'Maname' }}
          >
            We're working hard to bring you something amazing. Stay tuned for
            updates!
          </p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-2 mb-12"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-[#EDF526]"
              animate={{
                y: [0, -20, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[#EDF526] to-[#EEFF00] text-black font-bold text-lg uppercase tracking-wide shadow-[0_0_30px_rgba(237,245,38,0.4)] hover:shadow-[0_0_50px_rgba(237,245,38,0.6)] transition-all duration-300"
              style={{ fontFamily: 'Metal Mania' }}
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.button>
          </Link>

          <motion.button
            onClick={() => router.back()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-8 py-4 rounded-lg bg-transparent border-2 border-[#EDF526] text-[#EDF526] font-bold text-lg uppercase tracking-wide shadow-[0_0_20px_rgba(237,245,38,0.3)] hover:shadow-[0_0_30px_rgba(237,245,38,0.5)] hover:bg-[#EDF526]/10 transition-all duration-300"
            style={{ fontFamily: 'Metal Mania' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </motion.button>
        </motion.div>
      </div>

      {/* Diagonal Lines Effect */}
      <motion.div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #EDF526 0px,
            #EDF526 2px,
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
    </div>
  );
}
