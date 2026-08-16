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

   async rewrites() {
      return [
         {
            source: "/api/:path*",
            destination: `${process.env.BACKEND_API_URL}/api/:path*`,
         },
      ];
   },
};

export default nextConfig;
