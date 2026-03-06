import { create } from 'zustand';
import { populateUserDetails, update_and_populate } from '../actions';
import { userActionsType, userStateType } from '../types';

const userState: userStateType = {
  userData: null,
  communityData: null,
  swcData: null,
  userLoading: false,
  isLoaded: false,
};
export const useUser = create<userActionsType & userStateType>((set) => ({
  ...userState,
  setUserData: (background?: boolean) => populateUserDetails(set, background),
  setCommunityData: (data: any | null) => set({ communityData: data }),
  clearUserData: () =>
    set({ userData: null, communityData: null, userLoading: false }),
  updateUserData: (data: any) => update_and_populate(set, data),
  setLoaded: (isLoaded: boolean) => set({ isLoaded }),
  // Write other reducers with proper actions like above.
}));
