'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface PaymentResult {
  success: boolean;
  teamId?: string;
  error?: string;
}

interface InitiatePaymentParams {
  teamId: string;
  eventId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
}

export function useRazorpay() {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const initiatePayment = useCallback(
    async (params: InitiatePaymentParams): Promise<PaymentResult> => {
      const { teamId, eventId, userName, userEmail, userPhone } = params;

      setIsLoading(true);

      try {
        // Step 1: Create order via API
        const orderResponse = await fetch('/api/payments/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamId, eventId }),
        });

        const orderData = await orderResponse.json();

        if (!orderResponse.ok) {
          throw new Error(orderData.error || 'Failed to create order');
        }

        setIsLoading(false);
        setIsProcessing(true);

        // Step 2: Open Razorpay checkout
        return new Promise((resolve) => {
          const options: RazorpayOptions = {
            key: orderData.keyId,
            order_id: orderData.orderId,
            amount: orderData.amount,
            currency: orderData.currency,
            name: 'TechTrix 2026',
            description: `Registration for ${orderData.eventName}`,
            prefill: {
              name: userName,
              email: userEmail,
              contact: userPhone,
            },
            theme: {
              color: '#6366f1', // Indigo color
            },
            handler: async (response: RazorpayResponse) => {
              // Step 3: Verify payment
              try {
                const verifyResponse = await fetch('/api/payments/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });

                const verifyData = await verifyResponse.json();

                if (verifyResponse.ok) {
                  toast.success('Payment successful! Registration confirmed.');
                  resolve({ success: true, teamId: verifyData.teamId });
                } else {
                  toast.error(
                    verifyData.error || 'Payment verification failed'
                  );
                  resolve({ success: false, error: verifyData.error });
                }
              } catch (error) {
                console.error('Verification error:', error);
                toast.error(
                  'Payment verification failed. Please contact support.'
                );
                resolve({ success: false, error: 'Verification failed' });
              } finally {
                setIsProcessing(false);
              }
            },
            modal: {
              ondismiss: () => {
                setIsProcessing(false);
                toast.info('Payment was cancelled. You can complete it later.');
                resolve({ success: false, error: 'Payment cancelled' });
              },
            },
          };

          if (typeof window.Razorpay === 'undefined') {
            toast.error('Payment system is loading. Please try again.');
            setIsProcessing(false);
            resolve({ success: false, error: 'Razorpay not loaded' });
            return;
          }

          const rzp = new window.Razorpay(options);
          rzp.open();
        });
      } catch (error) {
        console.error('Payment error:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to initiate payment'
        );
        setIsLoading(false);
        setIsProcessing(false);
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
    []
  );

  return {
    initiatePayment,
    isLoading,
    isProcessing,
  };
}
