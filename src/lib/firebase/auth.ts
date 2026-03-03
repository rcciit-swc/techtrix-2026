import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged as _onAuthStateChanged,
  signOut as _signOut,
  type User,
  type Unsubscribe,
  type Auth,
} from 'firebase/auth';
import { getFirebaseApp } from './config';

let _auth: Auth | null = null;
const googleProvider = new GoogleAuthProvider();

/** Get the Firebase Auth instance (lazy init) */
function getFirebaseAuth(): Auth {
  if (!_auth) {
    _auth = getAuth(getFirebaseApp());
  }
  return _auth;
}

/**
 * Trigger Google sign-in via popup.
 * Returns the signed-in user. The SessionProvider's onAuthStateChanged
 * listener will pick up the state change and exchange the token.
 */
export const signInWithGoogle = () =>
  signInWithPopup(getFirebaseAuth(), googleProvider);

/** Sign out from Firebase */
export const firebaseSignOut = () => _signOut(getFirebaseAuth());

/** Listen to Firebase auth state changes */
export const onFirebaseAuthStateChanged = (
  callback: (user: User | null) => void
): Unsubscribe => _onAuthStateChanged(getFirebaseAuth(), callback);

/** Get the current Firebase user */
export const getFirebaseUser = () => getFirebaseAuth().currentUser;

/** Get a fresh Firebase ID token for the current user */
export const getFirebaseIdToken = async (): Promise<string | null> => {
  const user = getFirebaseAuth().currentUser;
  if (!user) return null;
  return user.getIdToken();
};

/** Exchange a Firebase ID token for a Supabase-compatible JWT via our token bridge */
export async function exchangeFirebaseToken(idToken: string): Promise<{
  access_token: string;
  user: { id: string; email: string };
  isNewUser: boolean;
  isProfileComplete: boolean;
  avatarUrl: string | null;
  displayName: string | null;
}> {
  const res = await fetch('/api/auth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firebaseToken: idToken }),
  });
  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ error: 'Token exchange failed' }));
    throw new Error(error.error || 'Token exchange failed');
  }
  return res.json();
}
