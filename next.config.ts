import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/images/**",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
