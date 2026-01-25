import React from 'react';
import EventsSection from '@/components/EventsSection';
import Hero from '@/components/Hero';
import AboutSection from '@/components/about/About';

const page = () => {
  return (
    <div>
      <Hero />
      <AboutSection />
      <EventsSection />
    </div>
  );
};

export default page;
