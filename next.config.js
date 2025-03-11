/** @type {import('next').NextConfig} */
// const withPWA = require('@ducanh2912/next-pwa').default({
//   dest: 'public',
//   fallbacks: {
//     // Failed page requests fallback to this.
//     document: '/~offline',
//     // This is for /_next/.../.json files.
//     data: '/fallback.json',
//     // This is for images.
//     image: '/fallback.webp',
//     // This is for audio files.
//     audio: '/fallback.mp3',
//     // This is for video files.
//     video: '/fallback.mp4',
//     // This is for fonts.
//     font: '/fallback-font.woff2',
//   },
// });
const nextConfig = {
  images: {
    // 'utfs.io'
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
      },
      {
        protocol: "http",
        hostname: "libgen.is",
      },
      {
        protocol: "http",
        hostname: "gen.lib.rus.ec",
      },
      {
        protocol: "https",
        hostname: "library.lol",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

// module.exports = module.exports = withPWA(nextConfig);
module.exports = nextConfig;
