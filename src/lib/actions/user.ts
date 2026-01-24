import { getUserData } from '@/utils/functions';

export const populateUserDetails = async (set: any) => {
  set({ userLoading: true });
  // logic
  await getUserData();
  set({ userLoading: false });
};
