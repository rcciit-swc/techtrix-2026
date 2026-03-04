'use client';

import { useRazorpay } from '@/hooks/useRazorpay';
import { getEventWhatsAppLink } from '@/lib/constants/whatsapp';
import { login } from '@/lib/services/auth';
import { useEvents, useUser } from '@/lib/stores';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { PaymentLoadingOverlay } from './PaymentLoadingOverlay';
import { SoloEventRegistration } from './SoloRegistrationDialog';
import { TeamEventRegistration } from './TeamEventRegistration';
interface RegisterButtonProps {
  eventId: string;
}

export default function RegisterButton({ eventId }: RegisterButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userData, userLoading, swcData } = useUser();
  const { markEventAsRegistered, setEventsData, eventsData } = useEvents();
  const { initiatePayment, isProcessing, isLoading, isVerifying } =
    useRazorpay();
  const [isSoloOpen, setIsSoloOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [paymentActionState, setPaymentActionState] = useState<
    'creating-order' | 'verifying-payment' | null
  >(null);

  // Use event from store if available (contains updated registration status)
  const event = eventsData.find((e) => e.id === eventId);

  // SWC-paid users don't need to pay registration fees for eligible categories
  const isSWCPaid = !!swcData;
  const SWC_FREE_CATEGORY_IDS = [
    'fb17b092-1622-4a3d-90a9-650fd860f6a0', // Automata
    '441aa4ca-49ad-4b57-bb7f-6a1c5cc63a32', // Out of the Box
    'a8609025-6132-4d69-8c61-3313ef082db4', // Flagship
  ];
  const isEligibleForSWCFree =
    isSWCPaid && SWC_FREE_CATEGORY_IDS.includes(event?.event_category_id ?? '');
  const effectiveFees = isEligibleForSWCFree ? 0 : event!.registration_fees;

  // Determine registration state
  const isFullyRegistered =
    event?.registered && (!!event?.transaction_verified || effectiveFees === 0);
  const isPendingPayment =
    event?.registered && !isFullyRegistered && event?.registered_team_id;
  //debug the payment
  console.log(isFullyRegistered, isPendingPayment);

  const SHUTTERSCAPE_EVENT_ID = '49c435f3-ddca-412b-bb9a-b652af49315e';
  const SHUTTERSCAPE_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSd4VjRSB1kp0NTcSKPwFQRG6J2l9YK-sc5jc1GO50JipbNUjQ/viewform';

  const isShutterscape = eventId === SHUTTERSCAPE_EVENT_ID;

  const openShuttercapeForm = () => {
    if (isShutterscape) {
      window.open(SHUTTERSCAPE_FORM_URL, '_blank');
    }
  };

  const handleRegister = async () => {
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
      const callbackPath = `/event/${event?.id}${currentRef ? `?ref=${currentRef}` : ''}`;
      router.push(
        `/profile?onboarding=true&callback=${encodeURIComponent(callbackPath)}`
      );
      return;
    }

    if (event?.max_team_size === 1) {
      setIsSoloOpen(true);
    } else {
      setIsTeamOpen(true);
    }
  };

  const handleCompletePayment = async () => {
    if (!userData || !event?.registered_team_id) return;

    try {
      const result = await initiatePayment({
        eventId: event?.id || event?.id || '',
        teamId: event?.registered_team_id,
        userName: userData.name || '',
        userEmail: userData.email || '',
        userPhone: userData.phone || '',
      });

      if (result.success) {
        markEventAsRegistered(event?.id || event?.id || '');
        setEventsData(true); // Refetch from backend
        toast.success('Payment successful! Registration confirmed.');
        openShuttercapeForm();
      } else if (result.error !== 'Payment cancelled') {
        toast.error(result.error || 'Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    }
  };

  const renderButton = () => {
    // State 1: Registration closed
    if (!event?.reg_status) {
      return (
        <motion.button
          whileHover={{ scale: 1.02 }}
          animate={{
            boxShadow: [
              '0 8px 16px rgba(239, 68, 68, 0.3)',
              '0 10px 24px rgba(239, 68, 68, 0.5)',
              '0 8px 16px rgba(239, 68, 68, 0.3)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
          type="button"
          disabled
          className="relative px-4 py-1.5 sm:px-7 sm:py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 text-[12px] sm:text-[16px] md:text-[18px] cursor-not-allowed font-['Metal_Mania'] rounded-[50px] transition-all duration-300 text-center border-2 border-red-500/50 overflow-hidden opacity-75"
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
          {/* Diagonal strike-through effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-transparent to-red-500/20"
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          />
          {/* Pulsing border effect */}
          <motion.div
            className="absolute inset-0 rounded-[50px] border-2 border-red-500"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      );
    }

    // State 2: Fully registered (payment verified or free event)
    if (isFullyRegistered) {
      const whatsappLink = getEventWhatsAppLink(eventId);

      if (whatsappLink) {
        return (
          <div className="flex items-stretch rounded-[50px] overflow-hidden border-2 border-[#25D366]/50 shadow-[0_10px_20px_rgba(37,211,102,0.3)] hover:shadow-[0_15px_35px_rgba(37,211,102,0.6)] transition-all duration-300 transform scale-95 sm:scale-100">
            <motion.a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, backgroundColor: '#2be077' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center pl-5 pr-3 sm:pl-6 sm:pr-4 bg-[#25D366] text-white cursor-pointer transition-colors border-r border-white/20"
              title="Join WhatsApp Group"
            >
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[22px] sm:text-2xl"
              >
                💬
              </motion.span>
            </motion.a>

            <div className="flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-[#4FC879] to-[#1E8A4A] text-white text-[16px] sm:text-[18px] md:text-[20px] font-['Metal Mania']">
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
              '0 8px 16px rgba(34, 197, 94, 0.3)',
              '0 10px 24px rgba(34, 197, 94, 0.4)',
              '0 8px 16px rgba(34, 197, 94, 0.3)',
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          type="button"
          disabled
          className="relative px-4 py-1.5 sm:px-7 sm:py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-[12px] sm:text-[16px] md:text-[18px] cursor-not-allowed font-['Metal_Mania'] rounded-[50px] transition-all duration-300 text-center border-2 border-emerald-400/50 overflow-hidden"
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

    // State 3: Registered but payment pending
    if (isPendingPayment) {
      return (
        <motion.button
          whileHover={{
            scale: 1.08,
            y: -3,
            boxShadow: '0 15px 35px rgba(204, 168, 85, 0.6)',
          }}
          whileTap={{ scale: 0.96 }}
          animate={{
            boxShadow: [
              '0 10px 20px rgba(204, 168, 85, 0.3)',
              '0 12px 30px rgba(204, 168, 85, 0.5)',
              '0 10px 20px rgba(204, 168, 85, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          type="button"
          onClick={handleCompletePayment}
          disabled={isProcessing || isLoading}
          className="relative px-4 py-1.5 sm:px-7 sm:py-3 bg-gradient-to-r from-[#CCA855] to-[#a8892e] text-black text-[12px] sm:text-[16px] md:text-[18px] cursor-pointer font-['Metal_Mania'] rounded-[50px] hover:from-[#e0bc60] hover:to-[#CCA855] transition-all duration-300 text-center border-2 border-[#CCA855]/50 hover:border-[#CCA855]/80 overflow-hidden group"
        >
          <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
            {isProcessing || isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
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

    // State 4: Not registered — show Register Now + dialogs
    return (
      <motion.button
        whileHover={{
          scale: 1.08,
          y: -3,
          boxShadow: '0 15px 35px rgba(182, 3, 2, 0.6)',
        }}
        whileTap={{ scale: 0.96 }}
        animate={{
          boxShadow: [
            '0 10px 20px rgba(182, 3, 2, 0.3)',
            '0 12px 30px rgba(182, 3, 2, 0.5)',
            '0 10px 20px rgba(182, 3, 2, 0.3)',
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        type="button"
        onClick={handleRegister}
        className="relative px-4 py-1.5 sm:px-7 sm:py-3 bg-gradient-to-r from-[#B60302] to-[#8f0202] text-[#FAFAFA] text-[12px] sm:text-[16px] md:text-[18px] cursor-pointer font-['Metal_Mania'] rounded-[50px] hover:from-[#D60302] hover:to-[#B60302] transition-all duration-300 text-center border-2 border-[#FF003C]/30 hover:border-[#FF003C]/60 overflow-hidden group"
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
    );
  };

  return (
    <>
      {renderButton()}

      {/* Global Payment loading overlay */}
      {(paymentActionState || isLoading || isVerifying) && (
        <PaymentLoadingOverlay
          phase={
            paymentActionState ||
            (isVerifying ? 'verifying-payment' : 'creating-order')
          }
        />
      )}

      <SoloEventRegistration
        isOpen={isSoloOpen}
        onClose={() => setIsSoloOpen(false)}
        eventName={event?.name || ''}
        eventID={event?.id || ''}
        eventFees={effectiveFees}
        onRegistrationComplete={openShuttercapeForm}
      />

      <TeamEventRegistration
        isOpen={isTeamOpen}
        onClose={() => setIsTeamOpen(false)}
        eventName={event?.name || ''}
        minTeamSize={event?.min_team_size || 1}
        maxTeamSize={event?.max_team_size || 1}
        eventID={event?.id || ''}
        eventFees={effectiveFees}
        onRegistrationComplete={openShuttercapeForm}
      />
    </>
  );
}
