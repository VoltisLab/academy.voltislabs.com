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
  
  // Add this to support older packages that rely on the 'document' object
  experimental: {
    serverComponentsExternalPackages: ['react-quill-new']
  }
};

export default nextConfig;