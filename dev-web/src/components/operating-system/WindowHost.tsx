// "use client" 指示詞：此元件處理全域多視窗的動態渲染與互動，屬於客戶端元件
"use client";

import React from 'react';
import { Window } from './Window';
import { useDesktopApps } from '@/hooks/useDesktopApps';
import { useWindowContext } from '@/hooks/useWindowContext';
import { getAppComponent } from '@/lib/operating-system/appRegistry';

/**
 * 全域視窗宿主元件 (WindowHost - Presentation / Container Component)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是類作業系統的全域視窗調度與渲染容器 (Global Window Host Component)，負責：
 * 1. 全域跨路由浮動視窗 (Cross-route Global Windowing)：
 *    掛載於 MainLayoutWrapper，跳脫單一首頁 (Desktop) 限制，
 *    讓使用者在全站任何頁面（包括 /resume 等子頁面）都能隨時呼叫與操作 App 視窗。
 * 2. 視窗元件動態反查 (Dynamic Component Resolution)：
 *    監聽全域 `windows` 狀態陣列，透過 `getAppById` 與 `getAppComponent` 動態解析具體 App 畫面。
 * 3. 點擊穿透式外殼 (Click-through Canvas)：
 *    外層容器使用 `fixed inset-0 pointer-events-none z-40 overflow-hidden`，
 *    未被視窗遮蔽的區域維持點擊穿透，底層網頁可正常捲動與互動；
 *    而視窗本體為 `pointer-events-auto`，完整支援拖曳、點擊置頂與滾動操作。
 * 4. 視窗焦點與層疊管理 (Focus & Stacking Management)：
 *    使用者點擊任意視窗時，透過 `focusWindow` 將該視窗提升至最上層前景。
 */
export function WindowHost() {
  // 從 Context 取得應用程式資訊反查函式
  const { getAppById } = useDesktopApps();
  // 從 Context 取得開啟中的視窗清單與視窗操作方法
  const { windows, closeWindow, toggleMinimize, focusWindow } = useWindowContext();

  // 若目前沒有開啟任何視窗，不輸出多餘的 DOM 節點
  if (windows.length === 0) return null;

  return (
    // 全螢幕固定穿透容器：
    // - fixed inset-0: 釘滿瀏覽器全視窗 (相對於 Viewport)，不會隨底層網頁滾動而跑位
    // - pointer-events-none: 讓滑鼠點擊可穿透未遮蔽區域至底層網頁
    // - z-40: 浮動於頁面內容之上，並置於 z-50 工作列 (Taskbar) 之下
    // - overflow-hidden: 防止視窗被拖曳至畫面外時產生瀏覽器捲軸
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {windows.map((w) => {
        // 根據視窗 ID 反查 App 設定與對應的 React 元件
        const app = getAppById(w.id);
        if (!app) return null;

        const AppComponent = getAppComponent(app.component || app.id);

        return (
          <Window
            key={w.id}
            title={app.title}
            isOpen={true}
            isMinimized={w.minimized}
            onMinimize={() => toggleMinimize(w.id)}
            onClose={() => closeWindow(w.id)}
            onFocus={() => focusWindow?.(w.id)}
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
