'use client';

import { useEvents } from '@/lib/stores';
import { useUser } from '@/lib/stores/user';
import { supabase } from '@/lib/supabase/client';
import { useEffect } from 'react';

const SessionProvider = () => {
  const setUser = useUser((state) => state.setUserData);
  const clearUser = useUser((state) => state.clearUserData);
  const setEvent = useEvents((state) => state.setEventsData);

  useEffect(() => {
    // Initial fetch
    setUser();
    setEvent();

    // Listen for auth state changes (session restored, sign-in, sign-out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(true);
        setEvent(true);
      } else if (event === 'SIGNED_OUT') {
        clearUser();
        setEvent(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setEvent, clearUser]);

  return null;
};

export default SessionProvider;
