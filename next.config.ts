import { NextConfig } from 'next';

// TypeScript workaround: Assert the type of `experimental` to `any` to bypass the error
const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;