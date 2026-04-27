'use client';

import { getEvangelistsList } from '@/lib/actions/evangelists';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { DynamicBackground } from './AnimatedBackground';

interface EvangelistItem {
  referral_code: string;
  name: string;
  image: string | null;
  college: string | null;
}

const Evangelists = () => {
  const [evangelists, setEvangelists] = useState<EvangelistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvangelistsList().then((data) => {
      setEvangelists(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section
        id="ttevangelists"
        className="relative w-full py-16 md:py-24 bg-gradient-to-b from-black via-[#0a0a0a] to-black overflow-hidden"
      >
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="h-10 w-64 bg-white/5 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="w-32 h-1 bg-white/10 mx-auto" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/5 animate-pulse h-72"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (evangelists.length === 0) return null;

  return (
    <section className="relative w-full py-16 md:py-24 bg-gradient-to-b from-black via-[#0a0a0a] to-black overflow-hidden">
      <DynamicBackground variant="sponsors" />

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
            id="ttevangelists"
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wide mb-4"
            style={{ fontFamily: 'Metal Mania' }}
          >
            Our Evangelists
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-500 mx-auto" />
          <p className="mt-4 text-white/50 text-sm md:text-base max-w-lg mx-auto">
            The faces spreading the word about TechTrix 2026
          </p>
        </motion.div>

        {/* Evangelists Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
          {evangelists.map((evangelist, index) => (
            <motion.div
              key={evangelist.referral_code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className="group relative flex flex-col rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-white/[0.04] to-black/60 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(0,247,255,0.1)] hover:-translate-y-1"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-2xl z-10 pointer-events-none" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-500/20 rounded-tr-2xl z-10 pointer-events-none" />

              {/* Avatar area */}
              <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-cyan-900/20 to-black">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent z-10 pointer-events-none" />
                {evangelist.image ? (
                  <Image
                    src={evangelist.image}
                    alt={evangelist.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span
                      className="text-5xl md:text-6xl font-bold text-cyan-500/50"
                      style={{ fontFamily: 'Metal Mania' }}
                    >
                      {evangelist.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Info area */}
              <div className="flex flex-col gap-2.5 p-3 md:p-4 border-t border-white/8">
                {/* Name */}
                <p
                  className="text-white text-sm md:text-base font-bold leading-tight line-clamp-1 group-hover:text-cyan-400 transition-colors duration-300"
                  style={{ fontFamily: 'Metal Mania' }}
                >
                  {evangelist.name}
                </p>

                {/* College */}
                {evangelist.college && (
                  <p className="text-white/40 text-[10px] md:text-xs leading-tight line-clamp-1 -mt-1.5">
                    {evangelist.college}
                  </p>
                )}

                {/* Referral code row */}
                <div className="flex items-center justify-between gap-2 bg-black/50 border border-cyan-500/15 rounded-lg px-2.5 py-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-cyan-500/50 text-[9px] uppercase tracking-widest font-semibold shrink-0">
                      REF
                    </span>
                    <span className="text-cyan-400 text-[11px] md:text-xs font-mono font-bold truncate">
                      {evangelist.referral_code}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(evangelist.referral_code);
                      toast.success('Referral code copied!');
                    }}
                    className="shrink-0 p-1 rounded-md text-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                    title="Copy referral code"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Evangelists;
