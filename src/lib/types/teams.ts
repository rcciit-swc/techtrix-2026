export interface OrgTeamMember {
  id: string;
  created_at: string;
  fest_id: string | null;
  name: string | null;
  team_id: string | null;
  image: string | null;
  sequence: number | null;
  approved: boolean | null;
  role_name: string | null;
}

export interface DefinedOrgTeam {
  role: string;
  team_name: string | null;
}

// Mapped structure matching the current design
export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface Team {
  category: string;
  id: string;
  path: string;
  icon: React.ReactNode;
  members: TeamMember[];
}

// State and Actions for Zustand store
export interface TeamsStateType {
  teams: Team[];
  teamsLoading: boolean;
  teamsError: string | null;
}

export interface TeamsActionsType {
  fetchTeams: () => Promise<void>;
  clearTeamsError: () => void;
}
