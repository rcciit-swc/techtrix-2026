'use client';

import { useRazorpay } from '@/hooks/useRazorpay';
import { CURRENT_FEST_ID } from '@/lib/constants/fests';
import { getEventWhatsAppLink } from '@/lib/constants/whatsapp';
import { login } from '@/lib/services/auth';
import {
  ExistingTeamData,
  getMyRegistrations,
  getPaymentStatus,
} from '@/lib/services/register';
import { checkAllMembersSWC } from '@/lib/services/user';
import { useUser } from '@/lib/stores';
import { events } from '@/lib/types/events';
import { motion } from 'framer-motion';
import { Copy, Link2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FindTeammatesModal } from './FindTeammatesModal';
import { JoinTeamModal } from './JoinTeamModal';
import { PaymentLoadingOverlay } from './PaymentLoadingOverlay';
import { SoloEventRegistration } from './SoloRegistrationDialog';
import { TeamDetailsModal } from './TeamDetailsModal';
import { TeamEventRegistration } from './TeamEventRegistration';

interface RegisterButtonProps {
  eventId: string;
  event: events;
}

export default function RegisterButton({
  eventId,
  event,
}: RegisterButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userData, userLoading, swcData } = useUser();
  const { initiatePayment, isProcessing, isLoading, isVerifying } =
    useRazorpay();

  const [isSoloOpen, setIsSoloOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isFindTeammatesOpen, setIsFindTeammatesOpen] = useState(false);
  const [findTeammatesIntent, setFindTeammatesIntent] = useState<
    'waitlist' | 'open_team'
  >('waitlist');
  const [registerAndPostFn, setRegisterAndPostFn] = useState<
    (() => Promise<void>) | undefined
  >(undefined);
  const [isJoinTeamOpen, setIsJoinTeamOpen] = useState(false);
  const [isTeamDetailsOpen, setIsTeamDetailsOpen] = useState(false);
  const [isEditingExistingTeam, setIsEditingExistingTeam] = useState(false);

  // Local registration state — sourced exclusively from get_my_registrations_by_fest
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredTeamId, setRegisteredTeamId] = useState<string | null>(null);
  const [txVerified, setTxVerified] = useState<string | null>(null);

  // Team details
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [teamStatus, setTeamStatus] = useState<
    'pending' | 'active' | 'closed' | null
  >(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [teamMemberCount, setTeamMemberCount] = useState<number>(1);
  const [teamLeadId, setTeamLeadId] = useState<string | null>(null);
  const [existingTeamData, setExistingTeamData] =
    useState<ExistingTeamData | null>(null);
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);
  const [allMembersSWCCleared, setAllMembersSWCCleared] = useState<
    boolean | null
  >(null);

  const isTeamEvent = (event.max_team_size ?? 1) > 1;

  const isSWCPaid = !!swcData;
  const SWC_FREE_CATEGORY_IDS = [
    'fb17b092-1622-4a3d-90a9-650fd860f6a0',
    '441aa4ca-49ad-4b57-bb7f-6a1c5cc63a32',
    'a8609025-6132-4d69-8c61-3313ef082db4',
  ];
  const isSWCFreeCategory = SWC_FREE_CATEGORY_IDS.includes(
    event.event_category_id ?? ''
  );
  // For team events: free only if ALL members have SWC cleared.
  // For solo events: only the current user needs SWC.
  const isEligibleForSWCFree =
    isSWCPaid &&
    isSWCFreeCategory &&
    (!isTeamEvent || allMembersSWCCleared === true);
  const effectiveFees = isEligibleForSWCFree
    ? 0
    : (event.registration_fees ?? 0);

  // For free team events: registered only when team is closed. Paid events: payment is the gate.
  const isFullyRegistered =
    isRegistered &&
    (!!txVerified ||
      isPaymentVerified ||
      (effectiveFees === 0 && (!isTeamEvent || teamStatus === 'closed')));

  // Default true (teamLeadId null = not loaded yet, treat as lead to avoid wrong participant UI)
  const isLead = !teamLeadId || teamLeadId === userData?.id;

  const isAwaitingMembers =
    isTeamEvent &&
    (teamStatus === 'pending' || teamStatus === 'active') &&
    !!registeredTeamId;

  const isPendingPayment =
    isRegistered &&
    !isFullyRegistered &&
    !!registeredTeamId &&
    (!isTeamEvent ? true : teamStatus === 'closed');

  // Helper: build ExistingTeamData from a MyRegistration row
  const buildExistingTeamData = (
    reg: Awaited<ReturnType<typeof getMyRegistrations>>[number]
  ): ExistingTeamData => ({
    team_id: reg.team_id,
    team_name: reg.team_name,
    team_status: reg.team_status,
    invite_code: reg.invite_code,
    team_lead_id: reg.is_lead ? (userData?.id ?? '') : '',
    team_lead_email: reg.team_lead_email,
    team_lead_name: reg.team_lead_name,
    team_lead_phone: reg.team_lead_phone,
    college: reg.college,
    is_team: reg.max_team_size > 1,
    referral_code: null,
    reg_mode: reg.reg_mode,
    payment_mode: reg.payment_mode,
    account_holder_name: null,
    attendance: false,
    registered_at: reg.registered_at,
    transaction_id: reg.transaction_id,
    transaction_screenshot: reg.transaction_screenshot,
    transaction_verified: reg.transaction_verified,
    verification_mail_sent: null,
    member_count: reg.member_count,
    participants: reg.participants.map((p) => ({
      name: p.name,
      phone: p.phone ?? null,
      email: p.email,
      college: p.college ?? null,
      extras: null,
    })),
  });

  // Fetch fresh registration data — single source of truth for all registration state
  useEffect(() => {
    if (!userData?.id) return;
    getMyRegistrations(CURRENT_FEST_ID, userData.id).then((registrations) => {
      const reg = registrations.find((r) => r.event_id === eventId);
      if (!reg) return;

      setIsRegistered(true);
      setRegisteredTeamId(reg.team_id);
      setTeamStatus(reg.team_status);
      setInviteCode(reg.invite_code);
      setTeamName(reg.team_name);
      setTeamMemberCount(reg.member_count);
      setTeamLeadId(reg.is_lead ? userData.id : '__not_lead__');

      if (reg.payment_verified_at || reg.payment_status === 'paid') {
        setIsPaymentVerified(true);
        setTxVerified(reg.payment_verified_at ?? reg.transaction_verified);
      } else if (reg.transaction_verified) {
        setTxVerified(reg.transaction_verified);
      }

      setExistingTeamData(buildExistingTeamData(reg));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id, eventId]);

  // For team events in an SWC free category: check that every participant has SWC cleared.
  // Runs when team closes (all members joined) so participant list is complete.
  useEffect(() => {
    if (!isTeamEvent || !isSWCFreeCategory || teamStatus !== 'closed') return;
    if (!existingTeamData?.participants?.length) return;

    const emails = existingTeamData.participants
      .map((p) => p.email)
      .filter((e): e is string => !!e);

    checkAllMembersSWC(emails).then(setAllMembersSWCCleared);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    teamStatus,
    existingTeamData?.participants?.length,
    isSWCFreeCategory,
    isTeamEvent,
  ]);

  // Re-check payment when team is closed — catches payments made by other team members.
  // Also fires on tab focus so the lead sees the correct state without a refresh.
  useEffect(() => {
    if (teamStatus !== 'closed' || !registeredTeamId) return;

    const check = async () => {
      const payment = await getPaymentStatus(registeredTeamId);
      if (payment.status === 'paid') {
        setIsPaymentVerified(true);
        setTxVerified(payment.verified_at ?? new Date().toISOString());
      }
    };

    check();

    const handleVisibility = () => {
      if (!document.hidden) check();
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamStatus, registeredTeamId]);

  const SHUTTERSCAPE_EVENT_ID = '49c435f3-ddca-412b-bb9a-b652af49315e';
  const SHUTTERSCAPE_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSd4VjRSB1kp0NTcSKPwFQRG6J2l9YK-sc5jc1GO50JipbNUjQ/viewform';
  const UNSTOP_EVENT_ID = '1b0af2ef-1101-4f43-8061-3ac42db45167';
  const UNSTOP_FORM_URL =
    'https://unstop.com/o/vGiOo53?lb=N84Gpz8e&utm_medium=Share&utm_source=techt2024854&utm_campaign=Competitions';

  const isShutterscape = eventId === SHUTTERSCAPE_EVENT_ID;
  const isUnstopEvent = eventId === UNSTOP_EVENT_ID;

  const openShuttercapeForm = () => {
    if (isShutterscape) window.open(SHUTTERSCAPE_FORM_URL, '_blank');
  };

  const handleRegister = async () => {
    if (isUnstopEvent) {
      window.open(UNSTOP_FORM_URL, '_blank');
      return;
    }
    if (isShutterscape) {
      window.open(SHUTTERSCAPE_FORM_URL, '_blank');
      return;
    }
    if (userLoading) {
      toast.info('Please wait while we check your login status');
      return;
    }
    if (!userData) {
      await login();
      return;
    }
    if (
      !userData.phone ||
      !userData.name ||
      userData.phone.trim() === '' ||
      userData.name.trim() === ''
    ) {
      const currentRef = searchParams?.get('ref');
      const callbackPath = `/event/${event.id}${currentRef ? `?ref=${currentRef}` : ''}`;
      router.push(
        `/profile?onboarding=true&next=${encodeURIComponent(callbackPath)}`
      );
      return;
    }
    if (event.max_team_size === 1) {
      setIsSoloOpen(true);
    } else {
      setIsTeamOpen(true);
    }
  };

  const handleCompletePayment = async () => {
    if (!userData || !registeredTeamId) return;
    // Guard: another team member may have already paid
    const existingPayment = await getPaymentStatus(registeredTeamId);
    if (existingPayment.status === 'paid') {
      setIsPaymentVerified(true);
      setTxVerified(existingPayment.verified_at ?? new Date().toISOString());
      toast.info('Payment was already completed by a team member!');
      return;
    }
    try {
      const result = await initiatePayment({
        eventId: event.id || '',
        teamId: registeredTeamId,
        userName: userData.name || '',
        userEmail: userData.email || '',
        userPhone: userData.phone || '',
      });
      if (result.success) {
        setIsPaymentVerified(true);
        setTxVerified(new Date().toISOString());
        toast.success('Payment successful! Registration confirmed.');
        openShuttercapeForm();
      } else if (result.error !== 'Payment cancelled') {
        toast.error(result.error || 'Payment failed. Please try again.');
      }
    } catch {
      toast.error('Payment failed. Please try again.');
    }
  };

  const copyInviteCode = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    toast.success('Invite code copied!');
  };

  const renderButton = () => {
    if (!event.reg_status) {
      return (
        <motion.button
          whileHover={{ scale: 1.02 }}
          animate={{
            boxShadow: [
              '0 8px 16px rgba(239,68,68,0.3)',
              '0 10px 24px rgba(239,68,68,0.5)',
              '0 8px 16px rgba(239,68,68,0.3)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
          type="button"
          disabled
          className="relative px-4 py-1.5 sm:px-7 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 text-[12px] sm:text-[16px] md:text-[18px] cursor-not-allowed font-['Metal_Mania'] rounded-[50px] border-2 border-red-500/50 overflow-hidden opacity-75"
        >
          <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔒
            </motion.span>
            Register Soon
          </span>
          <motion.div
            className="absolute inset-0 rounded-[50px] border-2 border-red-500"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      );
    }

    // Fully registered must be checked before awaiting-members —
    // payment completion overrides team status in all cases
    if (isFullyRegistered) {
      const whatsappLink = getEventWhatsAppLink(eventId);

      if (whatsappLink) {
        return (
          <div className="flex items-stretch rounded-[50px] overflow-hidden border-2 border-[#25D366]/50 shadow-[0_10px_20px_rgba(37,211,102,0.3)]">
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center pl-5 pr-3 sm:pl-6 sm:pr-4 bg-[#25D366] text-white cursor-pointer border-r border-white/20"
            >
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[22px] sm:text-2xl"
              >
                💬
              </motion.span>
            </motion.a>
            <div className="flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-[#4FC879] to-[#1E8A4A] text-white text-[16px] sm:text-[18px] font-['Metal_Mania']">
              Registered
            </div>
          </div>
        );
      }

      return (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
          animate={{
            boxShadow: [
              '0 8px 16px rgba(34,197,94,0.3)',
              '0 10px 24px rgba(34,197,94,0.4)',
              '0 8px 16px rgba(34,197,94,0.3)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          type="button"
          disabled
          className="relative px-4 py-1.5 sm:px-7 sm:py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-[12px] sm:text-[16px] md:text-[18px] cursor-not-allowed font-['Metal_Mania'] rounded-[50px] border-2 border-emerald-400/50 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✓
            </motion.span>
            Already Registered
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/20 to-emerald-400/0"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.button>
      );
    }

    // Awaiting min members before payment can proceed
    if (isAwaitingMembers) {
      return (
        <div className="flex flex-col items-end gap-1.5">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            animate={{
              boxShadow: [
                '0 8px 16px rgba(234,179,8,0.3)',
                '0 12px 28px rgba(234,179,8,0.55)',
                '0 8px 16px rgba(234,179,8,0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            type="button"
            onClick={() => setIsTeamDetailsOpen(true)}
            className="relative px-4 py-1.5 sm:px-6 sm:py-2.5 bg-gradient-to-r from-yellow-600 to-yellow-700 text-black text-[11px] sm:text-[14px] cursor-pointer font-['Metal_Mania'] rounded-[50px] border-2 border-yellow-400/50 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-1.5 whitespace-nowrap">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ⏳
              </motion.span>
              {isLead ? 'Invite Members' : 'Awaiting Members'}
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-yellow-300/20 to-yellow-300/0"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
          </motion.button>

          {/* Invite code + share link strip */}
          {inviteCode && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={copyInviteCode}
                className="flex items-center gap-1.5 text-[10px] text-white/40 hover:text-white/80 transition-colors bg-white/5 rounded-full px-3 py-1 border border-white/10 hover:border-white/20"
              >
                <span className="font-mono tracking-wider">{inviteCode}</span>
                <Copy size={10} />
              </button>
              <button
                onClick={() => {
                  const link = `${window.location.origin}/event/${eventId}?inv_code=${inviteCode}`;
                  navigator.clipboard.writeText(link);
                  toast.success('Invite link copied!');
                }}
                className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/70 transition-colors bg-white/5 rounded-full px-2.5 py-1 border border-white/10 hover:border-white/20"
                title="Copy shareable link"
              >
                <Link2 size={10} />
              </button>
            </div>
          )}
        </div>
      );
    }

    // Payment pending
    if (isPendingPayment) {
      return (
        <motion.button
          whileHover={{
            scale: 1.08,
            y: -3,
            boxShadow: '0 15px 35px rgba(204,168,85,0.6)',
          }}
          whileTap={{ scale: 0.96 }}
          animate={{
            boxShadow: [
              '0 10px 20px rgba(204,168,85,0.3)',
              '0 12px 30px rgba(204,168,85,0.5)',
              '0 10px 20px rgba(204,168,85,0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          type="button"
          onClick={handleCompletePayment}
          disabled={isProcessing || isLoading}
          className="relative px-4 py-1.5 sm:px-7 sm:py-3 bg-gradient-to-r from-[#CCA855] to-[#a8892e] text-black text-[12px] sm:text-[16px] md:text-[18px] cursor-pointer font-['Metal_Mania'] rounded-[50px] border-2 border-[#CCA855]/50 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
            {isProcessing || isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <motion.span
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  💳
                </motion.span>
                Complete Payment
              </>
            )}
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#CCA855]/0 via-white/20 to-[#CCA855]/0"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.button>
      );
    }

    // Not registered — Register Now + secondary team actions
    return (
      <div className="flex flex-col items-end gap-1.5">
        <motion.button
          whileHover={{
            scale: 1.08,
            y: -3,
            boxShadow: '0 15px 35px rgba(182,3,2,0.6)',
          }}
          whileTap={{ scale: 0.96 }}
          animate={{
            boxShadow: [
              '0 10px 20px rgba(182,3,2,0.3)',
              '0 12px 30px rgba(182,3,2,0.5)',
              '0 10px 20px rgba(182,3,2,0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          type="button"
          onClick={handleRegister}
          className="relative px-4 py-1.5 sm:px-7 sm:py-3 bg-gradient-to-r from-[#B60302] to-[#8f0202] text-[#FAFAFA] text-[12px] sm:text-[16px] md:text-[18px] cursor-pointer font-['Metal_Mania'] rounded-[50px] border-2 border-[#FF003C]/30 overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
            Register Now
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#FF003C]/0 via-[#FF003C]/20 to-[#FF003C]/0"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.button>

        {/* Secondary actions for team events */}
        {isTeamEvent && !isUnstopEvent && !isShutterscape && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFindTeammatesOpen(true)}
              className="text-[11px] font-sans text-white/70 hover:text-white bg-white/8 hover:bg-white/12 border border-white/20 hover:border-white/35 rounded-full px-3 py-1 transition-all"
            >
              Find Teammates
            </button>
            <button
              onClick={() => setIsJoinTeamOpen(true)}
              className="text-[11px] font-sans text-white/70 hover:text-white bg-white/8 hover:bg-white/12 border border-white/20 hover:border-white/35 rounded-full px-3 py-1 transition-all"
            >
              Join a Team
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {renderButton()}

      {(isLoading || isVerifying) && (
        <PaymentLoadingOverlay
          phase={isVerifying ? 'verifying-payment' : 'creating-order'}
        />
      )}

      <SoloEventRegistration
        isOpen={isSoloOpen}
        onClose={() => setIsSoloOpen(false)}
        eventName={event.name || ''}
        eventID={event.id || ''}
        eventFees={effectiveFees}
        onRegistrationComplete={openShuttercapeForm}
      />

      <TeamEventRegistration
        isOpen={isTeamOpen}
        onClose={() => {
          setIsTeamOpen(false);
          setIsEditingExistingTeam(false);
        }}
        eventName={event.name || ''}
        minTeamSize={event.min_team_size || 1}
        maxTeamSize={event.max_team_size || 1}
        eventID={event.id || ''}
        eventFees={effectiveFees}
        onRegistrationComplete={openShuttercapeForm}
        onRegistrationWithInviteCode={(code, status) => {
          setInviteCode(code);
          setTeamStatus(status);
          setExistingTeamData((prev) =>
            prev ? { ...prev, invite_code: code, team_status: status } : prev
          );
          // Re-fetch from DB to get the full fresh team data
          if (userData?.id) {
            getMyRegistrations(CURRENT_FEST_ID, userData.id).then(
              (registrations) => {
                const reg = registrations.find((r) => r.event_id === eventId);
                if (reg) {
                  setIsRegistered(true);
                  setRegisteredTeamId(reg.team_id);
                  setExistingTeamData(buildExistingTeamData(reg));
                }
              }
            );
          }
        }}
        onOpenFindTeammates={(intent, registerAndPost) => {
          setFindTeammatesIntent(intent);
          setRegisterAndPostFn(
            registerAndPost ? () => registerAndPost : undefined
          );
          setIsFindTeammatesOpen(true);
        }}
        initialData={
          isEditingExistingTeam ? (existingTeamData ?? undefined) : undefined
        }
      />

      <FindTeammatesModal
        isOpen={isFindTeammatesOpen}
        onClose={() => setIsFindTeammatesOpen(false)}
        eventId={eventId}
        eventName={event.name || ''}
        registeredTeamId={registeredTeamId ?? undefined}
        registeredTeamName={teamName}
        teamStatus={teamStatus}
        maxTeamSize={event.max_team_size}
        currentMemberCount={teamMemberCount}
        defaultTab={
          findTeammatesIntent === 'open_team' ? 'open_teams' : 'looking'
        }
        hideWaitlist={findTeammatesIntent === 'open_team'}
        onRegisterAndPost={
          registerAndPostFn
            ? async () => {
                await registerAndPostFn();
                setIsFindTeammatesOpen(false);
                setIsTeamOpen(false);
              }
            : undefined
        }
      />

      <JoinTeamModal
        isOpen={isJoinTeamOpen}
        onClose={() => setIsJoinTeamOpen(false)}
        onSuccess={() => {
          if (!userData?.id) return;
          getMyRegistrations(CURRENT_FEST_ID, userData.id).then(
            (registrations) => {
              const reg = registrations.find((r) => r.event_id === eventId);
              if (!reg) return;
              setIsRegistered(true);
              setRegisteredTeamId(reg.team_id);
              setTeamStatus(reg.team_status);
              setInviteCode(reg.invite_code);
              setTeamName(reg.team_name);
              setTeamMemberCount(reg.member_count);
              setTeamLeadId(reg.is_lead ? userData.id : '__not_lead__');
              if (reg.payment_verified_at || reg.payment_status === 'paid') {
                setIsPaymentVerified(true);
                setTxVerified(
                  reg.payment_verified_at ?? reg.transaction_verified
                );
              } else if (reg.transaction_verified) {
                setTxVerified(reg.transaction_verified);
              }
              setExistingTeamData(buildExistingTeamData(reg));
            }
          );
        }}
      />

      {existingTeamData && (
        <TeamDetailsModal
          isOpen={isTeamDetailsOpen}
          onClose={() => setIsTeamDetailsOpen(false)}
          teamData={existingTeamData}
          eventId={eventId}
          onEdit={
            isLead
              ? () => {
                  setIsTeamDetailsOpen(false);
                  setIsEditingExistingTeam(true);
                  setIsTeamOpen(true);
                }
              : undefined
          }
          onFindMembers={
            isLead
              ? () => {
                  setFindTeammatesIntent('open_team');
                  setIsFindTeammatesOpen(true);
                }
              : undefined
          }
        />
      )}
    </>
  );
}
