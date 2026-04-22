import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Strict mode for catching potential issues early
  reactStrictMode: true,

  // Images: allow Supabase storage domains when user avatars land
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
