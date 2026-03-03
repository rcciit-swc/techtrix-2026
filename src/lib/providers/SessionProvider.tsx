'use client';

import { useAuth } from '@/lib/stores/auth';
import { useUser } from '@/lib/stores/user';
import { useEvents } from '@/lib/stores';
import { setSupabaseToken, getSupabaseToken } from '@/lib/supabase/client';
import {
  onFirebaseAuthStateChanged,
  exchangeFirebaseToken,
} from '@/lib/firebase/auth';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const SessionProvider = () => {
  const setAuth = useAuth((state) => state.setAuth);
  const clearAuth = useAuth((state) => state.clearAuth);
  const setUser = useUser((state) => state.setUserData);
  const clearUser = useUser((state) => state.clearUserData);
  const setEvent = useEvents((state) => state.setEventsData);
  const router = useRouter();
  const exchangingRef = useRef(false);

  useEffect(() => {
    // Fetch events on mount (doesn't require auth)
    setEvent();

    // If there's a stored token, restore user data immediately
    if (getSupabaseToken()) {
      setUser();
    }

    // Listen for Firebase auth state changes.
    // With signInWithPopup the flow is straightforward:
    // 1. User clicks login → popup opens → user picks Google account
    // 2. Popup closes → onAuthStateChanged fires with the user
    // 3. We exchange the Firebase token for a Supabase JWT
    const unsubscribe = onFirebaseAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        console.log(
          '[SessionProvider] Firebase user detected:',
          firebaseUser.email
        );
        await handleFirebaseUser(firebaseUser);
      } else {
        console.log('[SessionProvider] No Firebase user');
        // Only clear if there's no stored token (avoid clearing during
        // the initial null state before Firebase hydrates from IndexedDB)
        if (!getSupabaseToken()) {
          clearAuth();
          clearUser();
          setEvent();
        }
      }
    });

    async function handleFirebaseUser(
      firebaseUser: import('firebase/auth').User
    ) {
      // Prevent concurrent token exchanges
      if (exchangingRef.current) return;
      exchangingRef.current = true;

      try {
        console.log('[SessionProvider] Exchanging Firebase token…');
        const idToken = await firebaseUser.getIdToken();
        const result = await exchangeFirebaseToken(idToken);
        console.log(
          '[SessionProvider] Token exchange success:',
          result.user.id
        );

        // Store the Supabase JWT — this rebuilds the Supabase client
        setSupabaseToken(result.access_token);

        // Update auth store with user info
        setAuth({
          userId: result.user.id,
          email: result.user.email,
          profileImage: result.avatarUrl,
          displayName: result.displayName,
        });

        // Refresh user data and events from DB
        setUser();
        setEvent();

        // Only force onboarding for brand-new users.
        // Existing users with partially complete profiles can
        // edit their profile voluntarily from the profile page.
        if (result.isNewUser) {
          const currentPath = window.location.pathname + window.location.search;
          const isAlreadyOnboarding = currentPath.includes('onboarding=true');

          if (!isAlreadyOnboarding) {
            const nextParam =
              currentPath !== '/'
                ? `&next=${encodeURIComponent(currentPath)}`
                : '';
            router.push(`/profile?onboarding=true${nextParam}`);
          }
        }
      } catch (error) {
        console.error(
          '[SessionProvider] Firebase token exchange failed:',
          error
        );
        setSupabaseToken(null);
        clearAuth();
        clearUser();
      } finally {
        exchangingRef.current = false;
      }
    }

    return () => {
      unsubscribe();
    };
  }, [setAuth, clearAuth, setUser, clearUser, setEvent, router]);

  return null;
};

export default SessionProvider;
