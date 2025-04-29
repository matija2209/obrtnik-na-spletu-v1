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
  // async rewrites() {
  //   return [
  //     {
  //       // Rule for the specific host a1-instalacije.vercel.app
  //       source: '/:path*', // Match all paths
  //       has: [
  //         {
  //           type: 'host',
  //           value: 'a1-instalacije.vercel.app',
  //         },
  //       ],
  //       destination: '/tenant-domains/:path*', // Rewrite to /tenant-domains, preserving the path
  //     },
  //     {
  //       // Rule for the root path for other hosts
  //       source: '/',
  //       destination: '/tenant-domains/:tenant/', // No trailing path here
  //       has: [
  //         {
  //           type: 'host',
  //           // Exclude the specific host and common localhost/vercel previews
  //           value: '^(?!a1-instalacije\\.vercel\\.app|localhost|.*\\.vercel\\.app$).*$',
  //         },
  //         {
  //           type: 'host',
  //           value: '(?<tenant>.*)', // Capture the full hostname
  //         },
  //       ],
  //     },
  //     {
  //       // Rule for non-root paths for other hosts, excluding /api and /admin
  //       // Use :path+ to ensure it matches paths with content
  //       source: '/:path+((?!api|admin).*)',
  //       destination: '/tenant-domains/:tenant/:path*',
  //       has: [
  //         {
  //           type: 'host',
  //           // Exclude the specific host and common localhost/vercel previews
  //           value: '^(?!a1-instalacije\\.vercel\\.app|localhost|.*\\.vercel\\.app$).*$',
  //         },
  //         {
  //           type: 'host',
  //           value: '(?<tenant>.*)', // Capture the full hostname
  //         },
  //       ],
  //     },
  //   ]
  // },
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
