import CommunityPartnerOnboard from '@/components/community-partner/CommunityPartnerOnboard';
import { Suspense } from 'react';

export const metadata = {
  title: 'Community Partner Onboarding | TechTrix 2026',
  description: 'Complete your community partner onboarding for TechTrix 2026.',
};

export default function OnboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-pulse text-yellow-400 text-lg font-semibold tracking-wider">
            Loading...
          </div>
        </div>
      }
    >
      <CommunityPartnerOnboard />
    </Suspense>
  );
}
