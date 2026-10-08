import * as React from "react"

// 定義行動裝置與桌面裝置的分界斷點寬度 (768px 對應 Tailwind 的 md: 斷點)
const MOBILE_BREAKPOINT = 768

/**
 * 偵測目前螢幕寬度是否為行動裝置的 Custom Hook (useIsMobile)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本 Hook 負責提供響應式 (Responsive) 斷點狀態監聽：
 * 1. 斷點狀態偵測：以 768px 為門檻 (對齊 Tailwind `md:` 斷點)，監聽視窗寬度變化並即時回傳是否為行動裝置 (`boolean`)。
 * 2. SSR 環境防護：安全地將瀏覽器 `window` 與 `matchMedia` 物件存取延遲至客戶端 `useEffect` 掛載後，防止 SSR 時拋出崩潰例外。
 * 3. 生命週期清理：在元件卸載時正確移除 `change` 監聽器，避免無效重複回呼與記憶體洩漏。
 * 
 * 【初學者觀念 - window.matchMedia 與清理函式 (Cleanup Function)】：
 * 1. 為什麼不能只在渲染時讀取 window.innerWidth？
 *    因為在伺服器端渲染 (SSR) 期間，Node.js 環境中不存在 `window` 全域物件，直接讀取會噴出 "window is not defined" 錯誤。
 *    因此必須在 useEffect (只在瀏覽器端執行) 內部存取。
 * 2. matchMedia API：
 *    這是瀏覽器內建高效監聽 CSS Media Query 變更的 API。
 * 3. 清理函式 (return () => ...):
 *    在 useEffect 尾端回傳的函式會在「元件卸載」時被執行。
 *    這裡移除事件監聽器 (removeEventListener)，防止記憶體洩漏 (Memory Leak)。
 * 4. 雙驚嘆號 (!!isMobile)：
 *    JavaScript 語法：將值強制轉換為純布林值 (true 或 false)。
 */
export function useIsMobile() {
  // isMobile 狀態，初始值為 undefined (代表尚未在客戶端完成初次比對)
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // 建立小於 767px 的媒體查詢比對器
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // 當視窗縮放跨越斷點時觸發的回呼
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // 註冊監聽器
    mql.addEventListener("change", onChange)
    
    // 立即執行一次以獲取當前寬度
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // 清理函式：元件卸載時取消事件監聽
    return () => mql.removeEventListener("change", onChange)
  }, []) // 空相依陣列 []：代表只在元件初次掛載與卸載時執行一次

  return !!isMobile
}
