"use client";

import React from 'react';
import { useSystemTray } from '@/hooks/useSystemTray';

/**
 * 系統匣展示元件 (Presentation Component)
 * 內部時鐘狀態與計時邏輯已拆分至 useSystemTray hook
 */
export function SystemTray() {
  const { timeString, dateString, isLoaded } = useSystemTray();

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-4 px-3 h-full hover:bg-white/10 rounded-md transition-colors text-xs text-gray-400">
        ...
      </div>
    );
  }

  return (
    <div className="flex items-center h-full px-2 text-gray-800 dark:text-white">
      <div className="flex flex-col items-end justify-center px-3 h-full hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer text-xs">
        <span>{timeString}</span>
        <span>{dateString}</span>
      </div>
    </div>
  );
}
