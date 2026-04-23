import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    // Skip server-side image optimization — most images are already-compressed
    // external CDN assets (i.postimg.cc, i.ibb.co). The optimization proxy adds
    // latency and causes 500 timeouts when those CDNs are slow.
    unoptimized: true,
  },
};

export default nextConfig;
