import Link from 'next/link';

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        <h1
          className="text-5xl md:text-6xl font-bold text-[#EEFF00] uppercase mb-6"
          style={{ fontFamily: 'KungFuMaster' }}
        >
          Auth Error
        </h1>
        <p
          className="text-white text-lg md:text-xl mb-8 max-w-md mx-auto"
          style={{ fontFamily: 'Metal Mania' }}
        >
          Something went wrong during sign in. The link may have expired or
          already been used.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#EEFF00] text-black font-bold uppercase tracking-widest px-8 py-3 hover:bg-yellow-300 transition-colors"
          style={{ fontFamily: 'Metal Mania' }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
