import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload'
import type { Configuration as WebpackConfig } from 'webpack';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: false, // Recommended for Payload compatibility
  },
  images:{
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/media/**', // Adjust path if needed
      },
      {
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_SERVER_URL as string).hostname, // Use env var
        pathname: '/api/media/**', // Adjust path if needed
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          // Match any path except admin and api
          source: '/:path*',
          // Rewrite to the tenant-domains route with the tenant determined by hostname
          destination: '/tenant-domains/:path*',
          has: [
            {
              type: 'host',
              value: '(?<tenant>.*)',
            },
          ],
        },
        // Keep admin paths as they are
        {
          source: '/admin/:path*',
          destination: '/admin/:path*',
        },
        // Keep API paths as they are
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ]
    }
  },
  
  // Add other Next.js config options as needed
  
  // Add other Next.js config options as needed
  reactStrictMode: true,
  webpack: (config: WebpackConfig, { webpack }) => {
    config.plugins = config.plugins || []; // Ensure plugins array exists
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
      }),
    );

    return config;
  },
};

export default withPayload(nextConfig);
