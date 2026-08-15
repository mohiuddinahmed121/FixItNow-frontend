import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
      remotePatterns: [
         {
            hostname: "static.vecteezy.com",
         },
         {
            hostname: "example.com",
         },
      ],
   },
};

export default nextConfig;
