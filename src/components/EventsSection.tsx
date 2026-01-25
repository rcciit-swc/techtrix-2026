import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

const categories = [
  { id:"a1bb62c8-fd3d-485a-959e-be8cc528cc43", name: 'Automata', logo: '/events/logo1.png', image: '/events/hero1.png' },
  { id:"0f947f04-f7bc-45f7-a66c-789b2bbe2b53", name: 'Robotics', logo: '/events/logo2.png', image: '/events/hero2.png' },
  { id:"0f52d7d3-a9e7-454a-bff0-979de725e51a", name: 'Out of the box', logo: '/events/logo3.png', image: '/events/hero3.png'},
  { id:"4ff0cd32-079f-43fd-84b0-b9147f74eaca", name: 'Flagship', logo: '/events/logo4.png', image: '/events/hero4.png' },
  { id:"43c36d73-7e86-4c5b-a580-cecda4b14281", name: 'Gaming', logo: '/events/logo5.png', image: '/events/hero5.png' },
];

export default function EventsSection() {

  return (
    <section id="events">
      <div className="min-h-screen bg-[#0a0a0a] py-8 md:py-12 relative overflow-hidden flex flex-col">
      {/* Header */}
      <div className="text-center mb-16 px-4">
        <h1
          className="text-4xl md:text-5xl font-bold text-[#FFFFFF] tracking-wider uppercase"
          style={{ fontFamily: 'KungFuMaster' }}
        >
          Events
        </h1>
        <p
          className="text-white text-sm md:text-base mt-2 tracking-wide"
          style={{ fontFamily: 'MetalMania' }}
        >
          Events Branch from the Tree of Innovation - Choose Your Destiny
        </p>
      </div>

      {/* Main Container */}
      <div className="relative w-full flex-1 flex flex-row">
        {/* Left Section - Yellow Box */}
        <div className="relative w-[65%] h-[37.5rem] md:h-[46.875rem] lg:h-[53.125rem] flex flex-col">
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
            className="absolute inset-0 bg-[#EEFF00]"
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

          {/* Inner content area */}
          <div className="relative h-full flex flex-row gap-4 px-6 py-10 items-center">
            {categories.map((category, index) => (
              <Link 
                key={category.name}
                href={`/events/${category.id}`}
                className="relative flex-1 h-[95%] group cursor-pointer"
              >
                <div
                  className="absolute inset-0 w-full h-full bg-gradient-to-b from-black via-[#EDF526] to-black opacity-90"
                  style={{
                    clipPath: 'polygon(0% 10%, 100% 0%, 100% 90%, 0% 100%)',
                  }}
                />

                {/* Image Layer */}
                <div
                  className="absolute -top-16 bottom-0 left-0 right-0 z-10 flex flex-col"
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 92%, 0% 100%)',
                  }}
                >
                  {/* Image Container */}
                  <div className="relative flex-[4] w-full overflow-hidden">
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
                      <div className="relative z-10 bg-black w-full py-2 border-y border-[#EEFF00]/30">
                        <h3 className="text-white text-[0.625rem] md:text-sm font-bold uppercase tracking-wider text-center">
                          {category.name}
                        </h3>
                      </div>
                    </div>

                    {/* Extended Region for Logo */}
                    <div className="flex-1 flex items-center justify-center w-full pb-10">
                      <div className="w-15 h-15 md:w-20 md:h-20 lg:w-23 lg:h-23 rounded-full group-hover:scale-110 bg-transparent flex items-center justify-center overflow-hidden">
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
        <div className="w-[35%] px-4 md:px-8 flex flex-col justify-center items-center relative text-center">
          {/* Top right slashes - Yellow */}
          <div className="absolute top-0 right-8 text-[#EEFF00] text-2xl md:text-2xl font-bold tracking-widest">
            / / / / / /
          </div>

          <div className="mb-8">
            <p
              className="text-white text-base md:text-3xl tracking-widest uppercase mb-6"
              style={{ fontFamily: 'MetalMania' }}
            >
              Introducing
            </p>
            <p
              className="text-gray-500 text-md md:text-lg tracking-wide uppercase mb-6"
              style={{ fontFamily: 'MetalMania' }}
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

          {/* Corner Triangle */}
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
