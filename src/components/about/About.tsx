import Image from 'next/image';
import Link from 'next/link';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full min-h-screen py-12 md:py-24 overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/about/about-bg.png')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-16 items-start">
        {/* LEFT: POSTER */}
        <div className="flex justify-center">
          <Image
            src="/about/poster.png"
            alt="Techtrix 2026 Poster"
            width={520}
            height={650}
            className="rounded-3xl shadow-2xl"
            priority
          />
        </div>

        {/* RIGHT: CONTENT */}
        <div className="relative text-white">
          {/* MOBILE HEADING */}
          <Image
            src="/about/originmob.png"
            alt="Our Origin Story"
            width={360}
            height={160}
            className="mb-4 md:mb-8 mx-auto w-[90%] h-auto md:hidden"
          />

          {/* DESKTOP HEADING */}
          <Image
            src="/about/origin.png"
            alt="Our Origin Story"
            width={420}
            height={140}
            className="mb-8 hidden md:block w-[420px] h-auto"
          />

          {/* GLASS MORPHISM BOX */}
          <div className="rounded-2xl bg-black/40 backdrop-blur-md border border-amber-300 p-5 mb-4 md:mb-8 -mt-2 md:-mt-6">
            <p className="text-base text-gray-100 leading-relaxed mb-2 md:mb-4">
              Techtrix wasn&apos;t just built — it was engineered. Born from a
              collective of visionaries, coders, and creators, we set out to
              assemble the ultimate gathering of technological might.
            </p>

            <p className="text-base text-gray-100 leading-relaxed">
              Our mission? To provide a platform where innovation knows no
              bounds. Whether you&apos;re a start-level genius or a captain of
              industry, this is your proving ground.
            </p>
          </div>

          {/* STATS */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mb-3 md:mb-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur border border-white/20">
              <span className="text-yellow-400 text-lg">⚡</span>
              <div>
                <div className="font-bold text-xl">3000+</div>
                <div className="text-xs text-gray-300">INNOVATORS</div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur border border-white/20">
              <span className="text-blue-400 text-lg">🛡</span>
              <div>
                <div className="font-bold text-xl">30+</div>
                <div className="text-xs text-gray-300">EVENTS</div>
              </div>
            </div>
          </div>

          {/* CTA + STATUS */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 mb-4 md:mb-10">
            <Link href="/#events">
              <button className="font-orbitron font-bold tracking-wider px-6 py-3 md:px-8 md:py-4 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition-all duration-300 hover:scale-105">
                JOIN THE ALLIANCE →
              </button>
            </Link>

            <span className="text-xs text-green-400 font-mono tracking-widest">
              ● SYSTEMS ONLINE
            </span>
          </div>

          {/* SCRAPS IMAGE */}
          <Image
            src="/about/scraps.png"
            alt="Inspirational quote"
            width={360}
            height={90}
            className="-mt-1 md:-mt-3 w-[260px] md:w-[360px] h-auto opacity-80 mx-auto"
          />
        </div>
      </div>

      {/* ABOUT END STRIP (BOTTOM OVERLAY) */}
      <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
        <Image
          src="/about/aboutend.png"
          alt="About section end HUD"
          width={1440}
          height={80}
          className="w-full h-auto opacity-90"
          priority
        />
      </div>
    </section>
  );
}
