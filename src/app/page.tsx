import React from 'react';
import EventsSection from '@/components/EventsSection';
import Hero from '@/components/Hero';
import AboutSection from '@/components/about/About';
import PrincipalDesk from '@/components/PrincipleSection';
import SponsorSection from '@/components/SponsorSection';
const page = () => {
  return (
    <div>
      <Hero />
      <SponsorSection />
      <AboutSection />
      <EventsSection />
      <PrincipalDesk />
    </div>
  );
};

export default page;
