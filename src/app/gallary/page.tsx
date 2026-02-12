'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const images = [
  '/Gallery/DSC09209.JPG.webp',
  '/Gallery/DSC09210.JPG.webp',
  '/Gallery/Ranit_ (24).JPG.webp',
  '/Gallery/RISH_7994 (81).JPG.webp',
  '/Gallery/RISH_8209.JPG.webp',
  '/Gallery/RISH_8373.JPG.webp',
  '/Gallery/RISH_8482.JPG.webp',
  '/Gallery/SAI_8155.JPG.webp',
  '/Gallery/SAI_8301.JPG.webp',
  '/Gallery/SAI_8480.JPG.webp',
  '/Gallery/SAM_0099.JPG.webp',
  '/Gallery/SAM_0355.JPG.webp',
  '/Gallery/SHIN_0176.JPG.webp',
  '/Gallery/SHIN_0223.JPG.webp',
  '/Gallery/Sou_6758.JPG.webp',
  '/Gallery/Sou_6929.JPG.webp',
  '/Gallery/Sou_7177.JPG.webp',
  '/Gallery/_SUB7041.JPG.webp',
  '/Gallery/_SUB7232.JPG.webp',
];

export default function MasonryGallery() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<string[]>([]);

  const handleImageError = (src: string) => {
    console.error('Failed to load image:', src);
    setFailedImages((prev) => [...prev, src]);
  };

  return (
    <div className="min-h-screen bg-[#000d21]">
      <div>
        <h1
          style={{ fontFamily: 'Metal Mania' }}
          className="text-4xl text-center py-10 text-white"
        >
          Gallery
        </h1>
      </div>

      {/* Show failed images alert */}
      {failedImages.length > 0 && (
        <div className="px-4 pb-4 md:px-6">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-white">
            <h3 className="font-bold mb-2">
              Failed to load {failedImages.length} image(s):
            </h3>
            <ul className="list-disc list-inside text-sm">
              {failedImages.map((img, i) => (
                <li key={i}>{img}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
                    ? 'blur-none scale-100'
                    : hovered === index
                      ? 'blur-none scale-105'
                      : 'blur-sm'
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
                  onError={() => handleImageError(src)}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
