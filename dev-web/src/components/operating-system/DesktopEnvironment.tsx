"use client";

import React from 'react';
import { DesktopIcon } from './DesktopIcon';
import { Window } from './Window';
import { useDesktopEnvironment } from '@/hooks/useDesktopEnvironment';

/**
 * 桌面環境展示元件 (Presentation Component)
 * 狀態管理、視窗開關生命週期與元件解析已拆分至 useDesktopEnvironment hook
 */
export function DesktopEnvironment() {
  const {
    apps,
    windows,
    openWindow,
    closeWindow,
    toggleMinimize,
    resolveWindowApp,
  } = useDesktopEnvironment();

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-100 to-blue-300 dark:from-[#0f2027] dark:via-[#203a43] dark:to-[#2c5364] selection:bg-blue-500/30"
    >
      {/* 桌面 Icon 區域 (動態讀取 apps 清單) */}
      <div className="absolute inset-0 p-4 flex flex-col flex-wrap content-start gap-4 h-[calc(100vh-3rem)]">
        {apps.map((app) => (
          <DesktopIcon key={app.id} app={app} onOpenWindow={openWindow} />
        ))}
      </div>

      {/* 動態渲染開啟的視窗 */}
      {windows.map((w) => {
        const resolved = resolveWindowApp(w.id);
        if (!resolved) return null;

        const { app, Component: AppComponent } = resolved;

        return (
          <Window 
            key={w.id}
            title={app.title} 
            isOpen={true}
            isMinimized={w.minimized}
            onMinimize={() => toggleMinimize(w.id)}
            onClose={() => closeWindow(w.id)}
          >
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
