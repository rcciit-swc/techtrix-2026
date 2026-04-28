'use server';

import { CURRENT_FEST_ID } from '@/lib/constants/fests';
import { createServer } from '@/lib/supabase/server';
import { EvangelistStats, RegistrationDetail } from '@/lib/types/evangelists';

export interface EvangelistItem {
  referral_code: string;
  name: string;
  image: string | null;
  college: string | null;
}

export async function getEvangelistsList(): Promise<EvangelistItem[]> {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from('evangelists')
    .select('referral_code, name, image, college')
    .eq('fest_id', CURRENT_FEST_ID)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching evangelists:', error);
    return [];
  }

  return (data || []).map((row: any) => ({
    referral_code: row.referral_code,
    name: row.name,
    image: row.image || null,
    college: row.college || null,
  }));
}

export async function getEvangelistLeaderboard(): Promise<EvangelistStats[]> {
  const supabase = await createServer();

  const { data, error } = await supabase.rpc('get_evangelist_leaderboard', {
    p_fest_id: CURRENT_FEST_ID,
  });

  if (error) {
    console.error('Error fetching evangelist leaderboard:', error);
    return [];
  }

  return data as EvangelistStats[];
}

export async function getEvangelistEventRegistrations(
  referralCode: string,
  eventId: string
): Promise<RegistrationDetail[]> {
  const supabase = await createServer();

  const { data, error } = await supabase.rpc(
    'get_event_registrations_by_evangelist_referral',
    {
      p_referral_code: referralCode,
      p_event_id: eventId,
    }
  );

  if (error) {
    console.error('Error fetching evangelist event registrations:', error);
    return [];
  }

  return data as RegistrationDetail[];
}
