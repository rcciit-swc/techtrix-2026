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
import {
  RegisterTeamParams,
  registerTeamWithParticipants,
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
  CreditCard,
  Eye,
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
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, Toaster } from 'sonner';
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
  onPaymentPhaseChange?: (
    phase: 'creating-order' | 'verifying-payment' | null
  ) => void;
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
  onPaymentPhaseChange,
}: EventRegistrationDialogProps) {
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
  console.log(extraFields);
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
  const [registerLoading, setRegisterLoading] = useState(false);
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
  } = useForm<TeamLeadFormValues>({
    resolver: zodResolver(teamLeadSchema),
    defaultValues: {
      name: userData?.name,
      phone: userData?.phone,
      email: userData?.email,
      collegeName: userData?.college,
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
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
  });

  const onAddTeamMember = (data: TeamMemberFormValues) => {
    // Validate duplicate email: check against already added team members and the team lead.
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
    if (totalTeamCount < minTeamSize) {
      toast.error(
        `Minimum team size is ${minTeamSize}. Please add more team members.`
      );
    } else if (totalTeamCount > maxTeamSize) {
      toast.error(
        `Maximum team size is ${maxTeamSize}. Please remove some team members.`
      );
    } else {
      setShowConfirmTeam(true);
      setIsSheetOpen(true);
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
        teamMembers: teamMembers,
        ref: userData?.referral_code || 'GOT2026',
        account_holder_name: teamLeadData.name,
        paymentMode: 'RAZORPAY',
        regMode: 'ONLINE',
      };

      const teamId = await registerTeamWithParticipants(
        registrationParams,
        false
      );

      if (!teamId) {
        throw new Error('Failed to create registration');
      }

      markEventAsPending(eventID, teamId);

      const result = await initiatePayment({
        eventId: eventID,
        teamId: teamId,
        userName: teamLeadData.name,
        userEmail: teamLeadData.email,
        userPhone: teamLeadData.phone,
      });

      if (result.success) {
        const eventData = eventsData?.find(
          (event) => event.id === eventID || event.event_id === eventID
        );
        toast.success('Registration successful!');
        markEventAsRegistered(eventID);
        setEventsData(true);
        setShowSuccess(true);
        triggerConfetti();

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
      teamMembers: teamMembers,
      ref: userData?.referral_code || 'GOT2026',
      account_holder_name: teamLeadData!.name,
      paymentMode: 'SWC_PAID',
      regMode: 'ONLINE',
    };
    try {
      const teamId = await registerTeamWithParticipants(
        registrationParams,
        eventFees === 0
      );
      if (teamId) {
        markEventAsPending(eventID, teamId);
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
          className="sm:max-w-[450px] max-h-[90vh] bg-black/80 backdrop-blur-xl border border-white/20 p-6 md:p-8 shadow-2xl rounded-2xl overflow-hidden my-scrollbar"
          onInteractOutside={(e) => {
            if (isProcessing || isRegistering || isVerifying) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader className="relative z-10 mb-2">
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
              <div
                className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-white' : 'bg-white/20'} transition-all duration-300`}
              ></div>
              <div
                className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-white' : 'bg-white/20'} transition-all duration-300`}
              ></div>
              <div
                className={`w-2 h-2 rounded-full ${step === 3 ? 'bg-white' : 'bg-white/20'} transition-all duration-300`}
              ></div>
            </div>

            <div className="flex justify-center mt-3">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Users size={12} className="text-white/60" />
                <p className="text-white/80 text-xs">
                  Members: <span className="text-white">{totalTeamCount}</span>
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

          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="flex flex-col items-center justify-center py-10"
              >
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
                  Your team "{teamLeadData?.teamName}" has been registered.
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
                    className="space-y-3 mt-2"
                  >
                    <div className="space-y-1.5">
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
                          defaultValue={teamLeadData?.teamName}
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
                          defaultValue={userData?.name}
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
                          defaultValue={userData?.phone}
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
                          defaultValue={userData?.email}
                          {...registerTeamLead('email')}
                          className="w-full bg-white/5 border border-white/10 text-white/70 rounded-lg p-2.5 pl-9 text-sm"
                          readOnly
                        />
                        <Mail
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                        />
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
                          defaultValue={
                            teamLeadData?.collegeName || userData?.college
                          }
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
                            defaultValue={teamLeadData?.extras?.[field] || ''}
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

                    <div className="flex justify-end gap-3 mt-4 pt-2">
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

                <ViewTeamMembers
                  isOpen={isSheetOpen}
                  onOpenChange={setIsSheetOpen}
                  teamMembers={teamMembers}
                  teamLeadData={teamLeadData}
                  showConfirmTeam={showConfirmTeam}
                  registerLoading={registerLoading || isRegistering}
                  onRemoveMember={onRemoveMember}
                  isFree={eventFees === 0}
                  confirmTeam={async () => {
                    if (eventFees === 0) {
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

                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mt-2"
                  >
                    {isAddingMember ? (
                      <motion.form
                        onSubmit={handleTeamMemberSubmit((data) => {
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
                        className="space-y-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h3 className="text-center text-white/80 text-sm mb-2">
                          {editingMemberIndex !== null
                            ? 'Edit Member'
                            : 'Add New Member'}
                        </h3>

                        <div className="space-y-1.5">
                          <label className="text-white/60 text-xs uppercase tracking-wider pl-1 fa-icon">
                            Member Name
                          </label>
                          <input
                            {...registerTeamMember('name')}
                            className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 text-white rounded-lg p-2.5 text-sm"
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
                          <label className="text-white/60 text-xs uppercase tracking-wider pl-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            {...registerTeamMember('phone')}
                            className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 text-white rounded-lg p-2.5 text-sm"
                            placeholder="Phone Number"
                          />
                          {teamMemberErrors.phone && (
                            <p className="text-red-400 text-xs">
                              {teamMemberErrors.phone.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-white/60 text-xs uppercase tracking-wider pl-1">
                            Email
                          </label>
                          <input
                            type="email"
                            {...registerTeamMember('email')}
                            className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 text-white rounded-lg p-2.5 text-sm"
                            placeholder="Email Address"
                          />
                          {teamMemberErrors.email && (
                            <p className="text-red-400 text-xs">
                              {teamMemberErrors.email.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-white/60 text-xs uppercase tracking-wider pl-1">
                            College
                          </label>
                          <input
                            {...registerTeamMember('college')}
                            className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 text-white rounded-lg p-2.5 text-sm"
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
                            <label className="text-white/60 text-xs uppercase tracking-wider pl-1">
                              {field.replace(/_/g, ' ')}
                            </label>
                            <input
                              {...registerTeamMember(`extras.${field}` as any)}
                              className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 text-white rounded-lg p-2.5 text-sm capitalize"
                              placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                              required
                            />
                          </div>
                        ))}

                        <div className="flex gap-2 justify-end pt-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              setIsAddingMember(false);
                              setEditingMemberIndex(null);
                            }}
                            className="text-white/60 hover:text-white"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-white/10 hover:bg-white/20 text-white"
                          >
                            {editingMemberIndex !== null ? 'Update' : 'Add'}
                          </Button>
                        </div>
                      </motion.form>
                    ) : (
                      <div className="space-y-4">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
                            <UserCheck size={16} className="text-yellow-400" />
                            <div>
                              <p className="text-white text-sm font-medium">
                                {teamLeadData?.name}
                              </p>
                              <p className="text-white/40 text-xs">Team Lead</p>
                            </div>
                          </div>

                          {teamMembers.length > 0 ? (
                            <div className="space-y-2">
                              {teamMembers.map((member, idx) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center bg-white/5 p-2 rounded-lg"
                                >
                                  <div className="flex items-center gap-2">
                                    <User size={14} className="text-white/40" />
                                    <span className="text-white/80 text-sm">
                                      {member.name}
                                    </span>
                                  </div>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => {
                                        setEditingMemberIndex(idx);
                                        setIsAddingMember(true);
                                      }}
                                      className="p-1 hover:text-white text-white/40"
                                    >
                                      <Pencil size={12} />
                                    </button>
                                    <button
                                      onClick={() => onRemoveMember(idx)}
                                      className="p-1 hover:text-red-400 text-white/40"
                                    >
                                      <X size={12} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-center text-white/40 text-xs py-2">
                              No members added yet
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-3">
                          {teamMembers.length < maxTeamSize - 1 && (
                            <Button
                              onClick={() => setIsAddingMember(true)}
                              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                            >
                              <Plus size={16} className="mr-2" /> Add Member
                            </Button>
                          )}

                          <div className="flex gap-3 justify-end mt-2">
                            <Button
                              variant="ghost"
                              onClick={() => setStep(1)}
                              className="text-white/60 hover:text-white"
                            >
                              <ArrowLeft size={16} className="mr-2" /> Back
                            </Button>
                            <Button
                              onClick={handleProceedToPayment}
                              className="bg-white/10 hover:bg-white/20 text-white border border-white/10"
                              disabled={
                                totalTeamCount < minTeamSize ||
                                totalTeamCount > maxTeamSize
                              }
                            >
                              {eventFees === 0
                                ? 'Review & Register'
                                : 'Review & Pay'}{' '}
                              <ArrowRight size={16} className="ml-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={fadeVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="mt-2"
                  >
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
                          <span className="text-white">{totalTeamCount}</span>
                        </div>
                        {eventFees > 0 &&
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
                        {eventFees === 0 && (
                          <div className="flex justify-between text-sm py-2">
                            <span className="text-white/40">Total Fee</span>
                            <span className="font-bold text-green-400">
                              Free
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={onFinalSubmit}
                      disabled={isProcessing || isRegistering}
                      className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-6 rounded-full group relative overflow-hidden"
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
                            {eventFees === 0
                              ? 'CONFIRM REGISTRATION'
                              : `PAY ₹${eventFees > 0 ? calculateGatewayFee(eventFees).totalAmount : 0} & REGISTER`}
                          </span>
                          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        </>
                      )}
                    </Button>
                    <div className="flex justify-center mt-3">
                      <Button
                        variant="ghost"
                        onClick={() => setStep(2)}
                        className="text-white/60 hover:text-white text-xs"
                      >
                        <ArrowLeft size={14} className="mr-1" /> Back
                      </Button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
      <Toaster position="top-center" richColors />
    </>
  );
}
