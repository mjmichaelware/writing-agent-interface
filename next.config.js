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
        ".next/cache/**",
        "**/.next/cache/**",
        ".git/**",
        "**/.git/**",
        ".sandbox/**",
        "**/.sandbox/**",
      ],
    },
  },
};

module.exports = nextConfig;
