import React from 'react';
import Image from 'next/image';

const SponsorSection = () => {
  return (
    <div className="relative w-full py-12 md:py-16 overflow-hidden">
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
              fontFamily: 'VerveAlternate', // unable to fetch verve alternate font
              fontSize: '35px',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: 'normal',
            }}
          >
            OUR VALUABLE SPONSORS
          </h1>
        </div>

        <div className="flex flex-wrap pt-4 items-center justify-center gap-8 md:gap-12 lg:gap-[150px]">
          <div className="relative w-48 h-32 md:w-56 md:h-36 lg:w-64 lg:h-40">
            <Image
              src="/SponsorSection/Icon1.svg"
              alt="Sponsor 1"
              fill
              className="object-contain"
            />
          </div>

          <div className="relative w-48 h-32 md:w-56 md:h-36 lg:w-64 lg:h-40">
            <Image
              src="/SponsorSection/Icon2.svg"
              alt="Sponsor 2"
              fill
              className="object-contain"
            />
          </div>

          <div className="relative w-48 h-32 md:w-56 md:h-36 lg:w-64 lg:h-40">
            <Image
              src="/SponsorSection/Icon3.svg"
              alt="Sponsor 3"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorSection;
