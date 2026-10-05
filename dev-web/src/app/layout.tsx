import type { Metadata } from "next";
import "./globals.css";
import { IBM_Plex_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider"

const ibmPlexSans = IBM_Plex_Sans({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "SeanHoCode Web",
  description: "Frontend Web Dev",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // 必須加上 suppressHydrationWarning
    // 因 next-themes 會在客戶端載入時立即修改 <html> 標籤的屬性（加入 class="dark" 等），這會導致與伺服器端渲染 (SSR) 輸出的 HTML 結構不一致，進而引發 React Hydration Error。在 <html> 加上 suppressHydrationWarning 是官方建議用來忽略此特定層級屬性比對錯誤的標準做法
    <html lang="en" className={cn("font-sans", ibmPlexSans.variable)} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"         // 以 class 屬性 (dark) 來控制樣式
          defaultTheme="system"     // 預設跟隨作業系統設定
          enableSystem              // 啟用系統主題偵測
          disableTransitionOnChange // 避免切換瞬間發生 CSS 漸變閃爍
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
