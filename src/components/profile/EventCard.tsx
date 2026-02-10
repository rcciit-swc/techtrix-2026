'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  IndianRupee,
  CheckCircle2,
  Eye,
  X,
  Users,
  Receipt,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { TeamMember } from '@/lib/types';

interface EventCardProps {
  event_id: string;
  name: string;
  image_url: string;
  registration_fees: number;
  registered?: boolean;
  schedule: string;
  team_details: TeamMember[] | null;
  transaction_screenshot: string | null;
  transaction_verified?: string | null;
}

export default function EventCard({
  name,
  image_url,
  registration_fees,
  schedule,
  team_details,
  transaction_screenshot,
  transaction_verified,
}: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'team' | 'payment'>('team');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to strip HTML tags
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  // Clean the schedule string
  const cleanSchedule = schedule ? stripHtml(schedule) : '';

  // Extract date from schedule
  const scheduleParts = cleanSchedule.split(/Venue\s*:/i);
  const eventInfo =
    scheduleParts.length > 1
      ? scheduleParts[scheduleParts.length - 1].trim()
      : cleanSchedule;

  const dateMatch = eventInfo.match(/^([^,]+)/);
  const rawDate = dateMatch ? dateMatch[1].trim() : '';

  let formattedDate = rawDate;
  try {
    const datePattern =
      /(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i;
    const extractedDate =
      rawDate.match(datePattern) || eventInfo.match(datePattern);

    if (extractedDate) {
      formattedDate = extractedDate[1];
    }
  } catch (e) {
    console.warn('Date parsing failed', e);
  }

  const renderModal = () => {
    if (!mounted || !isModalOpen) return null;

    return createPortal(
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            style={{ margin: 0 }}
          >
            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
                border: '2px solid rgba(204, 168, 85, 0.3)',
              }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 border-b border-[#CCA855]/30">
                <h2
                  className="text-2xl md:text-3xl font-bold text-[#CCA855] text-center pr-8 uppercase tracking-wider"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  {name}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X size={24} className="text-[#CCA855]" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#CCA855]/30">
                <button
                  onClick={() => setActiveTab('team')}
                  className={`flex-1 py-4 px-6 font-bold uppercase tracking-wide transition-all ${
                    activeTab === 'team'
                      ? 'bg-[#CCA855]/10 text-[#CCA855] border-b-2 border-[#CCA855]'
                      : 'text-gray-400 hover:text-[#CCA855]'
                  }`}
                  style={{ fontFamily: 'Maname' }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Users size={20} />
                    Team Details
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`flex-1 py-4 px-6 font-bold uppercase tracking-wide transition-all ${
                    activeTab === 'payment'
                      ? 'bg-[#CCA855]/10 text-[#CCA855] border-b-2 border-[#CCA855]'
                      : 'text-gray-400 hover:text-[#CCA855]'
                  }`}
                  style={{ fontFamily: 'Maname' }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Receipt size={20} />
                    Payment
                  </span>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {activeTab === 'team' && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    {team_details && team_details.length > 0 ? (
                      team_details.map((member, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl bg-gradient-to-r from-[#CCA855]/10 to-transparent border border-[#CCA855]/20"
                        >
                          <h3 className="text-lg font-bold text-[#CCA855] mb-2" style={{ fontFamily: 'Maname' }}>
                            {index === 0 ? 'Team Lead' : `Member ${index + 1}`}
                          </h3>
                          <div className="space-y-1 text-white" style={{ fontFamily: 'Maname' }}>
                            <p>
                              <span className="text-gray-400">Name:</span>{' '}
                              {member.name}
                            </p>
                            <p>
                              <span className="text-gray-400">Email:</span>{' '}
                              {member.email}
                            </p>
                            <p>
                              <span className="text-gray-400">Phone:</span>{' '}
                              {member.phone}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400 py-8" style={{ fontFamily: 'Maname' }}>
                        Solo registration - No team details available
                      </p>
                    )}
                  </motion.div>
                )}

                {activeTab === 'payment' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col items-center justify-center font-['Maname'] text-white"
                  >
                    {transaction_screenshot ? (
                      <div className="relative w-full max-w-md">
                        <Image
                          src={transaction_screenshot}
                          alt="Payment Screenshot"
                          width={500}
                          height={700}
                          className="rounded-xl border-2 border-[#CCA855]/30"
                        />
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Receipt
                          size={64}
                          className="text-gray-600 mx-auto mb-4"
                        />
                        <p className="text-gray-400 text-lg" style={{ fontFamily: 'Maname' }}>
                          {registration_fees > 0
                            ? 'Payment pending / Screenshot not available'
                            : 'Free event - No payment required'}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  const isPaymentPending = registration_fees > 0 && !transaction_verified;

  return (
    <>
      <motion.div
        className="group relative overflow-hidden rounded-[20px] w-full max-w-[380px] h-[480px] cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 rounded-[20px] overflow-hidden">
          <Image
            src={image_url || '/placeholder.svg'}
            alt={name || 'Event image'}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            priority={true}
          />
          {/* Dark gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
        </div>

        {/* Persistent Gold Overlay on Hover */}
        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[20px] bg-gradient-to-b from-[#CCA855]/15 to-[#CCA855]/0" />

        {/* Moving Shine Effect */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-[20px]">
          <div className="absolute top-0 -left-[150%] w-[100%] h-full bg-gradient-to-r from-transparent via-[#CCA855]/40 to-transparent -skew-x-12 transition-all duration-1000 ease-out group-hover:left-[150%]" />
        </div>

        {/* Status Badge - Top Left */}
        <motion.div
          className="absolute top-4 left-4 z-20"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          {isPaymentPending ? (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500 to-orange-600 px-3 py-1.5 rounded-full shadow-lg">
              <Receipt size={16} className="text-white" />
              <span className="text-white font-bold text-xs uppercase tracking-wide">
                Payment Pending
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-500 to-emerald-600 px-3 py-1.5 rounded-full shadow-lg">
              <CheckCircle2 size={16} className="text-white" />
              <span className="text-white font-bold text-xs uppercase tracking-wide">
                Registered
              </span>
            </div>
          )}
        </motion.div>

        {/* Decorative Corner Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
          <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-[#CCA855] rounded-tr-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20">
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-[#CCA855] rounded-bl-3xl" />
        </div>

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          {/* Top Section - Event Name */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3
                className="font-bold text-white text-2xl md:text-3xl uppercase tracking-wide mb-2 line-clamp-3"
                style={{
                  fontFamily: "'Metal Mania'",
                  textShadow:
                    '0 0 20px rgba(204, 168, 85, 0.5), 2px 2px 4px rgba(0,0,0,0.8)',
                }}
              >
                {name}
              </h3>
              {/* Decorative underline */}
              <motion.div
                className="h-1 bg-gradient-to-r from-transparent via-[#CCA855] to-transparent mx-auto"
                initial={{ width: 0 }}
                animate={{ width: '80%' }}
                transition={{ delay: 0.4, duration: 0.6 }}
              />
            </motion.div>
          </div>

          {/* Bottom Section - Date, Fee, Buttons */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Date and Fee Info Cards */}
            <div className="grid grid-cols-2 gap-3" style={{ fontFamily: 'Maname' }}>
              {/* Date Card */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-[#CCA855]/30">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={16} className="text-[#CCA855]" />
                  <span className="text-[#CCA855] text-xs font-semibold uppercase tracking-wide">
                    Date
                  </span>
                </div>
                <p className="text-white text-sm font-bold">
                  {formattedDate || 'TBA'}
                </p>
              </div>

              {/* Fee Card */}
              <div className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-[#CCA855]/30">
                <div className="flex items-center gap-2 mb-1">
                  <IndianRupee size={16} className="text-[#CCA855]" />
                  <span className="text-[#CCA855] text-xs font-semibold uppercase tracking-wide">
                    Fee
                  </span>
                </div>
                <p className="text-white text-sm font-bold">
                  ₹ {registration_fees || 0}
                </p>
              </div>
            </div>

            {/* View Details Button */}
            <motion.button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 rounded-xl font-bold text-base uppercase tracking-wide relative overflow-hidden border-2 border-[#CCA855]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(204, 168, 85, 0.3) 0%, rgba(204, 168, 85, 0.15) 100%)',
                backdropFilter: 'blur(10px)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Eye size={20} className="text-[#CCA855]" />
                <span
                  className="text-[#CCA855]"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  View Details
                </span>
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-[20px] pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: '0 0 30px rgba(204, 168, 85, 0.4) inset',
          }}
        />
      </motion.div>

      {/* Render Modal via Portal */}
      {renderModal()}
    </>
  );
}