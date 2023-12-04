/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 'utfs.io'
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
};

module.exports = nextConfig;
