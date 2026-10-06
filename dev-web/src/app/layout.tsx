import type { Metadata } from "next"
import "./globals.css"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { ThemeProvider } from "@/components/layout/theme-provider"

export const metadata: Metadata = {
  title: "seanhocode | Backend Developer",
  description: "Personal brand, resume, and tech lab of seanhocode.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // 必須加上 suppressHydrationWarning
    // 因 next-themes 會在客戶端載入時立即修改 <html> 標籤的屬性（加入 class="dark" 等），這會導致與伺服器端渲染 (SSR) 輸出的 HTML 結構不一致，進而引發 React Hydration Error。在 <html> 加上 suppressHydrationWarning 是官方建議用來忽略此特定層級屬性比對錯誤的標準做法
    <html lang="zh-TW" suppressHydrationWarning>
      <body className="bg-background text-foreground font-sans antialiased">
        <ThemeProvider
          attribute="class"         // 以 class 屬性 (dark) 來控制樣式
          defaultTheme="dark"     // 預設跟隨作業系統設定
          enableSystem              // 啟用系統主題偵測
          disableTransitionOnChange // 避免切換瞬間發生 CSS 漸變閃爍
        >
          <SidebarProvider>
            {/* 左側樹狀導覽列 */}
            <AppSidebar />
            
            {/* 右側主要內容區 */}
            <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
              {/* 行動版或隱藏側邊欄時的觸發按鈕 */}
              <div className="p-4 flex items-center border-b bg-white sticky top-0 z-10 md:hidden">
                <SidebarTrigger />
                <span className="ml-4 font-bold text-blue-600">seanhocode</span>
              </div>
              
              {/* 頁面內容注入點 */}
              <div className="p-6 md:p-8 lg:p-12 w-full max-w-5xl mx-auto flex-grow">
                {children}
              </div>
              
              <footer className="bg-transparent text-gray-400 text-sm py-6 mt-auto text-center border-t border-gray-200">
                <p>© {new Date().getFullYear()} seanhocode. All rights reserved.</p>
              </footer>
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}