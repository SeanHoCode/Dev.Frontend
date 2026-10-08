// 引入 Next.js 內建的 Metadata 型別，用於設定 HTML <head> 中的 SEO 相關標籤 (如 title, description)
import type { Metadata } from "next"

// 引入全域樣式表 (包含 Tailwind CSS 的基礎設定、字體與全域顏色變數)
import "./globals.css"

// 引入主題提供者元件，負責全站深色/淺色模式 (Dark/Light mode) 的切換
import { ThemeProvider } from "@/components/layout/ThemeProvider"

// 引入主要排版外殼元件，負責包裝桌面環境與共用工作列
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper"

/**
 * 網頁靜態元資料 (Metadata)
 * Next.js 會在編譯或渲染時，自動將此物件轉為 HTML 的 <title> 和 <meta name="description"> 等標籤
 */
export const metadata: Metadata = {
  title: "2.1.16.25",
  description: "Personal brand, resume, and tech lab of seanhocode.",
}

/**
 * RootLayout (根排版元件)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本檔案是整個應用程式的最頂層入口外殼 (Root Layout)，所有頁面均在此架構下運行：
 * 1. 建立 HTML 基礎骨架：輸出 `<html>` 與 `<body>` 根標籤，設定全站語系 (`lang="zh-TW"`) 與 antialiased 平滑字體。
 * 2. 宣告 SEO 元資料：透過靜態物件 `metadata` 定義瀏覽器分頁標題與網頁搜尋說明。
 * 3. 載入全域樣式與外觀主題：匯入 `globals.css` 並以 `ThemeProvider` 包覆全站，提供深淺色模式切換支援。
 * 4. 掛載主要排版外殼：將各頁面的 `children` 傳入 `MainLayoutWrapper`，統一注入狀態管理 Provider 與工作列。
 * 
 * 【初學者觀念】：
 * - 這是 Next.js App Router 的最外層架構，所有路由頁面 (page.tsx) 都會作為 children 注入到這裡。
 * - 它是 Server Component (伺服器元件)，因為頂部沒有宣告 "use client"。
 *
 * @param children 代表當前路由頁面所對應的內容 (例如 app/page.tsx 或 app/resume/page.tsx)
 * @param Readonly<{ children: React.ReactNode }> TypeScript 語法：代表傳入的 props 是唯讀的，children 為任何合法的 React 節點
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning 說明：
    // 因 next-themes 套件會在瀏覽器端載入時，直接在 <html> 標籤上加入 class="dark" 或 class="light"，
    // 這會導致瀏覽器端收到的 HTML 屬性與伺服器端預渲染 (SSR) 的初始屬性有些微差異，因而觸發 React 的 Hydration Warning 警告。
    // 在 <html> 上加上此屬性是 Next.js 與 next-themes 官方推薦用來忽略此標籤比對警告的標準做法。
    <html lang="zh-TW" suppressHydrationWarning>
      <body className="bg-background text-foreground font-sans antialiased">
        {/*
          ThemeProvider 設定：
          - attribute="class": 切換模式時透過在 HTML 加上/移除 'dark' class 來控制 Tailwind 的 dark: 樣式
          - defaultTheme="dark": 預設載入深色主題
          - enableSystem: 支援跟隨使用者作業系統的主題設定
          - disableTransitionOnChange: 切換主題時暫時停用 CSS transition，避免畫面出現閃爍動畫
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* MainLayoutWrapper 負責管理視窗 Context 與底部 Taskbar 工作列 */}
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}