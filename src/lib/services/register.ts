import { supabase } from '@/lib/supabase/client';
import { generateInviteCode } from '@/lib/utils/inviteCode';
import { toast } from 'sonner';

export interface CreateTeamDirectParams {
  userId: string;
  eventId: string;
  teamName: string;
  college: string;
  teamLeadEmail: string;
  teamLeadName: string;
  teamLeadPhone: string;
  teamLeadExtras?: Record<string, any>;
  teamMembers: TeamMember[];
  ref?: string | null;
  paymentMode?: string;
  regMode?: string;
  accountHolderName?: string;
}

/**
 * Directly inserts a team + participants without going through the RPC.
 * Used when no payment transaction is involved yet (e.g. pre-payment open team posting).
 * Returns the new team_id or null on failure.
 */
export async function createTeamDirect(
  params: CreateTeamDirectParams
): Promise<string | null> {
  const {
    userId,
    eventId,
    teamName,
    college,
    teamLeadEmail,
    teamLeadName,
    teamMembers,
    ref,
    paymentMode,
    regMode,
    accountHolderName,
  } = params;

  // 1. Insert the team row
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({
      event_id: eventId,
      team_name: teamName,
      team_lead_id: userId,
      team_lead_email: teamLeadEmail,
      college,
      is_team: true,
      referral_code: ref ?? null,
      reg_mode: regMode ?? 'ONLINE',
      payment_mode: paymentMode ?? 'RAZORPAY',
      account_holder_name: accountHolderName ?? teamLeadName,
      attendance: false,
      registered_at: new Date().toISOString(),
      team_status: 'pending',
    })
    .select('team_id')
    .single();

  if (teamError || !team) {
    console.error('[createTeamDirect] team insert failed:', teamError);
    toast.error('Failed to create team. Please try again.');
    return null;
  }

  // 2. Insert additional members as participants (team lead is not a participant row)
  if (teamMembers.length > 0) {
    const rows = teamMembers.map((m) => ({
      team_id: team.team_id,
      name: m.name,
      phone: m.phone,
      email: m.email,
      college: m.college,
      extras: m.extras ?? {},
    }));

    const { error: participantsError } = await supabase
      .from('participants')
      .insert(rows);

    if (participantsError) {
      console.error(
        '[createTeamDirect] participants insert failed:',
        participantsError
      );
      // Team was created — return its ID anyway so the flow can continue
    }
  }

  return team.team_id;
}

