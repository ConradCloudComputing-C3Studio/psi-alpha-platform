/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don’t export static HTML–let Next.js handle SSR
  // (i.e. remove output: 'export')
  images: {
    // if you’re using next/image but want to skip the optimization step
    unoptimized: true,
  },

  // Skip ESLint during CI/CD builds so you don’t get
  // “Unexpected any” errors in production
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
