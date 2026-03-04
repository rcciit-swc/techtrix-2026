const DEDUCTION_RATE = 0.0236; // 2% platform fee + 18% GST on fee

/**
 * Calculates the exact gross amount in Paise to charge via Razorpay,
 * ensuring the merchant receives the exact target amount in Rupees after fees.
 *
 * @param {number} targetAmountInRupees - The exact amount you want to receive (e.g., 100).
 * @returns {number} The exact gross amount to charge, in Paise (e.g., 10242).
 */
export function calculateRazorpayChargeInPaise(targetAmountInRupees: number) {
  const targetInPaise = targetAmountInRupees * 100;
  return Math.ceil(targetInPaise / (1 - DEDUCTION_RATE));
}

/**
 * Calculates the gateway fee breakdown for display purposes.
 *
 * @param {number} registrationFeeInRupees - The base registration fee in Rupees.
 * @returns {{ gatewayFee: number, totalAmount: number }} Gateway fee and total in Rupees.
 */
export function calculateGatewayFee(registrationFeeInRupees: number) {
  const totalInPaise = calculateRazorpayChargeInPaise(registrationFeeInRupees);
  const totalInRupees = totalInPaise / 100;
  const gatewayFee = +(totalInRupees - registrationFeeInRupees).toFixed(2);
  return { gatewayFee, totalAmount: totalInRupees };
}

export default calculateRazorpayChargeInPaise;
