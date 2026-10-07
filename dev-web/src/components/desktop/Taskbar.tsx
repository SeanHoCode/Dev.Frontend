"use client";

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutGrid } from 'lucide-react';
import { StartMenu } from './StartMenu';
import { SystemTray } from './SystemTray';
import { useWindowContext } from './WindowContext';
import { desktopApps } from '@/data/desktopConfig';

export function Taskbar() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const taskbarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { windows, toggleMinimize } = useWindowContext();

  // Close start menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (taskbarRef.current && !taskbarRef.current.contains(event.target as Node)) {
        setIsStartMenuOpen(false);
      }
    }
    
    if (isStartMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStartMenuOpen]);

  return (
    <div ref={taskbarRef} className="fixed bottom-0 left-0 right-0 h-12 bg-white/70 dark:bg-black/40 backdrop-blur-md border-t border-gray-200 dark:border-white/10 flex items-center justify-between z-50 select-none">
      
      {/* Start Menu Popup */}
      <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} />

      {/* Left side (Start Button & Apps) */}
      <div className="flex items-center h-full px-2 gap-1">
        <button
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          className={`h-10 w-10 flex items-center justify-center rounded-md transition-colors ${
            isStartMenuOpen ? 'bg-black/10 dark:bg-white/20' : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <LayoutGrid size={22} className="text-blue-600 dark:text-blue-400" />
        </button>
        
        {/* Only show open apps on desktop (/) */}
        {pathname === '/' && windows.length > 0 && (
          <>
            <div className="w-px h-6 bg-gray-300 dark:bg-white/20 mx-1"></div>
            <div className="flex items-center gap-1">
              {windows.map((w) => {
                // Find app info
                const appInfo = desktopApps.find(a => a.windowId === w.id);
                if (!appInfo) return null;
                
                return (
                  <button
                    key={w.id}
                    onClick={() => toggleMinimize(w.id)}
                    className={`h-10 px-3 flex items-center gap-2 rounded-md transition-colors ${
                      w.minimized ? 'hover:bg-black/5 dark:hover:bg-white/10' : 'bg-black/10 dark:bg-white/20 border-b-2 border-blue-500'
                    }`}
                    title={appInfo.label}
                  >
                    <appInfo.icon size={16} className="text-blue-600 dark:text-blue-300" />
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
