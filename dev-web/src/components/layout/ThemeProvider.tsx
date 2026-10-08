// "use client" 指示詞：深淺色主題切換依賴瀏覽器的 localStorage 與 DOM 樣式變更，屬於客戶端行為
"use client"

import * as React from "react"
// 引入第三方套件 next-themes 的 ThemeProvider，重新命名為 NextThemesProvider 避免名稱衝突
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * 主題提供者元件 (ThemeProvider)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是第三方主題套件 `next-themes` 的客戶端封裝器 (Client Boundary Wrapper)，負責：
 * 1. 隔離客戶端邊界 (Client Boundary)：將 `'use client'` 限制在此元件中，讓根排版 `app/layout.tsx` 保留為 Server Component 的靜態渲染優勢。
 * 2. 廣播主題狀態 (Theme Context)：提供全站深淺色切換的上下文環境，自動將使用者偏好同步儲存至瀏覽器 `localStorage`。
 * 3. 透傳屬性配置 (Props Forwarding)：透明傳遞 `attribute="class"` 與 `defaultTheme="dark"` 等設定給原生 Provider。
 * 
 * 【初學者觀念 - 元件封裝 (Wrapper Component)】：
 * 1. 為什麼要自己包一層 ThemeProvider 而不直接在 layout.tsx 引入 next-themes？
 *    因為 next-themes 內部依賴 React 的 Context API (需要 "use client")，
 *    而 app/layout.tsx 是 Server Component。
 *    透過封裝一個獨立的客戶端 ThemeProvider 元件，可以讓 layout.tsx 繼續維持為 Server Component，
 *    符合 Next.js 的效能最佳實踐 (將 Client 邊界往下推)。
 * 2. React.ComponentProps<typeof NextThemesProvider>：
 *    TypeScript 技巧：直接繼承 NextThemesProvider 所支援的所有 Props 型別，省去重複宣告。
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // 將所有傳入的 props 與子節點 (children) 轉交給 next-themes 的原生 Provider
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}