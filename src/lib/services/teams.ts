import { supabase } from '@/lib/supabase/client';
import { OrgTeamMember, DefinedOrgTeam } from '@/lib/types/teams';

/**
 * Fetches all organization teams with their members from the database
 * @returns Promise containing org teams with members
 */
export const getOrgTeams = async (): Promise<OrgTeamMember[] | null> => {
  try {
    const { data, error } = await supabase
      .from('org_teams')
      .select('*')
      .eq('approved', true)
      .order('sequence', { ascending: true });

    if (error) {
      console.error('Error fetching org teams:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching org teams:', error);
    return null;
  }
};

/**
 * Fetches all defined organization team categories
 * @returns Promise containing defined team categories
 */
export const getDefinedOrgTeams = async (): Promise<
  DefinedOrgTeam[] | null
> => {
  try {
    const { data, error } = await supabase
      .from('defined_org_teams')
      .select('*')
      .order('role', { ascending: true });

    if (error) {
      console.error('Error fetching defined org teams:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching defined org teams:', error);
    return null;
  }
};

/**
 * Fetches organization teams grouped by team category
 * @returns Promise containing teams grouped by category
 */
export const getTeamsGroupedByCategory = async () => {
  try {
    const [orgTeams, definedTeams] = await Promise.all([
      getOrgTeams(),
      getDefinedOrgTeams(),
    ]);

    if (!orgTeams || !definedTeams) {
      return null;
    }

    // Create a map of team_id to team_name
    const teamNameMap = new Map<string, string>();
    definedTeams.forEach((team) => {
      teamNameMap.set(team.role, team.team_name || team.role);
    });

    // Group members by team_id
    const groupedTeams = new Map<string, OrgTeamMember[]>();
    orgTeams.forEach((member) => {
      if (member.team_id) {
        if (!groupedTeams.has(member.team_id)) {
          groupedTeams.set(member.team_id, []);
        }
        groupedTeams.get(member.team_id)?.push(member);
      }
    });

    return {
      groupedTeams,
      teamNameMap,
    };
  } catch (error) {
    console.error('Error grouping teams by category:', error);
    return null;
  }
};
