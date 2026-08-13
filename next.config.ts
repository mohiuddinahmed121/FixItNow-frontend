import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   cacheComponents: true,

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

   async rewrites() {
      return [
         {
            source: "/api/:path*",
            destination: "http://localhost:5000/api/:path*",
         },
      ];
   },
};

export default nextConfig;
