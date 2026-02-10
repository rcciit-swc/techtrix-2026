import Razorpay from 'razorpay';
import crypto from 'crypto';

// Server-side Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

/**
 * Verify Razorpay payment signature using HMAC SHA256
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const payload = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(payload)
    .digest('hex');

  return expectedSignature === signature;
}

/**
 * Verify Razorpay webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return expectedSignature === signature;
}

export interface CreateOrderParams {
  amount: number; // in rupees, will be converted to paise
  eventId: string;
  userId: string;
  teamId: string;
  eventName: string;
}

/**
 * Create a Razorpay order
 */
export async function createRazorpayOrder(params: CreateOrderParams) {
  const { amount, eventId, userId, teamId, eventName } = params;

  // Receipt max length is 40 chars, use shortened IDs
  const shortTeamId = teamId.slice(0, 8);
  const receipt = `t_${shortTeamId}_${Date.now()}`.slice(0, 40);

  const order = await razorpay.orders.create({
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt,
    notes: {
      event_id: eventId,
      user_id: userId,
      team_id: teamId,
      event_name: eventName,
    },
  });

  return order;
}
