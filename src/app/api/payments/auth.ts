import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Verifies if a user is authorized to perform actions for a team
 * (either as the team lead or as a registered participant).
 */
export async function verifyTeamMembership(
  teamId: string,
  userId: string,
  userEmail?: string,
  teamLeadId?: string | null
): Promise<boolean> {
  // Check if they are the team lead
  if (teamLeadId && teamLeadId === userId) {
    return true;
  }

  // Need email to check participants table
  if (!userEmail) {
    return false;
  }

  // Check if they are a participant
  const { data: participant, error } = await supabaseAdmin
    .from('participants')
    .select('email')
    .eq('team_id', teamId)
    .eq('email', userEmail)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      '[verifyTeamMembership] Error verifying team participant:',
      error
    );
    return false;
  }

  return !!participant;
}