export interface RegisterSoloParams {
  userId: string;
  eventId: string;
  transactionId: string;
  transactionScreenshot: string | null;
  college: string;
  ref?: string | null;
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
      p_referral_code: ref ?? null,
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
  ref: string | null;
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

/**
 * After team creation, assigns an invite code and sets team_status
 * based on whether the current member count meets the minimum.
 */
export async function finalizeTeamRegistration(
  teamId: string,
  totalMemberCount: number,
  minTeamSize: number,
  eventId?: string,
  userId?: string
): Promise<{ invite_code: string; team_status: 'pending' | 'active' }> {
  const invite_code = generateInviteCode();
  const team_status: 'pending' | 'active' =
    totalMemberCount >= minTeamSize ? 'active' : 'pending';

  await supabase
    .from('teams')
    .update({ invite_code, team_status })
    .eq('team_id', teamId);

  // Remove team lead from the discovery waitlist if they were on it
  if (eventId && userId) {
    await supabase
      .from('team_discovery')
      .update({ status: 'matched' })
      .eq('event_id', eventId)
      .eq('user_id', userId);
  }

  return { invite_code, team_status };
}

/**
 * Check if the user already has a team for this event (regardless of payment status).
 * Used on the event page to detect teams created without payment.
 */
export interface ExistingTeamParticipant {
  name: string;
  phone: string | null;
  email: string;
  college: string | null;
  extras: Record<string, any> | null;
}

export interface ExistingTeamData {
  team_id: string;
  team_name: string | null;
  team_status: 'pending' | 'active' | 'closed' | null;
  invite_code: string | null;
  team_lead_id: string;
  team_lead_email: string | null;
  team_lead_name: string | null;
  team_lead_phone: string | null;
  college: string | null;
  is_team: boolean;
  referral_code: string | null;
  reg_mode: string | null;
  payment_mode: string | null;
  account_holder_name: string | null;
  attendance: boolean;
  registered_at: string | null;
  transaction_id: string | null;
  transaction_screenshot: string | null;
  transaction_verified: string | null;
  verification_mail_sent: boolean | null;
  member_count: number;
  participants: ExistingTeamParticipant[];
}

export async function getExistingTeamForEvent(
  eventId: string,
  userId: string
): Promise<ExistingTeamData | null> {
  const { data, error } = await supabase.rpc('get_existing_team_for_event', {
    p_event_id: eventId,
    p_user_id: userId,
  });

  if (error || !data || data.length === 0) return null;

  const row = data[0];
  return {
    team_id: row.team_id,
    team_name: row.team_name ?? null,
    team_status: row.team_status ?? null,
    invite_code: row.invite_code ?? null,
    team_lead_id: row.team_lead_id,
    team_lead_email: row.team_lead_email ?? null,
    team_lead_name: row.team_lead_name ?? null,
    team_lead_phone: row.team_lead_phone ?? null,
    college: row.college ?? null,
    is_team: row.is_team ?? true,
    referral_code: row.referral_code ?? null,
    reg_mode: row.reg_mode ?? null,
    payment_mode: row.payment_mode ?? null,
    account_holder_name: row.account_holder_name ?? null,
    attendance: row.attendance ?? false,
    registered_at: row.registered_at ?? null,
    transaction_id: row.transaction_id ?? null,
    transaction_screenshot: row.transaction_screenshot ?? null,
    transaction_verified: row.transaction_verified ?? null,
    verification_mail_sent: row.verification_mail_sent ?? null,
    member_count: Number(row.member_count),
    participants: row.participants ?? [],
  };
}

/**
 * Fetch invite_code and team_status for a given team.
 */
/**
 * Fetches full ExistingTeamData for any team by its ID.
 * Used as a fallback for participants (non-leads) where
 * get_existing_team_for_event only matches team leads.
 */
export async function getTeamDataByTeamId(
  teamId: string
): Promise<ExistingTeamData | null> {
  const [teamRes, participantsRes, countRes] = await Promise.all([
    supabase
      .from('teams')
      .select(
        'team_id, team_name, team_status, invite_code, team_lead_id, team_lead_email, college, is_team, referral_code, reg_mode, payment_mode, account_holder_name, attendance, registered_at, transaction_id, transaction_screenshot, transaction_verified, verification_mail_sent'
      )
      .eq('team_id', teamId)
      .single(),
    supabase
      .from('participants')
      .select('name, phone, email, college, extras')
      .eq('team_id', teamId),
    supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', teamId),
  ]);

  if (teamRes.error || !teamRes.data) return null;

  const t = teamRes.data as any;

  // Resolve team lead name + phone from users table
  const { data: leadUser } = await supabase
    .from('users')
    .select('name, phone')
    .eq('id', t.team_lead_id)
    .maybeSingle();

  return {
    team_id: t.team_id,
    team_name: t.team_name ?? null,
    team_status: t.team_status ?? null,
    invite_code: t.invite_code ?? null,
    team_lead_id: t.team_lead_id,
    team_lead_email: t.team_lead_email ?? null,
    team_lead_name: leadUser?.name ?? null,
    team_lead_phone: leadUser?.phone ?? null,
    college: t.college ?? null,
    is_team: t.is_team ?? true,
    referral_code: t.referral_code ?? null,
    reg_mode: t.reg_mode ?? null,
    payment_mode: t.payment_mode ?? null,
    account_holder_name: t.account_holder_name ?? null,
    attendance: t.attendance ?? false,
    registered_at: t.registered_at ?? null,
    transaction_id: t.transaction_id ?? null,
    transaction_screenshot: t.transaction_screenshot ?? null,
    transaction_verified: t.transaction_verified ?? null,
    verification_mail_sent: t.verification_mail_sent ?? null,
    member_count: (countRes.count ?? 0) + 1,
    participants: (participantsRes.data ?? []) as ExistingTeamParticipant[],
  };
}

export async function getTeamDetails(teamId: string): Promise<{
  invite_code: string | null;
  team_status: 'pending' | 'active' | 'closed' | null;
  team_name: string | null;
  team_lead_id: string | null;
  member_count: number;
} | null> {
  const [teamRes, countRes] = await Promise.all([
    supabase
      .from('teams')
      .select('invite_code, team_status, team_name, team_lead_id')
      .eq('team_id', teamId)
      .single(),
    supabase
      .from('participants')
      .select('*', { count: 'exact', head: true })
      .eq('team_id', teamId),
  ]);

  if (teamRes.error || !teamRes.data) return null;
  return {
    ...(teamRes.data as any),
    member_count: (countRes.count ?? 0) + 1, // +1 for team lead
  };
}

export interface UpdateTeamParams {
  teamId: string;
  teamName: string;
  college: string;
  teamLeadName: string;
  teamMembers: TeamMember[];
  accountHolderName?: string;
}

/**
 * Updates an existing team row and replaces all participants.
 * Used when the user edits a pre-saved (pending/open) team and proceeds to pay.
 */
export async function updateExistingTeam(
  params: UpdateTeamParams
): Promise<boolean> {
  const {
    teamId,
    teamName,
    college,
    teamLeadName,
    teamMembers,
    accountHolderName,
  } = params;

  // 1. Update the team row
  const { error: teamError } = await supabase
    .from('teams')
    .update({
      team_name: teamName,
      college,
      account_holder_name: accountHolderName ?? teamLeadName,
    })
    .eq('team_id', teamId);

  if (teamError) {
    console.error('[updateExistingTeam] team update failed:', teamError);
    toast.error('Failed to update team. Please try again.');
    return false;
  }

  // 2. Replace participants: delete existing then insert new
  await supabase.from('participants').delete().eq('team_id', teamId);

  if (teamMembers.length > 0) {
    const rows = teamMembers.map((m) => ({
      team_id: teamId,
      name: m.name,
      phone: m.phone,
      email: m.email,
      college: m.college,
      extras: m.extras ?? {},
    }));
    const { error: insertError } = await supabase
      .from('participants')
      .insert(rows);
    if (insertError) {
      console.error(
        '[updateExistingTeam] participants insert failed:',
        insertError
      );
    }
  }

  return true;
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

export interface RegistrationParticipant {
  name: string;
  email: string;
  phone: string | null;
  college: string | null;
  extras: Record<string, any> | null;
}

export interface MyRegistration {
  // Team
  team_id: string;
  team_name: string | null;
  team_status: 'pending' | 'active' | 'closed' | null;
  invite_code: string | null;
  college: string | null;
  reg_mode: string | null;
  payment_mode: string | null;
  registered_at: string | null;
  transaction_id: string | null;
  transaction_screenshot: string | null;
  transaction_verified: string | null;
  // Team lead info
  team_lead_name: string | null;
  team_lead_email: string | null;
  team_lead_phone: string | null;
  // Event (full details)
  event_id: string;
  event_name: string;
  event_category_id: string | null;
  registration_fees: number;
  prize_pool: number;
  image_url: string | null;
  schedule: string | null;
  description: string | null;
  rules: string | null;
  reg_status: boolean;
  min_team_size: number;
  max_team_size: number;
  extra_fields: string[] | null;
  // Members
  member_count: number;
  participants: RegistrationParticipant[];
  is_lead: boolean;
  // Payment
  payment_status: string | null;
  payment_amount: number | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  payment_verified_at: string | null;
}

export async function getMyRegistrations(
  festId: string,
  userId: string
): Promise<MyRegistration[]> {
  const { data, error } = await supabase.rpc('get_my_registrations_by_fest', {
    p_fest_id: festId,
    p_user_id: userId,
  });

  if (error || !data) {
    console.error('[getMyRegistrations] RPC error:', error);
    return [];
  }

  return (data as any[]).map((row) => ({
    team_id: row.team_id,
    team_name: row.team_name ?? null,
    team_status: row.team_status ?? null,
    invite_code: row.invite_code ?? null,
    college: row.college ?? null,
    reg_mode: row.reg_mode ?? null,
    payment_mode: row.payment_mode ?? null,
    registered_at: row.registered_at ?? null,
    transaction_id: row.transaction_id ?? null,
    transaction_screenshot: row.transaction_screenshot ?? null,
    transaction_verified: row.transaction_verified ?? null,
    team_lead_name: row.team_lead_name ?? null,
    team_lead_email: row.team_lead_email ?? null,
    team_lead_phone: row.team_lead_phone ?? null,
    event_id: row.event_id,
    event_name: row.event_name,
    event_category_id: row.event_category_id ?? null,
    registration_fees: row.registration_fees ?? 0,
    prize_pool: row.prize_pool ?? 0,
    image_url: row.image_url ?? null,
    schedule: row.schedule ?? null,
    description: row.description ?? null,
    rules: row.rules ?? null,
    reg_status: row.reg_status ?? false,
    min_team_size: row.min_team_size ?? 1,
    max_team_size: row.max_team_size ?? 1,
    extra_fields: row.extra_fields ?? null,
    member_count: Number(row.member_count ?? 1),
    participants: row.participants ?? [],
    is_lead: row.is_lead ?? true,
    payment_status: row.payment_status ?? null,
    payment_amount: row.payment_amount ?? null,
    razorpay_order_id: row.razorpay_order_id ?? null,
    razorpay_payment_id: row.razorpay_payment_id ?? null,
    payment_verified_at: row.payment_verified_at ?? null,
  }));
}
