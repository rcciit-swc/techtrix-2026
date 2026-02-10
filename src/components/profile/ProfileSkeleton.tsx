import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileSkeleton() {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: "url('/profile/profilebg.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      <main className="pt-40 md:pt-32 pb-8 relative z-10">
        {/* Title Skeleton */}
        <div className="flex justify-center mb-8">
          <Skeleton className="h-12 w-64 bg-white/10" />
        </div>

        {/* Profile Card Skeleton */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="backdrop-blur-md rounded-[40px] p-6 md:p-8 border border-white/10 bg-black/40">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Avatar Skeleton */}
              <Skeleton className="w-[160px] h-[160px] rounded-full bg-white/10" />

              {/* Info Skeleton */}
              <div className="space-y-4 flex-1 text-center md:text-left">
                <div className="space-y-2">
                  <Skeleton className="h-10 w-48 mx-auto md:mx-0 bg-white/10" />
                  <Skeleton className="h-5 w-64 mx-auto md:mx-0 bg-white/10" />
                  <Skeleton className="h-5 w-40 mx-auto md:mx-0 bg-white/10" />
                </div>
                <div className="flex gap-4 justify-center md:justify-start">
                  <Skeleton className="h-11 w-28 rounded-full bg-yellow-400/20" />
                  <Skeleton className="h-11 w-28 rounded-full bg-white/10" />
                </div>
              </div>
            </div>
          </div>

          {/* Registered Events Section Skeleton */}
          <div className="mt-16">
            <div className="flex justify-center mb-10">
              <Skeleton className="h-12 w-72 bg-white/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="w-full max-w-[380px] h-[480px] rounded-[20px] bg-white/10"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}