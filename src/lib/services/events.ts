import { supabase } from '@/lib/supabase/client';
import { events } from '@/lib/types/events';
import { toast } from 'sonner';
import { CURRENT_FEST_ID } from '../constants';

export const getEventCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('event_categories')
      .select('*')
      .eq('fest_id', CURRENT_FEST_ID);
    if (error) return error;
    return data;
  } catch (error: any) {
    toast.error(error.message);
  }
};

export const getEventsData = async (): Promise<events[] | null> => {
  try {
    const { data: authData } = await supabase.auth.getSession();
    const userId = authData?.session?.user?.id ?? null;

    const { data, error } = await supabase.rpc(
      'get_events_with_participants_and_extras_by_fest',
      {
        p_fest_id: CURRENT_FEST_ID,
        p_user_id: userId,
      }
    );

    if (error) {
      console.error('Error fetching events:', error);
      return null;
    }

    // Map RPC field names to the expected type fields
    const mapped = (data as any[])?.map((event: any) => {
      const { is_registered, ...rest } = event;
      return {
        ...rest,
        registered: is_registered ?? false,
      };
    });

    return mapped as events[];
  } catch (err) {
    console.error('Unexpected error fetching events:', err);
    return null;
  }
};

export const getEventByID = async (id: string): Promise<events | null> => {
  const { data, error } = await supabase
    .from('events')
    .select(
      'id, name, description, event_category_id, min_team_size, max_team_size, registration_fees, prize_pool, schedule, rules, reg_status, image_url, links, coordinators, convenors, extra_fields'
    )
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }

  return data as events | null;
};
