'use server';

import { createServer } from '@/lib/supabase/server';

export async function verifySWCStudent(email: string): Promise<boolean> {
  if (!email) return false;

  const validDomains = ['@rcciit.org.in', '@rccinstitute.org', '@rcciit.org'];
  const hasValidDomain = validDomains.some((domain) => email.endsWith(domain));

  if (!hasValidDomain) {
    return false;
  }

  const supabase = await createServer();

  try {
    const { data, error } = await supabase
      .from('SWC-2026')
      .select('email')
      .eq('email', email)
      .single();

    if (error || !data) {
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error verifying SWC student:', err);
    return false;
  }
}
