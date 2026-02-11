import AboutSection from '@/components/about/About';
import EventsSection from '@/components/EventsSection';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import PrincipalDesk from '@/components/PrincipleSection';
import SponsorSection from '@/components/SponsorSection';
import SponsorshipProposition from '@/components/SponsorshipProposition';

const page = () => {
  return (
    <div>
      <Hero />

      <AboutSection />
      <EventsSection />
      <SponsorSection />
      <SponsorshipProposition />
      <PrincipalDesk />
      <Footer />
    </div>
  );
};

export default page;
