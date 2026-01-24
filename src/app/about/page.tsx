import Image from 'next/image';

export default function AboutSection() {
  return (
    <section
      className="relative w-full min-h-screen py-24 overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('/about-bg.png')",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* LEFT: POSTER */}
        <div className="flex justify-center">
          <Image
            src="/poster.png"
            alt="Techtrix 2026 Poster"
            width={520}
            height={650}
            className="rounded-3xl shadow-2xl"
            priority
          />
        </div>

        {/* RIGHT: CONTENT */}
        <div className="relative text-white">
          {/* HEADING */}
          <Image
            src="/origin.png" // put your heading image here
            alt="Our Origin Story"
            width={420}
            height={140}
            className="mb-8 w-[300px] md:w-[420px] h-auto"
          />

          {/* GLASS MORPHISM BOX */}
          <div className="rounded-2xl bg-black/40 backdrop-blur-md border border-amber-300 p-8 mb-8 -mt-6">
            <p className="text-base text-gray-100 leading-relaxed mb-4">
              Techtrix wasn't just built — it was engineered. Born from a
              collective of visionaries, coders, and creators, we set out to
              assemble the ultimate gathering of technological might. Like the
              heroes we admire, we believe that.
            </p>

            <p className="text-base text-gray-100 leading-relaxed">
              Our mission? To provide a platform where innovation knows no
              bounds. Whether you're a start-level genius or a captain of
              industry, this is your proving ground.
            </p>
          </div>

          {/* STATS */}
          <div className="flex gap-6 mb-8">
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-black/40 backdrop-blur border border-white/20">
              <span className="text-yellow-400 text-lg">⚡</span>
              <div>
                <div className="font-bold text-xl">3000+</div>
                <div className="text-xs text-gray-300">INNOVATORS</div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-black/40 backdrop-blur border border-white/20">
              <span className="text-blue-400 text-lg">🛡</span>
              <div>
                <div className="font-bold text-xl">50+</div>
                <div className="text-xs text-gray-300">EVENTS</div>
              </div>
            </div>
          </div>

          {/* CTA + STATUS */}
          <div className="flex items-center gap-6 mb-8">
            <button className="font-orbitron font-bold text-base tracking-wider px-8 py-4 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition-all duration-300 hover:scale-105 whitespace-nowrap">
              JOIN THE ALLIANCE →
            </button>

            <span className="text-xs text-green-400 font-mono tracking-widest">
              ● SYSTEMS ONLINE
            </span>
          </div>

          {/* QUOTE */}
          <Image
            src="/scraps.png"
            alt="Inspirational quote"
            width={360}
            height={90}
            className="-mt-12 w-[260px] md:w-[360px] h-auto opacity-80 mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
