import { signInWithGoogle, firebaseSignOut } from '@/lib/firebase/auth';
import { setSupabaseToken } from '@/lib/supabase/client';
import { useAuth } from '@/lib/stores/auth';

/**
 * Trigger Google sign-in via Firebase popup.
 * The popup closes once the user picks their account, then
 * onAuthStateChanged fires in SessionProvider which handles the token exchange.
 */
export const login = async (_next?: string) => {
  try {
    console.log('[auth] Starting Google sign-in popup…');
    const result = await signInWithGoogle();
    console.log('[auth] Popup resolved, user:', result?.user?.email);
    // SessionProvider's onAuthStateChanged will handle the rest
  } catch (error) {
    console.error('[auth] Login Error:', error);
    return null;
  }
};

/**
 * Sign out: Firebase + clear Supabase token + clear server cookie.
 */
export const logout = async () => {
  try {
    // Sign out from Firebase
    await firebaseSignOut();

    // Clear Supabase token (rebuilds client without auth)
    setSupabaseToken(null);

    // Clear auth store
    useAuth.getState().clearAuth();

    // Clear server-side cookie
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});

    // Redirect to home
    window.location.href = '/';
  } catch (error) {
    console.error('Logout failed:', error);
    window.location.href = '/';
  }
};
