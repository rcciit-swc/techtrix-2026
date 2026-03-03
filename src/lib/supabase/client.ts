'use client';

import {
  createClient as _createClient,
  SupabaseClient,
} from '@supabase/supabase-js';

/**
 * Build a Supabase client optionally authenticated with a custom JWT.
 * When token is provided, RLS policies see auth.uid() = the JWT's `sub` claim.
 * When token is null, the client uses the anon key (public access).
 */
function buildClient(token: string | null): SupabaseClient {
  const options: Record<string, unknown> = {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  };

  if (token) {
    options.global = { headers: { Authorization: `Bearer ${token}` } };
  }

  return _createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    options
  );
}

/** The real Supabase client instance, rebuilt whenever the token changes */
let _currentClient: SupabaseClient = buildClient(
  typeof window !== 'undefined'
    ? localStorage.getItem('sb-custom-access-token')
    : null
);

/** Update the stored JWT and rebuild the Supabase client */
export function setSupabaseToken(token: string | null) {
  if (typeof window !== 'undefined') {
    if (token) localStorage.setItem('sb-custom-access-token', token);
    else localStorage.removeItem('sb-custom-access-token');
  }
  _currentClient = buildClient(token);
}

/** Read the stored JWT (client-side only) */
export function getSupabaseToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sb-custom-access-token');
}

/**
 * Proxy over the real client — all property accesses are forwarded
 * to the current `_currentClient`. When `setSupabaseToken()` swaps
 * the underlying client, every `supabase.from(...)` call automatically
 * uses the new, correctly-authenticated instance.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop: string | symbol) {
    return (_currentClient as unknown as Record<string | symbol, unknown>)[
      prop
    ];
  },
});

/** Create a fresh Supabase client with the current token */
export function createClient() {
  return buildClient(getSupabaseToken());
}
