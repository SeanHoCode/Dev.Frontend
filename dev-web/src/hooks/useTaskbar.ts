"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useWindowContext } from '@/hooks/useWindowContext';
import { useDesktopApps } from '@/hooks/useDesktopApps';

/**
 * 處理工作列開啟狀態、點擊外部關閉、最小化視窗等操作邏輯 (Script 邏輯抽離)
 */
export function useTaskbar() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const taskbarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { windows, toggleMinimize } = useWindowContext();
  const { getAppById } = useDesktopApps();

  // 點擊工作列與開始功能表外部時自動關閉
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

  const toggleStartMenu = useCallback(() => {
    setIsStartMenuOpen((prev) => !prev);
  }, []);

  const closeStartMenu = useCallback(() => {
    setIsStartMenuOpen(false);
  }, []);

  return {
    isStartMenuOpen,
    toggleStartMenu,
    closeStartMenu,
    taskbarRef,
    pathname,
    windows,
    toggleMinimize,
    getAppById,
  };
}
