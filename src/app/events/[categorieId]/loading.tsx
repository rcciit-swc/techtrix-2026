'use client';

import GenericLoader from '@/components/GenericLoader';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Dark Background Pulse */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(250, 204, 21, 0.05) 0%, transparent 60%)',
        }}
      />
      <div className="relative z-10 flex flex-col items-center gap-4">
        <GenericLoader />
      </div>
    </div>
  );
}
