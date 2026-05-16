/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },

  typescript: {
    ignoreBuildErrors: true
  },

  outputFileTracingExcludes: {
    "*": [
      "**/.next/cache/webpack/**/*",
      "**/.sandbox/**/*",
      "**/.git/**/*",
      "**/node_modules/@swc/**/*"
    ]
  }
};

module.exports = nextConfig;
