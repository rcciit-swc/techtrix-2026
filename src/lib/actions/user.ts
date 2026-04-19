import { getUserData, updateUserData } from '@/lib/services';

export const populateUserDetails = async (
  set: any,
  background: boolean = false
) => {
  if (!background) set({ userLoading: true });
  const data = await getUserData();
  if (data) {
    set({
      userData: data.data,
      swcData: data.swcData,
      communityData: data.communityData,
      evangelistData: data.evangelistData,
      userLoading: false,
    });
  } else {
    set({ userLoading: false });
  }
};

export const update_and_populate = async (set: any, data: any) => {
  set({ userLoading: true });
  await updateUserData(data);
  const updatedData = await getUserData();
  if (updatedData) {
    set({
      userData: updatedData.data,
      swcData: updatedData.swcData,
      communityData: updatedData.communityData,
      userLoading: false,
    });
  } else {
    set({ userLoading: false });
  }
};
