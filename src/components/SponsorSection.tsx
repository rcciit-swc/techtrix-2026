import Image from 'next/image';
import { DynamicBackground } from './AnimatedBackground';

const SponsorSection = () => {
  return (
    <div className="relative w-full py-12 md:py-16 overflow-hidden">
      {/* Animated Background */}
      <DynamicBackground variant="sponsors" />

      <div className="absolute inset-0 -z-10">
        <Image
          src="/SponsorSection/SponsorBG.png"
          alt="Background"
          fill
          className="object-cover opacity-90"
        />
      </div>

      <div className="flex flex-col items-center justify-center font-bold gap-8 md:gap-12 px-4">
        <div className="text-center">
          <h1
            className="text-white text-center"
            style={{
              fontFamily: 'VerveAlternate',
              fontSize: '35px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: 'normal',
            }}
          >
            OUR VALUABLE SPONSORS
          </h1>
        </div>

        {/* Launching Soon Message */}
        <div className="flex items-center justify-center pt-4 min-h-[200px]">
          <h2
            className="text-[#EDF526] text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-wider"
            style={{
              fontFamily: 'Metal Mania',
              textShadow: '0 0 20px rgba(237, 245, 38, 0.5)',
            }}
          >
            Launching Soon
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SponsorSection;
