import { events } from '@/lib/types/events';
import { supabase } from '@/lib/supabase/client';
import { CURRENT_FEST_ID } from '../constants';
import { toast } from 'sonner';

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
      'get_events_with_participants_by_fest',
      {
        p_fest_id: CURRENT_FEST_ID,
        p_user_id: userId,
      }
    );

    if (error) {
      console.error('Error fetching events:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error fetching events:', err);
    return null;
  }
};

export const getEventByID = async (id: string): Promise<events | null> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id);

  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }

  // Return the first result, since the RPC returns a table (array)
  return data && data.length > 0 ? data[0] : null;
};
