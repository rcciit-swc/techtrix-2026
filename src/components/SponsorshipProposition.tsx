'use client';

import { FileText, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { DynamicBackground } from './AnimatedBackground';

const SponsorshipProposition = () => {
  return (
    <section className="relative w-full py-16 md:py-24 bg-gradient-to-b from-black via-[#0a0a0a] to-black overflow-hidden">
      {/* Animated Background */}
      <DynamicBackground variant="sponsorship" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wide mb-4"
            style={{ fontFamily: 'Metal Mania' }}
          >
            Interested in Sponsoring Our Event?
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#00ff41] to-[#EDF526] mx-auto" />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          {/* Brochure Button */}
          <a
            href="/brochure.pdf"
            download
            className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00ff41] to-[#00cc33] text-black font-bold text-lg md:text-xl uppercase tracking-wide shadow-[0_0_30px_rgba(0,255,65,0.4)] hover:shadow-[0_0_50px_rgba(0,255,65,0.6)] transition-all duration-300 hover:scale-105 overflow-hidden"
            style={{ fontFamily: 'Metal Mania' }}
          >
            <motion.div
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
            <FileText className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Brochure</span>
          </a>

          {/* Contact Us Button */}
          <a
            href="/contact"
            className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-black border-2 border-[#EDF526] text-[#EDF526] font-bold text-lg md:text-xl uppercase tracking-wide shadow-[0_0_30px_rgba(237,245,38,0.3)] hover:shadow-[0_0_50px_rgba(237,245,38,0.5)] hover:bg-[#EDF526] hover:text-black transition-all duration-300 hover:scale-105 overflow-hidden"
            style={{ fontFamily: 'Metal Mania' }}
          >
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#EDF526]/10 to-transparent"
            />
            <Mail className="w-6 h-6 relative z-10 group-hover:text-black transition-colors" />
            <span className="relative z-10">Contact Us</span>
          </a>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-[#00ff41]/20 text-6xl font-bold">
          //
        </div>
        <div className="absolute bottom-10 right-10 text-[#EDF526]/20 text-6xl font-bold">
          //
        </div>
      </div>
    </section>
  );
};

export default SponsorshipProposition;
