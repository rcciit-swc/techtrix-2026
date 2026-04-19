'use server';

import { CURRENT_FEST_ID } from '@/lib/constants/fests';
import { createServer } from '@/lib/supabase/server';

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
