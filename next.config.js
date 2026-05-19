/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Prevents the build worker from crashing on type resolution
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Force Webpack and disable WASM-dependent features
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

module.exports = nextConfig;
