'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function PrincipalDesk() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="relative w-full py-16 px-4 md:px-12 overflow-hidden text-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/principlesection/Bg.png"
          alt="Background"
          fill
          className="object-cover opacity-90"
        />
        {/* I added this so that text should visible properly */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2
            style={{ fontFamily: 'KungFuMaster' }}
            className="text-white text-[55px] font-normal underline decoration-solid underline-offset-auto decoration-auto"
          >
            Principal's Desk
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-[39px] items-start justify-between">
          {/* Left - Speech with Expandable Box */}
          <div className="order-2 lg:order-1 flex-1 lg:w-[890px] lg:-ml-[25px]">
            <div className="relative p-6 md:p-8 rounded-lg border-2 border-[#EDF526]/30 bg-black/50 backdrop-blur-sm shadow-[0_0_30px_rgba(237,245,38,0.2)]">
              {/* Speech Content */}
              <div
                className={`text-justify text-sm md:text-base leading-relaxed overflow-hidden transition-all duration-500 ${
                  isExpanded
                    ? 'max-h-[2000px]'
                    : 'max-h-[300px] md:max-h-[400px]'
                }`}
              >
                <p className="mb-4 text-[#F9FAFB] text-justify font-normal text-[20px] leading-normal font-['ManameALT']">
                  Life is vast – achieving excellence in academics and technical
                  knowledge is essential for professional growth, but that alone
                  does not define the true spirit of education. A student must
                  also find opportunities to explore creativity, innovation,
                  leadership and collaboration beyond the classroom. The young
                  undergraduates are filled with immense energy, curiosity and
                  potential, which need expression through constructive and
                  inspiring platforms. After entering college life, students
                  experience a new sense of independence and freedom, which
                  allows them to nurture their talents in technology, research,
                  entrepreneurship, creative thinking and problem-solving.{' '}
                  <br /> <br />
                  The college fests provide the ideal platform to showcase these
                  skills and channel youthful enthusiasm into innovation and
                  development. Techtrix 2026 – the annual techno-management fest
                  of RCCIIT – is one such flagship platform, traditionally
                  supported and encouraged by the institute. Members of the
                  Student Welfare Committee, along with hundreds of dedicated
                  senior and junior student volunteers, are working together
                  under the careful guidance of faculty members to make Techtrix
                  2026 a grand success. Over the years, Techtrix has taken up
                  the challenge of scaling itself into a major inter-college
                  technical fest, attracting participation from institutions
                  across Kolkata, other districts, and beyond the state. This
                  year too, it will be a vibrant multi-event celebration
                  featuring competitions, workshops, hackathons, robotics
                  challenges, management events and exhibitions across diverse
                  domains of emerging technology. <br /> <br />I extend my best
                  wishes for the grand success of Techtrix 2026, and I hope it
                  will be even better organized this year, particularly as we
                  celebrate the institute's silver jubilee year 2026. I also
                  look forward to enthusiastic participation, stronger
                  collaboration, and higher standards of excellence in this
                  edition.
                </p>
              </div>

              {/* Gradient Fade Overlay when collapsed */}
              {!isExpanded && (
                <div className="absolute bottom-16 left-0 right-0 h-32 bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none" />
              )}

              {/* See More/Less Button */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="relative w-fit mx-auto mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-transparent border-2 border-[#EDF526] text-[#EDF526] font-bold text-lg uppercase tracking-wide shadow-[0_0_20px_rgba(237,245,38,0.3)] hover:shadow-[0_0_30px_rgba(237,245,38,0.5)] hover:bg-[#EDF526]/10 transition-all duration-300 hover:scale-105"
                style={{ fontFamily: 'Metal Mania' }}
              >
                {isExpanded ? (
                  <>
                    <span>See Less</span>
                    <ChevronUp className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <span>See More</span>
                    <ChevronDown className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right - Principal Image */}
          <div className=" lg:-mr-15 order-1 lg:order-2 flex-1 lg:max-w-fit flex flex-col items-center">
            <div className="relative w-full h-[350px] md:h-[350px] lg:h-[450px] lg:w-[350px] overflow-hidden rounded-xl">
              <Image
                src="/principlesection/Principle-Img.png"
                alt="Dr. Anirban Mukherjee"
                fill
                className="object-cover object-center"
              />
            </div>

            <div
              style={{ fontFamily: 'MetalMania' }}
              className="text-center pt-2 w-full"
            >
              <h3 className="text-center text-[25px] leading-[151.689%] font-normal text-[#F9FAFB]">
                Prof.(Dr.) Anirban Mukherjee
              </h3>

              <p className="text-[#EDF526] text-[14px] font-normal leading-[151.689%] text-center">
                PRINCIPAL (OFFICIATING) RCCIIT
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center w-full lg:mt-16 pb-16">
          <button className="relative w-[580px] h-[330px] transition-transform hover:scale-105 active:scale-95">
            <Image
              src="/principlesection/Button.svg"
              alt="Register Now"
              fill
              className="object-contain"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
