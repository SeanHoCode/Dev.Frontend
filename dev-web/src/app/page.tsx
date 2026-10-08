// 引入桌面作業系統的主要環境元件 (負責渲染桌面圖示與彈出視窗)
import { DesktopEnvironment } from '@/components/operating-system/DesktopEnvironment';

/**
 * 首頁進入點 (Route: "/")
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本檔案是網站首頁的路由入口外殼 (Static Page Shell)，負責：
 * 1. 定義首頁路由視圖：對應使用者造訪首頁 `/` 時的展示畫面。
 * 2. 設定全螢幕桌面容器：透過滿版樣式與 `overflow-hidden` 鎖定螢幕，確保呈現類作業系統的無滾動條桌面外觀。
 * 3. 委派互動邏輯：遵循薄頁面外殼 (Thin Page) 原則，不在此處撰寫複雜商業邏輯，直接掛載並委派給 `DesktopEnvironment` 呈現。
 * 
 * 【初學者觀念 - 靜態頁面外殼 (Static Page Shell)】：
 * 1. 在 Next.js App Router 中，每個資料夾底下的 page.tsx 代表一個公開路由。根目錄 app/page.tsx 對應網站首頁 "/"。
 * 2. 此元件頂部沒有宣告 "use client"，因此預設為 Server Component (編譯期靜態渲染)。
 * 3. 根據架構規範，page.tsx 僅作為外殼容器，負責設定最外層的 CSS 排版，並將所有互動與動態邏輯委託給內部的 Client Component (DesktopEnvironment)。
 */
export default function Home() {
  return (
    // Tailwind 類別解說：
    // - min-h-screen: 最小高度為瀏覽器視窗 100vh
    // - w-full: 寬度 100% 撐滿
    // - m-0 p-0: 清除預設邊界 (margin) 與內距 (padding)
    // - overflow-hidden: 超出視窗範圍的內容自動隱藏，防止桌面出現瀏覽器原生滾動條
    <main className="min-h-screen w-full m-0 p-0 overflow-hidden">
      {/* 嵌入桌面環境核心元件 */}
      <DesktopEnvironment />
    </main>
  );
}