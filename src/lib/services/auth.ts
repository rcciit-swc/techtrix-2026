import { supabase } from '@/lib/supabase/client';

export const login = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: location.origin + '/api/auth/callback?next=',
    },
  });
  if (error) {
    console.log('some error ocurred ');
    console.error('Login Error:', error);
    return null;
  }
  return data;
};

export const logout = async () => {
  const { data: session } = await supabase.auth.getSession();

  if (!session || !session.session) {
    console.warn('No active session found.');
    window.location.href = '/'; // Redirect anyway
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout failed:', error.message);
  }

  window.location.href = '/';
};
