'use client';
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
          <div className="order-2 lg:order-1 flex-1 lg:w-[890px] lg:-ml-43 ">
            <div className="p-6 md:p-8 rounded-lg text-justify text-sm md:text-base leading-relaxed shadow-lg">
              <p className="mb-4 text-[#F9FAFB] text-center font-normal text-[20px] leading-normal font-['Maname']">
                Life is big – achieving perfection in academic or technical
                domain is important for professional success in life. But that
                is not all; one must look for opportunities to explore life
                beyond that. The young undergrads are having lot of energy and
                spirit within them which needs expression in different forms.
                After entering the college, while enjoying the adulthood for the
                first time in life, a student gets some reprieve from the
                pressure of competitive academics and gets time and freedom to
                nurture his/her talent in sports, arts, performing arts,
                innovations and all. <br /> <br />
                The college fests provide the real platform to showcase their
                talents and unleash their energy - their youthful exuberance.
                Game of Thrones (GoT) – the annual sports fest of RCCIIT is one
                such platform created and traditionally supported by RCCIIT.
                Members of the Student Welfare Committee along with hundreds of
                senior and junior student volunteers have come up and are
                working together under the careful guidance of senior faculty
                members to make the 2026version of GoT a grand success. From
                last year GoT has taken up a big challenge by scaling it up to
                the extent of Inter-College Sports Meet attracting participants
                from Kolkata, other Districts and even other States. This time
                also it will be a multi-tournament event organized at multiple
                venues within and outside college. Cricket, Football, Badminton
                and other sports competitions at college level are now fewer in
                numbers compared to earlier days. Trendy games like gully
                cricket, futsal are more popular which doesn't hold the
                traditional spirit of the on-field games. Moreover, it is
                observed that students are now more inclined towards digital
                games, which is detrimental to their mental and physical health.
                This is one reason why RCCIIT has put lot of emphasis on games
                and sports. By accommodating traditional versions of the games
                in GoT and making those open for all, we believe it will uphold
                the true spirit of games and sports and foster sportsmanship,
                positivity and friendship among the students. <br /> <br /> I
                wish all success of this mega event and hope it will be even
                better organized this year, particularly considering the
                institute's silver jubilee celebration year 2026. I also expect
                better participation and competition this time.
              </p>
            </div>
          </div>

          {/* Right  */}
          <div className=" lg:mt-12 lg:-mr-24 order-1 lg:order-2 flex-1 lg:max-w-[466px] flex flex-col items-center">
            <div className="relative w-full h-[500px] md:h-[600px] lg:h-[604px] overflow-hidden rounded-xl ">
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

              <p className="text-[#EDF526] font-['Metal_Mania'] text-[18px] font-normal leading-[151.689%] text-center">
                PRINCIPAL (OFFICIATING) RCCIIT & PROFESSOR, IT, RCCIIT
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center w-full  lg:mt-16 pb-16">
          <button className="relative w-[580px] h-[330px] transition-transform hover:scale-105 active:scale-95">
            <Image
              src="/principlesection/button.svg"
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
