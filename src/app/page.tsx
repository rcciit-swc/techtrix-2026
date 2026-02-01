import React from 'react';
import EventsSection from '@/components/EventsSection';
import Hero from '@/components/Hero';
import AboutSection from '@/components/about/About';
import Footer from '@/components/Footer';

const page = () => {
  return (
    <div>
      <Hero />
      <AboutSection />
      <EventsSection />
      <Footer />
    </div>
  );
};

export default page;
