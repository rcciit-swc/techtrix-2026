import React from 'react';
import EventsSection from '@/components/EventsSection';
import Footer from '@/components/Footer';
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
      <Footer />
    </div>
  );
};

export default page;
