import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DynamicBackground } from './AnimatedBackground';

export const categories = [
  {
    id: 'fb17b092-1622-4a3d-90a9-650fd860f6a0',
    name: 'Automata',
    logo: '/events/logo1.png',
    image: '/events/hero1.png',
  },
  {
    id: '12e9931b-42f8-41a0-9f87-3fd641fe946e',
    name: 'Robotics',
    logo: '/events/logo2.png',
    image: '/events/hero2.png',
  },
  {
    id: '441aa4ca-49ad-4b57-bb7f-6a1c5cc63a32',
    name: 'Out of the box',
    logo: '/events/logo3.png',
    image: '/events/hero3.png',
  },
  {
    id: 'a8609025-6132-4d69-8c61-3313ef082db4',
    name: 'Flagship',
    logo: '/events/logo4.png',
    image: '/events/hero4.png',
  },
  {
    id: '40d34d1e-1a8c-4ce6-a3e3-6b704b85a568',
    name: 'Gaming',
    logo: '/events/logo5.png',
    image: '/events/hero5.png',
  },
];

export default function EventsSection() {
  return (
    <section id="events">
      <div className="min-h-screen md:min-h-0 md:bg-[#000000] py-8 md:py-12 relative overflow-hidden flex flex-col">
        {/* Animated Background */}
        <DynamicBackground variant="events" />
        {/* Mobile Background Image 
        <div className="absolute inset-0 w-full h-full md:hidden z-0">
          <Image
            src="/events/background.jpg"
            alt="Background"
            fill
            className="w-full object-cover object-top opacity-100 scale-75 origin-top"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>*/}

        {/* Header */}
        <div className="text-center mb-16 px-4 relative z-10">
          <h1
            className="text-6xl md:text-7xl font-bold text-[#FFFFFF] tracking-wider uppercase"
            style={{ fontFamily: 'KungFuMaster' }}
          >
            Events
          </h1>
          <p
            className="text-white text-2xl md:text-3xl mt-4 tracking-wide"
            style={{ fontFamily: 'Metal Mania' }}
          >
            Events Branch from the Tree of Innovation - Choose Your Destiny
          </p>
        </div>

        {/* Mobile Text Content */}
        <div className="md:hidden text-center mb-12 px-4 z-20 relative">
          <p
            className="text-white text-2xl tracking-widest uppercase mb-2"
            style={{ fontFamily: 'Metal Mania' }}
          >
            Introducing
          </p>
          <h2
            className="text-[#EEFF00] text-5xl uppercase leading-tight mb-2"
            style={{ fontFamily: 'KungFuMaster' }}
          >
            Tech Heroes
            <br />
            Roster
          </h2>
          <p
            className="text-gray-500 text-lg tracking-wide uppercase"
            style={{ fontFamily: 'Metal Mania' }}
          >
            For Techtrix 2026
          </p>
        </div>

        {/* Main Container */}
        <div className="relative w-full flex-1 flex flex-col md:flex-row z-10 md:bg-transparent">
          {/* Left Section - Yellow Box */}
          <div className="relative w-full md:w-[65%] h-auto md:h-[46.875rem] lg:h-[53.125rem] flex flex-col">
            {/* Top left chevrons - Black */}
            <div className="absolute top-4 left-2 z-20">
              <div className="flex flex-col gap-0.5">
                <ChevronDown size={30} color="#000000" strokeWidth={5} />
                <ChevronDown size={30} color="#000000" strokeWidth={5} />
                <ChevronDown size={30} color="#000000" strokeWidth={5} />
              </div>
            </div>

            {/* Yellow frame container - Straight Rectangle */}
            <div
              className="hidden md:block absolute inset-0 bg-[#EEFF00]"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
              }}
            >
              <div className="absolute bottom-0 w-full h-32 flex flex-row gap-4 px-6 items-end">
                {categories.map((_, index) => (
                  <div key={index} className="flex-1 h-full relative">
                    {/* Black Triangle on top of yellow */}
                    <div
                      className="absolute bottom-0 w-full h-full bg-[#0a0a0a]"
                      style={{
                        clipPath:
                          'polygon(0% 100%, 100% 100%, 100% 40%, 0% 100%)',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-full flex flex-col gap-6 px-4 pt-16 pb-8 md:flex-row md:gap-4 md:px-6 md:py-10 items-center w-full">
              {categories.map((category, index) => (
                <Link
                  key={category.name}
                  href={`/events/${category.id}`}
                  className="relative group cursor-pointer w-[85%] max-w-[280px] aspect-[2/5] mb-4 last:mb-0 md:flex-1 md:h-[95%] md:aspect-auto md:mb-0 md:w-auto md:max-w-none"
                >
                  <div
                    className="absolute inset-0 w-full h-full bg-gradient-to-b from-black via-[#EDF526] to-black opacity-100"
                    style={{
                      clipPath: 'polygon(0% 10%, 100% 0%, 100% 90%, 0% 100%)',
                      boxShadow:
                        '0 -10px 20px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0)',
                    }}
                  />

                  <div className="absolute -top-8 bottom-0 z-10 flex flex-col left-0 right-0 md:[clip-path:polygon(0%_0%,_100%_0%,_100%_92%,_0%_100%)]">
                    {/* Image Container */}
                    <div className="relative flex-[4] w-full overflow-hidden rounded-t-lg md:rounded-none">
                      <div className="absolute inset-0 w-full h-full">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover object-top grayscale transition-all duration-300 group-hover:grayscale-0 group-hover:scale-105"
                          sizes="(max-width: 48rem) 20vw, 15vw"
                          priority
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
                    </div>

                    {/* Text and logo Section */}
                    <div className="flex-[1.5] flex flex-col items-center justify-start pt-0 w-full px-0">
                      <div className="w-full relative mb-0 group-hover:scale-105 transition-transform z-10">
                        <div className="absolute inset-0 bg-[#EDF526] blur opacity-50"></div>
                        {/* Black Rectangle */}
                        <div className="relative z-10 bg-black w-full py-1.5 md:py-2 border-y border-[#EEFF00]/30">
                          <h3 className="text-white text-lg md:text-sm font-bold uppercase tracking-wider text-center">
                            {category.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex-1 flex items-center justify-center w-full pb-3 md:pb-10">
                        <div className="w-16 h-16 md:w-20 md:h-20 lg:w-23 lg:h-23 rounded-full group-hover:scale-110 bg-transparent flex items-center justify-center overflow-hidden">
                          <Image
                            src={category.logo}
                            alt={category.name}
                            width={64}
                            height={64}
                            className="object-contain grayscale group-hover:scale-110 w-full h-full opacity-90 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section - Text Content*/}
          <div className="hidden md:flex w-[35%] px-8 flex-col justify-center items-center relative text-center">
            {/* Top right slashes - Yellow */}
            <div className="absolute top-0 right-8 text-[#EEFF00] text-2xl md:text-2xl font-bold tracking-widest">
              / / / / / /
            </div>

            <div className="mb-8">
              <p
                className="text-white text-base md:text-3xl tracking-widest uppercase mb-6"
                style={{ fontFamily: 'Metal Mania' }}
              >
                Introducing
              </p>
              <p
                className="text-gray-500 text-md md:text-lg tracking-wide uppercase mb-6"
                style={{ fontFamily: 'Metal Mania' }}
              >
                For Techtrix 2026
              </p>
              <h2
                className="text-[#EEFF00] text-4xl md:text-8xl uppercase leading-tight"
                style={{ fontFamily: 'KungFuMaster' }}
              >
                Tech Heroes
                <br />
                Roster
              </h2>
            </div>

            {/* Bottom right chevrons - Yellow */}
            <div className="absolute bottom-5 left-10">
              <div className="flex flex-col gap-0.5">
                <ChevronUp size={30} color="#EEFF00" strokeWidth={5} />
                <ChevronUp size={30} color="#EEFF00" strokeWidth={5} />
                <ChevronUp size={30} color="#EEFF00" strokeWidth={5} />
              </div>
            </div>

            <div
              className="absolute bottom-0 right-0 w-24 h-24 bg-[#EEFF00]"
              style={{
                clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
