"use client";

import React, { createContext, useState } from 'react';
import { WindowData, WindowContextType } from '@/types/operating-system/window';

export const WindowContext = createContext<WindowContextType | undefined>(undefined);

/**
 * 視窗狀態提供者元件 (Provider Component)
 * 檔名 WindowProvider.tsx 與元件名稱一致
 */
export function WindowProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<WindowData[]>([]);

  const openWindow = (id: string) => {
    setWindows((prev) => {
      const exists = prev.find((w) => w.id === id);
      if (exists) {
        return prev.map((w) => w.id === id ? { ...w, minimized: false } : w);
      }
      return [...prev, { id, minimized: false }];
    });
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const toggleMinimize = (id: string) => {
    setWindows((prev) => prev.map((w) => 
      w.id === id ? { ...w, minimized: !w.minimized } : w
    ));
  };

  const closeAllWindows = () => {
    setWindows([]);
  };

  return (
    <WindowContext.Provider value={{ windows, openWindow, closeWindow, toggleMinimize, closeAllWindows }}>
      {children}
    </WindowContext.Provider>
  );
}

// 重新匯出 Hook 以相容既有引用
export { useWindowContext } from '@/hooks/useWindowContext';
// 重新匯出型別以維持相容性
export type { WindowData, WindowContextType } from '@/types/operating-system/window';
