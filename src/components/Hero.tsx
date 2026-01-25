import { HeroBackground } from './hero/HeroBackground';
// import { HeroCountdown } from './hero/HeroCountdown';
import { HeroCharacters } from './hero/HeroCharacters';
import { HeroContent } from './hero/HeroContent';
import { Sparkles } from './hero/Sparkles';

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen bg-[#050816] overflow-hidden">
      <HeroBackground />
      <Sparkles />
      {/* <HeroCountdown /> */}
      <HeroCharacters />
      <HeroContent />
    </section>
  );
}
