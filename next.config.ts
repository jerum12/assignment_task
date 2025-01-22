import { NextConfig } from 'next';

// TypeScript workaround: Assert the type of `experimental` to `any` to bypass the error
const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Enable the App Directory feature
  } as any, // Workaround for TypeScript error
};

export default nextConfig;