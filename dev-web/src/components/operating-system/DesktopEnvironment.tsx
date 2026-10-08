// "use client" 指示詞：此元件處理桌面圖示的點擊開啟、多視窗動畫與狀態更新，屬於動態客戶端互動元件
"use client";

import React from 'react';
// 引入桌面圖示元件
import { DesktopIcon } from './DesktopIcon';
// 引入單一視窗外殼元件
import { Window } from './Window';
// 引入封裝了桌面生命週期、視窗操作與動態 App 解析邏輯的 Custom Hook
import { useDesktopEnvironment } from '@/hooks/useDesktopEnvironment';

/**
 * 桌面環境核心元件 (DesktopEnvironment)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是類作業系統桌面的主舞台畫布 (Desktop Canvas Component)，負責：
 * 1. 桌面壁紙與網格佈局：呈現深淺色漸層背景壁紙，並以 Grid 網格系統排版所有桌面圖示。
 * 2. 驅動桌面圖示清單：遍歷 `apps` 陣列，動態渲染 `<DesktopIcon />`，並綁定開啟視窗或路由跳轉動作。
 * 3. 動態管理多視窗渲染：遍歷開啟中的視窗清單 (`windows`)，調用 `resolveWindowApp` 動態反查出標題與內部 React 元件，實體化多個 `<Window>`。
 * 4. 委託外觀協調：透過 `useDesktopEnvironment` 外觀 Hook 統合 App 資料與視窗狀態，自身專注於 UI 宣告。
 * 
 * 【初學者觀念 - 資料驅動與動態元件解析 (Dynamic Component Rendering)】：
 * 1. 職責分離：
 *    元件本身不寫死視窗開關、計時或陣列操作，而是呼叫 useDesktopEnvironment() 取得狀態與工具函式，
 *    JSX 只負責將資料轉換為視覺畫面。
 * 2. 桌面圖示區域：
 *    讀取 apps 陣列，使用 .map() 迴圈渲染每個桌面圖示。點擊圖示時觸發 openWindow(id)。
 * 3. 視窗動態渲染：
 *    遍歷當前開啟的視窗 (windows)。透過 resolveWindowApp(w.id) 動態反查出：
 *    - 視窗標題列該叫什麼名字？ (app.title)
 *    - 視窗裡面該放入哪一個 React 元件？ (Component: AppComponent)
 *    如果該 App 元件尚未實作，則顯示預設的友善佔位提示，而不是報錯崩潰。
 */
export function DesktopEnvironment() {
  // 從自訂 Hook 取得應用程式清單、當前開啟的視窗、以及操作視窗的函式
  const {
    apps,
    windows,
    openWindow,
    closeWindow,
    toggleMinimize,
    resolveWindowApp,
  } = useDesktopEnvironment();

  return (
    // 桌面背景容器：
    // - relative w-full h-screen: 相對定位、寬高佔滿整個視窗螢幕
    // - overflow-hidden: 超出範圍隱藏，避免出現滾動條
    // - bg-gradient-to-br: 漸層背景 (由左上到右下)；支援深淺色模式切換
    // - selection:bg-blue-500/30: 使用者在桌面上選取文字時的高亮半透明背景色
    <div 
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-100 to-blue-300 dark:from-[#0f2027] dark:via-[#203a43] dark:to-[#2c5364] selection:bg-blue-500/30"
    >
      {/* 
        桌面 Icon 擺放區域：
        - absolute inset-0: 絕對定位並鋪滿父容器四周 (top:0, right:0, bottom:0, left:0)
        - flex flex-col flex-wrap: 由上往下排列圖示，高度排滿後自動折行到下一欄
        - content-start gap-4: 欄位靠左對齊，圖示彼此間距 16px
        - h-[calc(100vh-3rem)]: 扣除底部工作列 (3rem / 48px) 的可用高度
      */}
      <div className="absolute inset-0 p-4 flex flex-col flex-wrap content-start gap-4 h-[calc(100vh-3rem)]">
        {apps.map((app) => (
          <DesktopIcon key={app.id} app={app} onOpenWindow={openWindow} />
        ))}
      </div>

      {/* 
        動態渲染所有「正在開啟」的視窗：
        windows 陣列記錄了目前桌面上開了哪些視窗 (例如 [{ id: 'about_me', minimized: false }])
      */}
      {windows.map((w) => {
        // 根據視窗 ID 反查 App 設定與對應的 React 元件
        const resolved = resolveWindowApp(w.id);
        if (!resolved) return null; // 找不到 App 定義時安全略過

        const { app, Component: AppComponent } = resolved;

        return (
          // 渲染標準視窗框架
          <Window 
            key={w.id}
            title={app.title} 
            isOpen={true}
            isMinimized={w.minimized}
            onMinimize={() => toggleMinimize(w.id)}
            onClose={() => closeWindow(w.id)}
          >
            {/* 條件渲染：若有對應的 App 元件則渲染，若無則顯示施工中提示 */}
            {AppComponent ? (
              <AppComponent />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
                <p className="text-base font-semibold mb-1">應用程式開發中</p>
                <p className="text-xs text-gray-400">
                  找不到對應的元件：{app.component || app.id}
                </p>
              </div>
            )}
          </Window>
        );
      })}
    </div>
  );
}
