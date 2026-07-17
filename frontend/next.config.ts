import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_R2_URL ? new URL(process.env.NEXT_PUBLIC_R2_URL).hostname : 'media.novelschoolindia.com',
      },
      {
        protocol: 'https',
        hostname: 'novelschoolindia.com',
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/pages',
        destination: '/',
        permanent: true,
      },
    ];
  },
  // reactCompiler: true, // Commenting out experimental feature if causing issues, or leave it if works
  experimental: {
    // reactCompiler: true, // Usually it's in experimental
  },
};

export default nextConfig;
