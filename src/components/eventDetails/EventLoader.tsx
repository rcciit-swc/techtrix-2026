'use client';

export default function EventLoader() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* shimmer keyframe via inline style — no Framer Motion overhead */}
      <style>{`
        @keyframes ev-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .ev-shimmer {
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
          background-size: 600px 100%;
          animation: ev-shimmer 1.4s ease-in-out infinite;
        }
      `}</style>

      {/* Hero image placeholder */}
      <div className="relative w-full h-[45vh] sm:h-[55vh] ev-shimmer" />

      {/* Content area */}
      <div className="relative -mt-20 px-4 sm:px-8 max-w-4xl mx-auto space-y-5 pb-16">
        {/* Category chip */}
        <div className="ev-shimmer h-5 w-24 rounded-full" />

        {/* Event title */}
        <div className="ev-shimmer h-9 w-3/4 rounded-lg" />
        <div className="ev-shimmer h-6 w-1/2 rounded-lg" />

        {/* Info row */}
        <div className="flex gap-3 pt-2">
          <div className="ev-shimmer h-8 w-28 rounded-full" />
          <div className="ev-shimmer h-8 w-24 rounded-full" />
          <div className="ev-shimmer h-8 w-20 rounded-full" />
        </div>

        {/* Divider */}
        <div className="ev-shimmer h-px w-full rounded" />

        {/* Description lines */}
        <div className="space-y-2.5">
          <div className="ev-shimmer h-4 w-full rounded" />
          <div className="ev-shimmer h-4 w-5/6 rounded" />
          <div className="ev-shimmer h-4 w-4/6 rounded" />
        </div>

        {/* Details cards row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ev-shimmer h-20 rounded-xl" />
          ))}
        </div>

        {/* Register button */}
        <div className="flex justify-end pt-4">
          <div className="ev-shimmer h-11 w-44 rounded-full" />
        </div>
      </div>
    </div>
  );
}
