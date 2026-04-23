import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export const getUserData = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    // If there's no session or an error, return early without throwing
    if (error || !data?.session) {
      return null;
    }

    const userdetails = await supabase
      .from('users')
      .select('*')
      .eq('id', data.session.user.id);

    if (userdetails && userdetails.data && userdetails.data.length > 0) {
      const swcData = await supabase
        .from('SWC-2026')
        .select('*')
        .eq('email', userdetails.data[0].email);

      const communityData = await supabase
        .from('community_partners')
        .select('*')
        .eq('community_email', userdetails.data[0].email)
        .maybeSingle();

      const evangelistData = await supabase
        .from('evangelists')
        .select('*')
        .eq('email', userdetails.data[0].email)
        .maybeSingle();

      const returnValue = {
        data: userdetails.data[0],
        swcData:
          swcData.data && swcData.data.length > 0 ? swcData.data[0] : null,
        communityData: communityData.data || null,
        evangelistData: evangelistData.data || null,
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

export async function checkAllMembersSWC(emails: string[]): Promise<boolean> {
  if (!emails.length) return false;
  const { data, error } = await supabase
    .from('SWC-2026')
    .select('email')
    .in('email', emails);
  if (error || !data) return false;
  // Every email in the list must have a matching SWC row
  return data.length >= emails.length;
}

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

export const validateReferralCode = async (code: string) => {
  try {
    const { data, error } = await supabase
      .from('community_partners')
      .select('referral_code')
      .eq('referral_code', code)
      .single();

    if (error || !data) {
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error validating referral code:', err);
    return false;
  }
};

export const updateReferralCode = async (code: string, id: string) => {
  try {
    await supabase.from('users').update({ referral: code }).eq('id', id);
  } catch (e) {
    console.log(e);
  }
};
