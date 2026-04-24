import EventCardsCluster from '@/components/EventCardsCluster';
import GenericLoader from '@/components/GenericLoader';
import { categories } from '@/components/EventsSection';
import { constructMetaData } from '@/lib/utils';
import type { Metadata } from 'next';
import { Suspense } from 'react';

const BASE_URL = 'https://techtrix.rcciit.org.in';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorieId: string }>;
}): Promise<Metadata> {
  const { categorieId } = await params;
  const category = categories.find((c) => c.id === categorieId);
  const name = category?.name ?? 'Events';

  return constructMetaData({
    title: `${name} Events`,
    description: `Explore ${name} events at Techtrix 2026 — the Annual Inter-College National Level Technical Fest of RCCIIT, Kolkata. Register and compete now.`,
    openGraphType: 'website',
    canonical: `${BASE_URL}/events/${categorieId}`,
  });
}

export default async function EventsPage() {
  return (
    <div
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/profile/profilebg.jpeg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Animated Background Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(250, 204, 21, 0.1) 0%, transparent 70%)',
          animation: 'pulse 8s infinite',
        }}
      />

      <main className="relative z-10 h-full w-full">
        <Suspense
          fallback={
            <div className="h-screen w-full flex items-center justify-center">
              <GenericLoader />
            </div>
          }
        >
          <EventCardsCluster />
        </Suspense>
      </main>
    </div>
  );
}
