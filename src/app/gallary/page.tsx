'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const images = [
  '/Gallary/DSC09209.JPG.jpeg',
  '/Gallary/DSC09210.JPG.jpeg',
  '/Gallary/Ranit_ (24).JPG.jpeg',
  '/Gallary/RISH_7994 (81).JPG.jpeg',
  '/Gallary/RISH_8209.JPG.jpeg',
  '/Gallary/RISH_8373.JPG.jpeg',
  '/Gallary/RISH_8482.JPG.jpeg',
  '/Gallary/SAI_8155.JPG.jpeg',
  '/Gallary/SAI_8301.JPG.jpeg',
  '/Gallary/SAI_8480.JPG.jpeg',
  '/Gallary/SAM_0099.JPG.jpeg',
  '/Gallary/SAM_0355.JPG.jpeg',
  '/Gallary/SHIN_0176.JPG.jpeg',
  '/Gallary/SHIN_0223.JPG.jpeg',
  '/Gallary/Sou_6758.JPG.jpeg',
  '/Gallary/Sou_6929.JPG.jpeg',
  '/Gallary/Sou_7177.JPG.jpeg',
  '/Gallary/_SUB7041.JPG.jpeg',
  '/Gallary/_SUB7232.JPG.jpeg',
];

export default function MasonryGallery() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#000d21]">
      <div>
        <h1
          style={{ fontFamily: 'Metal Mania' }}
          className="text-4xl  text-center py-10 text-white"
        >
          Gallary
        </h1>
      </div>

      {/* Gallery Section */}
      <div className="px-4 pb-20 md:px-6">
        <div className="columns-1 gap-4 space-y-4 transition-all sm:columns-2 md:columns-3 lg:columns-4">
          {images.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              className="group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 ease-in-out"
            >
              <motion.div
                className={`relative w-full transition-all duration-300 ease-in-out ${
                  hovered === null
                    ? 'blur-0 scale-100'
                    : hovered === index
                      ? 'blur-0 scale-105'
                      : 'blur-xs'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  width={800}
                  height={1200}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="w-full h-auto rounded-lg object-cover"
                  loading="lazy"
                  quality={85}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB//2Q=="
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
