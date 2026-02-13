import { create } from 'zustand';
import { TeamsStateType, TeamsActionsType } from '../types/teams';
import { populateTeams, clearTeamsError } from '../actions/teams';

type TeamsStoreType = TeamsStateType & TeamsActionsType;

const teamsState: TeamsStateType = {
  teams: [],
  teamsLoading: false,
  teamsError: null,
};

export const useTeams = create<TeamsStoreType>((set) => ({
  ...teamsState,
  fetchTeams: async () => await populateTeams(set),
  clearTeamsError: () => clearTeamsError(set),
}));
