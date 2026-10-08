// "use client" 指示詞：此元件處理桌面圖示的渲染與點擊互動，屬於動態客戶端互動元件
"use client";

import React from 'react';
// 引入桌面圖示元件
import { DesktopIcon } from './DesktopIcon';
// 引入封裝了桌面應用程式資料與視窗操作的 Custom Hook
import { useDesktopEnvironment } from '@/hooks/useDesktopEnvironment';

/**
 * 桌面環境核心元件 (DesktopEnvironment)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是類作業系統桌面的主舞台畫布 (Desktop Canvas Component)，負責：
 * 1. 桌面壁紙與網格佈局：呈現深淺色漸層背景壁紙，並以 Grid 網格系統排版所有桌面圖示。
 * 2. 驅動桌面圖示清單：遍歷 `apps` 陣列，動態渲染 `<DesktopIcon />`，並綁定開啟視窗或路由跳轉動作。
 * 3. 架構解耦 (Decoupled Windows Architecture)：
 *    視窗的渲染已提升至全域 `<WindowHost />` (於 MainLayoutWrapper 掛載)，
 *    使桌面僅專注於桌面畫布與圖示，而開啟的視窗則能自由浮動於全站所有頁面之上。
 */
export function DesktopEnvironment() {
  // 從自訂 Hook 取得應用程式清單以及開啟視窗的函式
  const { apps, openWindow } = useDesktopEnvironment();

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
    </div>
  );
}
