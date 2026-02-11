'use client';

import { Facebook, Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <div className="relative w-full overflow-hidden pb-20">
      {/* Background Image */}
      <Image
        src="/Footer/Background.jpg"
        alt="Background"
        fill
        className="object-cover opacity-90"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-10 relative z-20">
        {/* Main Footer Content - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mb-6 items-start">
          {/* Column 1: Social Media - Connect With Us */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h3
              className="text-[#EDF526] text-[18px] md:text-[20px] font-bold leading-tight tracking-wider uppercase"
              style={{ fontFamily: 'Metal Mania' }}
            >
              Connect With Us
            </h3>
            <div className="flex gap-6">
              <motion.a
                href="https://instagram.com/techtrix_official"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#F2EFE9] hover:text-[#EDF526] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={28} strokeWidth={2} />
              </motion.a>
              <motion.a
                href="https://www.facebook.com/techtrix.rcciit"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                className="text-[#F2EFE9] hover:text-[#EDF526] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={28} strokeWidth={2} />
              </motion.a>
            </div>
          </motion.div>

          {/* Column 2: Navigation Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-3 text-center"
          >
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Events', href: '/events' },
                { label: 'Team', href: '/team' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'Contact', href: '/contact' },
              ].map((link, index) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.08 }}
                >
                  <Link
                    href={link.href}
                    className="text-[#F2EFE9] text-[15px] md:text-[17px] font-medium hover:text-[#EDF526] transition-all duration-300 inline-block hover:scale-105"
                    style={{ fontFamily: 'Maname' }}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Techtrix Logo & Event Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center justify-center md:items-end space-y-3"
          >
            {/* Techtrix Logo */}
            <motion.div
              className="relative"
              animate={{
                filter: [
                  'drop-shadow(0 0 15px rgba(237, 245, 38, 0.6))',
                  'drop-shadow(0 0 25px rgba(237, 245, 38, 0.9))',
                  'drop-shadow(0 0 15px rgba(237, 245, 38, 0.6))',
                ],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
            >
              <Image
                src="https://i.postimg.cc/j20BjMhq/logo.png"
                alt="Techtrix Logo"
                width={240}
                height={240}
                className="w-20 h-auto md:w-32"
                priority
              />
            </motion.div>

            {/* Event Dates */}
            <div className="text-center md:text-right space-y-1">
              <p
                className="text-[#EDF526] text-[14px] md:text-[15px] font-bold uppercase tracking-wider"
                style={{ fontFamily: 'Metal Mania' }}
              >
                Event Dates
              </p>
              <p
                className="text-[#F2EFE9] text-[13px] md:text-[14px] font-medium"
                style={{ fontFamily: 'Maname' }}
              >
                ANNOUCING SOON
              </p>
            </div>

            {/* Tagline */}
            <motion.p
              className="text-[rgba(242,239,233,0.75)] text-[12px] md:text-[13px] italic text-center md:text-right"
              style={{ fontFamily: 'Maname' }}
              animate={{
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              Mark your calendars!
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom Copyright Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="border-t border-[rgba(242,239,233,0.2)] pt-4"
        >
          <div
            className="flex flex-col md:flex-row justify-between items-center gap-2 text-[rgba(242,239,233,0.75)] text-[11px] md:text-[13px]"
            style={{ fontFamily: 'Maname' }}
          >
            <p className="text-center md:text-left">
              © 2026 TECHTRIX TECH FEST. All rights reserved.
            </p>
            <motion.p
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              Made with{' '}
              <motion.span
                animate={{
                  scale: [1, 1.3, 1],
                  color: ['#ef4444', '#dc2626', '#ef4444'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                ❤️
              </motion.span>{' '}
              by Techtrix Technical Team
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
