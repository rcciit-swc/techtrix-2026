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

  // Simplified Date Parsing
  const eventDate = (() => {
    try {
      const clean = schedule?.replace(/<[^>]*>?/gm, '') || '';
      const match = clean.match(
        /(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i
      );
      return match ? match[1] : clean.split(/Venue\s*:/i)[0]?.trim() || '';
    } catch {
      return '';
    }
  })();

  const isPaymentPending = registration_fees > 0 && !transaction_verified;

  const renderModal = () => {
    if (!mounted || !isModalOpen) return null;
    return createPortal(
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl border-2 border-[#CCA855]/30"
              style={{
                background:
                  'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 20, 0.95) 100%)',
              }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 border-b border-[#CCA855]/30 flex justify-between items-center">
                <h2
                  className="text-2xl md:text-3xl font-bold text-[#CCA855] text-center uppercase tracking-wider"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  {name}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <X size={24} className="text-[#CCA855]" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#CCA855]/30">
                {['team', 'payment'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`flex-1 py-4 px-6 font-bold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
                      activeTab === tab
                        ? 'bg-[#CCA855]/10 text-[#CCA855] border-b-2 border-[#CCA855]'
                        : 'text-gray-400 hover:text-[#CCA855]'
                    }`}
                    style={{ fontFamily: 'Maname' }}
                  >
                    {tab === 'team' ? (
                      <Users size={20} />
                    ) : (
                      <Receipt size={20} />
                    )}
                    {tab === 'team' ? 'Team Details' : 'Payment'}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh] overflow-x-hidden relative min-h-[300px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'team' ? (
                    <motion.div
                      key="team"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {team_details?.length ? (
                        team_details.map((member, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-xl bg-[#CCA855]/5 border border-[#CCA855]/20"
                          >
                            <h3
                              className="text-lg font-bold text-[#CCA855] mb-2"
                              style={{ fontFamily: 'Maname' }}
                            >
                              {index === 0
                                ? 'Team Lead'
                                : `Member ${index + 1}`}
                            </h3>
                            <div className="space-y-1 text-white font-[Maname]">
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
                        <p className="text-center text-gray-400 py-8 font-[Maname]">
                          Solo registration
                        </p>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center justify-center font-[Maname] text-white"
                    >
                      {transaction_screenshot ? (
                        <Image
                          src={transaction_screenshot}
                          alt="Payment"
                          width={500}
                          height={700}
                          className="rounded-xl border-2 border-[#CCA855]/30"
                        />
                      ) : (
                        <div className="text-center py-12">
                          <Receipt
                            size={64}
                            className="text-gray-600 mx-auto mb-4"
                          />
                          <p className="text-gray-400 text-lg">
                            {registration_fees > 0
                              ? 'Payment pending / No screenshot'
                              : 'Free event'}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    );
  };

  return (
    <>
      <motion.div
        className="group relative overflow-hidden rounded-[20px] w-full max-w-[380px] h-[480px] cursor-pointer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute inset-0 rounded-[20px] overflow-hidden">
          <Image
            src={image_url || '/placeholder.svg'}
            alt={name}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
        </div>

        {/* Hover Effects */}
        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[20px] bg-gradient-to-b from-[#CCA855]/15 to-[#CCA855]/0" />
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-[20px]">
          <div className="absolute top-0 -left-[150%] w-[100%] h-full bg-gradient-to-r from-transparent via-[#CCA855]/40 to-transparent -skew-x-12 transition-all duration-1000 ease-out group-hover:left-[150%]" />
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-20 transition-transform duration-300 hover:scale-105">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg ${isPaymentPending ? 'bg-gradient-to-r from-yellow-500 to-orange-600' : 'bg-gradient-to-r from-green-500 to-emerald-600'}`}
          >
            {isPaymentPending ? (
              <Receipt size={16} className="text-white" />
            ) : (
              <CheckCircle2 size={16} className="text-white" />
            )}
            <span className="text-white font-bold text-xs uppercase tracking-wide">
              {isPaymentPending ? 'Payment Pending' : 'Registered'}
            </span>
          </div>
        </div>

        {/* Decorative Corners */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
          <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-[#CCA855] rounded-tr-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20 pointer-events-none">
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-[#CCA855] rounded-bl-3xl" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-6">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
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
              <div className="h-1 bg-gradient-to-r from-transparent via-[#CCA855] to-transparent mx-auto w-4/5" />
            </div>
          </div>

          <div className="space-y-3">
            <div
              className="grid grid-cols-2 gap-3"
              style={{ fontFamily: 'Maname' }}
            >
              {[
                { icon: Calendar, label: 'Date', value: eventDate || 'TBA' },
                {
                  icon: IndianRupee,
                  label: 'Fee',
                  value: `₹ ${registration_fees || 0}`,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-black/40 backdrop-blur-md rounded-xl p-3 border border-[#CCA855]/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon size={16} className="text-[#CCA855]" />
                    <span className="text-[#CCA855] text-xs font-semibold uppercase tracking-wide">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-white text-sm font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 rounded-xl font-bold text-base uppercase tracking-wide relative overflow-hidden border-2 border-[#CCA855] group/btn transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background:
                  'linear-gradient(135deg, rgba(204, 168, 85, 0.3) 0%, rgba(204, 168, 85, 0.15) 100%)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2 text-[#CCA855]">
                <Eye size={20} />
                <span style={{ fontFamily: "'Metal Mania'" }}>
                  View Details
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Hover Glow */}
        <div
          className="absolute inset-0 rounded-[20px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: '0 0 30px rgba(204, 168, 85, 0.4) inset' }}
        />
      </motion.div>
      {renderModal()}
    </>
  );
}
