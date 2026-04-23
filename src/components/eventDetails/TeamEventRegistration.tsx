'use client';

import { ViewTeamMembers } from '@/components/eventDetails/ViewTeamMembers';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRazorpay } from '@/hooks/useRazorpay';
import { postOpenTeam } from '@/lib/services/discovery';
import { verifySWCStudent } from '@/lib/actions/swc';
import {
  createTeamDirect,
  ExistingTeamData,
  finalizeTeamRegistration,
  RegisterTeamParams,
  registerTeamWithParticipants,
  updateExistingTeam,
} from '@/lib/services/register';
import { useEvents, useUser } from '@/lib/stores';
import { calculateGatewayFee } from '@/lib/utils/razorpay';
import { zodResolver } from '@hookform/resolvers/zod';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Check,
  Copy,
  CreditCard,
  Eye,
  Link2,
  Loader2,
  Mail,
  Pencil,
  Phone,
  Plus,
  User,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface EventRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  minTeamSize: number; // includes team lead
  maxTeamSize: number;
  eventID: string;
  eventFees: number;
  onRegistrationComplete?: () => void;
  onRegistrationWithInviteCode?: (
    inviteCode: string,
    teamStatus: 'pending' | 'active' | 'closed'
  ) => void;
  onPaymentPhaseChange?: (
    phase: 'creating-order' | 'verifying-payment' | null
  ) => void;
  onOpenFindTeammates?: (
    intent: 'waitlist' | 'open_team',
    registerAndPost?: () => Promise<void>
  ) => void;
  initialData?: ExistingTeamData;
}

// Zod schema for the Team Lead (Step 1)
const teamLeadSchema = z.object({
  teamName: z.string().min(1, 'Team name is required'),
  name: z.string().min(1, 'Team lead name is required'),
  phone: z.string().min(1, 'Team lead phone is required'),
  email: z.string().email('Invalid email'),
  collegeName: z.string().min(1, 'College name is required'),
  extras: z.record(z.string(), z.any()).optional(),
});
type TeamLeadFormValues = z.infer<typeof teamLeadSchema>;

