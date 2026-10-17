import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { dev }) {
    if (dev) {
      const ignored = config.watchOptions?.ignored
      const defaultIgnored = /[\\/](?:node_modules|\.git|\.next)(?:[\\/]|$)/
      const qaIgnored = /[\\/](?:\.playwright-cli|dogfood-output)(?:[\\/]|$)/
      config.watchOptions = {
        ...config.watchOptions,
        ignored: new RegExp(
          `${ignored instanceof RegExp ? ignored.source : defaultIgnored.source}|${qaIgnored.source}`,
        ),
      }
    }
    return config
  },
  images: {
    localPatterns: [
      { pathname: '/andrade_realstate_logo.png', search: '' },
      { pathname: '/logo-kw-bahia-fullcolor.png', search: '' },
      { pathname: '/hero-property-pexels.jpeg', search: '' },
      { pathname: '/hero-building.png', search: '' },
      { pathname: '/api/uploads/file/**', search: '' },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
