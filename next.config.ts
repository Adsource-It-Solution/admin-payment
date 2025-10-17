import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config: {
    resolve: {alias: {canva: boolean; encoding: boolean}};
  }) => {
    config.resolve.alias.canva = false,
    config.resolve.alias.encoding = false

    return config;
  },
  transpilePackages: ["@react-pdf/renderer"],
};

export default nextConfig;
