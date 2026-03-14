'use client';

import {
  CommunityStats,
  getCommunityLeaderboard,
} from '@/lib/actions/communities';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { DynamicBackground } from './AnimatedBackground';

const CommunityPartners = () => {
  const [communities, setCommunities] = useState<CommunityStats[]>([]);

  useEffect(() => {
    getCommunityLeaderboard().then((data) => {
      const updatedData = data.map((community) => {
        if (
          community.community_name.toLowerCase() ===
          'gdg on campus rcciit'.toLowerCase()
        ) {
          return {
            ...community,
            community_image: 'https://i.postimg.cc/0jsLmDqm/gdgc-3.png',
          };
        }
        return community;
      });
      setCommunities(updatedData);
    });
  }, []);

  if (communities.length === 0) return null;

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
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-wide mb-4"
            style={{ fontFamily: 'Metal Mania' }}
          >
            Our Community Partners
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 mx-auto" />
          <p className="mt-4 text-white/50 text-sm md:text-base max-w-lg mx-auto">
            Proud communities powering TechTrix 2026
          </p>
        </motion.div>

        {/* Community Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
          {communities.map((community, index) => (
            <motion.div
              key={community.referral_code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className="group relative flex flex-col items-center"
            >
              {/* Card */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/60 backdrop-blur-sm transition-all duration-300 group-hover:border-yellow-500/40 group-hover:shadow-[0_0_25px_rgba(234,179,8,0.15)]">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none" />

                {/* Corner accent */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-500/40 rounded-tl-2xl z-10 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-500/40 rounded-br-2xl z-10 pointer-events-none" />

                {/* Image */}
                {community.community_image ? (
                  <Image
                    src={community.community_image}
                    alt={community.community_name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <span
                      className="text-4xl md:text-5xl font-bold text-yellow-500/60"
                      style={{ fontFamily: 'Metal Mania' }}
                    >
                      {community.community_name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Name */}
              <p
                className="mt-3 text-white/80 text-xs md:text-sm font-semibold text-center leading-tight group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2"
                style={{ fontFamily: "'Exo-Black', sans-serif" }}
              >
                {community.community_name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityPartners;
