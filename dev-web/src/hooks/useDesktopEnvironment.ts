// "use client" 指示詞：此 Hook 處理桌面視窗的開啟/關閉生命週期與元件解析
"use client";

import { useEffect, useCallback } from 'react';
// 引入 App 清單的 Context Hook
import { useDesktopApps } from '@/hooks/useDesktopApps';
// 引入視窗狀態的 Context Hook
import { useWindowContext } from '@/hooks/useWindowContext';
// 引入應用程式元件註冊表 (負責將字串代碼如 'AboutMeApp' 對應到真實的 React 元件)
import { getAppComponent } from '@/lib/operating-system/appRegistry';

/**
 * 桌面環境核心邏輯 Hook (useDesktopEnvironment)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本 Hook 是桌面環境元件的外觀協調器 (Desktop Facade Hook)，負責：
 * 1. 跨模組狀態聚合 (State Aggregation)：整合 `useDesktopApps` (應用程式清單資料) 與 `useWindowContext` (視窗開啟與最小化狀態)，提供單一乾淨的操作介面。
 * 2. 視窗元件動態反查 (Dynamic Component Resolution)：實作 `resolveWindowApp(windowId)`，透過 `appRegistry` 將視窗 ID 解析為對應的 App 設定與 React 實體元件。
 * 3. 跨頁面路由卸載清理 (Route Exit Cleanup)：在離開首頁桌面跳轉至其他子頁面時，於 `useEffect` 清理階段自動執行 `closeAllWindows()` 清除開啟中的視窗。
 * 
 * 【初學者觀念 - 業務邏輯整合與頁面卸載清理】：
 * 1. 邏輯整合 (Facade Pattern)：
 *    此 Hook 作為桌面畫面的「大腦」，將來自不同 Context 的能力 (Apps 清單 + 視窗狀態)
 *    與本地的動態元件解析 (resolveWindowApp) 整合成單一乾淨的介面提供給 DesktopEnvironment.tsx。
 * 2. 卸載清理 (Unmount Cleanup)：
 *    在 useEffect 內部回傳 () => closeAllWindows()，當使用者透過導覽列跳轉到其他專頁 (例如 /resume) 時，
 *    觸發清理函式，將目前留在桌面的所有視窗自動關閉，避免再次回到桌面時留下非預期的舊狀態。
 */
export function useDesktopEnvironment() {
  // 取得所有可用 App 與依據 ID 查詢的方法
  const { apps, getAppById } = useDesktopApps();
  // 取得開啟中的視窗列表與開/關/最小化等控制方法
  const { windows, openWindow, closeWindow, toggleMinimize, closeAllWindows } = useWindowContext();

  // 監聽元件卸載：離開首頁路由時強制重設所有開啟的視窗
  useEffect(() => {
    return () => {
      closeAllWindows();
    };
  }, [closeAllWindows]);

  /**
   * 輔助解析函式：輸入開啟中視窗的 windowId，找出對應的 App 資訊與 React 元件
   * 
   * @param windowId 視窗識別碼 (例如 "about_me")
   * @returns { app: DesktopApp, Component: React.ComponentType | null } 或 null
   */
  const resolveWindowApp = useCallback((windowId: string) => {
    // 1. 從 apps 清單中查找符合 ID 的 App 設定
    const app = getAppById(windowId);
    if (!app) return null;

    // 2. 透過元件註冊表 (Registry) 反查出該 App 對應的 React 元件
    const Component = getAppComponent(app.component || app.id);
    
    return {
      app,
      Component,
    };
  }, [getAppById]);

  // 回傳給 DesktopEnvironment.tsx 純畫面元件使用
  return {
    apps,
    windows,
    openWindow,
    closeWindow,
    toggleMinimize,
    resolveWindowApp,
  };
}
