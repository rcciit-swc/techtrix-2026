import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    domains: ['i.postimg.cc', 'i.ibb.co'],
  },
};

export default nextConfig;
