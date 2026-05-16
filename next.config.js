/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  experimental: {
    outputFileTracingExcludes: {
      "*": [
        ".git/**",
        "**/.git/**",
        ".next/cache/**",
        "**/.next/cache/**",
        ".sandbox/**",
        "**/.sandbox/**",
      ],
    },
  },
};

module.exports = nextConfig;
