"use client";

import { useEffect, useCallback } from 'react';
import { useDesktopApps } from '@/hooks/useDesktopApps';
import { useWindowContext } from '@/hooks/useWindowContext';
import { getAppComponent } from '@/lib/operating-system/appRegistry';

/**
 * 處理桌面環境視窗管理、生命週期與動態元件解析邏輯 (Script 邏輯抽離)
 */
export function useDesktopEnvironment() {
  const { apps, getAppById } = useDesktopApps();
  const { windows, openWindow, closeWindow, toggleMinimize, closeAllWindows } = useWindowContext();

  // 離開首頁時強制關閉所有視窗
  useEffect(() => {
    return () => {
      closeAllWindows();
    };
  }, [closeAllWindows]);

  // 輔助函式：根據視窗 ID 取得 App 設定與對應元件
  const resolveWindowApp = useCallback((windowId: string) => {
    const app = getAppById(windowId);
    if (!app) return null;
    const Component = getAppComponent(app.component || app.id);
    return {
      app,
      Component,
    };
  }, [getAppById]);

  return {
    apps,
    windows,
    openWindow,
    closeWindow,
    toggleMinimize,
    resolveWindowApp,
  };
}
