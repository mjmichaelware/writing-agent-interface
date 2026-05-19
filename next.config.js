/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silences the build error by providing an empty config
  turbopack: {}, 
  
  // Clean configurations
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Remove the unsupported 'eslint' key
  // Add other necessary configs here
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
};

module.exports = nextConfig;
