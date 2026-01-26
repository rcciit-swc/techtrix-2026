import React from 'react';
import EventsSection from '@/components/EventsSection';
import PrincipalDesk from '@/components/PrincipleSection';
import SponsorSection from '@/components/SponsorSection';
const page = () => {
  return (
    <div>
      <h1>Techtrix 2026</h1>
      <EventsSection />
      <SponsorSection />
      <PrincipalDesk />
    </div>
  );
};

export default page;
