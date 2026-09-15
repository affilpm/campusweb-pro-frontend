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
        hostname: process.env.NEXT_PUBLIC_R2_URL ? new URL(process.env.NEXT_PUBLIC_R2_URL).hostname : '',
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
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
  experimental: {
    staticGenerationMaxConcurrency: 1,
  },
};

export default nextConfig;
