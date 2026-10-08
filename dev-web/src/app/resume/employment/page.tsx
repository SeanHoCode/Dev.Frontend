// 引入履歷畫面的 Client Component 容器元件
import { ResumeView } from '@/components/resume/ResumeView';

/**
 * 履歷專頁進入點 (Route: "/resume")
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本檔案是履歷專屬頁面的路由入口外殼 (Static Page Shell)，負責：
 * 1. 定義子路由視圖：對應使用者造訪 `/resume` 網址時的展示頁面。
 * 2. 呈現頁面大標題與基礎佈局：輸出「個人履歷」主標題，並以 `space-y-6` 規範內容垂直排版間距。
 * 3. 委派履歷視圖邏輯：將資料抓取、載入骨架、錯誤處理與卡片渲染工作完全委託給 `ResumeView` 客戶端元件。
 * 
 * 【初學者觀念 - 路由組織與 SPA 模式】：
 * 1. 在 Next.js App Router 中，資料夾路徑即為 URL 路由。
 *    因此 "app/resume/page.tsx" 自動對應到網站的 "/resume" 網址。
 * 2. 本專案採用純前端靜態匯出 (Static Export)，因此 page.tsx 保持為靜態外殼 (Static Shell)。
 * 3. 實際獲取後端資料、處理 Loading 等候畫面與呈現資料的邏輯，全數封裝在子元件 <ResumeView /> 內部。
 */
export default function ResumePage() {
  return (
    // Tailwind 類別解說：
    // - space-y-6: 讓 main 底下的子元素之間自動產生垂直間距 (1.5rem / 24px)
    <main className="space-y-6">
      {/*
        標題樣式解說：
        - text-3xl: 字體大小為 30px
        - font-bold: 粗體字
        - tracking-tight: 字元間距稍微收緊，讓大標題視覺更凝聚
      */}
      <h1 className="text-3xl font-bold tracking-tight">個人履歷</h1>
      
      {/* 嵌入履歷視圖元件 (Client Component，內部會自動發送請求獲取資料) */}
      <ResumeView />
    </main>
  );
}