'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useUser } from '@/lib/stores';
import { useEvents } from '@/lib/stores';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { registerSoloEvent } from '@/lib/services/register';
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
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateGatewayFee } from '@/lib/utils/razorpay';

interface SoloEventRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  eventID: string;
  eventFees: number;
  onRegistrationComplete?: () => void;
}

// Schema for solo (team lead) details.
const soloLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^\d{10,}$/, 'Phone must be at least 10 digits'),
  email: z.string().email('Invalid email'),
  college: z.string().min(1, 'College is required'),
});
type SoloLeadFormValues = z.infer<typeof soloLeadSchema>;

export function SoloEventRegistration({
  isOpen,
  onClose,
  eventName,
  eventID,
  eventFees,
  onRegistrationComplete,
}: SoloEventRegistrationDialogProps) {
  const { userData } = useUser();
  const {
    markEventAsRegistered,
    markEventAsPending,
    setEventsData,
    eventsData,
  } = useEvents();
  const eventData = eventsData?.find((event) => event.event_id === eventID);

  const [step, setStep] = useState(1);
  const [soloLeadData, setSoloLeadData] = useState<SoloLeadFormValues | null>(
    null
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
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

  // Form for solo lead details.
  const {
    register: registerSoloLead,
    handleSubmit: handleSoloLeadSubmit,
    formState: { errors: soloLeadErrors },
    reset: resetSoloLead,
  } = useForm<SoloLeadFormValues>({
    resolver: zodResolver(soloLeadSchema),
    defaultValues: {
      name: userData?.name || '',
      phone: userData?.phone || '',
      email: userData?.email || '',
      college: userData?.college || '',
    },
  });

  // Reset form when userData loads
  useEffect(() => {
    if (userData) {
      console.log('[SoloRegistration] Resetting form with userData');
      resetSoloLead({
        name: userData.name || '',
        phone: userData.phone || '',
        email: userData.email || '',
        college: userData.college || '',
      });
    }
  }, [userData, resetSoloLead]);

  const onSoloLeadSubmit = (data: SoloLeadFormValues) => {
    setSoloLeadData(data);
    setStep(2);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const isFreeEvent = eventFees === 0;

  const sendConfirmationEmail = async () => {
    const emailData = {
      teamName: null,
      leaderName: soloLeadData!.name,
      leaderPhone: soloLeadData!.phone,
      email: soloLeadData!.email,
      eventName: eventName,
      year: '2026',
      festName: 'Game of Thrones',
      transactionId: 'free',
      college: soloLeadData!.college,
      teamMembers: [],
      coordinators: eventData?.coordinators || [],
      verificationDays: 0,
      contactEmail: 'rcciit.got.official@gmail.com',
      logoUrl: 'https://i.postimg.cc/Gtpt62ST/got.jpg',
      socialLinks: {
        instagram: '#',
        facebook: '#',
        website: '#',
      },
    };

    await fetch('/api/sendMail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: soloLeadData!.email,
        subject: `🎉 Registration Confirmed: ${eventName} - Game of Thrones 2026`,
        fileName: 'send-email.ejs',
        data: emailData,
      }),
    });
  };

  const onFinalSubmit = async () => {
    if (!soloLeadData) return;
    setIsRegistering(true);

    try {
      const registrationParams = {
        userId: String(userData?.id),
        eventId: eventID,
        transactionId: '',
        college: soloLeadData.college,
        transactionScreenshot: '',
        name: soloLeadData.name,
        phone: soloLeadData.phone,
        email: soloLeadData.email,
        account_holder_name: soloLeadData.name,
        paymentMode: isFreeEvent ? 'SWC_PAID' : 'RAZORPAY',
        regMode: 'ONLINE',
      };

      const teamId = await registerSoloEvent(registrationParams);

      if (!teamId) {
        throw new Error('Failed to create registration');
      }

      // Optimistically update state to 'Payment Pending' immediately
      markEventAsPending(eventID, teamId);

      // Free/SWC-paid: register directly without payment
      if (isFreeEvent) {
        toast.success('Registration successful!');
        markEventAsRegistered(eventID);
        setEventsData(true);
        setShowSuccess(true);
        triggerConfetti();
        await sendConfirmationEmail();
        onRegistrationComplete?.();
        setTimeout(() => {
          handleDialogClose();
        }, 3000);
        return;
      }

      // Paid event: initiate Razorpay
      const result = await initiatePayment({
        eventId: eventID,
        teamId: teamId,
        userName: soloLeadData.name,
        userEmail: soloLeadData.email,
        userPhone: soloLeadData.phone,
      });

      if (result.success) {
        toast.success('Registration successful!');
        markEventAsRegistered(eventID);
        setEventsData(true);
        setShowSuccess(true);
        triggerConfetti();
        await sendConfirmationEmail();
        onRegistrationComplete?.();
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

  const handleDialogClose = () => {
    setShowSuccess(false);
    setSoloLeadData(null);
    setStep(1);
    resetSoloLead();
    onClose();
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) =>
        !isProcessing && (open ? null : handleDialogClose())
      }
      modal={!isProcessing}
    >
      <DialogContent className="sm:max-w-[450px] bg-black/80 backdrop-blur-xl border border-white/20 p-8 shadow-2xl rounded-2xl overflow-hidden">
        <DialogHeader className="relative z-10 mb-6">
          <DialogTitle
            className="text-center text-white text-2xl tracking-widest"
            style={{ fontFamily: "'Metal Mania'" }}
          >
            Registration for {eventName}
          </DialogTitle>
          <div className="flex justify-center mt-4 gap-3">
            <div
              className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-white' : 'bg-white/20'} transition-all duration-300`}
            ></div>
            <div
              className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-white' : 'bg-white/20'} transition-all duration-300`}
            ></div>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center justify-center py-8 relative z-10"
            >
              <div className="w-16 h-16 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mb-6">
                <Check size={32} className="text-green-500" />
              </div>
              <h2
                className="text-2xl text-white mb-2 tracking-wide"
                style={{ fontFamily: "'Metal Mania'" }}
              >
                Registration Successful!
              </h2>
              <p className="text-white/60 text-center mb-4 text-sm">
                You have successfully registered for {eventName}
              </p>
              <p className="text-yellow-400 font-medium text-sm">
                We&apos;ll see you at the fest!
              </p>
            </motion.div>
          ) : step === 1 ? (
            <motion.form
              key="step1"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleSoloLeadSubmit(onSoloLeadSubmit)}
              className="space-y-4 relative z-10"
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider pl-1"
                  >
                    <User size={14} />
                    <span>Name</span>
                  </label>
                  <div className="relative group">
                    <input
                      id="name"
                      readOnly
                      {...registerSoloLead('name')}
                      className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 focus:outline-none text-white rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 placeholder:text-white/20"
                      placeholder="Enter your name"
                    />
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 group-focus-within:text-yellow-400/70 transition-colors"
                    />
                  </div>
                  {soloLeadErrors.name && (
                    <p className="text-red-400 text-xs ml-1">
                      {soloLeadErrors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider pl-1"
                  >
                    <Phone size={14} />
                    <span>Phone</span>
                  </label>
                  <div className="relative group">
                    <input
                      id="phone"
                      type="tel"
                      readOnly
                      {...registerSoloLead('phone')}
                      className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 focus:outline-none text-white rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 placeholder:text-white/20"
                      placeholder="Enter your phone number"
                    />
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 group-focus-within:text-yellow-400/70 transition-colors"
                    />
                  </div>
                  {soloLeadErrors.phone && (
                    <p className="text-red-400 text-xs ml-1">
                      {soloLeadErrors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider pl-1"
                  >
                    <Mail size={14} />
                    <span>Email</span>
                  </label>
                  <div className="relative group">
                    <input
                      id="email"
                      type="email"
                      {...registerSoloLead('email')}
                      className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 focus:outline-none text-white rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 placeholder:text-white/20"
                      placeholder="Enter your email"
                      readOnly
                    />
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 group-focus-within:text-yellow-400/70 transition-colors"
                    />
                  </div>
                  {soloLeadErrors.email && (
                    <p className="text-red-400 text-xs ml-1">
                      {soloLeadErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="college"
                    className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-wider pl-1"
                  >
                    <Building size={14} />
                    <span>College</span>
                  </label>
                  <div className="relative group">
                    <input
                      id="college"
                      autoFocus
                      {...registerSoloLead('college')}
                      className="w-full bg-white/5 border border-white/10 focus:border-yellow-400/50 focus:ring-1 focus:ring-yellow-400/20 focus:outline-none text-white rounded-lg p-2.5 pl-9 text-sm transition-all duration-300 placeholder:text-white/20"
                      placeholder="Enter your college name"
                    />
                    <Building
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 group-focus-within:text-yellow-400/70 transition-colors"
                    />
                  </div>
                  {soloLeadErrors.college && (
                    <p className="text-red-400 text-xs ml-1">
                      {soloLeadErrors.college.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleDialogClose}
                  className="bg-transparent hover:bg-white/10 text-white/60 hover:text-white flex items-center gap-2 px-5 rounded-full transition-all duration-300"
                >
                  <X size={16} />
                  <span>Close</span>
                </Button>
                <Button
                  type="submit"
                  className="bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center gap-2 px-6 rounded-full transition-all duration-300 group"
                >
                  <span>Next Step</span>
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="step2"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative z-10"
            >
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
                <h3
                  className="text-white/80 text-lg text-center mb-6 tracking-wider"
                  style={{ fontFamily: "'Metal Mania'" }}
                >
                  Confirm Details
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/40 text-sm">Event</span>
                    <span className="text-white font-medium text-right text-sm">
                      {eventName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/40 text-sm">Name</span>
                    <span className="text-white font-medium text-right text-sm">
                      {soloLeadData?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-white/40 text-sm">Email</span>
                    <span className="text-white font-medium text-right text-sm">
                      {soloLeadData?.email}
                    </span>
                  </div>
                  {!isFreeEvent &&
                    (() => {
                      const { gatewayFee, totalAmount } =
                        calculateGatewayFee(eventFees);
                      return (
                        <>
                          <div className="flex justify-between items-center py-2">
                            <span className="text-white/40 text-sm">
                              Registration Fee
                            </span>
                            <span className="text-white font-medium text-right text-sm">
                              ₹ {eventFees}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-white/40 text-sm">
                              Gateway Fee
                            </span>
                            <span className="text-white/50 text-right text-sm">
                              + ₹ {gatewayFee}
                            </span>
                          </div>
                          <div className="border-t border-dashed border-white/10 my-1" />
                          <div className="flex justify-between items-center py-2">
                            <span className="text-white/60 text-sm font-medium">
                              Total
                            </span>
                            <span className="font-bold text-lg text-right text-yellow-400">
                              ₹ {totalAmount}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  {isFreeEvent && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-white/40 text-sm">Fee</span>
                      <span className="font-bold text-lg text-right text-green-400">
                        Free
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={onFinalSubmit}
                  disabled={isProcessing || isRegistering}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-6 rounded-full transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  {isProcessing || isRegistering ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      <span className="tracking-wide">
                        {isFreeEvent
                          ? 'CONFIRM REGISTRATION'
                          : `PAY ₹${calculateGatewayFee(eventFees).totalAmount} & REGISTER`}
                      </span>
                      <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                    </>
                  )}
                </Button>
                <p className="text-center text-[10px] text-white/30">
                  {isFreeEvent
                    ? 'Registration will be confirmed instantly.'
                    : 'Secure payment via Razorpay.'}
                </p>
              </div>

              <div className="flex justify-center mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                  className="bg-transparent hover:bg-white/5 text-white/40 hover:text-white/80 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-xs"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Edit</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
