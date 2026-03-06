'use server';

import { CURRENT_FEST_ID } from '@/lib/constants';
import { createServer } from '@/lib/supabase/server';

export interface CommunityEventBreakdown {
  event_id: string;
  event_name: string;
  registration_count: number;
}

export interface CommunityStats {
  referral_code: string;
  community_name: string;
  community_image: string | null;
  community_email: string | null;
  total_registrations: number;
  total_signups: number;
  event_breakdown: CommunityEventBreakdown[];
}

export interface RegistrationDetail {
  team_id: string;
  team_name: string | null;
  team_lead_email: string | null;
  college: string | null;
  registered_at: string | null;
  is_team: boolean;
  participants: {
    name: string;
    email: string;
    phone: string | null;
    college: string | null;
  }[];
}

export async function getCommunityLeaderboard(): Promise<CommunityStats[]> {
  const supabase = await createServer();

  const { data, error } = await supabase.rpc('get_community_leaderboard', {
    p_fest_id: CURRENT_FEST_ID,
  });

  if (error) {
    console.error('Error fetching community leaderboard:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    referral_code: row.referral_code,
    community_name: row.community_name,
    community_image: row.community_image || null,
    community_email: row.community_email || null,
    total_registrations: Number(row.total_registrations) || 0,
    total_signups: Number(row.total_signups) || 0,
    event_breakdown: (row.event_breakdown || []) as CommunityEventBreakdown[],
  }));
}

export async function getEventRegistrations(
  referralCode: string,
  eventId: string
): Promise<RegistrationDetail[]> {
  const supabase = await createServer();

  const { data, error } = await supabase.rpc(
    'get_event_registrations_by_referral',
    {
      p_referral_code: referralCode,
      p_event_id: eventId,
    }
  );

  if (error) {
    console.error('Error fetching event registrations:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    team_id: row.team_id,
    team_name: row.team_name,
    team_lead_email: row.team_lead_email,
    college: row.college,
    registered_at: row.registered_at,
    is_team: row.is_team ?? false,
    participants: (row.participants ||
      []) as RegistrationDetail['participants'],
  }));
}
