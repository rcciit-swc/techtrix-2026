'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DynamicBackground } from './AnimatedBackground';

const PartnerSection = () => {
  const communityPartnersTiers = [
    {
      tier: 'Tier 1',
      registrations: '200+ Registrations',
      benefits: [
        'Techtrix 2026 Merchandise + Goodies (1)',
        'Social Media Shoutout',
        'Special Entry Card',
        '4 Community Passes for RCCIIT Cultural Fest - Regalia 2026',
      ],
    },
    {
      tier: 'Tier 2',
      registrations: '150+ Registrations',
      benefits: [
        'Techtrix 2026 Goodies (1)',
        'Social Media Shoutout',
        'Special Entry Card',
        '1+1 Couple Pass for RCCIIT Cultural Fest - Regalia 2026',
      ],
    },
    {
      tier: 'Tier 3',
      registrations: '100+ Registrations',
      benefits: [
        'Social Media Shoutout',
        'Special Entry Card',
        '1 Single Pass for RCCIIT Cultural Fest - Regalia 2026',
      ],
    },
  ];

  const evangelistsTiers = [
    {
      tier: 'Tier 1',
      registrations: '80+ Registrations',
      benefits: [
        'Techtrix 2026 Merchandise + Goodies (1)',
        'Social Media Shoutout',
        'Special Entry Card for Techtrix 2026',
        '1+1 Couple Pass for RCCIIT Cultural Fest - Regalia 2026',
      ],
    },
    {
      tier: 'Tier 2',
      registrations: '60+ Registrations',
      benefits: [
        'Techtrix 2026 Goodies (1)',
        'Social Media Shoutout',
        'Special Entry Card for Techtrix 2026',
        '1 Single Pass for RCCIIT Cultural Fest - Regalia 2026',
      ],
    },
    {
      tier: 'Tier 3',
      registrations: '40+ Registrations',
      benefits: [
        'Social Media Shoutout',
        'Special Entry Card for Techtrix 2026',
      ],
    },
  ];

  const PartnerRow = ({
    title,
    callText,
    image,
    tiers,
    link,
    id,
  }: {
    title: string;
    callText: string;
    image: string;
    tiers: any[];
    link: string;
    id: string;
  }) => (
    <div id={id} className="mb-10 last:mb-0">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 border-l-4 border-[#00f7ff] pl-6"
      >
        <h3
          className="text-white text-3xl md:text-4xl font-bold uppercase tracking-tight"
          style={{ fontFamily: 'Metal Mania' }}
        >
          {title}
        </h3>
        <p className="text-[#00f7ff]/70 text-sm md:text-base font-medium italic mt-1">
          {callText}
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Side: Poster */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/4 max-w-[320px] mx-auto lg:mx-0"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.3)] border border-white/5 bg-black/40 group">
            <Image
              src={image}
              alt={title}
              width={400}
              height={600}
              className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </motion.div>

        {/* Right Side: Tiers and Info */}
        <div className="w-full lg:flex-1 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`p-5 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col ${idx === 0 ? 'border-[#00f7ff]/30 bg-[#00f7ff]/5' : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4
                    className={`text-lg font-bold ${idx === 0 ? 'text-[#00f7ff]' : 'text-yellow-400'}`}
                  >
                    {tier.tier}
                  </h4>
                  <div
                    className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${idx === 0 ? 'bg-[#00f7ff]/20 text-[#00f7ff]' : 'bg-white/10 text-white/50'}`}
                  >
                    {idx === 0 ? 'Supreme' : 'Member'}
                  </div>
                </div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-4">
                  {tier.registrations}
                </p>

                <ul className="space-y-2 flex-grow">
                  {tier.benefits.map((benefit: string, bIdx: number) => (
                    <li
                      key={bIdx}
                      className="flex items-start gap-2 text-white/70 text-xs leading-relaxed"
                    >
                      <div
                        className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${idx === 0 ? 'bg-[#00f7ff]' : 'bg-yellow-400'}`}
                      />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className=""
          >
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#00f7ff] hover:bg-white text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:-translate-y-1 shadow-[0_4px_15px_rgba(0,247,255,0.3)] group"
            >
              <span className="text-sm uppercase tracking-wider">
                Apply to be a {title.split(' ')[0]}
              </span>
              <ExternalLink
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative w-full py-16 overflow-hidden bg-black/60">
      <DynamicBackground variant="sponsors" />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-12"
        >
          <span className="text-[#00f7ff] font-bold tracking-[0.3em] uppercase text-xs mb-3">
            Collaborations
          </span>
          <h2
            className="text-white text-4xl md:text-6xl font-bold uppercase tracking-tighter text-center"
            style={{
              fontFamily: 'VerveAlternate',
              textShadow: '0 0 30px rgba(0, 247, 255, 0.2)',
            }}
          >
            Join the <span className="text-[#00f7ff]">Alliance</span>
          </h2>
          <div className="mt-6 flex gap-4">
            <div className="w-12 h-1 bg-[#00f7ff] rounded-full" />
            <div className="w-4 h-1 bg-white/10 rounded-full" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <PartnerRow
            id="partners"
            title="Community Partners"
            callText="Lead your community to glory"
            image="https://i.postimg.cc/XJqNNn8Y/comm-partners.png"
            tiers={communityPartnersTiers}
            link="https://www.goavo.ai/events/forms/fillup?id=69a836bd1e8cd2a586af0624"
          />

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <PartnerRow
            id="evangelists"
            title="Evangelists"
            callText="Be the face of evolution"
            image="https://i.postimg.cc/SsRQQmrR/evangelists.png"
            tiers={evangelistsTiers}
            link="https://www.goavo.ai/events/forms/fillup?id=69a8384d3b1cbacce818ee40"
          />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -left-64 top-1/4 w-[500px] h-[500px] bg-[#00f7ff]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -right-64 bottom-1/4 w-[500px] h-[500px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />
    </section>
  );
};

export default PartnerSection;
