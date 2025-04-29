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
    return [
      {
        // Match any path that doesn't start with /api or /admin
        // The :path* captures the rest of the path including the leading /
        // The * makes the path optional to match the root '/'
        source: '/:path((?!api|admin).*)',
        destination: '/tenant-domains/:tenant/:path*',
        has: [
          {
            type: 'host',
            // Capture the full hostname (e.g., a1-instalacije.vercel.app)
            value: '(?<tenant>.*)',
          },
        ],
      },
    ]
  },
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
