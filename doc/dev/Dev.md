# 開發環境

## 啟動開發環境網站
- 於 Dev.Frontend/[專案名稱] 路徑下輸入指令: `npm run dev`

# Next.js
## App Router
- 檔案目錄即路由 (File-based Routing)
    - 不需要額外設定路由表
    - 在 app/ 底下建立資料夾與 page.tsx（例如 app/employees/page.tsx），系統就會自動生成 /employees 的網址
## src/app
- 頁面與版面分離
    - `page.tsx`: 僅負責當前路由頁面的 UI 內容與狀態
    - `layout.tsx`: 管理共用版面（如導覽列）以及 HTML 的 `<head>` 標籤資訊（如網頁標題 `metadata`）。所有子頁面都會自動套用此版面
- 樣式與靜態資源管理
    - `globals.css`: 控制全域樣式（如網頁背景）。若要清除預設樣式，須保留檔案最上方的三行 `@tailwind` 指令（若有啟用 Tailwind CSS），其餘皆可刪除
    - `favicon.ico`: 瀏覽器分頁標籤圖示，直接替換該檔案即可更新全站圖示
## Server Component
- Next.js 預設所有元件都是 Server Component
- Server Component 元件無法使用 useState 或綁定 onClick 事件
## Client Component
- 要實作「點擊按鈕」這類需要與瀏覽器互動的功能，必須將該元件宣告為 Client Component
- 在 Component 第一行書入 ``'use client';`` 宣告為 Client Component

# React
## Components
- React component 是一個回傳標記語言的 JavaScript 函式
- React component 名稱一定要以大寫字母開頭，而 HTML 標記語言則必須為小寫字母
- export default 關鍵字指定檔案中的主要 component
- React 應用程式由 components 組成
# TypeScript
- 出現「不是模組 (is not a module)」的錯誤，是因為 TypeScript 認定該檔案為全域腳本，而非獨立模組。在 TypeScript 中，檔案內部必須包含至少一個 export 或 import 語句，才會被視為模組


# Shadcn UI
- [shadcn/ui](https://ui.shadcn.com/)
## 根據需求安裝元件
- 初始化完成後，根據需求將元件安裝到專案中
- 元件的原始碼會被下載到 `src/components/ui` 資料夾內
- 建議先安裝以下常用元件：
    ```bash
    npx shadcn@latest add button
    npx shadcn@latest add card
    npx shadcn@latest add badge
    npx shadcn@latest add avatar
    ```
