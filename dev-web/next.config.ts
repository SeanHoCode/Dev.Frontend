import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  // // 注意：如果你的 GitHub 儲存庫名稱不是 seanhocode.github.io，而是例如 dev-web
  // // 你必須取消下方註解並設定 basePath，否則部署後 CSS 與圖片路徑會全部失效
  // // basePath: "/dev-web", 
  // images: {
  //   unoptimized: true, // GitHub Pages 不支援 Next.js 預設的圖片最佳化 API
  // },
  reactCompiler: true,
};

export default nextConfig;
