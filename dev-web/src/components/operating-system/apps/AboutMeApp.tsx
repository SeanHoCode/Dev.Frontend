import React from 'react';

/**
 * 「關於我 (About Me)」應用程式內容元件
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是桌面作業系統中「關於我」應用程式的專屬內容模組 (App Content View)，負責：
 * 1. 呈現個人簡介視圖：展示個人頭像縮圖、稱號（seanhocode）、專業職位與核心技術標籤（C#, Go, Docker 等）。
 * 2. 視窗內容插槽適配：作為純內容展示元件，不處理視窗拖曳或開關邏輯，專注呈現豐富內容並填滿 `<Window>` 元件的子節點。
 * 3. 註冊表對應：與 `src/lib/operating-system/appRegistry.ts` 綁定，當使用者在桌面點擊開啟 `about_me` 時被動態查找並渲染。
 * 
 * 【初學者觀念 - 獨立 App 模組與視窗內容】：
 * 1. 在作業系統桌面架構中，這個元件代表「視窗打開後裡面要顯示的內容」。
 * 2. 它被登記在 src/lib/operating-system/appRegistry.ts 中，當使用者在桌面點擊「關於我」圖示時，
 *    系統會動態將此元件渲染進 <Window> 視窗的內容插槽 (children) 中。
 * 3. 樣式完全採用 Tailwind CSS，支援深淺色模式自動切換 (透過 dark: 前綴)。
 */
export function AboutMeApp() {
  return (
    // 外層容器：space-y-6 讓各區塊之間維持 24px 垂直間距；支援深淺色文字顏色
    <div className="space-y-6 text-gray-800 dark:text-gray-200">
      
      {/* 個人大頭貼與標題區塊 (flex 水平排列，gap-6 間距 24px) */}
      <div className="flex items-center gap-6">
        {/* 
          圓形頭像縮圖：
          - w-24 h-24: 寬高 96px
          - rounded-full: 圓形半徑 9999px
          - flex-shrink-0: 防止在小螢幕時圓形被擠壓變形
          - flex items-center justify-center: 內部字母置中
        */}
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex flex-shrink-0 items-center justify-center text-blue-600 dark:text-blue-300 text-3xl font-bold">
          S
        </div>
        
        {/* 名字與職稱 */}
        <div>
          <h1 className="text-2xl font-bold mb-2">seanhocode</h1>
          <p className="text-gray-600 dark:text-gray-400">Backend Developer / 系統工程師</p>
        </div>
      </div>

      {/* 詳細簡介區塊 */}
      <div className="space-y-4">
        {/* 區塊標題 (含下方底線分隔 border-b) */}
        <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">關於我</h2>
        <p className="leading-relaxed">
          嗨！我是一名熱愛技術的後端工程師。專注於系統架構設計、API 開發，以及自動化部署流程。
          我喜歡將複雜的業務邏輯轉化為乾淨、易維護的程式碼，並對學習新技術充滿熱忱。
        </p>
        
        {/* 主要技能列表 */}
        <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mt-4">主要技能</h2>
        {/* list-disc: 圓點清單符號；list-inside: 符號縮排在清單方塊內 */}
        <ul className="list-disc list-inside space-y-1">
          <li>C# / .NET Core / ASP.NET</li>
          <li>Node.js / TypeScript</li>
          <li>SQL Server / PostgreSQL / Redis</li>
          <li>Docker / CI/CD (GitHub Actions)</li>
          <li>系統架構設計與效能優化</li>
        </ul>
      </div>
    </div>
  );
}
