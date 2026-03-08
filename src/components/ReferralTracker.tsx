'use client';

import { updateReferralCode, validateReferralCode } from '@/lib/services';
import { useUser } from '@/lib/stores';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function ReferralTracker() {
  const searchParams = useSearchParams();
  const { userData } = useUser();

  useEffect(() => {
    const handleReferral = async () => {
      const refFromUrl =
        searchParams?.get('ref') || searchParams?.get('referral');
      let finalRef = refFromUrl;
      let isVerified = false;

      // 1. If we have a referral code in the URL, verify and store it
      if (refFromUrl) {
        const isValid = await validateReferralCode(refFromUrl);
        if (isValid) {
          const expires = new Date();
          expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
          document.cookie = `tt_referral=${refFromUrl};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
          isVerified = true;
        } else {
          finalRef = null;
        }
      }

      // 2. If no valid URL ref, try getting from cookie
      if (!finalRef) {
        const getCookie = (name: string): string | null => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) {
            const val = parts.pop()?.split(';').shift();
            return val || null;
          }
          return null;
        };
        finalRef = getCookie('tt_referral');
      }

      // 3. If we have a ref (from URL or cookie), sync to database if user is logged in
      if (userData?.id && finalRef && userData.referral !== finalRef) {
        if (!isVerified) {
          isVerified = await validateReferralCode(finalRef);
        }
        if (isVerified) {
          updateReferralCode(finalRef, userData.id);
        }
      }
    };

    handleReferral();
  }, [searchParams, userData]);

  return null;
}
