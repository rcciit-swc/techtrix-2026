'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
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
  PartyPopper,
  Ticket,
  Music,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SoloEventRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  eventID: string;
  eventFees: number;
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
}: SoloEventRegistrationDialogProps) {
  const { userData } = useUser();
  const { markEventAsRegistered, eventsData } = useEvents();
  const eventData = eventsData?.find((event) => event.event_id === eventID);

  const [step, setStep] = useState(1);
  const [soloLeadData, setSoloLeadData] = useState<SoloLeadFormValues | null>(
    null
  );
  const [showSuccess, setShowSuccess] = useState(false);
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

  const onFinalSubmit = async () => {
    if (!soloLeadData) return;

    try {
      // 1. Register the team/user first with pending payment
      const registrationParams = {
        userId: String(userData?.id),
        eventId: eventID,
        transactionId: '', // Will be updated after payment
        college: soloLeadData.college,
        transactionScreenshot: '',
        name: soloLeadData.name,
        phone: soloLeadData.phone,
        email: soloLeadData.email,
        account_holder_name: soloLeadData.name, // Use applicant name
        paymentMode: 'RAZORPAY',
        regMode: 'ONLINE',
      };

      const teamId = await registerSoloEvent(registrationParams);

      if (!teamId) {
        throw new Error('Failed to create registration');
      }

      // 2. Initiate Razorpay Payment
      const result = await initiatePayment({
        eventId: eventID,
        teamId: teamId,
        userName: soloLeadData.name,
        userEmail: soloLeadData.email,
        userPhone: soloLeadData.phone,
      });

      if (result.success) {
        // Payment verified by API/Webhook
        toast.success('Registration successful!');
        markEventAsRegistered(eventID);
        setShowSuccess(true);
        triggerConfetti();

        // Send email confirmation
        const emailData = {
          teamName: null,
          leaderName: soloLeadData.name,
          leaderPhone: soloLeadData.phone,
          email: soloLeadData.email,
          eventName: eventName,
          year: '2026',
          festName: 'Game of Thrones',
          transactionId: result.teamId || 'razorpay', // Use teamId or placeholder
          college: soloLeadData.college,
          teamMembers: [],
          coordinators: eventData?.coordinators || [],
          verificationDays: 0, // Instant verification
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
            to: soloLeadData.email,
            subject: `🎉 Registration Confirmed: ${eventName} - Game of Thrones 2026`,
            fileName: 'send-email.ejs',
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) =>
        !isProcessing && (open ? null : handleDialogClose())
      }
      modal={!isProcessing}
    >
      <DialogContent
        className="sm:max-w-[450px] my-scrollbar border-2 border-[#FF003C] rounded-xl p-8 shadow-xl overflow-hidden"
        style={{
          backgroundImage:
            'url(https://i.postimg.cc/C5SMqWV1/cae8d04277c25697532890b8f73997b82d3609a1.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <DialogHeader className="relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="hidden xl:flex items-center justify-center gap-2 mb-2 md:mb-3 relative z-10"
          >
            <PartyPopper size={20} className="text-[#FF003C] md:w-6 md:h-6" />
            <Music size={20} className="text-[#FF003C] md:w-6 md:h-6" />
            <Ticket size={20} className="text-[#FF003C] md:w-6 md:h-6" />
          </motion.div>
          <DialogTitle className="text-center text-white font-antolia tracking-widest font-bold text-sm md:text-2xl lg:text-xl pb-1 relative z-10">
            Registration for {eventName}
          </DialogTitle>
          <div className="flex justify-center mt-1 md:mt-2">
            <div className="h-0.5 md:h-1 w-24 md:w-32 bg-[#FF003C] rounded-full"></div>
          </div>
          <div className="flex justify-center mt-2 md:mt-3">
            <div className="flex gap-3 md:gap-4">
              <div
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${step === 1 ? 'bg-[#FF003C]' : 'bg-gray-600'} transition-colors duration-300`}
              ></div>
              <div
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${step === 2 ? 'bg-[#FF003C]' : 'bg-gray-600'} transition-colors duration-300`}
              ></div>
            </div>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 relative z-10"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <Check size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Registration Successful!
              </h2>
              <p className="text-gray-300 text-center mb-4">
                You have successfully registered for {eventName}
              </p>
              <p className="text-yellow-300 font-medium">
                We'll see you at the fest!
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
              className="overflow-y-auto my-scrollbar max-h-[60vh] md:max-h-[55vh] 2xl:max-h-[60vh] relative z-10 mt-2 md:mt-4"
            >
              <div className="grid gap-2 md:gap-4 py-1 md:py-2">
                <div className="grid gap-1.5">
                  <label
                    htmlFor="name"
                    className="flex items-center gap-1 md:gap-2 text-[#CCA855] font-medium text-xs md:text-sm relative z-10"
                  >
                    <User size={14} className="md:w-[18px] md:h-[18px]" />
                    <span>Name</span>
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      readOnly
                      {...registerSoloLead('name')}
                      className="w-full bg-[#090B0D] border border-[#FF003C] focus:border-[#FF003C] focus:ring-1 focus:ring-[#FF003C] focus:outline-none text-[#CCA855] rounded-md p-1.5 pl-7 md:p-2 md:pl-9 text-xs md:text-sm transition-all duration-300 relative z-10"
                      placeholder="Enter your name"
                    />
                    <User
                      size={14}
                      className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-[#FF003C]/70 z-10 md:w-[18px] md:h-[18px]"
                    />
                  </div>
                  {soloLeadErrors.name && (
                    <p className="text-red-400 text-sm ml-2">
                      {soloLeadErrors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <label
                    htmlFor="phone"
                    className="flex items-center gap-1 md:gap-2 text-[#CCA855] font-medium text-xs md:text-sm relative z-10"
                  >
                    <Phone size={14} className="md:w-[18px] md:h-[18px]" />
                    <span>Phone</span>
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      type="tel"
                      readOnly
                      {...registerSoloLead('phone')}
                      className="w-full bg-[#090B0D] border border-[#FF003C] focus:border-[#FF003C] focus:ring-1 focus:ring-[#FF003C] focus:outline-none text-[#CCA855] rounded-md p-1.5 pl-7 md:p-2 md:pl-9 text-xs md:text-sm transition-all duration-300 relative z-10"
                      placeholder="Enter your phone number"
                    />
                    <Phone
                      size={14}
                      className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-[#FF003C]/70 z-10 md:w-[18px] md:h-[18px]"
                    />
                  </div>
                  {soloLeadErrors.phone && (
                    <p className="text-red-400 text-sm ml-2">
                      {soloLeadErrors.phone.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <label
                    htmlFor="email"
                    className="flex items-center gap-1 md:gap-2 text-[#CCA855] font-medium text-xs md:text-sm relative z-10"
                  >
                    <Mail size={14} className="md:w-[18px] md:h-[18px]" />
                    <span>Email</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      {...registerSoloLead('email')}
                      className="w-full bg-[#090B0D] border border-[#FF003C] focus:border-[#FF003C] focus:ring-1 focus:ring-[#FF003C] focus:outline-none text-[#CCA855] rounded-md p-1.5 pl-7 md:p-2 md:pl-9 text-xs md:text-sm transition-all duration-300 relative z-10"
                      placeholder="Enter your email"
                      readOnly
                    />
                    <Mail
                      size={14}
                      className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-[#FF003C]/70 z-10 md:w-[18px] md:h-[18px]"
                    />
                  </div>
                  {soloLeadErrors.email && (
                    <p className="text-red-400 text-sm ml-2">
                      {soloLeadErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-1.5">
                  <label
                    htmlFor="college"
                    className="flex items-center gap-1 md:gap-2 text-[#CCA855] font-medium text-xs md:text-sm relative z-10"
                  >
                    <Building size={14} className="md:w-[18px] md:h-[18px]" />
                    <span>College</span>
                  </label>
                  <div className="relative">
                    <input
                      id="college"
                      autoFocus
                      {...registerSoloLead('college')}
                      className="w-full bg-[#090B0D] border border-[#FF003C] focus:border-[#FF003C] focus:ring-1 focus:ring-[#FF003C] focus:outline-none text-[#CCA855] rounded-md p-1.5 pl-7 md:p-2 md:pl-9 text-xs md:text-sm transition-all duration-300 relative z-10"
                      placeholder="Enter your college name"
                    />
                    <Building
                      size={14}
                      className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 text-[#FF003C]/70 z-10 md:w-[18px] md:h-[18px]"
                    />
                  </div>
                  {soloLeadErrors.college && (
                    <p className="text-red-400 text-sm ml-2">
                      {soloLeadErrors.college.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 md:gap-4 mt-2 md:mt-4 relative z-10">
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
          ) : (
            <motion.div
              key="step2"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-y-auto my-scrollbar max-h-[70vh] md:max-h-[55vh] relative z-10 mt-2"
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
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-medium text-right">
                        {soloLeadData?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white font-medium text-right">
                        {soloLeadData?.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Registration Fee:</span>
                      <span className="text-[#FF003C] font-bold text-lg text-right">
                        ₹ {eventFees}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 w-full">
                  <Button
                    onClick={onFinalSubmit}
                    disabled={isProcessing}
                    className="w-full bg-[#CCA855] hover:bg-[#CCA855]/90 text-black font-bold py-3 rounded-md transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
                  >
                    {isProcessing ? (
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
                  onClick={() => setStep(1)}
                  disabled={isProcessing}
                  className="bg-transparent hover:bg-white/10 text-white border border-gray-600 flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300"
                >
                  <ArrowLeft size={16} />
                  <span>Back to Details</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
