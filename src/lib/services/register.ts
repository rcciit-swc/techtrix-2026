import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export interface RegisterSoloParams {
  userId: string;
  eventId: string;
  transactionId: string;
  transactionScreenshot: string | null;
  college: string;
  ref?: string;
  paymentMode?: string;
  regMode?: string;
  account_holder_name?: string;
  extras?: any;
}

export async function registerSoloEvent(
  params: RegisterSoloParams
): Promise<any> {
  const {
    userId,
    eventId,
    transactionId,
    transactionScreenshot,
    college,
    ref,
    paymentMode,
    regMode,
    account_holder_name,
    extras,
  } = params;

  // Call the RPC named 'register_solo_event_with_extras' with the required parameters.
  const { data, error } = await supabase.rpc(
    'register_solo_event_with_extras',
    {
      p_account_holder_name: account_holder_name,
      p_attendance: false,
      p_college: college,
      p_event_id: eventId,
      p_payment_mode: paymentMode || 'UPI',
      p_referral_code: ref || 'GOT2026',
      p_reg_mode: regMode || 'ONLINE',
      p_transaction_id: transactionId,
      p_transaction_screenshot: transactionScreenshot,
      p_user_id: userId,
      p_extras: extras || {},
    }
  );

  console.log('[registerSoloEvent] RPC Result -> data:', data, 'error:', error);

  if (error) {
    toast.error(`Registration failed: ${error.message}`);
    throw new Error(error.message);
  }

  return data;
}

export interface TeamMember {
  name: string;
  phone: string;
  email: string;
  college: string;
  extras?: any;
}

export interface RegisterTeamParams {
  userId: string;
  eventId: string;
  transactionId: string | null;
  teamName: string;
  college: string;
  transactionScreenshot: string | null;
  teamLeadName: string;
  teamLeadPhone: string;
  teamLeadEmail: string;
  teamLeadExtras?: any;
  teamMembers: TeamMember[];
  ref: string;
  paymentMode?: string;
  regMode?: string;
  account_holder_name?: string;
}

export async function registerTeamWithParticipants(
  params: RegisterTeamParams,
  isSWCPaid = false
) {
  // Validate required fields. If any validation fails, throw immediately.
  const validations = [
    { value: params.userId, message: 'User ID is required.' },
    { value: params.eventId, message: 'Event ID is required.' },
    !isSWCPaid &&
      params.paymentMode !== 'RAZORPAY' && {
        value: params.transactionId,
        message: 'Transaction ID is required.',
      },
    { value: params.teamName, message: 'Team name is required.' },
    { value: params.college, message: 'College is required.' },
    !isSWCPaid &&
      params.paymentMode !== 'RAZORPAY' && {
        value: params.transactionScreenshot,
        message: 'Transaction screenshot is required.',
      },
    { value: params.teamLeadName, message: 'Team lead name is required.' },
    { value: params.teamLeadPhone, message: 'Team lead phone is required.' },
    { value: params.teamLeadEmail, message: 'Team lead email is required.' },
    {
      value: params.account_holder_name,
      message: 'Account holder name is required.',
    },
  ].filter(Boolean);

  for (const validation of validations) {
    const { value, message } = validation as {
      value: string | null;
      message: string;
    };
    if (!value) {
      toast.error(message);
      console.error('Validation failed:', message);
      throw new Error(message);
    }
  }

  const {
    userId,
    eventId,
    transactionId,
    teamName,
    college,
    transactionScreenshot,
    teamLeadName,
    teamLeadPhone,
    teamLeadEmail,
    teamLeadExtras,
    teamMembers,
    ref,
    regMode,
    paymentMode,
    account_holder_name,
  } = params;

  // Call the RPC function 'register_team_with_participants_and_extras'
  const { data, error } = await supabase.rpc(
    'register_team_with_participants_and_extras',
    {
      p_user_id: userId,
      p_event_id: eventId,
      p_transaction_id: transactionId,
      p_team_name: teamName,
      p_college: college,
      p_transaction_screenshot: transactionScreenshot,
      p_team_lead_name: teamLeadName,
      p_team_lead_phone: teamLeadPhone,
      p_team_lead_email: teamLeadEmail,
      p_team_lead_extras: teamLeadExtras || {},
      p_team_members: teamMembers || [],
      p_reg_mode: regMode || 'ONLINE',
      p_payment_mode: paymentMode || 'UPI',
      p_referral_code: ref || 'TECHTRIX2025',
      p_attendance: false,
      p_account_holder_name: account_holder_name,
    }
  );

  if (error) {
    // Check for the specific error message
    if (error.message.includes('User already registered for this event')) {
      toast.error('You are already registered for this event.');
    } else {
      toast.error(`Registration failed: ${error.message}`);
    }
    console.error('Error registering team:', error);
    throw new Error(error.message);
  } else {
    return data;
  }
}

export const approveRegistration = async (registrationId: string) => {
  try {
    const now = new Date();
    const isoString = now.toISOString();
    const { data, error } = await supabase
      .from('teams')
      .update({
        transaction_verified: isoString,
      })
      .eq('team_id', registrationId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Check if a team has a pending or completed payment
 */
export async function getPaymentStatus(teamId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('status, razorpay_order_id, verified_at')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return { status: 'not_started' as const };
  }

  return data;
}

export interface PaymentStatusType {
  status: 'not_started' | 'pending' | 'paid' | 'failed';
  razorpay_order_id?: string;
  verified_at?: string;
}
