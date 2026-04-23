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
  User,
  Phone,
  Mail,
  Building,
  Crown,
  Copy,
  Check,
  CreditCard,
  Clock,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { MyRegistration } from '@/lib/services/register';
import { useUser } from '@/lib/stores';
import { toast } from 'sonner';

interface RegistrationCardProps {
  registration: MyRegistration;
}

const SWC_FREE_CATEGORY_IDS = [
  'fb17b092-1622-4a3d-90a9-650fd860f6a0',
  '441aa4ca-49ad-4b57-bb7f-6a1c5cc63a32',
  'a8609025-6132-4d69-8c61-3313ef082db4',
];

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Awaiting Members',
    className: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  },
  active: {
    label: 'Open',
    className: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  },
  closed: {
    label: 'Closed',
    className: 'text-green-400 bg-green-400/10 border-green-400/30',
  },
};

export default function RegistrationCard({
  registration,
}: RegistrationCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'members' | 'payment'
  >('overview');
  const [mounted, setMounted] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const { swcData } = useUser();
  const isSWCPaid = !!swcData;
  const isEligibleForSWCFree =
    isSWCPaid &&
    SWC_FREE_CATEGORY_IDS.includes(registration.event_category_id ?? '');
  const effectiveFees = isEligibleForSWCFree
    ? 0
    : registration.registration_fees;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFullyPaid =
    effectiveFees === 0 ||
    !!registration.transaction_verified ||
    !!registration.payment_verified_at ||
    registration.payment_status === 'paid';

  const teamStatusInfo = STATUS_STYLES[registration.team_status ?? 'pending'];

  const eventDate = (() => {
    try {
      const clean = registration.schedule?.replace(/<[^>]*>?/gm, '') || '';
      const match = clean.match(
        /(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i
      );
      return match ? match[1] : clean.split(/Venue\s*:/i)[0]?.trim() || '';
    } catch {
      return '';
    }
  })();

  const copyInviteCode = () => {
    if (!registration.invite_code) return;
    navigator.clipboard.writeText(registration.invite_code);
    setCodeCopied(true);
    toast.success('Invite code copied!');
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const allMembers = [
    {
      label: 'Team Lead',
      name: registration.team_lead_name ?? registration.team_lead_email ?? '—',
      email: registration.team_lead_email,
      phone: registration.team_lead_phone,
      college: registration.college,
      isLead: true,
    },
    ...registration.participants.map((p, i) => ({
      label: `Member ${i + 2}`,
      name: p.name,
      email: p.email,
      phone: p.phone,
      college: p.college,
      isLead: false,
    })),
  ];

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
              className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl border border-white/15 bg-black/90"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-white/10 flex items-start justify-between gap-3">
                <div>
                  <h2
                    className="text-white text-xl tracking-widest"
                    style={{ fontFamily: "'Metal Mania'" }}
                  >
                    {registration.event_name}
                  </h2>
                  <p className="text-white/40 text-xs mt-0.5">
                    {registration.team_name}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {registration.is_lead && (
                    <span className="flex items-center gap-1 text-[10px] text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-2.5 py-0.5">
                      <Crown size={9} /> Lead
                    </span>
                  )}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <X size={18} className="text-white/60" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/10">
                {(['overview', 'members', 'payment'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 px-2 text-xs font-medium uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      activeTab === tab
                        ? 'text-yellow-400 border-b-2 border-yellow-400 bg-yellow-400/5'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    {tab === 'overview' && <Eye size={13} />}
                    {tab === 'members' && <Users size={13} />}
                    {tab === 'payment' && <Receipt size={13} />}
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[60vh]">
                <AnimatePresence mode="wait">
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="p-6 space-y-4"
                    >
                      {/* Team info */}
                      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-white font-medium">
                              {registration.team_name ?? '—'}
                            </p>
                            {registration.college && (
                              <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
                                <Building size={10} /> {registration.college}
                              </p>
                            )}
                          </div>
                          <span
                            className={`text-[10px] border rounded-full px-2.5 py-0.5 capitalize shrink-0 ${teamStatusInfo?.className}`}
                          >
                            {teamStatusInfo?.label ?? registration.team_status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-black/30 rounded-lg px-3 py-2">
                            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">
                              Members
                            </p>
                            <p className="text-white">
                              {registration.member_count}
                            </p>
                          </div>
                          <div className="bg-black/30 rounded-lg px-3 py-2">
                            <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">
                              Role
                            </p>
                            <p
                              className={
                                registration.is_lead
                                  ? 'text-yellow-400'
                                  : 'text-white/70'
                              }
                            >
                              {registration.is_lead ? 'Team Lead' : 'Member'}
                            </p>
                          </div>
                          {registration.registered_at && (
                            <div className="bg-black/30 rounded-lg px-3 py-2 col-span-2">
                              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">
                                Registered
                              </p>
                              <p className="text-white/70">
                                {new Date(
                                  registration.registered_at
                                ).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Invite code — show if team is pending/active */}
                        {registration.invite_code &&
                          registration.team_status !== 'closed' && (
                            <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-lg px-3 py-2">
                              <div>
                                <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">
                                  Invite Code
                                </p>
                                <p className="text-white font-mono tracking-widest text-sm">
                                  {registration.invite_code}
                                </p>
                              </div>
                              <button
                                onClick={copyInviteCode}
                                className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                              >
                                {codeCopied ? (
                                  <Check size={14} className="text-green-400" />
                                ) : (
                                  <Copy size={14} />
                                )}
                              </button>
                            </div>
                          )}
                      </div>

                      {/* Event schedule */}
                      {eventDate && (
                        <div className="flex items-center gap-2 text-white/50 text-xs">
                          <Calendar size={12} />
                          <span>{eventDate}</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'members' && (
                    <motion.div
                      key="members"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.15 }}
                      className="p-6 space-y-3"
                    >
                      {allMembers.map((m, i) => (
                        <div
                          key={i}
                          className="bg-white/5 border border-white/10 rounded-xl p-3"
                        >
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <User
                              size={11}
                              className={
                                m.isLead ? 'text-yellow-400' : 'text-white/30'
                              }
                            />
                            <span
                              className={`text-[10px] uppercase tracking-wider ${m.isLead ? 'text-yellow-400' : 'text-white/30'}`}
                            >
                              {m.label}
                            </span>
                          </div>
                          <p className="text-white text-sm">{m.name}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                            {m.phone && (
                              <span className="text-[11px] text-white/40 flex items-center gap-1">
                                <Phone size={10} /> {m.phone}
                              </span>
                            )}
                            {m.email && (
                              <span className="text-[11px] text-white/40 flex items-center gap-1">
                                <Mail size={10} /> {m.email}
                              </span>
                            )}
                            {m.college && (
                              <span className="text-[11px] text-white/40 flex items-center gap-1">
                                <Building size={10} /> {m.college}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'payment' && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.15 }}
                      className="p-6 space-y-4"
                    >
                      {/* Payment status chip */}
                      <div
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm ${
                          isFullyPaid
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : effectiveFees === 0
                              ? 'bg-white/5 border-white/10 text-white/60'
                              : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                        }`}
                      >
                        {isFullyPaid ? (
                          <CheckCircle2 size={16} />
                        ) : effectiveFees === 0 ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <Clock size={16} />
                        )}
                        <span>
                          {effectiveFees === 0
                            ? 'Free Event'
                            : isFullyPaid
                              ? 'Payment Verified'
                              : 'Payment Pending'}
                        </span>
                        {effectiveFees > 0 && (
                          <span className="ml-auto text-white/50 text-xs">
                            ₹{effectiveFees}
                          </span>
                        )}
                      </div>

                      {/* Payment details */}
                      {(registration.razorpay_payment_id ||
                        registration.razorpay_order_id) && (
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5">
                          {registration.razorpay_payment_id && (
                            <div>
                              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">
                                Payment ID
                              </p>
                              <p className="text-white/80 font-mono text-xs">
                                {registration.razorpay_payment_id}
                              </p>
                            </div>
                          )}
                          {registration.razorpay_order_id && (
                            <div>
                              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">
                                Order ID
                              </p>
                              <p className="text-white/80 font-mono text-xs">
                                {registration.razorpay_order_id}
                              </p>
                            </div>
                          )}
                          {registration.payment_verified_at && (
                            <div>
                              <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">
                                Verified At
                              </p>
                              <p className="text-white/70 text-xs">
                                {new Date(
                                  registration.payment_verified_at
                                ).toLocaleString('en-IN')}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Screenshot */}
                      {registration.transaction_screenshot && (
                        <div>
                          <p className="text-white/40 text-[10px] uppercase tracking-wider mb-2">
                            Payment Screenshot
                          </p>
                          <Image
                            src={registration.transaction_screenshot}
                            alt="Payment screenshot"
                            width={480}
                            height={640}
                            className="rounded-xl border border-white/10 w-full"
                          />
                        </div>
                      )}

                      {!registration.razorpay_payment_id &&
                        !registration.transaction_screenshot &&
                        effectiveFees > 0 && (
                          <div className="text-center py-8">
                            <Receipt
                              size={48}
                              className="text-white/20 mx-auto mb-3"
                            />
                            <p className="text-white/40 text-sm">
                              No payment recorded yet
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
        {/* Background image */}
        <div className="absolute inset-0 rounded-[20px] overflow-hidden">
          <Image
            src={registration.image_url || '/placeholder.svg'}
            alt={registration.event_name}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
        </div>

        {/* Hover shimmer */}
        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[20px] bg-gradient-to-b from-[#CCA855]/15 to-[#CCA855]/0" />
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-[20px]">
          <div className="absolute top-0 -left-[150%] w-[100%] h-full bg-gradient-to-r from-transparent via-[#CCA855]/40 to-transparent -skew-x-12 transition-all duration-1000 ease-out group-hover:left-[150%]" />
        </div>

        {/* Status badge */}
        <div className="absolute top-4 left-4 z-20">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg ${
              isFullyPaid
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : effectiveFees === 0
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-600'
            }`}
          >
            {isFullyPaid || effectiveFees === 0 ? (
              <CheckCircle2 size={14} className="text-white" />
            ) : (
              <Receipt size={14} className="text-white" />
            )}
            <span className="text-white font-bold text-xs uppercase tracking-wide">
              {effectiveFees === 0
                ? 'Registered'
                : isFullyPaid
                  ? 'Registered'
                  : 'Pending Payment'}
            </span>
          </div>
        </div>

        {/* Role badge */}
        {registration.is_lead && (
          <div className="absolute top-4 right-4 z-20">
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/40">
              <Crown size={12} className="text-yellow-400" />
              <span className="text-yellow-400 text-[10px] font-bold uppercase tracking-wide">
                Lead
              </span>
            </div>
          </div>
        )}

        {/* Decorative corners */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
          <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-[#CCA855] rounded-tr-3xl" />
        </div>
        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-20 pointer-events-none">
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-[#CCA855] rounded-bl-3xl" />
        </div>

        {/* Card content */}
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
                {registration.event_name}
              </h3>
              <div className="h-1 bg-gradient-to-r from-transparent via-[#CCA855] to-transparent mx-auto w-4/5" />
              {registration.team_name && (
                <p className="text-white/50 text-xs mt-2 tracking-wide">
                  {registration.team_name}
                </p>
              )}
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
                  value: isEligibleForSWCFree
                    ? 'SWC Free'
                    : `₹ ${registration.registration_fees || 0}`,
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

            {/* Member count indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10">
              <Users size={13} className="text-white/40" />
              <span className="text-white/50 text-xs">
                {registration.member_count} member
                {registration.member_count !== 1 ? 's' : ''}
              </span>
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

        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-[20px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ boxShadow: '0 0 30px rgba(204, 168, 85, 0.4) inset' }}
        />
      </motion.div>
      {renderModal()}
    </>
  );
}
