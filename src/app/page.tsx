'use client';

import AboutSection from '@/components/about/About';
import EventsSection from '@/components/EventsSection';
import Hero from '@/components/Hero';
import PartnerSection from '@/components/PartnerSection';
import PrincipalDesk from '@/components/PrincipleSection';
import SplashLoader from '@/components/SplashLoader';
import SponsorSection from '@/components/SponsorSection';
import SponsorshipProposition from '@/components/SponsorshipProposition';
import { useUser } from '@/lib/stores';
import { useCallback, useEffect, useState } from 'react';

const page = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(true);
  const { isLoaded, setLoaded } = useUser();

  useEffect(() => {
    // If user has already loaded (e.g., navigated back to home), skip splash
    if (isLoaded) {
      setShowSplash(false);
      setLoading(false);
      return;
    }

    // Set timer for splash screen duration
    const timer = setTimeout(() => {
      setLoading(false); // Trigger exit animation
    }, 3500);

    return () => clearTimeout(timer);
  }, [isLoaded]);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    setLoaded(true);
  }, [setLoaded]);

  return (
    <>
      {showSplash && (
        <SplashLoader isLoading={loading} onComplete={handleSplashComplete} />
      )}
      <div className="animate-fade-in">
        <Hero />
        <AboutSection />
        <EventsSection />
        <SponsorSection />
        <PartnerSection />
        <SponsorshipProposition />
        <PrincipalDesk />
      </div>
    </>
  );
};

export default page;
