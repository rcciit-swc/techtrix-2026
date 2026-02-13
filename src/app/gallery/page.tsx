'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState } from 'react';

const images = [
  'https://i.postimg.cc/qvSrn5Sm/Accomodation-Proposal.jpg',
  'https://i.postimg.cc/Z52m3M2c/DSC09209.jpg',
  'https://i.postimg.cc/Bnk3DVkp/DSC09210.jpg',
  'https://i.postimg.cc/8z9GW092/RISH-7994-(81).jpg',
  'https://i.postimg.cc/9f9hBBHL/RISH-8209.jpg',
  'https://i.postimg.cc/25WDxxNJ/RISH-8373.jpg',
  'https://i.postimg.cc/Xv5bgg6z/RISH-8482.jpg',
  'https://i.postimg.cc/N0XcxxwY/SAI-8155.jpg',
  'https://i.postimg.cc/rp4k99Lq/SAI-8301.jpg',
  'https://i.postimg.cc/jjfbhhr2/SAI-8480.jpg',
  'https://i.postimg.cc/N0Xcxxw5/SAM-0099.jpg',
  'https://i.postimg.cc/4dTT2hJm/SAM-0355.jpg',
  'https://i.postimg.cc/HxCCv7py/SHIN-0176.jpg',
  'https://i.postimg.cc/j5rr3Jsf/SHIN-0223.jpg',
  'https://i.postimg.cc/fLhhq0wc/Sou-6758.jpg',
  'https://i.postimg.cc/LXBFc6XN/Sou-6929.jpg',
  'https://i.postimg.cc/ydXCMYdf/Sou-7177.jpg',
  'https://i.postimg.cc/0ybxzsWG/SUB7041.jpg',
  'https://i.postimg.cc/VkpwMVpD/SUB7232.jpg',
];

export default function MasonryGallery() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const handleImageError = (src: string) => {
    console.error('Failed to load image:', src);
    setFailedImages((prev) => [...prev, src]);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-fixed text-slate-200 selection:bg-cyan-500/30"
      style={{ backgroundImage: "url('/profile/profilebg.jpeg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Animated Background Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(250, 204, 21, 0.1) 0%, transparent 70%)',
          animation: 'pulse 8s infinite',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-12 md:mb-20 text-center"
        >
          <motion.h1
            style={{ fontFamily: 'Metal Mania' }}
            className="text-5xl md:text-7xl font-bold text-yellow-500 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] tracking-wider uppercase"
          >
            Gallery
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100px' }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-1 bg-yellow-400 mx-auto mt-4 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"
          />
          <p className="mt-4 text-slate-300 max-w-2xl mx-auto text-lg">
            Glimpses of the chaos, the innovation, and the energy.
          </p>
        </motion.div>

        {/* Show failed images alert if any */}
        {failedImages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-8 px-4"
          >
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-200">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                Failed to load {failedImages.length} image(s)
              </h3>
            </div>
          </motion.div>
        )}

        {/* Gallery Section */}
        <motion.div style={{ y }} className="px-2 md:px-4 pb-20">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {images.map((src, index) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: (index % 4) * 0.1, // Stagger based on column position roughly
                  type: 'spring',
                  stiffness: 50,
                }}
                viewport={{ once: true, margin: '-50px' }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className="break-inside-avoid"
              >
                <motion.div
                  className={`
                    group relative overflow-hidden rounded-xl border border-white/10 bg-gray-900/50
                    backdrop-blur-sm transition-all duration-500 ease-out
                    ${
                      hovered !== null && hovered !== index
                        ? 'blur-[2px] opacity-50 scale-95 grayscale-[0.7]'
                        : 'blur-0 opacity-100 grayscale-0 shadow-[0_0_30px_-5px_rgba(250,204,21,0.3)]'
                    }
                  `}
                  whileHover={{
                    scale: 1.02,
                    borderColor: 'rgba(250,204,21,0.5)',
                    boxShadow: '0 0 40px -10px rgba(250,204,21,0.6)',
                    zIndex: 10,
                  }}
                >
                  <div className="relative aspect-auto">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                    <Image
                      src={src}
                      alt={`Gallery image ${index + 1}`}
                      width={800}
                      height={600}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="w-full h-auto object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                      quality={90}
                      onError={() => handleImageError(src)}
                    />

                    {/* Overlay Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                      <div className="h-0.5 w-12 bg-yellow-400 mb-2" />
                      <p className="text-white text-sm font-light tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        TECHTRIX 2026
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
