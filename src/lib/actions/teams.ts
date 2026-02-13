import { getTeamsGroupedByCategory } from '@/utils/functions/teams/getTeams';
import { getTeamIcon, getTeamPath } from '@/utils/functions/teams/teamIcons';
import { Team, TeamMember } from '../types/teams';

/**
 * Fetches and populates team data from the database
 * Maps the database structure to the UI structure
 */
export const populateTeams = async (set: any) => {
  try {
    set({ teamsLoading: true, teamsError: null });

    const result = await getTeamsGroupedByCategory();

    if (!result) {
      set({
        teams: [],
        teamsLoading: false,
        teamsError: 'Failed to fetch teams data',
      });
      return;
    }

    const { groupedTeams, teamNameMap } = result;

    // Map the grouped data to the Team structure
    const teams: Team[] = [];

    groupedTeams.forEach((members, teamId) => {
      const teamName = teamNameMap.get(teamId) || teamId;

      // Map members to the TeamMember structure
      const mappedMembers: TeamMember[] = members
        .filter((member) => member.name && member.image) // Filter out incomplete data
        .map((member) => ({
          name: member.name || '',
          role: member.role_name || teamName,
          image: member.image || '',
        }));

      // Only add teams that have members
      if (mappedMembers.length > 0) {
        teams.push({
          category: teamName,
          id: teamId,
          path: getTeamPath(teamId),
          icon: getTeamIcon(teamId),
          members: mappedMembers,
        });
      }
    });

    // Sort teams by a predefined order (optional)
    const teamOrder = [
      'faculty',
      'swc',
      'convenors',
      'coordinators',
      'tech',
      'graphics',
      'social_media',
      'pr',
      'logistics',
      'sponsorship',
    ];

    teams.sort((a, b) => {
      const indexA = teamOrder.indexOf(a.id.toLowerCase());
      const indexB = teamOrder.indexOf(b.id.toLowerCase());

      // If both are in the order array, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // If only one is in the order array, prioritize it
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // Otherwise, sort alphabetically
      return a.category.localeCompare(b.category);
    });

    set({ teams, teamsLoading: false, teamsError: null });
  } catch (error: any) {
    console.error('Error populating teams:', error);
    set({
      teams: [],
      teamsLoading: false,
      teamsError: error.message || 'An unexpected error occurred',
    });
  }
};

/**
 * Clears any team-related errors
 */
export const clearTeamsError = (set: any) => {
  set({ teamsError: null });
};
