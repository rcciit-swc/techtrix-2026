'use server';

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

/**
 * Create a Supabase client for server-side use (API routes, server actions).
 * Reads the custom JWT from the httpOnly cookie set by the token bridge.
 * When a valid token is present, RLS policies work as if the user is authenticated.
 */
export async function createServer() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sb-custom-auth-token')?.value ?? null;

  const options: Record<string, unknown> = {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  };

  if (token) {
    options.global = { headers: { Authorization: `Bearer ${token}` } };
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    options
  );
}
