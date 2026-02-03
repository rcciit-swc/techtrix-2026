import Image from 'next/image';

export default function PrincipalDesk() {
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
          {/* Left*/}
          <div className="order-2 lg:order-1 flex-1 lg:w-[890px] lg:-ml-[25px] ">
            <div className="p-6 md:p-8 rounded-lg text-justify text-sm md:text-base leading-relaxed shadow-lg">
              <p className="mb-4 text-[#F9FAFB] text-center font-normal  text-[20px] leading-normal font-['ManameALT']">
                Life is vast – achieving excellence in academics and technical
                knowledge is essential for professional growth, but that alone
                does not define the true spirit of education. A student must
                also find opportunities to explore creativity, innovation,
                leadership and collaboration beyond the classroom. The young
                undergraduates are filled with immense energy, curiosity and
                potential, which need expression through constructive and
                inspiring platforms. After entering college life, students
                experience a new sense of independence and freedom, which allows
                them to nurture their talents in technology, research,
                entrepreneurship, creative thinking and problem-solving. <br />{' '}
                <br />
                The college fests provide the ideal platform to showcase these
                skills and channel youthful enthusiasm into innovation and
                development. Techtrix 2026 – the annual techno-management fest
                of RCCIIT – is one such flagship platform, traditionally
                supported and encouraged by the institute. Members of the
                Student Welfare Committee, along with hundreds of dedicated
                senior and junior student volunteers, are working together under
                the careful guidance of faculty members to make Techtrix 2026 a
                grand success. Over the years, Techtrix has taken up the
                challenge of scaling itself into a major inter-college technical
                fest, attracting participation from institutions across Kolkata,
                other districts, and beyond the state. This year too, it will be
                a vibrant multi-event celebration featuring competitions,
                workshops, hackathons, robotics challenges, management events
                and exhibitions across diverse domains of emerging technology.{' '}
                <br /> <br />I extend my best wishes for the grand success of
                Techtrix 2026, and I hope it will be even better organized this
                year, particularly as we celebrate the institute’s silver
                jubilee year 2026. I also look forward to enthusiastic
                participation, stronger collaboration, and higher standards of
                excellence in this edition.
              </p>
            </div>
          </div>

          {/* Right  */}
          <div className=" lg:mt-20  lg:-mr-15 order-1 lg:order-2 flex-1 lg:max-w-[466px] flex flex-col items-center">
            <div className="relative w-full h-[55vh] md:h-[600px] lg:h-[604px] overflow-hidden rounded-xl ">
              <Image
                src="/principlesection/Principle-Img.png"
                alt="Dr. Anirban Mukherjee"
                fill
                className="object-cover object-center"
              />
            </div>

            <div
              style={{ fontFamily: 'MetalMania' }}
              className="text-center pt-6 w-full"
            >
              <h3 className="text-center text-[25px] leading-[151.689%] font-normal text-[#F9FAFB]">
                Prof.(Dr.) Anirban Mukherjee
              </h3>

              <p className="text-[#EDF526]  text-[18px] font-normal leading-[151.689%] text-center">
                PRINCIPAL (OFFICIATING) RCCIIT & PROFESSOR, IT, RCCIIT
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center w-full  lg:mt-16 pb-16">
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
