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
        protocol: 'http',
        hostname: '143.110.186.16',
      },
      {
        protocol: 'https',
        hostname: 'pub-30421f2590ac4738b43f524395aa8a2b.r2.dev',
      },
    ],
  },
  // reactCompiler: true, // Commenting out experimental feature if causing issues, or leave it if works
  experimental: {
    // reactCompiler: true, // Usually it's in experimental
  },
};

export default nextConfig;
