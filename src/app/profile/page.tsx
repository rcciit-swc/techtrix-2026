import ProfileContent from '@/components/profile/ProfilePageContent';
import ProfileSkeleton from '@/components/profile/ProfileSkeleton';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'My Profile | Techtrix 2026',
  description:
    'Manage your Techtrix 2026 profile and view your event registrations.',
  robots: { index: false, follow: false },
};

export default function ProfilePage() {
  return (
    // do not remove this Suspense component ( yes i am talking to you and i am not ai )
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
