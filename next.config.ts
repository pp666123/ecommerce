import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "pakaednxfiuorjewvlkf.supabase.co",
        port: "",
        // 鎖定路徑，只允許讀取 public 資料夾下的圖片，提升安全性
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
