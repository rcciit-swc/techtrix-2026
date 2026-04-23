'use client';

import AboutSection from '@/components/about/About';
import CommunityPartners from '@/components/CommunityPartners';
import Evangelists from '@/components/Evangelists';
import EventsSection from '@/components/EventsSection';
import FeaturedEvents from '@/components/FeaturedEvents';
import Hero from '@/components/Hero';
import PartnerSection from '@/components/PartnerSection';
import PrincipalDesk from '@/components/PrincipleSection';
import SplashLoader from '@/components/SplashLoader';
import SponsorSection from '@/components/SponsorSection';
import SponsorshipProposition from '@/components/SponsorshipProposition';
import { useUser } from '@/lib/stores';
import { useEffect, useState } from 'react';

const page = () => {
  const [loading, setLoading] = useState(true);
  const { isLoaded, setLoaded } = useUser();

  useEffect(() => {
    // Skip splash on repeat visits
    if (isLoaded) {
      setLoading(false);
      return;
    }
    // 1.8s display + 0.35s fade = ~2.15s total
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  return (
    <>
      {/* Splash sits on top (z-9999, position:fixed) — content renders behind it
          so there is no flash when the splash fades out */}
      <SplashLoader isLoading={loading} onComplete={() => setLoaded(true)} />
      <div>
        <Hero />
        <AboutSection />
        <EventsSection />
        <FeaturedEvents />
        <SponsorSection />
        <PartnerSection />
        <CommunityPartners />
        <Evangelists />
        <SponsorshipProposition />
        <PrincipalDesk />
      </div>
    </>
  );
};

export default page;
