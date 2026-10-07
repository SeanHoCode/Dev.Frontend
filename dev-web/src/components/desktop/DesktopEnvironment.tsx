"use client";

import { useEffect } from 'react';
import { desktopApps } from '@/data/desktopConfig';
import { DesktopIcon } from './DesktopIcon';
import { Window } from './Window';
import { AboutMeApp } from '@/components/apps/AboutMeApp';
import { useWindowContext } from './WindowContext';

export function DesktopEnvironment() {
  const { windows, openWindow, closeWindow, toggleMinimize, closeAllWindows } = useWindowContext();

  // 離開首頁時強制關閉所有視窗
  useEffect(() => {
    return () => {
      closeAllWindows();
    };
  }, [closeAllWindows]);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-100 to-blue-300 dark:from-[#0f2027] dark:via-[#203a43] dark:to-[#2c5364] selection:bg-blue-500/30"
    >
      {/* 桌面 Icon 區域 */}
      <div className="absolute inset-0 p-4 flex flex-col flex-wrap content-start gap-4 h-[calc(100vh-3rem)]">
        {desktopApps.map((app) => (
          <DesktopIcon key={app.id} app={app} onOpenWindow={openWindow} />
        ))}
      </div>

      {/* 渲染開啟的視窗 */}
      {windows.map((w) => {
        if (w.id === 'about_me') {
          return (
            <Window 
              key={w.id}
              title="關於我 (About Me)" 
              isOpen={true}
              isMinimized={w.minimized}
              onMinimize={() => toggleMinimize(w.id)}
              onClose={() => closeWindow(w.id)}
            >
              <AboutMeApp />
            </Window>
          );
        }
        return null;
      })}
    </div>
  );
}
