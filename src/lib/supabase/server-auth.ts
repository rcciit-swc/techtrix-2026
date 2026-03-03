import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

/**
 * Read and verify the custom Supabase JWT from the httpOnly cookie.
 * Returns the authenticated user's id and email, or null if not authenticated.
 * Use this in API routes instead of `supabase.auth.getUser()`.
 */
export async function getAuthenticatedUser(): Promise<{
  id: string;
  email: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sb-custom-auth-token')?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.SUPABASE_JWT_SECRET!
    ) as jwt.JwtPayload;

    if (!decoded.sub || !decoded.email) return null;

    return { id: decoded.sub, email: decoded.email as string };
  } catch {
    return null;
  }
}
