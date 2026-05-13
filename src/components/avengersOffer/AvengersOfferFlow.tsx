'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRazorpay } from '@/hooks/useRazorpay';
import { registerTeamWithParticipants } from '@/lib/services/register';
import { useEvents, useUser } from '@/lib/stores';
import { calculateGatewayFee } from '@/lib/utils/razorpay';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Loader2,
  Zap,
  X,
  Plus,
  Trash2,
  Users,
  Copy,
  UserCheck,
  Phone,
  Mail,
  Building,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  OFFER_EVENT_IDS,
  OFFER_PER_EVENT,
  OFFER_TOTAL,
  OFFER_NAME,
  getOtherOfferEvent,
  getOtherOfferEventName,
} from '@/lib/constants/avengersOffer';

type FlowStep = 'form_a' | 'form_b' | 'summary' | 'paying' | 'done';

interface TeamMember {
  name: string;
  phone: string;
  email: string;
  college: string;
}

interface FormData {
  teamName: string;
  lead: TeamMember;
  members: TeamMember[];
}

interface AvengersOfferFlowProps {
  isOpen: boolean;
  onClose: () => void;
  startingEventId: string;
  prefillData?: Partial<TeamMember>;
}

export function AvengersOfferFlow({
  isOpen,
  onClose,
  startingEventId,
  prefillData,
}: AvengersOfferFlowProps) {
  const searchParams = useSearchParams();
  const { userData } = useUser();
  const {
    markEventAsRegistered,
    markEventAsPending,
    setEventsData,
    eventsData,
  } = useEvents();
  const { initiatePayment } = useRazorpay();

  const otherEventId = getOtherOfferEvent(startingEventId);
  const eventA = eventsData.find(
    (e) => (e.id || e.event_id) === startingEventId
  );
  const eventB = eventsData.find((e) => (e.id || e.event_id) === otherEventId);

  const [step, setStep] = useState<FlowStep>('form_a');
  const [formA, setFormA] = useState<FormData>({
    teamName: '',
    lead: { name: '', phone: '', email: '', college: '' },
    members: [],
  });
  const [formB, setFormB] = useState<FormData>({
    teamName: '',
    lead: { name: '', phone: '', email: '', college: '' },
    members: [],
  });
  const [paymentProgress, setPaymentProgress] = useState<{
    a: 'pending' | 'done' | 'error';
    b: 'pending' | 'done' | 'error';
  }>({ a: 'pending', b: 'pending' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [tempMember, setTempMember] = useState<TeamMember>({
    name: '',
    phone: '',
    email: '',
    college: '',
  });
  const hasInitialized = useRef(false);

  // Pre-fill from user data - only when opening
  useEffect(() => {
    if (!isOpen) {
      hasInitialized.current = false;
      return;
    }
    if (hasInitialized.current) return;

    const leadDefaults: TeamMember = {
      name: prefillData?.name || userData?.name || '',
      phone: prefillData?.phone || userData?.phone || '',
      email: prefillData?.email || userData?.email || '',
      college: prefillData?.college || userData?.college || '',
    };
    const defaultForm: FormData = {
      teamName: '',
      lead: leadDefaults,
      members: [],
    };
    setFormA(defaultForm);
    setFormB(defaultForm);
    setStep('form_a');
    setPaymentProgress({ a: 'pending', b: 'pending' });
    hasInitialized.current = true;
  }, [isOpen, userData, prefillData]);

  // Stop Lenis when open
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).lenis) {
      if (isOpen) {
        (window as any).lenis.stop();
        document.body.style.overflow = 'hidden';
      } else {
        (window as any).lenis.start();
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof window !== 'undefined') document.body.style.overflow = '';
    };
  }, [isOpen]);

  const getRef = () =>
    searchParams?.get('ref') ||
    userData?.referral ||
    (typeof document !== 'undefined'
      ? document.cookie
          .split('; ')
          .find((r) => r.startsWith('tt_referral='))
          ?.split('=')[1]
      : null);

  const handleClose = useCallback(() => {
    if (isProcessing) return;
    setStep('form_a');
    onClose();
  }, [isProcessing, onClose]);

  const validateForm = (data: FormData, maxMembers: number): string | null => {
    if (!data.teamName.trim()) return 'Team Name is required';
    if (!data.lead.name.trim()) return 'Lead Name is required';

    // Clean phone number for validation
    const cleanLeadPhone = data.lead.phone.replace(/[^0-9]/g, '');
    if (cleanLeadPhone.length < 10)
      return 'Lead Phone must be at least 10 digits';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.lead.email))
      return 'Invalid Lead Email';
    if (!data.lead.college.trim()) return 'Lead College is required';

    for (let i = 0; i < data.members.length; i++) {
      const m = data.members[i];
      if (!m.name.trim()) return `Member ${i + 1} Name is required`;

      const cleanMemberPhone = m.phone.replace(/[^0-9]/g, '');
      if (cleanMemberPhone.length < 10)
        return `Member ${i + 1} Phone must be at least 10 digits`;

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email))
        return `Member ${i + 1} Invalid Email`;
      if (!m.college.trim()) return `Member ${i + 1} College is required`;
    }

    if (data.members.length + 1 > maxMembers)
      return `Max ${maxMembers} members allowed`;
    return null;
  };

  const handleFormASubmit = () => {
    const err = validateForm(formA, eventA?.max_team_size || 1);
    if (err) {
      toast.error(err);
      return;
    }
    setStep('form_b');
  };

  const handleFormBSubmit = () => {
    const err = validateForm(formB, eventB?.max_team_size || 1);
    if (err) {
      toast.error(err);
      return;
    }
    setStep('summary');
  };

  const copyFormAtoB = () => {
    setFormB({ ...formA });
    toast.success('Details copied from Event A');
  };

  // Poll check-offer-status to confirm Event A payment is committed
  const pollOfferStatus = async (
    eventId: string,
    maxAttempts = 3
  ): Promise<boolean> => {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      try {
        const res = await fetch(
          `/api/payments/check-offer-status?eventId=${eventId}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.otherRegistered) return true;
        }
      } catch {
        /* retry */
      }
    }
    return false;
  };

  const handlePay = async () => {
    if (!userData?.id) {
      toast.error('Please log in first');
      return;
    }
    setIsProcessing(true);
    setStep('paying');
    setPaymentProgress({ a: 'pending', b: 'pending' });

    try {
      // ── Step 1: Register BOTH events as pending first ──

      // Event A
      const teamIdA = await registerTeamWithParticipants({
        userId: String(userData.id),
        eventId: startingEventId,
        transactionId: '',
        teamName: formA.teamName,
        college: formA.lead.college,
        transactionScreenshot: '',
        teamLeadName: formA.lead.name,
        teamLeadPhone: formA.lead.phone,
        teamLeadEmail: formA.lead.email,
        teamMembers: formA.members,
        account_holder_name: formA.lead.name,
        paymentMode: 'RAZORPAY',
        regMode: 'ONLINE',
        ref: getRef() ?? null,
      });
      if (!teamIdA) throw new Error('Failed to register for Event A');
      markEventAsPending(startingEventId, teamIdA);

      // Event B
      const teamIdB = await registerTeamWithParticipants({
        userId: String(userData.id),
        eventId: otherEventId,
        transactionId: '',
        teamName: formB.teamName,
        college: formB.lead.college,
        transactionScreenshot: '',
        teamLeadName: formB.lead.name,
        teamLeadPhone: formB.lead.phone,
        teamLeadEmail: formB.lead.email,
        teamMembers: formB.members,
        account_holder_name: formB.lead.name,
        paymentMode: 'RAZORPAY',
        regMode: 'ONLINE',
        ref: getRef() ?? null,
      });
      if (!teamIdB) throw new Error('Failed to register for Event B');
      markEventAsPending(otherEventId, teamIdB);

      // ── Step 2: Trigger payments sequentially ──

      // Pay A - Full Price (₹50) to trigger bundle logic
      const resultA = await initiatePayment({
        eventId: startingEventId,
        teamId: teamIdA,
        userName: formA.lead.name,
        userEmail: formA.lead.email,
        userPhone: formA.lead.phone,
        offerOptIn: false, // Charge ₹50
      });

      if (!resultA.success) {
        setPaymentProgress((p) => ({ ...p, a: 'error' }));
        toast.error(
          'Event A payment failed: ' + (resultA.error || 'Unknown error')
        );
        handleClose();
        return;
      }
      setPaymentProgress((p) => ({ ...p, a: 'done' }));
      markEventAsRegistered(startingEventId);

      // Wait for verified status to commit (backend sync)
      await pollOfferStatus(otherEventId);

      // Pay B
      const resultB = await initiatePayment({
        eventId: otherEventId,
        teamId: teamIdB,
        userName: formB.lead.name,
        userEmail: formB.lead.email,
        userPhone: formB.lead.phone,
        offerOptIn: true,
      });

      if (!resultB.success) {
        setPaymentProgress((p) => ({ ...p, b: 'error' }));
        toast.error(
          'Event B payment failed: ' + (resultB.error || 'Unknown error')
        );
        handleClose();
        return;
      }
      setPaymentProgress((p) => ({ ...p, b: 'done' }));
      markEventAsRegistered(otherEventId);
      setEventsData(true);

      // ── Success ──
      setStep('done');
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (error) {
      console.error('[AvengersOfferFlow] Error:', error);
      toast.error('Registration failed. Please try again.');
      handleClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  const renderMemberFields = (
    data: FormData,
    setData: (d: FormData) => void,
    maxMembers: number
  ) => {
    if (isAddingMember) {
      return (
        <div className="space-y-4 px-1 py-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white text-sm font-['Metal_Mania'] tracking-wider">
              ADD NEW MEMBER
            </h3>
            <button
              onClick={() => setIsAddingMember(false)}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-white/60 text-[10px] uppercase tracking-wider pl-1 font-bold">
              MEMBER NAME
            </label>
            <input
              value={tempMember.name}
              onChange={(e) =>
                setTempMember({ ...tempMember, name: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 focus:outline-none text-white rounded-lg p-3 text-sm transition-all duration-300 placeholder:text-white/20"
              placeholder="Full Name"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-white/60 text-[10px] uppercase tracking-wider pl-1 font-bold">
              PHONE
            </label>
            <input
              value={tempMember.phone}
              onChange={(e) =>
                setTempMember({ ...tempMember, phone: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 focus:outline-none text-white rounded-lg p-3 text-sm transition-all duration-300 placeholder:text-white/20"
              placeholder="Phone Number"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-white/60 text-[10px] uppercase tracking-wider pl-1 font-bold">
              EMAIL
            </label>
            <input
              value={tempMember.email}
              onChange={(e) =>
                setTempMember({ ...tempMember, email: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 focus:outline-none text-white rounded-lg p-3 text-sm transition-all duration-300 placeholder:text-white/20"
              placeholder="Email Address"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-white/60 text-[10px] uppercase tracking-wider pl-1 font-bold">
              COLLEGE
            </label>
            <input
              value={tempMember.college}
              onChange={(e) =>
                setTempMember({ ...tempMember, college: e.target.value })
              }
              className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 focus:outline-none text-white rounded-lg p-3 text-sm transition-all duration-300 placeholder:text-white/20"
              placeholder="College Name"
            />
          </div>

          <Button
            onClick={() => {
              if (!tempMember.name || !tempMember.phone || !tempMember.email) {
                toast.error('Please fill in all member details');
                return;
              }
              if (
                tempMember.email.toLowerCase() === data.lead.email.toLowerCase()
              ) {
                toast.error(
                  'You are already the Team Lead. Add a different member.'
                );
                return;
              }
              setData({ ...data, members: [...data.members, tempMember] });
              setIsAddingMember(false);
              setTempMember({
                name: '',
                phone: '',
                email: '',
                college: data.lead.college,
              });
            }}
            className="w-full mt-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full py-6 transition-all"
          >
            <span>ADD MEMBER</span>
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4 px-1">
        {/* Team Name */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider pl-1 font-bold">
            <Users size={14} />
            <span>TEAM NAME</span>
          </label>
          <div className="relative group">
            <input
              value={data.teamName}
              onChange={(e) => setData({ ...data, teamName: e.target.value })}
              className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 focus:outline-none text-white rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 placeholder:text-white/20"
              placeholder="Enter team name"
            />
            <Users
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
          </div>
        </div>

        {/* Lead Info (Visual only) */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5">
            <UserCheck size={16} className="text-yellow-400" />
            <div>
              <p className="text-white text-sm font-medium">{data.lead.name}</p>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">
                TEAM LEAD
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 opacity-60">
            <div className="flex items-center gap-2 text-[11px] text-white/60">
              <Phone size={12} /> {data.lead.phone}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-white/60 truncate">
              <Mail size={12} /> {data.lead.email}
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 text-white/50 text-[10px] uppercase tracking-wider font-bold">
              <Users size={12} />
              <span>
                TEAMMATES ({data.members.length}/{maxMembers - 1})
              </span>
            </label>
            {data.members.length + 1 < maxMembers && (
              <button
                onClick={() => {
                  setTempMember({
                    name: '',
                    phone: '',
                    email: '',
                    college: data.lead.college,
                  });
                  setIsAddingMember(true);
                }}
                className="bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 text-[10px] px-3 py-1 rounded-full border border-yellow-400/20 transition-all flex items-center gap-1"
              >
                <Plus size={10} /> ADD TEAMMATE
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            {data.members.map((member, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 group transition-all hover:bg-white/[0.07]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-white/40 font-bold">
                    {idx + 2}
                  </div>
                  <div>
                    <p className="text-white text-xs font-medium">
                      {member.name}
                    </p>
                    <p className="text-white/40 text-[9px] uppercase tracking-tighter">
                      {member.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setData({
                      ...data,
                      members: data.members.filter((_, i) => i !== idx),
                    })
                  }
                  className="text-white/20 hover:text-red-400 transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {data.members.length === 0 && (
              <div className="text-center py-6 border border-dashed border-white/5 rounded-xl">
                <Users size={20} className="mx-auto text-white/10 mb-2" />
                <p className="text-white/20 text-[9px] uppercase tracking-widest font-bold">
                  No teammates added
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const eventAName = eventA?.name || 'Event A';
  const eventBName = eventB?.name || getOtherOfferEventName(startingEventId);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !isProcessing && (open ? null : handleClose())}
      modal={!isProcessing}
    >
      <DialogContent className="sm:max-w-[480px] bg-black/90 backdrop-blur-xl border border-white/20 p-6 sm:p-8 shadow-2xl rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle
            className="text-center text-white text-xl tracking-widest"
            style={{ fontFamily: "'Metal Mania'" }}
          >
            <span className="text-transparent bg-clip-text bg-linear-to-r from-red-400 to-yellow-400">
              {OFFER_NAME}
            </span>
          </DialogTitle>
          {/* Step indicators */}
          <div className="flex justify-center mt-3 gap-2">
            {['form_a', 'form_b', 'summary', 'paying', 'done'].map((s, i) => (
              <div
                key={s}
                className={`w-1.5 h-1.5 rounded-full transition-all ${step === s ? 'bg-yellow-400 w-4' : 'bg-white/15'}`}
              />
            ))}
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* ── FORM A ── */}
          {step === 'form_a' && (
            <motion.div
              key="form_a"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[10px] text-red-400 font-bold">
                    1
                  </div>
                  <span
                    className="text-white/70 text-sm"
                    style={{ fontFamily: "'Maname', serif" }}
                  >
                    {eventAName}
                  </span>
                </div>
                <span className="text-[10px] text-white/30 uppercase tracking-tighter">
                  Team Registration
                </span>
              </div>
              {renderMemberFields(formA, setFormA, eventA?.max_team_size || 3)}
              <div className="flex justify-between mt-6 pt-2">
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="text-white/40 hover:text-white rounded-full px-4"
                >
                  <X size={14} className="mr-1" />
                  Cancel
                </Button>
                <Button
                  onClick={handleFormASubmit}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full px-5 group"
                >
                  Next{' '}
                  <ArrowRight
                    size={14}
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── FORM B ── */}
          {step === 'form_b' && (
            <motion.div
              key="form_b"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center text-[10px] text-yellow-400 font-bold">
                    2
                  </div>
                  <span
                    className="text-white/70 text-sm"
                    style={{ fontFamily: "'Maname', serif" }}
                  >
                    {eventBName}
                  </span>
                </div>
                <button
                  onClick={copyFormAtoB}
                  className="flex items-center gap-1 text-[10px] text-yellow-400/60 hover:text-yellow-400 transition-colors"
                >
                  <Copy size={10} /> Copy Details
                </button>
              </div>
              {renderMemberFields(formB, setFormB, eventB?.max_team_size || 3)}
              <div className="flex justify-between mt-6 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setStep('form_a')}
                  className="text-white/40 hover:text-white rounded-full px-4"
                >
                  <ArrowLeft size={14} className="mr-1" />
                  Back
                </Button>
                <Button
                  onClick={handleFormBSubmit}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full px-5 group"
                >
                  Review{' '}
                  <ArrowRight
                    size={14}
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── SUMMARY ── */}
          {step === 'summary' && (
            <motion.div
              key="summary"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="space-y-4 mb-6">
                {[
                  {
                    label: eventAName,
                    data: formA,
                    color: 'from-red-400 to-orange-400',
                  },
                  {
                    label: eventBName,
                    data: formB,
                    color: 'from-blue-400 to-indigo-400',
                  },
                ].map(({ label, data, color }, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden p-4 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div
                      className={`absolute top-0 left-0 w-1 h-full bg-linear-to-b ${color}`}
                    />
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-0.5">
                          {label}
                        </p>
                        <h4 className="text-white text-base font-bold tracking-tight">
                          {data.teamName}
                        </h4>
                      </div>
                      <div
                        className="bg-white/10 px-2 py-1 rounded-md flex items-center gap-1.5"
                        title="Total Team Size"
                      >
                        <Users size={12} className="text-white/40" />
                        <span className="text-white text-xs">
                          {data.members.length + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-white/50 text-xs">
                      <div className="flex items-center gap-1">
                        <UserCheck size={12} /> {data.lead.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail size={12} /> {data.lead.email.split('@')[0]}...
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-5 text-center">
                <div className="flex items-center justify-center gap-3 mb-1">
                  <span className="text-white/30 line-through text-lg">
                    ₹100
                  </span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-400">
                    ₹{OFFER_TOTAL}
                  </span>
                  <span className="text-[9px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30 uppercase tracking-wider">
                    50% Off
                  </span>
                </div>
                {(() => {
                  const { gatewayFee, totalAmount } =
                    calculateGatewayFee(OFFER_TOTAL);
                  return (
                    <p className="text-white/30 text-[10px]">
                      ₹{OFFER_TOTAL} + ₹{gatewayFee} gateway = ₹{totalAmount}{' '}
                      total
                    </p>
                  );
                })()}
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handlePay}
                  className="w-full py-5 bg-linear-to-r from-red-600 to-yellow-500 hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] text-white font-bold rounded-full flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Zap
                    size={16}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  <span style={{ fontFamily: "'Metal Mania'" }}>
                    ASSEMBLE & PAY
                  </span>
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setStep('form_b')}
                  className="text-white/30 hover:text-white/60 rounded-full text-xs"
                >
                  <ArrowLeft size={12} className="mr-1" />
                  Back to Edit
                </Button>
              </div>
            </motion.div>
          )}

          {/* ── PAYING ── */}
          {step === 'paying' && (
            <motion.div
              key="paying"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="py-6"
            >
              <div className="space-y-4">
                <div
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all ${paymentProgress.a === 'done' ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${paymentProgress.a === 'done' ? 'bg-green-500/20' : 'bg-yellow-500/10'}`}
                  >
                    {paymentProgress.a === 'done' ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-white font-bold text-sm">
                        Bundle Payment
                      </p>
                      <span className="text-yellow-400 text-xs font-bold font-mono">
                        ₹{calculateGatewayFee(OFFER_TOTAL).totalAmount}
                      </span>
                    </div>
                    <p className="text-white/30 text-[10px] uppercase tracking-wider mt-0.5">
                      {paymentProgress.a === 'done'
                        ? 'Verified Successfully'
                        : 'Awaiting Razorpay Checkout'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 opacity-50">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/5">
                    {paymentProgress.b === 'done' ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Zap size={14} className="text-white/20" />
                    )}
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">{eventBName}</p>
                    <p className="text-white/30 text-[9px] uppercase tracking-tighter">
                      {paymentProgress.b === 'done'
                        ? 'Added to Account'
                        : 'Qualifies as Free after payment'}
                    </p>
                  </div>
                </div>
              </div>
              {paymentProgress.a !== 'done' && (
                <p className="text-center text-white/20 text-[10px] mt-6 animate-pulse">
                  Please complete the payment popup to proceed
                </p>
              )}
            </motion.div>
          )}

          {/* ── DONE ── */}
          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center py-8"
            >
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mb-5">
                <Check size={32} className="text-green-400" />
              </div>
              <h2
                className="text-2xl text-white mb-2 tracking-wide"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                Avengers Assembled!
              </h2>
              <p className="text-white/50 text-sm text-center mb-1">
                You're registered for both events.
              </p>
              <p className="text-yellow-400 text-xs mb-6">
                You saved ₹{100 - OFFER_TOTAL}!
              </p>
              <Button
                onClick={handleClose}
                className="bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full px-6"
              >
                <X size={14} className="mr-1" />
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
