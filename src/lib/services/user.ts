import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { createServer } from '@/lib/supabase/server';
import { useAuth } from '@/lib/stores/auth';

export const getUserData = async () => {
  try {
    // Read userId from the auth store (populated by Firebase auth flow)
    const { userId } = useAuth.getState();

    if (!userId) {
      return null;
    }

    const userdetails = await supabase
      .from('users')
      .select('*')
      .eq('id', userId);

    if (userdetails && userdetails.data && userdetails.data.length > 0) {
      const swcData = await supabase
        .from('SWC-2026')
        .select('*')
        .eq('email', userdetails.data[0].email);
      const returnValue = {
        data: userdetails.data[0],
        swcData:
          swcData.data && swcData.data.length > 0 ? swcData.data[0] : null,
      };
      return returnValue;
    }

    return null;
  } catch (err) {
    // Only log the error, don't show toast for auth errors when not logged in
    console.error('Error fetching user data:', err);
    return null;
  }
};

export const updateUserData = async (data: any) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        name: data.full_name,
        phone: data.phone,
        gender: data.gender,
        stream: data.stream,
        college: data.college,
        college_roll: data.college_roll,
        course: data.course,
      })
      .eq('id', data.id);
    if (error) {
      throw error;
    }
    return;
  } catch (error) {
    toast.error('Error updating user data');
    throw error;
  }
};

export const handleSaveChanges = async (
  formData: FormData,
  userData: any,
  updateUserData: (updatedData: any) => Promise<void> | void,
  closeModal: () => void
) => {
  const formDataObj = Object.fromEntries(formData.entries());

  if (!formDataObj.gender) {
    toast.error('Gender is required');
    throw new Error('Gender is required');
  } else if (!formDataObj.fullName) {
    toast.error('Full name is required');
    throw new Error('Full name is required');
  } else if (!formDataObj.phone) {
    toast.error('Phone number is required');
    throw new Error('Phone number is required');
  } else if (!/^\d{10}$/.test(formDataObj.phone as string)) {
    toast.error('Invalid phone number');
    throw new Error('Invalid phone number');
  } else if (!formDataObj.stream) {
    toast.error('Stream is required');
    throw new Error('Stream is required');
  } else if (!formDataObj.college) {
    toast.error('College is required');
    throw new Error('College is required');
  } else if (!formDataObj.college_roll) {
    toast.error('College Roll is required');
    throw new Error('College Roll is required');
  } else if (!formDataObj.course) {
    toast.error('Course is required');
    throw new Error('Course is required');
  }

  if (!userData?.id) {
    toast.error('User data not found');
    throw new Error('User data not found');
  }

  const updatedData = {
    id: userData.id,
    full_name: formDataObj.fullName,
    phone: formDataObj.phone,
    gender: formDataObj.gender,
    stream: formDataObj.stream,
    college: formDataObj.college,
    college_roll: formDataObj.college_roll,
    course: formDataObj.course,
  };

  try {
    await updateUserData(updatedData);
    toast.success('Profile updated successfully');
  } catch (error) {
    console.error('Error updating user data:', error);
    toast.error('Failed to update profile');
  } finally {
    closeModal();
  }
};

export const getSWCData = async (collegeRoll: string, email: string) => {
  try {
    const { data } = await supabase
      .from('SWC-2026')
      .select('*')
      .or(`roll.ilike.${collegeRoll},email.eq.${email}`);
    return data && data.length > 0;
  } catch (err) {
    toast.error('Error fetching SWC data');
    return false;
  }
};

export async function fetchRegistrationDetails(
  eventId: string,
  userId: string
): Promise<
  Array<{
    is_team: boolean;
    team_name: string;
    team_members: Array<{
      name: string;
      email: string;
      phone: string;
    }>;
  }>
> {
  const { data, error } = await supabase.rpc('get_registration_details', {
    p_event_id: eventId,
    p_user_id: userId,
  });

  if (error) {
    console.error('Error fetching registration details:', error);
    throw new Error('Failed to fetch registration details');
  }

  return data;
}

export const verifyCommunityReferralCode = async (code: string) => {
  try {
    const supabase = await createServer();
    const { data, error } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', code);
  } catch (err) {
    console.log(err);
  }
};

export const updateReferralCode = async (code: string, id: string) => {
  try {
    await supabase.from('users').update({ referral: code }).eq('id', id);
  } catch (e) {
    console.log(e);
  }
};
