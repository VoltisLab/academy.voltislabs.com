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
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prelura.s3.eu-west-2.amazonaws.com',
      },
    ],
  },
  };
  
  export default nextConfig;