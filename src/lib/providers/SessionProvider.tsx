'use client';

import { useEvents } from '@/lib/stores';
import { useUser } from '@/lib/stores/user';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SessionProvider = () => {
  const setUser = useUser((state) => state.setUserData);
  const clearUser = useUser((state) => state.clearUserData);
  const setEvent = useEvents((state) => state.setEventsData);
  const router = useRouter();

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

        if (event === 'SIGNED_IN') {
          // After a new sign-in, redirect to the originally intended page.
          // This is a fallback for when the OAuth provider strips the ?next= param
          // from the redirectTo URL, causing the callback to land on /.
          const loginRedirect = sessionStorage.getItem('login_redirect');
          if (loginRedirect && loginRedirect !== '/') {
            // If on the profile/onboarding page, leave it for handleProfileSave to consume.
            if (!window.location.pathname.startsWith('/profile')) {
              sessionStorage.removeItem('login_redirect');
              const currentPath =
                window.location.pathname + window.location.search;
              if (currentPath !== loginRedirect) {
                router.replace(loginRedirect);
              }
            }
          }
        }
      } else if (event === 'SIGNED_OUT') {
        clearUser();
        setEvent(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setUser, setEvent, clearUser]);

  return null;
};

export default SessionProvider;
