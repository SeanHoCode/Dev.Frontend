"use client";

import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { StartMenu } from './StartMenu';
import { SystemTray } from './SystemTray';
import { AppIcon } from './AppIcon';
import { useTaskbar } from '@/hooks/useTaskbar';

/**
 * 底部工作列展示元件 (Presentation Component)
 * 內部狀態與事件監聽已拆分至 useTaskbar hook
 */
export function Taskbar() {
  const {
    isStartMenuOpen,
    toggleStartMenu,
    closeStartMenu,
    taskbarRef,
    pathname,
    windows,
    toggleMinimize,
    getAppById,
  } = useTaskbar();

  return (
    <div 
      ref={taskbarRef} 
      className="fixed bottom-0 left-0 right-0 h-12 bg-white/70 dark:bg-black/40 backdrop-blur-md border-t border-gray-200 dark:border-white/10 flex items-center justify-between z-50 select-none"
    >
      {/* Start Menu Popup */}
      <StartMenu isOpen={isStartMenuOpen} onClose={closeStartMenu} />

      {/* Left side (Start Button & Apps) */}
      <div className="flex items-center h-full px-2 gap-1">
        <button
          onClick={toggleStartMenu}
          className={`h-10 w-10 flex items-center justify-center rounded-md transition-colors ${
            isStartMenuOpen ? 'bg-black/10 dark:bg-white/20' : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
          title="開始"
        >
          <LayoutGrid size={22} className="text-blue-600 dark:text-blue-400" />
        </button>
        
        {/* Only show open apps on desktop (/) */}
        {pathname === '/' && windows.length > 0 && (
          <>
            <div className="w-px h-6 bg-gray-300 dark:bg-white/20 mx-1"></div>
            <div className="flex items-center gap-1">
              {windows.map((w) => {
                const appInfo = getAppById(w.id);
                if (!appInfo) return null;
                
                return (
                  <button
                    key={w.id}
                    onClick={() => toggleMinimize(w.id)}
                    className={`h-10 px-3 flex items-center gap-2 rounded-md transition-colors ${
                      w.minimized ? 'hover:bg-black/5 dark:hover:bg-white/10' : 'bg-black/10 dark:bg-white/20 border-b-2 border-blue-500'
                    }`}
                    title={appInfo.title || appInfo.label}
                  >
                    <AppIcon icon={appInfo.icon} size={16} className="text-blue-600 dark:text-blue-300" />
                    <span className="text-xs text-gray-800 dark:text-gray-200 max-w-[100px] truncate">
                      {appInfo.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Right side (System Tray) */}
      <SystemTray />
    </div>
  );
}
