// "use client" 指示詞：此元件處理使用者點擊 (onClick) 圖示開啟視窗的瀏覽器端互動
"use client";

import React, { useCallback } from 'react';
// 引入 Next.js 內建的路由連結元件 (提供無重新整理的客戶端快速跳轉)
import Link from 'next/link';
// 引入桌面應用程式型別
import { DesktopApp } from '@/types/operating-system/desktop';
// 引入通用圖示渲染元件
import { AppIcon } from './AppIcon';

/**
 * DesktopIcon 元件的 Props 介面定義
 */
export interface DesktopIconProps {
  app: DesktopApp;                            // 該圖示所對應的 App 完整設定物件
  onOpenWindow?: (windowId: string) => void;  // 開啟視窗的回呼函式 (由父元件傳入)
}

/**
 * 桌面圖示元件 (DesktopIcon)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是桌面作業系統的單一桌面捷徑與互動單元 (Desktop Launcher Item)，負責：
 * 1. 呈現捷徑外觀與文字：渲染 App 圖示 (呼叫 `AppIcon`) 與底部名稱標籤，提供擬真桌面的懸停背景高亮效果。
 * 2. 雙軌點擊行為路由分流：
 *    - 內部視窗模式 (無 `href`)：點擊觸發 `onOpenWindow`，於桌面喚出對應的彈跳視窗。
 *    - 頁面跳轉模式 (有 `href`)：利用 Next.js `<Link>` 執行 SPA 無刷新路由切換 (如跳轉至 `/resume`)。
 * 3. 懸停回饋聯動：透過 Tailwind `group` 與 `group-hover` 實現滑鼠滑入時圖示與文字的聯動視覺回饋。
 * 
 * 【初學者觀念 - 條件分支與 Link vs. Button】：
 * 1. 在作業系統桌面中，圖示可能有兩種行為：
 *    - 行為 A (內部彈出視窗)：若沒有提供 href，點擊時呼叫 onOpenWindow 開啟視窗。
 *    - 行為 B (外部或獨立路由跳轉)：若有提供 href (例如前往 /resume)，則包裝在 Next.js 的 <Link> 元件中，實現單頁應用程式 (SPA) 的快速路由切換。
 * 2. Tailwind group 類別：
 *    在最外層加上 `group`，內部的圖示就可以使用 `group-hover:text-blue-800`，
 *    代表「只要滑鼠滑入整個圖示方塊，圖示顏色就會一起變深」。
 */
export function DesktopIcon({ app, onOpenWindow }: DesktopIconProps) {
  // 決定目標視窗 ID：優先使用自訂的 windowId，若無則預設使用 app.id
  const targetWindowId = app.windowId || app.id;

  // 點擊事件處理函式：若不是超連結，則呼叫開啟視窗方法
  const handleClick = useCallback(() => {
    if (!app.href) {
      onOpenWindow?.(targetWindowId);
    }
  }, [app.href, onOpenWindow, targetWindowId]);

  // 圖示的主要視覺 JSX 結構 (抽取為變數，供 Link 或 div 重複使用)
  const content = (
    <div className="flex flex-col items-center justify-start w-24 h-24 p-2 rounded hover:bg-black/10 dark:hover:bg-white/20 text-gray-800 dark:text-white transition-colors cursor-pointer group">
      {/* 
        圖示主體：
        - drop-shadow-md: 加上投影效果，讓圖示在各種壁紙上都清晰可見
        - group-hover: 當整個圖示方塊被 hover 時觸發色彩變化
      */}
      <AppIcon 
        icon={app.icon} 
        size={40} 
        className="mb-2 drop-shadow-md text-blue-600 dark:text-blue-100 group-hover:text-blue-800 dark:group-hover:text-white transition-colors" 
      />
      {/* 圖示名稱文字 */}
      <span className="text-xs text-center drop-shadow-md leading-tight font-medium">
        {app.label}
      </span>
    </div>
  );

  // 【情境 A：具有獨立網址】使用 Next.js Link 元件跳轉
  if (app.href) {
    return (
      <Link href={app.href}>
        {content}
      </Link>
    );
  }

  // 【情境 B：視窗應用程式】綁定 onClick 開啟桌面視窗
  return (
    <div onClick={handleClick}>
      {content}
    </div>
  );
}
