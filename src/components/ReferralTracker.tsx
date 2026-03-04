'use client';

import { updateReferralCode } from '@/lib/services';
import { useUser } from '@/lib/stores';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function ReferralTracker() {
  const searchParams = useSearchParams();
  const { userData } = useUser();

  useEffect(() => {
    const ref = searchParams?.get('ref') || searchParams?.get('referral');

    if (ref) {
      // 1. Store in cookie for non-logged in users (survives login redirect)
      const expires = new Date();
      expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
      document.cookie = `tt_referral=${ref};expires=${expires.toUTCString()};path=/;SameSite=Lax`;

      // 2. If user is logged in, sync to database immediately
      if (userData?.id && userData.referral !== ref) {
        updateReferralCode(ref, userData.id);
      }
    }
  }, [searchParams, userData]);

  return null;
}
