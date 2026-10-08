// "use client" 指示詞：此 Hook 處理 DOM 事件監聽 (mousedown) 與開關狀態，必須在客戶端執行
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
// 引入讀取當前路由路徑的 Hook
import { usePathname } from 'next/navigation';
// 引入視窗狀態與操作 Hook
import { useWindowContext } from '@/hooks/useWindowContext';
// 引入桌面 App 清單 Hook
import { useDesktopApps } from '@/hooks/useDesktopApps';

/**
 * 工作列邏輯處理 Hook (useTaskbar)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本 Hook 是工作列元件的行為控制大腦 (Taskbar Controller Hook)，負責：
 * 1. 開始選單互動與點擊外部收合 (Click-Outside Handler)：維護 `isStartMenuOpen` 狀態，並監聽全域點擊事件，當點擊非工作列區域時自動收合選單。
 * 2. 視窗任務狀態橋接：整合 `useWindowContext`，導出執行中視窗清單 (`windows`) 與最小化控制函式 (`toggleMinimize`)。
 * 3. 路由感知與資料反查：提供當前路徑 `pathname` 與 `getAppById` 查詢能力，支援工作列按鈕名稱與圖示渲染。
 * 
 * 【初學者觀念 - useRef 與 Click Outside 監聽模式】：
 * 1. 什麼是 useRef？
 *    - 在 React 中，除了使用 document.getElementById 外，更推薦使用 useRef 來獲取實體 DOM 節點。
 *    - 將 ref={taskbarRef} 綁定在 Taskbar 的 <div> 上，taskbarRef.current 就會指向那個真實的 HTML 元素。
 * 2. Click Outside (點擊外部自動關閉) 模式：
 *    - 當開始功能表開啟時，透過 document.addEventListener('mousedown', handleClickOutside) 監聽全螢幕的點擊。
 *    - 利用 Node.contains() API：taskbarRef.current.contains(event.target as Node)。
 *    - 若使用者點擊的目標「不在」工作列或開始功能表內部，代表使用者點了桌面的空白處或其它視窗，
 *      此時自動呼叫 setIsStartMenuOpen(false) 將選單收起。
 */
export function useTaskbar() {
  // isStartMenuOpen: 開始功能表是否彈出
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  // taskbarRef: 用於定位整個工作列 DOM 元素
  const taskbarRef = useRef<HTMLDivElement>(null);
  
  // 取得目前所在的路由 (例如 "/" 或 "/resume")
  const pathname = usePathname();
  // 取得視窗清單與最小化切換函式
  const { windows, toggleMinimize } = useWindowContext();
  // 取得反查 App 資訊的方法
  const { getAppById } = useDesktopApps();

  // 點擊工作列外部時自動收合開始功能表
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // 若點擊的不是工作列或選單內部的元素，關閉選單
      if (taskbarRef.current && !taskbarRef.current.contains(event.target as Node)) {
        setIsStartMenuOpen(false);
      }
    }
    
    // 只有在選單開啟時才註冊全域 mousedown 監聽器，避免無謂消耗效能
    if (isStartMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // 清理函式：選單關閉或元件卸載時移除監聽
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isStartMenuOpen]);

  // 切換開始功能表開關
  const toggleStartMenu = useCallback(() => {
    setIsStartMenuOpen((prev) => !prev);
  }, []);

  // 關閉開始功能表
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
