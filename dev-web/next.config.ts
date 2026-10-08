import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: '/Dev.Frontend',
  assetPrefix: '/Dev.Frontend',
  images: {
    unoptimized: true, // GitHub Pages 不支援 Next.js 預設的圖片最佳化 API
  },
};

export default nextConfig;
