'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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
            Principal&apos;s Desk
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
                  Life offers limitless opportunities, while academic excellence
                  and strong technical foundations are indispensable for
                  professional success, they alone cannot define the true
                  essence of engineering education. For B.Tech students, real
                  growth lies in transforming theoretical concepts into
                  innovative technologies, practical systems and impactful
                  solutions. Engineering education must inspire students to
                  think beyond conventional boundaries, encouraging them to
                  experiment, innovate and engineer solutions that address
                  industrial demands and societal needs. The undergraduate years
                  are a crucial phase during which students develop analytical
                  thinking, technical competence and a spirit of inquiry. This
                  stage provides them with the intellectual freedom and
                  institutional support necessary to explore cutting-edge
                  domains, undertake research-driven projects, build prototypes,
                  participate in technical competitions and cultivate an
                  innovation-oriented mindset. By engaging in such constructive
                  pursuits, students evolve from learners of technology into
                  creators of technology. <br /> <br />
                  Technical festivals play a vital role in strengthening this
                  innovation ecosystem by providing a dynamic platform where
                  knowledge meets execution. Techtrix 2026, the annual
                  techno-management fest of RCCIIT – represents not merely a
                  celebratory event, but a vibrant hub of technical creativity
                  and engineering excellence led by B.Tech students. It offers a
                  structured environment where students conceptualize, design,
                  coordinate and execute technically challenging events that
                  demand precision, teamwork and leadership. Guided by dedicated
                  faculty mentors, the Student Welfare Committee and an
                  enthusiastic team of senior and junior volunteers collaborate
                  to curate competitions and activities that emphasize coding
                  proficiency, embedded system design, robotics development,
                  AI-driven applications, sustainable engineering models and
                  data-centric innovations. Over the years, Techtrix has
                  steadily expanded its stature as a prominent inter-college
                  technical congregation, attracting participants from Kolkata
                  and various districts and states. This year’s edition promises
                  an even stronger focus on emerging technologies through
                  hackathons, research workshops, technical symposiums, project
                  expos and innovation challenges aligned with contemporary
                  domains such as artificial intelligence, Internet of Things,
                  renewable energy, automation, cybersecurity, and smart
                  systems. <br /> <br /> As we celebrate the Institute’s Silver
                  Jubilee year in 2026, I extend my sincere best wishes for the
                  resounding success of Techtrix 2026. I am confident that this
                  edition will exemplify higher benchmarks of technical
                  innovation, professional organization, and collaborative
                  excellence. I look forward to active participation from our
                  B.Tech students and to witnessing ground-breaking ideas,
                  practical prototypes, and transformative technological
                  solutions that reflect our unwavering commitment to
                  engineering advancement and societal progress. Hope this
                  opportunity will engage more and more individuals as well
                  groups for showcasing their talent, which will also inspire
                  our next generations too and may find out various solutions
                  for existing real-life problems.
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
                src="/principlesection/principal.jpg"
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
                Prof.(Dr.) Ashoke Mondal
              </h3>

              <p className="text-[#EDF526] text-[14px] font-normal leading-[151.689%] text-center">
                PRINCIPAL (OFFICIATING) RCCIIT
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center w-full lg:mt-16 pb-16">
          <Link href="/#events">
            <button className="relative w-[580px] h-[330px] transition-transform hover:scale-105 active:scale-95">
              <Image
                src="/principlesection/Button.svg"
                alt="Register Now"
                fill
                className="object-contain"
              />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
