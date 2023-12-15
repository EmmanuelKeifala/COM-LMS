/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 'utfs.io'
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
};

module.exports = nextConfig;
