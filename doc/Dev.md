# 開發環境
## 建立 Next.js 專案
- 於主資料夾路徑下輸入指令: `npx create-next-app@latest [專案名稱]`

## 建置並啟動專案
- 於 Dev.Frontend/[專案名稱] 路徑下輸入指令: `npm run dev`

## 自動建立專案檔案
### .next
- 執行開發伺服器或建置時，Next.js 自動編譯出來的暫存檔與正式運行檔案
- 是否可移除: 否(系統檔案) (雖然刪除後重新執行指令會自動產生，但在開發或運行期間不可移除)
### node_modules
- 存放所有經由 npm 下載的第三方套件實體檔案
- 是否可移除: 否(系統檔案) (若誤刪需透過終端機執行 `npm install` 重新下載裝回，開發期間不可缺失)
### public
- 存放靜態資源（如圖片、SVG、`favicon.ico` 等）的目錄，該目錄下的檔案可直接透過根目錄網址存取
- 是否可移除: 部分(網站內容) (預設的示範圖片可移除，但 `public` 資料夾本身必須保留)
### src
- 專案的原始碼主目錄，用來與根目錄的設定檔區隔，提高專案結構的可讀性
- 是否可移除: 否(系統目錄) (必須保留)
    - app
        - App Router 架構的核心目錄，負責管理路由與網頁畫面呈現
        - 是否可移除: 否(系統目錄) (必須保留，所有的頁面路由與核心佈局皆須建立於此)
        -page.tsx
            - 網站根目錄 (`/`) 的首頁 UI 畫面進入點
            - 是否可移除: 部分(網站內容) (檔案必須保留以維持首頁路由，但預設的展示用程式碼可全部清空並替換為自訂內容)
        - layout.tsx
            - 網站的共用根佈局 (Root Layout)，控制 `<html lang="en">` 與 `<body>`，所有子頁面都會自動套用此版面，常用於設定網頁 `<head>` 資訊 (`metadata`) 與共用的導覽列、頁尾
            - 是否可移除: 否(核心結構) (檔案必須保留，但可修改內部設定與移除預設帶入的字型)
        - globals.css
            - 全站共用的 CSS 樣式表
            - 是否可移除: 部分(網站內容) (若使用 Tailwind CSS，須保留最上方的 `@tailwind` 指令；若完全不使用自訂全域樣式，保留空檔案或清空內容即可)
        - favicon.ico
            - 網站預設在瀏覽器分頁標籤上顯示的圖示 (Icon)
            - 是否可移除: 是(網站內容) (可刪除並替換成自訂的 `.ico` 或其他格式圖示檔)
### .gitignore
- 告訴 Git 版本控制系統哪些檔案或資料夾 (如 `node_modules`, `.next`) 應被忽略，避免將非必要檔案上傳至程式碼儲存庫
- 是否可移除: 否(系統檔案)
### eslint.config.mjs
- ESLint 語法檢查工具的設定檔，用來規範程式碼寫作風格與品質
- 是否可移除: 否(系統檔案)
### next-env.d.ts
- TypeScript 的型別定義檔，確保編譯器能正確識別 Next.js 的專有型別
- 是否可移除: 否(系統檔案) (由 Next.js 自動維護，不可手動修改或刪除)
### next.config.ts
- Next.js 專案的核心設定檔，用於設定環境變數、跨域請求、路由重導向等進階編譯設定
- 是否可移除: 否(系統檔案)
### package.json
- 紀錄專案的基本資訊、各項 npm 執行腳本 (`scripts`，如 `npm run dev`) 以及專案所依賴的套件清單 (`dependencies`)
- 是否可移除: 否(系統檔案)
### postcss.config.mjs
- PostCSS 處理器的設定檔，通常用於與 Tailwind CSS 連動編譯處理樣式
- 是否可移除: 否(系統檔案)
### README.md
- 專案的說明文件，預設內容為 Next.js 的官方啟動教學與參考文件連結
- 是否可移除: 是(網站內容) (可完全清空並替換成你自己撰寫的專案說明文件)
### tsconfig.json
- TypeScript 的編譯設定檔，定義了型別檢查的嚴格程度與編譯環境參數
- 是否可移除: 否(系統檔案)

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

## 安裝 Shadcn UI
- 於 Dev.Frontend/[專案名稱] 路徑下輸入指令: ``npx shadcn@latest init --preset b5KafHpnE --template next``
- 須注意因為  Shadcn UI 依賴 Tailwind CSS v4，Next.js 預設有搭載，但如果移除以下設定則會安裝失敗
    - /src/app/globals.css 中的 ``@import "tailwindcss";`` 引用
    - /src/app/layout.tsx 中的 ``import "./globals.css";`` 引用

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

## 深色模式設定
1. 安裝 next-themes
    - 於 Dev.Frontend/[專案名稱] 路徑下輸入指令: ``npm install next-themes``
2. 於 components 中新增 ``theme-provider.tsx``:
    ```tsx
    "use client"

    import * as React from "react"
    import { ThemeProvider as NextThemesProvider } from "next-themes"

    export function ThemeProvider({
        children,
        ...props
    }: React.ComponentProps<typeof NextThemesProvider>) {
        return <NextThemesProvider {...props}>{children}</NextThemesProvider>
    }
    ```
3. 調整 src/app/layout.tsx
    1. 引用 ``theme-provider.tsx`` : ``import { ThemeProvider } from "@/components/theme-provider"``
    2. ``<html>`` 屬性中加上 ``suppressHydrationWarning``
        - 因 next-themes 會在客戶端載入時立即修改 ``<html>`` 標籤的屬性（加入 class="dark" 等），這會導致與伺服器端渲染 (SSR) 輸出的 HTML 結構不一致，進而引發 React Hydration Error。在 ``<html>`` 加上 ``suppressHydrationWarning`` 是官方建議用來忽略此特定層級屬性比對錯誤的標準做法
    3. ``<body>`` 加入 ``ThemeProvider``
        ``` html
        <body>
            <ThemeProvider
            attribute="class"       // 以 class 屬性 (dark) 來控制樣式
            defaultTheme="system"   // 預設跟隨作業系統設定
            enableSystem            // 啟用系統主題偵測
            disableTransitionOnChange // 避免切換瞬間發生 CSS 漸變閃爍
            >
                {children}
            </ThemeProvider>
        </body>
        ```