export function TeamEventRegistration({
  isOpen,
  onClose,
  eventName,
  minTeamSize,
  maxTeamSize,
  eventID,
  eventFees,
  onRegistrationComplete,
  onRegistrationWithInviteCode,
  onPaymentPhaseChange,
  onOpenFindTeammates,
  initialData,
}: EventRegistrationDialogProps) {
  const searchParams = useSearchParams();
  const { userData } = useUser();
  const {
    markEventAsRegistered,
    markEventAsPending,
    setEventsData,
    eventsData,
  } = useEvents();

  const eventData = useMemo(
    () =>
      eventsData?.find(
        (event) => event.id === eventID || event.event_id === eventID
      ) as any,
    [eventsData, eventID]
  );
  const extraFields: string[] = useMemo(
    () => eventData?.extra_fields || [],
    [eventData]
  );

  const teamMemberSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().regex(/^\d{10,}$/, 'Phone must be at least 10 digits'),
    email: z.string().email('Invalid email'),
    college: z.string().min(1, 'College name is required'),
    extras: z.record(z.string(), z.any()).optional(),
  });
  type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

  // step: 1 = Team Lead, 2 = Manage Team Members, 3 = Review & Pay
  const [step, setStep] = useState(1);
  const [teamLeadData, setTeamLeadData] = useState<TeamLeadFormValues | null>(
    null
  );
  const [teamMembers, setTeamMembers] = useState<TeamMemberFormValues[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const [showConfirmTeam, setShowConfirmTeam] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(
    null
  );
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLeadSWCVerified, setIsLeadSWCVerified] = useState(false);
  const [isVerifyingLead, setIsVerifyingLead] = useState(false);
  const [memberVerificationCache, setMemberVerificationCache] = useState<
    Record<string, boolean>
  >({});
  const [isVerifyingMember, setIsVerifyingMember] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<{
    inviteCode: string;
    teamStatus: 'pending' | 'active';
    teamId: string;
    postedAsOpen: boolean;
  } | null>(null);
  const [isPostingOpen, setIsPostingOpen] = useState(false);
  const { initiatePayment, isProcessing, isLoading, isVerifying } =
    useRazorpay();

  // Stop Lenis smooth scroll when modal is open
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
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  // Pre-fill form with user profile data when dialog opens (normal flow)
  useEffect(() => {
    if (!isOpen || initialData) return; // edit mode has its own reset below
    resetTeamLead({
      teamName: '',
      name: userData?.name ?? '',
      phone: userData?.phone ?? '',
      email: userData?.email ?? '',
      collegeName: userData?.college ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userData?.id]);

  // Pre-fill form when opened in edit mode with existing team data
  useEffect(() => {
    if (!isOpen || !initialData) return;
    resetTeamLead({
      teamName: initialData.team_name ?? '',
      name: initialData.team_lead_name ?? userData?.name ?? '',
      phone: initialData.team_lead_phone ?? userData?.phone ?? '',
      email: initialData.team_lead_email ?? userData?.email ?? '',
      collegeName: initialData.college ?? userData?.college ?? '',
    });
    setTeamMembers(
      (initialData.participants ?? []).map((p) => ({
        name: p.name,
        phone: p.phone ?? '',
        email: p.email,
        college: p.college ?? '',
        extras: p.extras ?? {},
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData]);

  // Sync payment phase to parent
  useEffect(() => {
    if (isRegistering && !isVerifying) {
      onPaymentPhaseChange?.('creating-order');
    } else if (isVerifying) {
      onPaymentPhaseChange?.('verifying-payment');
    } else {
      onPaymentPhaseChange?.(null);
    }
  }, [isRegistering, isVerifying, onPaymentPhaseChange]);

  const {
    register: registerTeamLead,
    handleSubmit: handleTeamLeadSubmit,
    formState: { errors: teamLeadErrors },
    reset: resetTeamLead,
    watch: watchTeamLead,
  } = useForm<TeamLeadFormValues>({
    resolver: zodResolver(teamLeadSchema),
    defaultValues: {
      teamName: '',
      name: userData?.name ?? '',
      phone: userData?.phone ?? '',
      email: userData?.email ?? '',
      collegeName: userData?.college ?? '',
    },
  });

  const onTeamLeadSubmit = (data: TeamLeadFormValues) => {
    setTeamLeadData(data);
    setStep(2);
    resetTeamLead();
  };

  const {
    register: registerTeamMember,
    handleSubmit: handleTeamMemberSubmit,
    formState: { errors: teamMemberErrors },
    reset: resetTeamMember,
    watch: watchTeamMember,
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
  });

  const watchLeadEmail = watchTeamLead('email');
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (watchLeadEmail) {
      setIsVerifyingLead(true);
      timeoutId = setTimeout(async () => {
        const verified = await verifySWCStudent(watchLeadEmail);
        setIsLeadSWCVerified(verified);
        setIsVerifyingLead(false);
      }, 500);
    } else {
      setIsLeadSWCVerified(false);
      setIsVerifyingLead(false);
    }
    return () => clearTimeout(timeoutId);
  }, [watchLeadEmail]);

  const watchMemberEmail = watchTeamMember('email');
  const watchMemberEmailValue = isAddingMember ? watchMemberEmail : null;
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (watchMemberEmailValue) {
      if (memberVerificationCache[watchMemberEmailValue] !== undefined) {
        return;
      }
      setIsVerifyingMember(true);
      timeoutId = setTimeout(async () => {
        const verified = await verifySWCStudent(watchMemberEmailValue);
        setMemberVerificationCache((prev) => ({
          ...prev,
          [watchMemberEmailValue]: verified,
        }));
        setIsVerifyingMember(false);
      }, 500);
    } else {
      setIsVerifyingMember(false);
    }
    return () => clearTimeout(timeoutId);
  }, [watchMemberEmailValue, memberVerificationCache]);

  useEffect(() => {
    const verifyUncached = async () => {
      const updates: Record<string, boolean> = {};
      let needsUpdate = false;
      for (const member of teamMembers) {
        if (
          memberVerificationCache[member.email] === undefined &&
          updates[member.email] === undefined
        ) {
          const verified = await verifySWCStudent(member.email);
          updates[member.email] = verified;
          needsUpdate = true;
        }
      }
      if (needsUpdate) {
        setMemberVerificationCache((prev) => ({ ...prev, ...updates }));
      }
    };
    verifyUncached();
  }, [teamMembers, memberVerificationCache]);

  const FREE_CATEGORIES = [
    'fb17b092-1622-4a3d-90a9-650fd860f6a0',
    '441aa4ca-49ad-4b57-bb7f-6a1c5cc63a32',
    'a8609025-6132-4d69-8c61-3313ef082db4',
  ];
  const isFreeCategory = eventData?.event_category_id
    ? FREE_CATEGORIES.includes(eventData.event_category_id)
    : false;
  const allMembersVerified = teamMembers.every(
    (m) => memberVerificationCache[m.email]
  );
  const isFreeEvent =
    eventFees === 0 ||
    (isFreeCategory && isLeadSWCVerified && allMembersVerified);

  const onAddTeamMember = (data: TeamMemberFormValues) => {
    if (teamLeadData && teamLeadData.email === data.email) {
      toast.error(
        'Team member email cannot be the same as the team lead email.'
      );
      return;
    }
    if (teamMembers.some((member) => member.email === data.email)) {
      toast.error('This email has already been added as a team member.');
      return;
    }
    setTeamMembers((prev) => [...prev, data]);
    resetTeamMember();
    setIsAddingMember(false);
  };

  useEffect(() => {
    if (editingMemberIndex !== null) {
      const memberToEdit = teamMembers[editingMemberIndex];
      resetTeamMember(memberToEdit);
    }
  }, [editingMemberIndex, teamMembers, resetTeamMember]);

  const totalTeamCount = (teamLeadData ? 1 : 0) + teamMembers.length;

  const handleProceedToPayment = () => {
    if (totalTeamCount > maxTeamSize) {
      toast.error(
        `Maximum team size is ${maxTeamSize}. Please remove some team members.`
      );
      return;
    }
    setShowConfirmTeam(true);
    setIsSheetOpen(true);
  };

  const handlePartialRegister = async () => {
    if (!teamLeadData) return;
    setIsRegistering(true);
    try {
      let teamId: string;

      if (initialData?.team_id) {
        // Edit mode — update existing team
        const ok = await updateExistingTeam({
          teamId: initialData.team_id,
          teamName: teamLeadData.teamName,
          college: teamLeadData.collegeName,
          teamLeadName: teamLeadData.name,
          teamMembers,
          accountHolderName: teamLeadData.name,
        });
        if (!ok) throw new Error('Failed to update team');
        teamId = initialData.team_id;
      } else {
        const registrationParams: RegisterTeamParams = {
          userId: userData?.id!,
          eventId: eventID,
          transactionId: null,
          teamName: teamLeadData.teamName,
          college: teamLeadData.collegeName,
          transactionScreenshot: '',
          teamLeadName: teamLeadData.name,
          teamLeadPhone: teamLeadData.phone,
          teamLeadEmail: teamLeadData.email,
          teamLeadExtras: teamLeadData.extras,
          teamMembers,
          ref:
            searchParams.get('ref') ||
            userData?.referral ||
            (typeof document !== 'undefined'
              ? document.cookie
                  .split('; ')
                  .find((row) => row.startsWith('tt_referral='))
                  ?.split('=')[1]
              : null) ||
            'TECHTRIX2026',
          account_holder_name: teamLeadData.name,
          paymentMode: 'RAZORPAY',
          regMode: 'ONLINE',
        };
        const id = await registerTeamWithParticipants(
          registrationParams,
          false
        );
        if (!id) throw new Error('Failed to create registration');
        teamId = id;
      }

      markEventAsPending(eventID, teamId);

      const { invite_code, team_status } = await finalizeTeamRegistration(
        teamId,
        totalTeamCount,
        minTeamSize,
        eventID,
        userData?.id
      );

      setRegistrationResult({
        inviteCode: invite_code,
        teamStatus: team_status,
        teamId,
        postedAsOpen: false,
      });
      onRegistrationWithInviteCode?.(invite_code, team_status);
      setShowSuccess(true);
      triggerConfetti();
    } catch (error) {
      console.error('Partial registration failed:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  // Register team with current members + immediately post to open team discovery
  const handleRegisterAndPostOpen = async () => {
    if (!teamLeadData || !userData?.id) return;
    setIsRegistering(true);
    try {
      const teamId = await createTeamDirect({
        userId: userData.id,
        eventId: eventID,
        teamName: teamLeadData.teamName,
        college: teamLeadData.collegeName,
        teamLeadEmail: teamLeadData.email,
        teamLeadName: teamLeadData.name,
        teamLeadPhone: teamLeadData.phone,
        teamLeadExtras: teamLeadData.extras,
        teamMembers: teamMembers,
        ref:
          searchParams.get('ref') ||
          userData?.referral ||
          (typeof document !== 'undefined'
            ? document.cookie
                .split('; ')
                .find((row) => row.startsWith('tt_referral='))
                ?.split('=')[1]
            : null) ||
          'TECHTRIX2026',
        accountHolderName: teamLeadData.name,
        paymentMode: 'RAZORPAY',
        regMode: 'ONLINE',
      });

      if (!teamId) throw new Error('Failed to create team');

      markEventAsPending(eventID, teamId);

      const { invite_code, team_status } = await finalizeTeamRegistration(
        teamId,
        totalTeamCount,
        minTeamSize,
        eventID,
        userData.id
      );

      // Post to open team discovery board
      const slotsAvailable = maxTeamSize - totalTeamCount;
      await postOpenTeam(eventID, userData.id, teamId, slotsAvailable, '');

      setRegistrationResult({
        inviteCode: invite_code,
        teamStatus: team_status,
        teamId,
        postedAsOpen: true,
      });
      onRegistrationWithInviteCode?.(invite_code, team_status);
      setShowSuccess(true);
      triggerConfetti();
    } catch (error) {
      console.error('Register & post open failed:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const onFinalSubmit = async () => {
    if (!teamLeadData) return;
    setIsRegistering(true);

    try {
      let teamId: string;
      let invite_code: string;
      let team_status: 'pending' | 'active' | 'closed';

      if (initialData?.team_id) {
        // Edit mode — reuse existing team_id; updates happen only after payment succeeds
        teamId = initialData.team_id;
        invite_code = initialData.invite_code ?? '';
        team_status =
          initialData.team_status === 'active' ? 'active' : 'pending';
      } else {
        const registrationParams: RegisterTeamParams = {
          userId: userData?.id!,
          eventId: eventID,
          transactionId: null,
          teamName: teamLeadData.teamName,
          college: teamLeadData.collegeName,
          transactionScreenshot: '',
          teamLeadName: teamLeadData.name,
          teamLeadPhone: teamLeadData.phone,
          teamLeadEmail: teamLeadData.email,
          teamLeadExtras: teamLeadData.extras,
          teamMembers,
          ref:
            searchParams.get('ref') ||
            userData?.referral ||
            (typeof document !== 'undefined'
              ? document.cookie
                  .split('; ')
                  .find((row) => row.startsWith('tt_referral='))
                  ?.split('=')[1]
              : null) ||
            'TECHTRIX2026',
          account_holder_name: teamLeadData.name,
          paymentMode: 'RAZORPAY',
          regMode: 'ONLINE',
        };

        const id = await registerTeamWithParticipants(
          registrationParams,
          false
        );
        if (!id) throw new Error('Failed to create registration');
        teamId = id;

        markEventAsPending(eventID, teamId);

        ({ invite_code, team_status } = await finalizeTeamRegistration(
          teamId,
          totalTeamCount,
          minTeamSize,
          eventID,
          userData?.id
        ));
      }

      const result = await initiatePayment({
        eventId: eventID,
        teamId: teamId,
        userName: teamLeadData.name,
        userEmail: teamLeadData.email,
        userPhone: teamLeadData.phone,
      });

      if (result.success) {
        // Edit mode: update team + participants only after payment confirmed.
        // Do NOT call finalizeTeamRegistration here — the verify endpoint already
        // set team_status='closed'. Calling finalize would overwrite it back to 'active'.
        if (initialData?.team_id) {
          await updateExistingTeam({
            teamId: initialData.team_id,
            teamName: teamLeadData.teamName,
            college: teamLeadData.collegeName,
            teamLeadName: teamLeadData.name,
            teamMembers,
            accountHolderName: teamLeadData.name,
          });
          // invite_code and team_status were already set before initiatePayment;
          // team_status is now 'closed' in DB (set by verify endpoint).
          team_status = 'closed';
        }

        const eventData = eventsData?.find(
          (event) => event.id === eventID || event.event_id === eventID
        );
        toast.success('Registration successful!');
        markEventAsRegistered(eventID);
        setEventsData(true);
        setShowSuccess(true);
        triggerConfetti();
        onRegistrationWithInviteCode?.(invite_code, team_status);

        const emailData = {
          eventName: eventData?.name,
          year: '2026',
          festName: 'Game of Thrones',
          teamName: teamLeadData.teamName,
          leaderName: teamLeadData.name,
          leaderPhone: teamLeadData.phone,
          email: teamLeadData.email,
          teamMembers: teamMembers,
          coordinators: eventData?.coordinators || [],
          contactEmail: 'rcciit.got.official@gmail.com',
          logoUrl: 'https://i.postimg.cc/Gtpt62ST/got.jpg',
          transactionId: result.teamId || 'razorpay',
          college: teamLeadData.collegeName,
          verificationDays: 0,
        };

        await fetch('/api/sendMail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: [teamLeadData.email, ...teamMembers.map((m) => m.email)],
            subject: `🎉 Registration Confirmed: ${eventData?.name?.toUpperCase()} - GAME OF THRONES 2026`,
            fileName: 'verify-email.ejs',
            data: emailData,
          }),
        });

        onRegistrationComplete?.();
        setTimeout(() => {
          handleDialogClose();
        }, 5000);
      } else {
        console.error(result.error);
        toast.error(result.error || 'Payment failed. Please try again.');
        handleDialogClose();
      }
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration process failed. Please try again.');
      handleDialogClose();
    } finally {
      setIsRegistering(false);
    }
  };

  const registerForSWCPaid = async () => {
    setIsRegistering(true);
    setRegisterLoading(true);
    try {
      let teamId: string | null = null;

      if (initialData?.team_id) {
        // Edit mode — update existing team
        const ok = await updateExistingTeam({
          teamId: initialData.team_id,
          teamName: teamLeadData!.teamName,
          college: teamLeadData!.collegeName,
          teamLeadName: teamLeadData!.name,
          teamMembers,
          accountHolderName: teamLeadData!.name,
        });
        if (ok) teamId = initialData.team_id;
      } else {
        const registrationParams: RegisterTeamParams = {
          userId: userData?.id!,
          eventId: eventID,
          transactionId: null,
          teamName: teamLeadData!.teamName,
          college: teamLeadData!.collegeName,
          transactionScreenshot: '',
          teamLeadName: teamLeadData!.name,
          teamLeadPhone: teamLeadData!.phone,
          teamLeadEmail: teamLeadData!.email,
          teamLeadExtras: teamLeadData!.extras,
          teamMembers,
          ref:
            searchParams.get('ref') ||
            userData?.referral ||
            (typeof document !== 'undefined'
              ? document.cookie
                  .split('; ')
                  .find((row) => row.startsWith('tt_referral='))
                  ?.split('=')[1]
              : null) ||
            null,
          account_holder_name: teamLeadData!.name,
          paymentMode: isFreeEvent ? 'SWC_PAID' : 'RAZORPAY',
          regMode: 'ONLINE',
        };
        teamId = await registerTeamWithParticipants(
          registrationParams,
          isFreeEvent
        );
      }

      if (teamId) {
        markEventAsPending(eventID, teamId);
        const { invite_code, team_status } = await finalizeTeamRegistration(
          teamId,
          totalTeamCount,
          minTeamSize,
          eventID,
          userData?.id
        );
        onRegistrationWithInviteCode?.(invite_code, team_status);
      }
      const eventData = eventsData?.find(
        (event) => event.id === eventID || event.event_id === eventID
      );
      const emailData = {
        eventName: eventData?.name,
        year: '2026',
        festName: 'Game of Thrones',
        teamName: teamLeadData!.teamName,
        leaderName: teamLeadData!.name,
        leaderPhone: teamLeadData!.phone,
        email: teamLeadData!.email,
        teamMembers: teamMembers,
        coordinators: eventData?.coordinators || [],
        contactEmail: 'rcciit.got.official@gmail.com',
        logoUrl: 'https://i.postimg.cc/Gtpt62ST/got.jpg',
        college: teamLeadData!.collegeName,
        verificationDays: 2,
      };
      await fetch('/api/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [
            teamLeadData!.email,
            ...teamMembers.map((member) => member.email),
          ],
          subject: `🎉 Registration Confirmed: ${eventData?.name.toUpperCase()} - GAME OF THRONES 2026`,
          fileName: 'verify-email.ejs',
          data: emailData,
        }),
      });
      markEventAsRegistered(eventID);
      setEventsData(true);
      setShowSuccess(true);
      toast.success('Registered successfully');
      triggerConfetti();
      onRegistrationComplete?.();
      setTimeout(() => {
        handleDialogClose();
      }, 5000);
      return true;
    } catch (error) {
      console.error('Failed to register team:', error);
      setIsRegistering(false);
      return false;
    } finally {
      setRegisterLoading(false);
    }
  };

  const resetForm = () => {
    setTeamLeadData(null);
    setTeamMembers([]);
    setStep(1);
    setIsAddingMember(false);
    setIsSheetOpen(false);
    resetTeamLead();
    resetTeamMember();
    setEditingMemberIndex(null);
    setIsRegistering(false);
    setShowSuccess(false);
    setRegistrationResult(null);
    setIsPostingOpen(false);
    onPaymentPhaseChange?.(null);
  };

  const handleDialogClose = () => {
    resetForm();
    onClose();
  };

  const onRemoveMember = (index: number) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <>
      <AnimatePresence>
        {isRegistering && (!isProcessing || isVerifying) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md"
          >
            <Loader2 className="w-12 h-12 text-yellow-400 animate-spin mb-4" />
            <h3
              className="text-white text-xl md:text-2xl tracking-widest mb-2 text-center"
              style={{ fontFamily: "'Metal Mania'" }}
            >
              {isVerifying ? 'VERIFYING TRANSACTION...' : 'PROCESSING...'}
            </h3>
            <p className="text-white/60 text-sm">
              Please do not refresh or close this page
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && !isProcessing && !isRegistering && !isVerifying) {
            handleDialogClose();
          }
        }}
        modal={!isProcessing && !isVerifying}
      >
        <DialogContent
          className="sm:max-w-[450px] h-full max-h-[90vh] bg-black/80 backdrop-blur-xl border border-white/20 p-0 shadow-2xl rounded-2xl overflow-hidden flex flex-col"
          onInteractOutside={(e) => {
            if (isProcessing || isRegistering || isVerifying) {
              e.preventDefault();
            }
          }}
        >
          <div className="p-6 md:p-8 pb-3 md:pb-4 flex-shrink-0">
            <DialogHeader className="relative z-10">
              <DialogTitle
                className="text-center text-white text-xl md:text-2xl tracking-widest"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                Team Registration
              </DialogTitle>
              <p className="text-center text-white/60 text-sm mt-1">
                {eventName}
              </p>

              <div className="flex justify-center mt-4 gap-3">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`w-2 h-2 rounded-full ${step === s ? 'bg-white' : 'bg-white/20'} transition-all duration-300`}
                  />
                ))}
              </div>

              <div className="flex justify-center mt-3">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  <Users size={12} className="text-white/60" />
                  <p className="text-white/80 text-xs">
                    Members:{' '}
                    <span className="text-white">{totalTeamCount}</span>
                    <span className="text-white/40 ml-1">
                      (Min: {minTeamSize}, Max: {maxTeamSize})
                    </span>
                  </p>
                </div>
              </div>

              {teamMembers.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center mt-2"
                >
                  <div
                    className="flex items-center gap-1.5 text-yellow-400/80 hover:text-yellow-400 cursor-pointer text-xs"
                    onClick={() => {
                      setShowConfirmTeam(false);
                      setIsSheetOpen(true);
                    }}
                  >
                    <Eye size={12} />
                    <span>View Added Members</span>
                  </div>
                </motion.div>
              )}
            </DialogHeader>
          </div>

          <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center p-6 md:p-8"
                >
                  {registrationResult?.teamStatus === 'pending' ? (
                    <>
                      <div className="w-16 h-16 bg-yellow-500/20 border border-yellow-500/50 rounded-full flex items-center justify-center mb-4">
                        <Users size={28} className="text-yellow-400" />
                      </div>
                      <h2
                        className="text-2xl text-white mb-2 tracking-wide text-center"
                        style={{ fontFamily: "'Metal Mania'" }}
                      >
                        Team Created!
                      </h2>
                      <p className="text-white/60 text-center mb-1 text-sm px-4">
                        "{teamLeadData?.teamName}" is ready.
                      </p>
                      <p className="text-yellow-400/80 text-xs text-center mb-5 px-4">
                        Add {minTeamSize - totalTeamCount} more member
                        {minTeamSize - totalTeamCount !== 1 ? 's' : ''} via
                        invite code to unlock payment.
                      </p>
                      <button
                        onClick={() => {
                          if (!registrationResult?.inviteCode) return;
                          navigator.clipboard.writeText(
                            registrationResult.inviteCode
                          );
                          toast.success('Invite code copied!');
                        }}
                        className="flex items-center gap-3 bg-white/5 border border-yellow-400/30 rounded-xl px-6 py-3 mb-5 hover:bg-white/10 transition-colors group"
                      >
                        <span className="font-mono text-yellow-300 text-lg tracking-widest">
                          {registrationResult?.inviteCode}
                        </span>
                        <Copy
                          size={16}
                          className="text-yellow-400/60 group-hover:text-yellow-400 transition-colors"
                        />
                      </button>
                      <p className="text-white/30 text-xs mb-4">
                        Tap code to copy &amp; share with teammates
                      </p>

                      {/* Post as Open Team CTA — only if not already posted */}
                      {!registrationResult?.postedAsOpen && (
                        <button
                          onClick={async () => {
                            if (!userData?.id || !registrationResult?.teamId)
                              return;
                            setIsPostingOpen(true);
                            const slotsAvailable = maxTeamSize - totalTeamCount;
                            const ok = await postOpenTeam(
                              eventID,
                              userData.id,
                              registrationResult.teamId,
                              slotsAvailable,
                              ''
                            );
                            setIsPostingOpen(false);
                            if (ok) {
                              setRegistrationResult((prev) =>
                                prev ? { ...prev, postedAsOpen: true } : prev
                              );
                              toast.success(
                                'Your team is now visible on the discovery board!'
                              );
                            } else {
                              toast.error('Failed to post. Try again.');
                            }
                          }}
                          disabled={isPostingOpen}
                          className="w-full mb-3 py-2.5 rounded-full text-xs border border-yellow-400/30 text-yellow-300 hover:bg-yellow-400/10 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isPostingOpen ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />{' '}
                              Posting...
                            </>
                          ) : (
                            '+ Post as Open Team'
                          )}
                        </button>
                      )}

                      {registrationResult?.postedAsOpen && (
                        <p className="text-green-400/70 text-xs mb-3 flex items-center gap-1.5">
                          <Check size={12} /> Team posted on discovery board
                        </p>
                      )}

                      <Button
                        onClick={handleDialogClose}
                        className="bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center gap-2 px-6 rounded-full transition-all duration-300"
                      >
                        <X size={16} />
                        <span>Done</span>
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mb-6">
                        <Check size={32} className="text-green-500" />
                      </div>
                      <h2
                        className="text-2xl text-white mb-2 tracking-wide text-center"
                        style={{ fontFamily: "'Metal Mania'" }}
                      >
                        Registration Successful!
                      </h2>
                      <p className="text-white/60 text-center mb-4 text-sm px-4">
                        Your team "{teamLeadData?.teamName}" has been
                        registered.
                      </p>
                      <p className="text-yellow-400 font-medium text-sm mb-6">
                        Get ready for the battle!
                      </p>
                      <Button
                        onClick={handleDialogClose}
                        className="bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center gap-2 px-6 rounded-full transition-all duration-300"
                      >
                        <X size={16} />
                        <span>Close</span>
                      </Button>
                    </>
                  )}
                </motion.div>
              ) : (
                <>
                  {step === 1 && (
                    <motion.form
                      key="step1"
                      variants={fadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onSubmit={handleTeamLeadSubmit(onTeamLeadSubmit)}
                      className="flex-1 flex flex-col min-h-0"
                    >
                      <div className="flex-1 overflow-y-auto px-6 md:px-8 space-y-3 custom-scrollbar">
                        <div className="space-y-1.5 pt-2">
                          <label
                            htmlFor="teamName"
                            className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider pl-1"
                          >
                            <Users size={14} />
                            <span>Team Name</span>
                          </label>
                          <div className="relative group">
                            <input
                              id="teamName"
                              {...registerTeamLead('teamName')}
                              className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 focus:outline-none text-white rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 placeholder:text-white/20"
                              placeholder="Enter team name"
                              autoFocus
                            />
                            <Users
                              size={16}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                            />
                          </div>
                          {teamLeadErrors.teamName && (
                            <p className="text-red-400 text-xs ml-1">
                              {teamLeadErrors.teamName.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider pl-1">
                            <UserCheck size={14} />
                            <span>Lead Name</span>
                          </label>
                          <div className="relative">
                            <input
                              readOnly
                              {...registerTeamLead('name')}
                              className="w-full bg-white/5 border border-white/10 text-white/70 rounded-lg p-2.5 pl-9 text-sm"
                            />
                            <UserCheck
                              size={16}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider pl-1">
                            <Phone size={14} />
                            <span>Lead Phone</span>
                          </label>
                          <div className="relative">
                            <input
                              readOnly
                              {...registerTeamLead('phone')}
                              className="w-full bg-white/5 border border-white/10 text-white/70 rounded-lg p-2.5 pl-9 text-sm"
                            />
                            <Phone
                              size={16}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider pl-1">
                            <Mail size={14} />
                            <span>Lead Email</span>
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              readOnly
                              {...registerTeamLead('email')}
                              className="w-full bg-white/5 border border-white/10 text-white/70 rounded-lg p-2.5 pl-9 pr-9 text-sm"
                            />
                            <Mail
                              size={16}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                            />
                            {isVerifyingLead && (
                              <Loader2
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 animate-spin"
                              />
                            )}
                            {!isVerifyingLead && isLeadSWCVerified && (
                              <Check
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400"
                              />
                            )}
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label
                            htmlFor="collegeName"
                            className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider pl-1"
                          >
                            <Building size={14} />
                            <span>College Name</span>
                          </label>
                          <div className="relative group">
                            <input
                              id="collegeName"
                              {...registerTeamLead('collegeName')}
                              className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 focus:outline-none text-white rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 placeholder:text-white/20"
                              placeholder="Enter college name"
                            />
                            <Building
                              size={16}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                            />
                          </div>
                          {teamLeadErrors.collegeName && (
                            <p className="text-red-400 text-xs ml-1">
                              {teamLeadErrors.collegeName.message}
                            </p>
                          )}
                        </div>

                        {extraFields.map((field: string) => (
                          <div key={field} className="space-y-1.5">
                            <label className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider pl-1">
                              <UserCheck size={14} />
                              <span>{field.replace(/_/g, ' ')}</span>
                            </label>
                            <div className="relative group">
                              <input
                                {...registerTeamLead(`extras.${field}` as any)}
                                defaultValue={
                                  teamLeadData?.extras?.[field] || ''
                                }
                                className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 focus:outline-none text-white rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 placeholder:text-white/20 capitalize"
                                placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                                required
                              />
                              <UserCheck
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end gap-3 p-6 md:p-8 pt-4 md:pt-4 flex-shrink-0 border-t border-white/10">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleDialogClose}
                          className="bg-transparent hover:bg-white/10 text-white/60 hover:text-white flex items-center gap-2 px-4 rounded-full transition-all duration-300"
                        >
                          <X size={16} />
                          <span>Close</span>
                        </Button>
                        <Button
                          type="submit"
                          className="bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center gap-2 px-6 rounded-full transition-all duration-300"
                        >
                          <span>Next</span>
                          <ArrowRight size={16} />
                        </Button>
                      </div>
                    </motion.form>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={fadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex-1 flex flex-col min-h-0"
                    >
                      <div className="flex-1 overflow-y-auto px-6 md:px-8 space-y-3 custom-scrollbar">
                        {isAddingMember ? (
                          <div className="space-y-3 py-4">
                            <h3 className="text-center text-white/80 text-sm mb-2">
                              {editingMemberIndex !== null
                                ? 'Edit Member'
                                : 'Add New Member'}
                            </h3>

                            <div className="space-y-1.5">
                              <label className="text-white/60 text-xs uppercase tracking-wider pl-1 font-medium">
                                Member Name
                              </label>
                              <input
                                {...registerTeamMember('name')}
                                className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 text-white rounded-lg p-2.5 text-sm transition-all duration-300"
                                placeholder="Full Name"
                                autoFocus
                              />
                              {teamMemberErrors.name && (
                                <p className="text-red-400 text-xs">
                                  {teamMemberErrors.name.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-white/60 text-xs uppercase tracking-wider pl-1 font-medium">
                                Phone
                              </label>
                              <input
                                type="tel"
                                {...registerTeamMember('phone')}
                                className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 text-white rounded-lg p-2.5 text-sm transition-all duration-300"
                                placeholder="Phone Number"
                              />
                              {teamMemberErrors.phone && (
                                <p className="text-red-400 text-xs">
                                  {teamMemberErrors.phone.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-white/60 text-xs uppercase tracking-wider pl-1 font-medium">
                                Email
                              </label>
                              <div className="relative">
                                <input
                                  type="email"
                                  {...registerTeamMember('email')}
                                  className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 text-white rounded-lg p-2.5 pr-9 text-sm transition-all duration-300"
                                  placeholder="Email Address"
                                />
                                {isVerifyingMember && (
                                  <Loader2
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 animate-spin"
                                  />
                                )}
                                {!isVerifyingMember &&
                                  watchMemberEmailValue &&
                                  memberVerificationCache[
                                    watchMemberEmailValue
                                  ] && (
                                    <Check
                                      size={16}
                                      className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400"
                                    />
                                  )}
                              </div>
                              {teamMemberErrors.email && (
                                <p className="text-red-400 text-xs">
                                  {teamMemberErrors.email.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-white/60 text-xs uppercase tracking-wider pl-1 font-medium">
                                College
                              </label>
                              <input
                                {...registerTeamMember('college')}
                                className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 text-white rounded-lg p-2.5 text-sm transition-all duration-300"
                                placeholder="College Name"
                              />
                              {teamMemberErrors.college && (
                                <p className="text-red-400 text-xs">
                                  {teamMemberErrors.college.message}
                                </p>
                              )}
                            </div>

                            {extraFields.map((field: string) => (
                              <div key={field} className="space-y-1.5">
                                <label className="text-white/60 text-xs uppercase tracking-wider pl-1 font-medium">
                                  {field.replace(/_/g, ' ')}
                                </label>
                                <input
                                  {...registerTeamMember(
                                    `extras.${field}` as any
                                  )}
                                  className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 text-white rounded-lg p-2.5 text-sm transition-all duration-300 capitalize"
                                  placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                                  required
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-4 py-4">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                                <UserCheck
                                  size={16}
                                  className="text-yellow-400"
                                />
                                <div>
                                  <p className="text-white text-sm font-medium">
                                    {teamLeadData?.name}
                                  </p>
                                  <p className="text-white/40 text-xs">
                                    Team Lead
                                  </p>
                                </div>
                              </div>

                              {teamMembers.length > 0 ? (
                                <div className="space-y-2">
                                  {teamMembers.map((member, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between items-center bg-white/5 p-2 rounded-lg border border-white/5"
                                    >
                                      <div className="flex items-center gap-2">
                                        <User
                                          size={14}
                                          className="text-white/40"
                                        />
                                        <span className="text-white/80 text-sm">
                                          {member.name}
                                        </span>
                                        {memberVerificationCache[
                                          member.email
                                        ] && (
                                          <Check
                                            size={14}
                                            className="text-green-400 ml-1"
                                          />
                                        )}
                                      </div>
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => {
                                            setEditingMemberIndex(idx);
                                            setIsAddingMember(true);
                                          }}
                                          className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/40 hover:text-white"
                                        >
                                          <Pencil size={12} />
                                        </button>
                                        <button
                                          onClick={() => onRemoveMember(idx)}
                                          className="p-1.5 hover:bg-red-500/10 rounded-md transition-colors text-white/40 hover:text-red-400"
                                        >
                                          <X size={12} />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-center text-white/40 text-xs py-4 italic">
                                  No members added yet. Add team members to
                                  continue.
                                </p>
                              )}
                            </div>

                            {teamMembers.length < maxTeamSize - 1 && (
                              <Button
                                onClick={() => setIsAddingMember(true)}
                                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center gap-2 py-5 rounded-xl transition-all duration-300"
                              >
                                <Plus size={16} />
                                <span>Add Team Member</span>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="p-6 md:p-8 pt-4 md:pt-4 flex-shrink-0 border-t border-white/10 space-y-3">
                        {isAddingMember ? (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => {
                                setIsAddingMember(false);
                                setEditingMemberIndex(null);
                              }}
                              className="bg-transparent hover:bg-white/10 text-white/60 hover:text-white flex items-center gap-2 px-4 rounded-full transition-all duration-300"
                            >
                              <X size={16} />
                              <span>Cancel</span>
                            </Button>
                            <Button
                              type="button"
                              onClick={handleTeamMemberSubmit((data) => {
                                if (editingMemberIndex !== null) {
                                  const updatedMembers = [...teamMembers];
                                  updatedMembers[editingMemberIndex] = data;
                                  setTeamMembers(updatedMembers);
                                  setEditingMemberIndex(null);
                                } else {
                                  onAddTeamMember(data);
                                }
                                setIsAddingMember(false);
                              })}
                              className="bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center gap-2 px-6 rounded-full transition-all duration-300"
                            >
                              <Check size={16} />
                              <span>
                                {editingMemberIndex !== null ? 'Update' : 'Add'}
                              </span>
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-end gap-3">
                              <Button
                                variant="ghost"
                                onClick={() => setStep(1)}
                                className="bg-transparent hover:bg-white/10 text-white/60 hover:text-white flex items-center gap-2 px-4 rounded-full transition-all duration-300"
                              >
                                <ArrowLeft size={16} />
                                <span>Back</span>
                              </Button>
                              <Button
                                onClick={handleProceedToPayment}
                                className="bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center gap-2 px-6 rounded-full transition-all duration-300 disabled:opacity-50"
                                disabled={
                                  totalTeamCount < minTeamSize ||
                                  totalTeamCount > maxTeamSize
                                }
                              >
                                <span>
                                  {isFreeEvent
                                    ? 'Review & Register'
                                    : 'Review & Pay'}
                                </span>
                                <ArrowRight size={16} />
                              </Button>
                            </div>

                            {/* Discovery hints — only when onOpenFindTeammates is wired and not editing an existing team */}
                            {onOpenFindTeammates && !initialData && (
                              <>
                                {/* Solo — no members at all */}
                                {teamMembers.length === 0 && (
                                  <div className="flex items-center justify-between gap-3 bg-white/3 border border-white/8 rounded-xl px-4 py-2.5">
                                    <p className="text-white/35 text-[11px] leading-snug">
                                      No teammates yet? We'll help you find one.
                                    </p>
                                    <button
                                      onClick={() =>
                                        onOpenFindTeammates('waitlist')
                                      }
                                      className="shrink-0 text-[11px] text-white/50 hover:text-white border border-white/15 hover:border-white/30 rounded-full px-3 py-1 transition-colors whitespace-nowrap"
                                    >
                                      Join Waitlist
                                    </button>
                                  </div>
                                )}

                                {/* Has at least 1 member added + still has open slots */}
                                {totalTeamCount > 1 &&
                                  totalTeamCount < maxTeamSize && (
                                    <div className="flex items-center justify-between gap-3 bg-white/3 border border-white/8 rounded-xl px-4 py-2.5">
                                      <p className="text-white/35 text-[11px] leading-snug">
                                        Room for {maxTeamSize - totalTeamCount}{' '}
                                        more? Post as open team.
                                      </p>
                                      <button
                                        onClick={() =>
                                          onOpenFindTeammates(
                                            'open_team',
                                            handleRegisterAndPostOpen
                                          )
                                        }
                                        className="shrink-0 text-[11px] text-white/50 hover:text-white border border-white/15 hover:border-white/30 rounded-full px-3 py-1 transition-colors whitespace-nowrap"
                                      >
                                        Find Members
                                      </button>
                                    </div>
                                  )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      variants={fadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="flex-1 flex flex-col min-h-0"
                    >
                      <div className="flex-1 overflow-y-auto px-6 md:px-8 custom-scrollbar pt-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                          <h3
                            className="text-white/80 text-lg text-center mb-6 tracking-wider"
                            style={{ fontFamily: "'Metal Mania'" }}
                          >
                            Registration Summary
                          </h3>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm py-2 border-b border-white/5">
                              <span className="text-white/40">Event</span>
                              <span className="text-white">{eventName}</span>
                            </div>
                            <div className="flex justify-between text-sm py-2 border-b border-white/5">
                              <span className="text-white/40">Team Name</span>
                              <span className="text-white">
                                {teamLeadData?.teamName}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm py-2 border-b border-white/5">
                              <span className="text-white/40">Members</span>
                              <span className="text-white">
                                {totalTeamCount}
                              </span>
                            </div>
                            {!isFreeEvent &&
                              (() => {
                                const { gatewayFee, totalAmount } =
                                  calculateGatewayFee(eventFees);
                                return (
                                  <>
                                    <div className="flex justify-between text-sm py-2">
                                      <span className="text-white/40">
                                        Registration Fee
                                      </span>
                                      <span className="text-white">
                                        ₹ {eventFees}.00
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm -pt-1 -mt-2 pb-2">
                                      <span className="text-white/40">
                                        Gateway Fee
                                      </span>
                                      <span className="text-white/50">
                                        {' '}
                                        ₹ {gatewayFee}
                                      </span>
                                    </div>
                                    <div className="border-t border-dashed border-white/10 my-1" />
                                    <div className="flex justify-between text-sm py-2">
                                      <span className="text-white/60 font-medium">
                                        Total
                                      </span>
                                      <span className="font-bold text-yellow-400">
                                        ₹ {totalAmount}
                                      </span>
                                    </div>
                                  </>
                                );
                              })()}
                            {isFreeEvent && (
                              <div className="flex justify-between text-sm py-2">
                                <span className="text-white/40">Total Fee</span>
                                <span className="font-bold text-green-400">
                                  Free
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 md:p-8 pt-4 md:pt-4 border-t border-white/10 flex-shrink-0">
                        <Button
                          onClick={onFinalSubmit}
                          disabled={isProcessing || isRegistering}
                          className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-6 rounded-full group relative overflow-hidden transition-all duration-300"
                        >
                          {isProcessing || isRegistering ? (
                            <>
                              <Loader2 className="animate-spin mr-2" />{' '}
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard className="mr-2 h-4 w-4" />
                              <span className="tracking-wide">
                                {isFreeEvent
                                  ? 'CONFIRM REGISTRATION'
                                  : `PAY ₹${!isFreeEvent ? calculateGatewayFee(eventFees).totalAmount : 0} & REGISTER`}
                              </span>
                              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                            </>
                          )}
                        </Button>
                        <div className="flex justify-center mt-3">
                          <Button
                            variant="ghost"
                            onClick={() => setStep(2)}
                            className="bg-transparent hover:bg-white/10 text-white/60 hover:text-white text-xs flex items-center gap-1 px-4 py-2 rounded-full transition-all duration-300"
                          >
                            <ArrowLeft size={14} /> <span>Back</span>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>

      <ViewTeamMembers
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        teamMembers={teamMembers}
        teamLeadData={teamLeadData}
        showConfirmTeam={showConfirmTeam}
        registerLoading={registerLoading || isRegistering}
        onRemoveMember={onRemoveMember}
        isFree={isFreeEvent}
        confirmTeam={async () => {
          if (isFreeEvent) {
            setRegisterLoading(true);
            const success = await registerForSWCPaid();
            setRegisterLoading(false);
            if (success) setIsSheetOpen(false);
          } else {
            setStep(3);
            setIsSheetOpen(false);
          }
        }}
        onEditTeamLead={() => {
          setStep(1);
          setIsSheetOpen(false);
        }}
        onEditMember={(index: number) => {
          setEditingMemberIndex(index);
          setIsAddingMember(true);
          setIsSheetOpen(false);
        }}
      />

      {/* <Toaster position="top-center" richColors /> */}
    </>
  );
}
