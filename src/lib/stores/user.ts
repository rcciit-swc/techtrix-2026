import { create } from 'zustand';
import { userActionsType, userStateType } from '../types';
import { populateUserDetails, update_and_populate } from '../actions';

const userState: userStateType = {
  userData: null,
  swcData: null,
  userLoading: false,
  isLoaded: false,
};
export const useUser = create<userActionsType & userStateType>((set) => ({
  ...userState,
  setUserData: () => populateUserDetails(set),
  clearUserData: () => set({ userData: null, userLoading: false }),
  updateUserData: (data: any) => update_and_populate(set, data),
  setLoaded: (isLoaded: boolean) => set({ isLoaded }),
  // Write other reducers with proper actions like above.
}));
