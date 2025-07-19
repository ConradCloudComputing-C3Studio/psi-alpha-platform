/** @type {import('next').NextConfig} */
const nextConfig = {
  // we want SSR, not a static export:
  // output and trailingSlash left commented-out
  // output: 'export',
  // trailingSlash: true,

  images: {
    // skip Next.js image optimization step if desired
    unoptimized: true,
  },

  eslint: {
    // don’t fail build on lint errors (e.g. no-explicit-any)
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
