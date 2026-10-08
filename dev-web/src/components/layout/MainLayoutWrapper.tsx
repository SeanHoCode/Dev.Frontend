"use client";

import { usePathname } from 'next/navigation';
import { Taskbar } from '@/components/operating-system/Taskbar';
import { WindowProvider } from '@/components/operating-system/WindowProvider';
import { DesktopAppsProvider } from '@/components/operating-system/DesktopAppsProvider';

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <DesktopAppsProvider>
      <WindowProvider>
        {pathname === '/' ? (
          // 首頁 (Desktop) 全螢幕
          children
        ) : (
          // 其他頁面：一般排版，加入 pb-12 避免內容被底部的工作列遮擋
          <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden pb-12 bg-background">
            {/* 頂部導覽列(簡易版，可視需求調整或隱藏) */}
            <div className="p-4 flex items-center border-b bg-white dark:bg-zinc-950 sticky top-0 z-10">
              <span className="font-bold text-blue-600">seanhocode</span>
            </div>
            
            {/* 頁面內容注入點 */}
            <div className="p-6 md:p-8 lg:p-12 w-full max-w-5xl mx-auto flex-grow">
              {children}
            </div>
          </main>
        )}

        {/* 全域底部工作列 (Windows Taskbar) */}
        <Taskbar />
      </WindowProvider>
    </DesktopAppsProvider>
  );
}
