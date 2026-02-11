import { HeroBackground } from './hero/HeroBackground';
import { HeroCharacters } from './hero/HeroCharacters';
import { HeroContent } from './hero/HeroContent';
import { Sparkles } from './hero/Sparkles';

export default function Hero() {
  return (
    <section className="relative w-full h-screen bg-[#050816] overflow-hidden flex flex-col items-center justify-start pt-16 md:pt-20">
      <HeroBackground />
      <Sparkles />
      <HeroCharacters />
      <HeroContent />
    </section>
  );
}
