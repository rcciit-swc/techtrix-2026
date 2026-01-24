import { create } from 'zustand';
import { userActionsType, userStateType } from '../types';
import { populateUserDetails } from '../actions';

const userState: userStateType = {
  userData: null,
  userLoading: false,
};
export const useUser = create<userActionsType | userStateType>((set) => ({
  ...userState,
  setUserData: () => populateUserDetails(set),
  // Write other reducers with proper actions like above.
}));
