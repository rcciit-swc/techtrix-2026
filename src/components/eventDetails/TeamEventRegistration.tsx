'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useUser } from '@/lib/stores';
import { toast, Toaster } from 'sonner';
import { useEvents } from '@/lib/stores';
import confetti from 'canvas-confetti';
import { ViewTeamMembers } from '@/components/eventDetails/ViewTeamMembers';
import {
  RegisterTeamParams,
  registerTeamWithParticipants,
} from '@/lib/services/register';
import { useRazorpay } from '@/hooks/useRazorpay';
import {
  User,
  Phone,
  Mail,
  Building,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Users,
  Pencil,
  Plus,
  UserCheck,
  UserPlus,
  Ticket,
  Music,
  Trophy,
  UsersRound,
  Eye,
} from 'lucide-react';

interface EventRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  minTeamSize: number; // includes team lead
  maxTeamSize: number;
  eventID: string;
  eventFees: number;
}

// Zod schema for the Team Lead (Step 1)
const teamLeadSchema = z.object({
  teamName: z.string().min(1, 'Team name is required'),
  name: z.string().min(1, 'Team lead name is required'),
  phone: z.string().min(1, 'Team lead phone is required'),
  email: z.string().email('Invalid email'),
  collegeName: z.string().min(1, 'College name is required'),
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
}: EventRegistrationDialogProps) {
  const { userData } = useUser();
  const { markEventAsRegistered, eventsData } = useEvents();

  const teamMemberSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().regex(/^\d{10,}$/, 'Phone must be at least 10 digits'),
    email: z.string().email('Invalid email'),
  });
  type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

  // step: 1 = Team Lead, 2 = Manage Team Members, 3 = Review & Pay
  const [step, setStep] = useState(1);
  // Store validated team lead details
  const [teamLeadData, setTeamLeadData] = useState<TeamLeadFormValues | null>(
    null
  );
  // Store added team members (without a college field)
  const [teamMembers, setTeamMembers] = useState<TeamMemberFormValues[]>([]);
  // For displaying the added team members via the ViewTeamMembers component
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isConfirmedTeam, setIsConfirmedTeam] = useState(false);
  const [showConfirmTeam, setShowConfirmTeam] = useState(false);
  // Toggle for showing the add team member form
  const [isAddingMember, setIsAddingMember] = useState(false);
  // Added state to track which member is being edited
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(
    null
  );
  // State to track registration process
  const [isRegistering, setIsRegistering] = useState(false);
  // Success state
  const [showSuccess, setShowSuccess] = useState(false);
  // Razorpay hook
  const { initiatePayment, isProcessing } = useRazorpay();

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

  // ----------- Step 1: Team Lead Form -----------
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

  // ----------- Step 2: Add Team Member Form -----------
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

  // Total team count (team lead is counted if teamLeadData is set)
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

  // ----------- Step 3: Razorpay Payment -----------
  const onFinalSubmit = async () => {
    if (!teamLeadData) return;
    setIsRegistering(true);

    try {
      // 1. Register the team first with pending payment
      const registrationParams: RegisterTeamParams = {
        userId: userData?.id!,
        eventId: eventID,
        transactionId: null, // Will be updated via webhook
        teamName: teamLeadData.teamName,
        college: teamLeadData.collegeName,
        transactionScreenshot: '',
        teamLeadName: teamLeadData.name,
        teamLeadPhone: teamLeadData.phone,
        teamLeadEmail: teamLeadData.email,
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

      // 2. Initiate Razorpay Payment
      const result = await initiatePayment({
        eventId: eventID,
        teamId: teamId,
        userName: teamLeadData.name,
        userEmail: teamLeadData.email,
        userPhone: teamLeadData.phone,
      });

      if (result.success) {
        const eventData = eventsData?.find(
          (event) => event.event_id === eventID
        );
        // Payment verified by API/Webhook
        toast.success('Registration successful!');
        markEventAsRegistered(eventID);
        setShowSuccess(true);
        triggerConfetti();

        // Send email confirmation
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
          verificationDays: 0, // Instant verification
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

        setTimeout(() => {
          handleDialogClose();
        }, 3000);
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
      userId: userData?.id!, // non-null assertion since we expect this to be set
      eventId: eventID,
      transactionId: null,
      teamName: teamLeadData!.teamName,
      college: teamLeadData!.collegeName,
      transactionScreenshot: '',
      teamLeadName: teamLeadData!.name,
      teamLeadPhone: teamLeadData!.phone,
      teamLeadEmail: teamLeadData!.email,
      teamMembers: teamMembers,
      ref: userData?.referral_code || 'GOT2026',
      account_holder_name: '',
    };
    try {
      // Call the registerTeamWithParticipants function.
      const result = await registerTeamWithParticipants(
        registrationParams,
        eventFees === 0
      );
      const eventData = eventsData?.find((event) => event.id === eventID);
      const emailData = {
        eventName: eventData?.name,
        year: '2025',
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
      const emailResponse = await fetch('/api/sendMail', {
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
      setShowSuccess(true);
      toast.success('Registered successfully');
      triggerConfetti();
      setTimeout(() => {
        handleDialogClose();
      }, 3000);
    } catch (error) {
      console.error('Failed to register team:', error);
      setIsRegistering(false);
      return;
    } finally {
      setRegisterLoading(false);
    }
  };
  const [registerLoading, setRegisterLoading] = useState(false);

  // Reset all internal state and forms
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
  };

  // Wrap onClose to also reset the form state
  const handleDialogClose = () => {
    resetForm();
    onClose();
  };

  const onRemoveMember = (index: number) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
  };

  // Animation variants
  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleDialogClose();
          }
        }}
        modal={!isProcessing}
      >
        <DialogContent
          className="sm:max-w-[450px] max-h-[90vh] my-scrollbar border-2 border-[#FF003C] rounded-xl p-4 md:p-6 shadow-xl overflow-hidden"
          style={{
            backgroundImage:
              'url(https://i.postimg.cc/C5SMqWV1/cae8d04277c25697532890b8f73997b82d3609a1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/60"></div>
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none z-0">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[#FF003C] blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-red-600 blur-3xl"></div>
          </div>

          <DialogHeader className="relative z-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="hidden xl:flex items-center justify-center gap-2 mb-2 md:mb-3"
            >
              <Trophy size={20} className="text-[#FF003C] md:w-6 md:h-6" />
              <UsersRound size={20} className="text-[#FF003C] md:w-6 md:h-6" />
              <Music size={20} className="text-[#FF003C] md:w-6 md:h-6" />
            </motion.div>
            <DialogTitle className="text-center text-white font-antolia tracking-widest font-bold text-xs md:text-lg pb-0.5 md:pb-1 relative z-10">
              Team Registration
            </DialogTitle>
            <div className="flex justify-center">
              <h2 className="text-[#CCA855] font-antolia tracking-widest text-[10px] md:text-sm">
                {eventName}
              </h2>
            </div>
            <div className="flex justify-center mt-0.5 md:mt-1">
              <div className="h-0.5 w-20 md:w-28 bg-[#FF003C] rounded-full"></div>
            </div>

            <div className="flex flex-col items-center mt-1 md:mt-2">
              <div className="flex gap-2 md:gap-3 mb-1 md:mb-2">
                <div
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${step === 1 ? 'bg-[#FF003C]' : 'bg-gray-600'} transition-colors duration-300`}
                ></div>
                <div
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${step === 2 ? 'bg-[#FF003C]' : 'bg-gray-600'} transition-colors duration-300`}
                ></div>
                <div
                  className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${step === 3 ? 'bg-[#FF003C]' : 'bg-gray-600'} transition-colors duration-300`}
                ></div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1 bg-[#FF003C]/10 px-2 md:px-3 py-1 md:py-1.5 rounded-full mt-1"
              >
                <Users size={12} className="text-[#FF003C] md:w-4 md:h-4" />
                <p className="text-white font-antolia tracking-widest text-[10px] md:text-xs">
                  Team Members:{' '}
                  <span className="text-[#CCA855]">{totalTeamCount}</span>
                  <span className="text-gray-400">
                    {' '}
                    (Min: {minTeamSize}, Max: {maxTeamSize})
                  </span>
                </p>
              </motion.div>
            </div>

            {teamMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex justify-center mt-2"
              >
                <div
                  className="flex items-center gap-1 text-[#CCA855] font-antolia cursor-pointer text-[10px] md:text-xs hover:underline"
                  onClick={() => {
                    setShowConfirmTeam(false);
                    setIsSheetOpen(true);
                  }}
                >
                  <Eye size={12} className="md:w-3.5 md:h-3.5" />
                  <span>View & Edit Added Members</span>
                </div>
              </motion.div>
            )}
          </DialogHeader>

          <div className="relative z-10 overflow-y-auto max-h-[calc(90vh-180px)] my-scrollbar">
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex flex-col items-center justify-center py-12"
                >
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                    <Check size={40} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Registration Successful!
                  </h2>
                  <p className="text-gray-300 text-center mb-4">
                    Your team "{teamLeadData?.teamName}" has been registered for{' '}
                    {eventName}
                  </p>
                  <p className="text-yellow-300 font-medium">
                    We're excited to see your team at the fest!
                  </p>
                </motion.div>
              ) : (
                <>
                  {/* Step 1: Team Lead Details */}
                  {step === 1 && (
                    <motion.form
                      key="step1"
                      variants={fadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onSubmit={handleTeamLeadSubmit(onTeamLeadSubmit)}
                      className="relative z-10 mt-1 md:mt-2"
                    >
                      <div className="grid gap-1.5 md:gap-2 py-0">
                        {/* Team Name Field */}
                        <div className="grid gap-1.5">
                          <label
                            htmlFor="teamName"
                            className="flex items-center gap-1 md:gap-2 text-[#CCA855] font-medium text-xs md:text-sm"
                          >
                            <Users
                              size={14}
                              className="md:w-[18px] md:h-[18px]"
                            />
                            <span>Team Name</span>
                          </label>
                          <div className="relative">
                            <input
                              id="teamName"
                              {...registerTeamLead('teamName')}
                              defaultValue={teamLeadData?.teamName}
                              className="w-full bg-[#090B0D] border font-antolia tracking-wider border-[#FF003C] focus:border-[#FF003C] focus:ring-1 focus:ring-[#FF003C] focus:outline-none text-[#CCA855] rounded-md p-1.5 pl-7 md:p-2 md:pl-9 text-xs md:text-sm transition-all duration-300"
                              placeholder="Enter your team name"
                              autoFocus
                            />
                            <Users
                              size={14}
                              className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-[#FF003C]/70 md:w-[18px] md:h-[18px]"
                            />
                          </div>
                          {teamLeadErrors.teamName && (
                            <p className="text-red-400 text-sm ml-2">
                              {teamLeadErrors.teamName.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-1.5">
                          <label
                            htmlFor="name"
                            className="flex items-center gap-1 md:gap-2 text-[#CCA855] font-medium text-xs md:text-sm"
                          >
                            <UserCheck
                              size={14}
                              className="md:w-[18px] md:h-[18px]"
                            />
                            <span>Team Lead Name</span>
                          </label>
                          <div className="relative">
                            <input
                              id="name"
                              readOnly
                              {...registerTeamLead('name')}
                              className="w-full bg-[#090B0D] border font-antolia tracking-wider border-[#FF003C] focus:border-[#FF003C] focus:ring-1 focus:ring-[#FF003C] focus:outline-none text-[#CCA855] rounded-md p-1.5 pl-7 md:p-2 md:pl-9 text-xs md:text-sm transition-all duration-300"
                              placeholder="Enter team lead name"
                              defaultValue={userData?.name}
                            />
                            <UserCheck
                              size={14}
                              className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-[#FF003C]/70 md:w-[18px] md:h-[18px]"
                            />
                          </div>
                          {teamLeadErrors.name && (
                            <p className="text-red-400 text-sm ml-2">
                              {teamLeadErrors.name.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-1.5">
                          <label
                            htmlFor="phone"
                            className="flex items-center gap-1 md:gap-2 text-[#CCA855] font-medium text-xs md:text-sm"
                          >
                            <Phone
                              size={14}
                              className="md:w-[18px] md:h-[18px]"
                            />
                            <span>Team Lead Phone</span>
                          </label>
                          <div className="relative">
                            <input
                              id="phone"
                              type="tel"
                              readOnly
                              defaultValue={userData?.phone}
                              {...registerTeamLead('phone')}
                              className="w-full bg-[#090B0D] border font-antolia tracking-wider border-[#FF003C] focus:border-[#FF003C] focus:ring-1 focus:ring-[#FF003C] focus:outline-none text-[#CCA855] rounded-md p-1.5 pl-7 md:p-2 md:pl-9 text-xs md:text-sm transition-all duration-300"
                              placeholder="Enter team lead phone number"
                            />
                            <Phone
                              size={14}
                              className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-[#FF003C]/70 md:w-[18px] md:h-[18px]"
                            />
                          </div>
                          {teamLeadErrors.phone && (
                            <p className="text-red-400 text-sm ml-2">
                              {teamLeadErrors.phone.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-1.5">
                          <label
                            htmlFor="email"
                            className="flex items-center gap-1 md:gap-2 text-[#CCA855] font-medium text-xs md:text-sm"
                          >
                            <Mail
                              size={14}
                              className="md:w-[18px] md:h-[18px]"
                            />
                            <span>Team Lead Email</span>
                          </label>
                          <div className="relative">
                            <input
                              id="email"
                              type="email"
                              defaultValue={userData?.email}
                              {...registerTeamLead('email')}
                              className="w-full bg-[#090B0D] border font-antolia tracking-wider border-[#FF003C] focus:border-[#FF003C] focus:ring-1 focus:ring-[#FF003C] focus:outline-none text-[#CCA855] rounded-md p-1.5 pl-7 md:p-2 md:pl-9 text-xs md:text-sm transition-all duration-300"
                              placeholder="Enter team lead email"
                              readOnly
                            />
                            <Mail
                              size={14}
                              className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-[#FF003C]/70 md:w-[18px] md:h-[18px]"
                            />
                          </div>
                          {teamLeadErrors.email && (
                            <p className="text-red-400 text-sm ml-2">
                              {teamLeadErrors.email.message}
                            </p>
                          )}
                        </div>

                        <div className="grid gap-1.5">
                          <label
                            htmlFor="collegeName"
                            className="flex items-center gap-1 md:gap-2 text-[#CCA855] font-medium text-xs md:text-sm"
                          >
                            <Building
                              size={14}
                              className="md:w-[18px] md:h-[18px]"
                            />
                            <span>College Name</span>
                          </label>
                          <div className="relative">
                            <input
                              id="collegeName"
                              {...registerTeamLead('collegeName')}
                              defaultValue={
                                teamLeadData?.collegeName || userData?.college
                              }
                              className="w-full bg-[#090B0D] border font-antolia tracking-wider border-[#FF003C] focus:border-[#FF003C] focus:ring-1 focus:ring-[#FF003C] focus:outline-none text-[#CCA855] rounded-md p-1.5 pl-7 md:p-2 md:pl-9 text-xs md:text-sm transition-all duration-300"
                              placeholder="Enter college name"
                            />
                            <Building
                              size={14}
                              className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-[#FF003C]/70 md:w-[18px] md:h-[18px]"
                            />
                          </div>
                          {teamLeadErrors.collegeName && (
                            <p className="text-red-400 text-sm ml-2">
                              {teamLeadErrors.collegeName.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 md:gap-3 mt-2 md:mt-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleDialogClose}
                          className="bg-[#FF003C] hover:bg-[#FF003C]/90 text-white flex items-center gap-2 px-4 py-2 rounded-md border-0 transition-all duration-300"
                        >
                          <X size={18} />
                          <span>Close</span>
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[#CCA855] hover:bg-[#CCA855]/90 text-black font-medium flex items-center gap-2 px-6 py-2 rounded-md border-0 transition-all duration-300"
                        >
                          <span>Next</span>
                          <ArrowRight size={18} />
                        </Button>
                      </div>
                    </motion.form>
                  )}

                  {/* ViewTeamMembers component would be rendered here */}
                  <ViewTeamMembers
                    isOpen={isSheetOpen}
                    onOpenChange={setIsSheetOpen}
                    teamMembers={teamMembers}
                    teamLeadData={teamLeadData}
                    showConfirmTeam={showConfirmTeam}
                    registerLoading={registerLoading}
                    onRemoveMember={onRemoveMember}
                    isFree={eventFees === 0}
                    confirmTeam={async () => {
                      setIsConfirmedTeam(true);
                      eventFees === 0 && setRegisterLoading(true);
                      eventFees === 0 ? await registerForSWCPaid() : setStep(3);
                      setRegisterLoading(false);
                      setIsSheetOpen(false);
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

                  {/* Step 2: Manage Team Members */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      variants={fadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="relative z-10 mt-1 md:mt-2"
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
                          className="grid gap-1.5 md:gap-2 py-0"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-center text-[#CCA855] font-antolia tracking-widest text-xs md:text-sm">
                            {editingMemberIndex !== null
                              ? 'Edit Team Member'
                              : 'Add Team Member'}
                          </h3>

                          <div className="grid gap-1.5">
                            <label
                              htmlFor="memberName"
                              className="flex items-center gap-1 md:gap-2 text-[#CCA855] font-medium text-xs md:text-sm"
                            >
                              <User
                                size={14}
                                className="md:w-[18px] md:h-[18px]"
                              />
                              <span>Member Name</span>
                            </label>
                            <div className="relative">
                              <input
                                id="memberName"
                                {...registerTeamMember('name')}
                                className="w-full bg-[#090B0D] border font-antolia tracking-wider border-[#FF003C] focus:border-[#FF003C] focus:ring-1 focus:ring-[#FF003C] focus:outline-none text-[#CCA855] rounded-md p-1.5 pl-7 md:p-2 md:pl-9 text-xs md:text-sm transition-all duration-300"
                                placeholder="Enter member name"
                                autoFocus
                              />
                              <User
                                size={14}
                                className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-[#FF003C]/70 md:w-[18px] md:h-[18px]"
                              />
                            </div>
                            {teamMemberErrors.name && (
                              <p className="text-red-400 text-sm ml-2">
                                {teamMemberErrors.name.message}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-1.5">
                            <label
                              htmlFor="memberPhone"
                              className="flex items-center gap-1 md:gap-2 text-[#CCA855] font-medium text-xs md:text-sm"
                            >
                              <Phone
                                size={14}
                                className="md:w-[18px] md:h-[18px]"
                              />
                              <span>Member Phone</span>
                            </label>
                            <div className="relative">
                              <input
                                id="memberPhone"
                                type="tel"
                                {...registerTeamMember('phone')}
                                className="w-full bg-[#090B0D] border font-antolia tracking-wider border-[#FF003C] focus:border-[#FF003C] focus:ring-1 focus:ring-[#FF003C] focus:outline-none text-[#CCA855] rounded-md p-1.5 pl-7 md:p-2 md:pl-9 text-xs md:text-sm transition-all duration-300"
                                placeholder="Enter member phone number"
                              />
                              <Phone
                                size={14}
                                className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-[#FF003C]/70 md:w-[18px] md:h-[18px]"
                              />
                            </div>
                            {teamMemberErrors.phone && (
                              <p className="text-red-400 text-sm ml-2">
                                {teamMemberErrors.phone.message}
                              </p>
                            )}
                          </div>

                          <div className="grid gap-1.5">
                            <label
                              htmlFor="memberEmail"
                              className="flex items-center gap-1 md:gap-2 text-[#CCA855] font-medium text-xs md:text-sm"
                            >
                              <Mail
                                size={14}
                                className="md:w-[18px] md:h-[18px]"
                              />
                              <span>Member Email</span>
                            </label>
                            <div className="relative">
                              <input
                                id="memberEmail"
                                type="email"
                                {...registerTeamMember('email')}
                                className="w-full bg-[#090B0D] border font-antolia tracking-wider border-[#FF003C] focus:border-[#FF003C] focus:ring-1 focus:ring-[#FF003C] focus:outline-none text-[#CCA855] rounded-md p-1.5 pl-7 md:p-2 md:pl-9 text-xs md:text-sm transition-all duration-300"
                                placeholder="Enter member email"
                              />
                              <Mail
                                size={14}
                                className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-[#FF003C]/70 md:w-[18px] md:h-[18px]"
                              />
                            </div>
                            {teamMemberErrors.email && (
                              <p className="text-red-400 text-sm ml-2">
                                {teamMemberErrors.email.message}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-row flex-wrap gap-2 md:gap-3 mt-2 md:mt-3 justify-between">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsAddingMember(false);
                                setEditingMemberIndex(null);
                              }}
                              className="bg-[#FF003C] hover:bg-[#FF003C]/90 text-white flex items-center gap-2 px-4 py-2 rounded-md border-0 transition-all duration-300"
                            >
                              <X size={18} />
                              <span>Cancel</span>
                            </Button>
                            <Button
                              type="submit"
                              className="bg-[#CCA855] hover:bg-[#CCA855]/90 text-black font-medium flex items-center gap-2 px-6 py-2 rounded-md border-0 transition-all duration-300"
                            >
                              {editingMemberIndex !== null ? (
                                <>
                                  <Pencil size={18} />
                                  <span>Update Member</span>
                                </>
                              ) : (
                                <>
                                  <Plus size={18} />
                                  <span>Add Member</span>
                                </>
                              )}
                            </Button>
                          </div>
                        </motion.form>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col gap-2 md:gap-3"
                        >
                          <div className="text-center">
                            <h3 className="text-[#CCA855] font-antolia tracking-widest text-xs md:text-sm mb-1">
                              Manage Team Members
                            </h3>
                            <p className="text-gray-300 text-[10px] md:text-xs">
                              {teamMembers.length === 0
                                ? 'Add team members to continue with registration.'
                                : `You have added ${teamMembers.length} team member${teamMembers.length !== 1 ? 's' : ''}.`}
                            </p>
                          </div>

                          {teamMembers.length > 0 && (
                            <div className="bg-[#FF003C]/10 rounded-lg p-4 border border-[#FF003C]/30">
                              <h4 className="text-[#CCA855] font-medium mb-3 flex items-center gap-2">
                                <Users size={18} />
                                <span>Team Overview</span>
                              </h4>
                              <div className="text-white">
                                <div className="flex items-center gap-2 mb-2 bg-[#FF003C]/20 p-2 rounded-md">
                                  <UserCheck
                                    size={16}
                                    className="text-[#CCA855] shrink-0"
                                  />
                                  <div className="grow">
                                    <span className="font-medium">
                                      {teamLeadData?.name}
                                    </span>
                                    <span className="text-gray-400 text-sm ml-2">
                                      (Team Lead)
                                    </span>
                                  </div>
                                </div>

                                {teamMembers.map((member, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between gap-2 mb-2 bg-gray-900/30 p-2 rounded-md"
                                  >
                                    <div className="flex items-center gap-2">
                                      <User
                                        size={16}
                                        className="text-gray-400 shrink-0"
                                      />
                                      <span className="font-medium">
                                        {member.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => {
                                          setEditingMemberIndex(idx);
                                          setIsAddingMember(true);
                                        }}
                                        className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                                      >
                                        <Pencil size={16} />
                                      </button>
                                      <button
                                        onClick={() => onRemoveMember(idx)}
                                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                                      >
                                        <X size={16} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 md:gap-3 justify-between mt-2">
                            {teamMembers.length < maxTeamSize - 1 && (
                              <Button
                                type="button"
                                onClick={() => setIsAddingMember(true)}
                                className="bg-[#CCA855] hover:bg-[#CCA855]/90 text-black font-medium flex items-center gap-2 px-6 py-2 rounded-md border-0 transition-all duration-300"
                              >
                                <UserPlus size={18} />
                                <span>Add Member</span>
                              </Button>
                            )}

                            <div className="flex gap-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(1)}
                                className="bg-[#FF003C] hover:bg-[#FF003C]/90 text-white flex items-center gap-2 px-4 py-2 rounded-md border-0 transition-all duration-300"
                              >
                                <ArrowLeft size={18} />
                                <span>Back</span>
                              </Button>

                              <Button
                                type="button"
                                onClick={handleProceedToPayment}
                                className="bg-[#CCA855] hover:bg-[#CCA855]/90 text-black font-medium flex items-center gap-2 px-6 py-2 rounded-md border-0 transition-all duration-300"
                                disabled={
                                  totalTeamCount < minTeamSize ||
                                  totalTeamCount > maxTeamSize
                                }
                              >
                                <span>
                                  {' '}
                                  {eventFees === 0
                                    ? 'Register'
                                    : 'Make Payment'}
                                </span>
                                <ArrowRight size={18} />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Review & Pay */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      variants={fadeVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="relative z-10 mt-1 md:mt-2"
                    >
                      <div className="flex flex-col items-center justify-center gap-4 py-4">
                        <div className="bg-[#090B0D] p-6 rounded-lg border border-[#FF003C] w-full max-w-sm">
                          <h3 className="text-[#CCA855] font-antolia tracking-wide text-lg text-center mb-4">
                            Registration Summary
                          </h3>

                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Event:</span>
                              <span className="text-white font-medium text-right">
                                {eventName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Team:</span>
                              <span className="text-white font-medium text-right">
                                {teamLeadData?.teamName}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Team Lead:</span>
                              <span className="text-white font-medium text-right">
                                {teamLeadData?.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Team Size:</span>
                              <span className="text-white font-medium text-right">
                                {totalTeamCount} members
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">
                                Registration Fee:
                              </span>
                              <span className="text-[#FF003C] font-bold text-lg text-right">
                                ₹ {eventFees}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 w-full max-w-sm">
                          <Button
                            onClick={onFinalSubmit}
                            disabled={isProcessing || isRegistering}
                            className="w-full bg-[#CCA855] hover:bg-[#CCA855]/90 text-black font-bold py-3 rounded-md transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
                          >
                            {isProcessing || isRegistering ? (
                              <>
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                <span>Processing Payment...</span>
                              </>
                            ) : (
                              <>
                                <CreditCard size={20} />
                                <span>Pay ₹{eventFees} & Register</span>
                                <motion.div
                                  className="absolute inset-0 bg-white/20"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ x: '100%' }}
                                  transition={{ duration: 0.5 }}
                                />
                              </>
                            )}
                          </Button>
                          <p className="text-center text-xs text-gray-500 mt-3">
                            Secure payment via Razorpay. Registration confirmed
                            instantly upon payment.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-start mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(2)}
                          disabled={isProcessing || isRegistering}
                          className="bg-transparent hover:bg-white/10 text-white border border-gray-600 flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300"
                        >
                          <ArrowLeft size={16} />
                          <span>Back to Team</span>
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </AnimatePresence>
          </div>

          <Toaster position="top-center" richColors />
        </DialogContent>
      </Dialog>
    </>
  );
}
