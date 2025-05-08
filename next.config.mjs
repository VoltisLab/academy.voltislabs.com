/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    reactStrictMode: true,
  
    webpack: (config) => {
      // Enable handling PDF files
      config.module.rules.push({
        test: /\.pdf$/,
        type: 'asset/resource',
      });
      return config;
    },
  };
  
  export default nextConfig;