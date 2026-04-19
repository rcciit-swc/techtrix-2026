import EvangelistOnboard from '@/components/evangelist/EvangelistOnboard';
import { Suspense } from 'react';

export const metadata = {
  title: 'Evangelist Onboarding | TechTrix 2026',
  description: 'Complete your evangelist onboarding for TechTrix 2026.',
};

export default function EvangelistOnboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="animate-pulse text-cyan-400 text-lg font-semibold tracking-wider">
            Loading...
          </div>
        </div>
      }
    >
      <EvangelistOnboard />
    </Suspense>
  );
}
