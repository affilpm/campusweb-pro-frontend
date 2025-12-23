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
        hostname: 'api.affils.site',
      },
      {
        protocol: 'https',
        hostname: 'pub-30421f2590ac4738b43f524395aa8a2b.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'pub-057f5009996946a7b2df09fb3bea1c0c.r2.dev',
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
  // reactCompiler: true, // Commenting out experimental feature if causing issues, or leave it if works
  experimental: {
    // reactCompiler: true, // Usually it's in experimental
  },
};

export default nextConfig;
