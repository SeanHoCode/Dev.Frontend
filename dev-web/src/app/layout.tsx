import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper"
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
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <MainLayoutWrapper>
            {children}
          </MainLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}