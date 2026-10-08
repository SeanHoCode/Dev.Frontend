// "use client" 指示詞：Context Provider 負責管理視窗開啟陣列與狀態更新，屬於客戶端行為
"use client";

import React, { createContext, useState } from 'react';
// 引入視窗狀態型別 (WindowData 為單一視窗狀態，WindowContextType 為 Context 提供的方法型別)
import { WindowData, WindowContextType } from '@/types/operating-system/window';

/**
 * 建立視窗 Context (WindowContext)
 * 供 useWindowContext Hook 於各個子元件中快速讀取視窗狀態
 */
export const WindowContext = createContext<WindowContextType | undefined>(undefined);

/**
 * 視窗狀態提供者元件 (WindowProvider)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是類作業系統視窗生命週期的狀態管理核心 (Window State Provider)，負責：
 * 1. 集中維護視窗清單 (State)：透過 React 狀態記錄當前已開啟的視窗陣列 (`windows: WindowData[]`) 及其最小化狀態。
 * 2. 封裝視窗生命週期方法 (Methods)：
 *    - `openWindow(id)`：開啟新視窗，或將已開啟但最小化的視窗還原至前景。
 *    - `closeWindow(id)`：將指定視窗從清單移除並卸載。
 *    - `toggleMinimize(id)`：切換視窗的最小化與可見狀態。
 *    - `closeAllWindows()`：一次關閉所有開啟中的視窗 (例如點擊「顯示桌面」時)。
 * 3. 跨元件狀態廣播 (Provider)：透過 `WindowContext` 共享狀態給桌面環境 (`DesktopEnvironment`) 與工作列 (`Taskbar`)，維持兩者視窗狀態同步。
 * 
 * 【初學者觀念 - 不可變性 (Immutability) 與陣列狀態更新】：
 * 在 React 中，更新陣列狀態時絕對不能使用 windows.push() 或 windows.splice() 直接修改原陣列，
 * 必須使用 setWindows((prev) => [...prev, 新元素]) 或 prev.filter() / prev.map() 回傳一個「全新的陣列實體」，
 * React 才能透過記憶體位址的比對察覺狀態改變，進而觸發畫面的重新渲染 (Re-render)。
 */
export function WindowProvider({ children }: { children: React.ReactNode }) {
  // windows: 目前桌面開啟的視窗清單 (例如: [{ id: 'about_me', minimized: false }])
  const [windows, setWindows] = useState<WindowData[]>([]);

  // 開啟視窗方法
  const openWindow = (id: string) => {
    setWindows((prev) => {
      // 檢查該視窗是否已經在桌面開啟中
      const exists = prev.find((w) => w.id === id);
      if (exists) {
        // 若已開啟過，確保將其「取消最小化」(minimized: false) 並移至陣列末端帶回最上層前景
        return [...prev.filter((w) => w.id !== id), { ...exists, minimized: false }];
      }
      // 若尚未開啟，將新視窗物件加入陣列末端 (展開運算子 ...prev 保留既有視窗)
      return [...prev, { id, minimized: false }];
    });
  };

  // 關閉視窗方法：透過 Array.prototype.filter() 剔除符合 id 的視窗
  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  // 切換最小化狀態：透過 Array.prototype.map() 將目標視窗的 minimized 布林值反轉
  const toggleMinimize = (id: string) => {
    setWindows((prev) => prev.map((w) => 
      w.id === id ? { ...w, minimized: !w.minimized } : w
    ));
  };

  // 將視窗提升至最上層前景 (Focus Window)
  const focusWindow = (id: string) => {
    setWindows((prev) => {
      const target = prev.find((w) => w.id === id);
      if (!target) return prev;
      if (prev[prev.length - 1]?.id === id) return prev;
      return [...prev.filter((w) => w.id !== id), target];
    });
  };

  // 關閉所有視窗
  const closeAllWindows = () => {
    setWindows([]);
  };

  return (
    // 將所有狀態與操作函式包裹為物件，傳遞給 Provider
    <WindowContext.Provider value={{ windows, openWindow, closeWindow, toggleMinimize, closeAllWindows, focusWindow }}>
      {children}
    </WindowContext.Provider>
  );
}

// 重新匯出 Hook 以相容既有引用
export { useWindowContext } from '@/hooks/useWindowContext';
// 重新匯出型別以維持相容性
export type { WindowData, WindowContextType } from '@/types/operating-system/window';
