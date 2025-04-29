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
  // ... existing code ...
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
