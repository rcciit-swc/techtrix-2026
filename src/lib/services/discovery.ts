import { supabase } from '@/lib/supabase/client';

export interface DiscoveryUser {
  name: string;
  email: string | null;
  college: string | null;
  phone: string | null;
}

export interface DiscoveryTeamMember {
  name: string;
  phone: string | null;
}

export interface DiscoveryTeam {
  team_id: string;
  team_name: string | null;
  invite_code: string | null;
  participants: DiscoveryTeamMember[];
}

export interface DiscoveryListing {
  id: string;
  type: 'looking' | 'open_team';
  event_id: string;
  user_id: string;
  message: string | null;
  slots_available: number | null;
  status: 'active' | 'matched' | 'withdrawn';
  created_at: string;
  user: DiscoveryUser;
  team: DiscoveryTeam | null;
}

export async function getDiscoveryListings(
  eventId: string
): Promise<{ looking: DiscoveryListing[]; open_teams: DiscoveryListing[] }> {
  const { data, error } = await supabase
    .from('team_discovery')
    .select(
      `id, type, event_id, user_id, message, slots_available, status, created_at,
       user:users(name, email, college, phone),
       team:teams(team_id, team_name, invite_code, participants(name, phone))`
    )
    .eq('event_id', eventId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error || !data) {
    return { looking: [], open_teams: [] };
  }

  const listings = data as unknown as DiscoveryListing[];
  return {
    looking: listings.filter((l) => l.type === 'looking'),
    open_teams: listings.filter((l) => l.type === 'open_team'),
  };
}

export async function addToWaitlist(
  eventId: string,
  userId: string,
  message: string
): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('team_discovery')
    .upsert(
      {
        event_id: eventId,
        user_id: userId,
        type: 'looking',
        message,
        status: 'active',
      },
      { onConflict: 'event_id,user_id' }
    )
    .select('id')
    .single();

  if (error) {
    console.error('addToWaitlist error:', error);
    return null;
  }
  return data;
}

export async function postOpenTeam(
  eventId: string,
  userId: string,
  teamId: string,
  slotsAvailable: number,
  message: string
): Promise<{ id: string } | null> {
  const { data, error } = await supabase
    .from('team_discovery')
    .upsert(
      {
        event_id: eventId,
        user_id: userId,
        type: 'open_team',
        team_id: teamId,
        slots_available: slotsAvailable,
        message,
        status: 'active',
      },
      { onConflict: 'event_id,user_id' }
    )
    .select('id')
    .single();

  if (error) {
    console.error('postOpenTeam error:', error);
    return null;
  }
  return data;
}

export async function withdrawFromDiscovery(
  eventId: string,
  userId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('team_discovery')
    .update({ status: 'withdrawn' })
    .eq('event_id', eventId)
    .eq('user_id', userId);

  return !error;
}

export async function getMyDiscoveryEntry(
  eventId: string,
  userId: string
): Promise<DiscoveryListing | null> {
  const { data, error } = await supabase
    .from('team_discovery')
    .select(
      `id, type, event_id, user_id, message, slots_available, status, created_at,
       user:users(name, email, college, phone),
       team:teams(team_id, team_name, invite_code, participants(name, phone))`
    )
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (error || !data) return null;
  return data as unknown as DiscoveryListing;
}
