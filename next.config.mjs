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
      {
        protocol: 'https',
        hostname: 'ext.same-assets.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  };
 
  export default nextConfig;