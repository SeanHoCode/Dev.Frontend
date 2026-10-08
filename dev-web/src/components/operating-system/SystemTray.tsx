// "use client" 指示詞：系統匣包含時鐘計時器 (每分鐘觸發重新渲染)，必須在客戶端執行
"use client";

import React from 'react';
// 引入封裝了定時器與日期時間字串格式化邏輯的 Custom Hook
import { useSystemTray } from '@/hooks/useSystemTray';

/**
 * 系統匣展示元件 (SystemTray - Presentation Component)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是工作列右下角系統狀態托盤的視覺展示模組 (System Tray View)，負責：
 * 1. 呈現系統日期與時鐘：以類 Windows 工作列經典的上下雙行版面，呈現格式化後的當前時間與日期。
 * 2. 水和不一致防禦 (Hydration Guard)：透過 `useSystemTray` 的 `isLoaded` 旗標在客戶端掛載前顯示佔位符，避免 SSR 時間與客戶端時間衝突。
 * 3. 委派計時運算：自身維持純展示 (Presentation)，將定時器計時與日期格式化完全委由 `useSystemTray` Custom Hook 處理。
 * 
 * 【初學者觀念 - 職責分離與 Hydration 防護】：
 * 1. 為什麼要把時鐘邏輯抽離到 useSystemTray Hook？
 *    若在元件內直接寫 new Date()，在 SSR 預渲染時的伺服器時間會與使用者瀏覽器當前的時間不同步，
 *    引發 React 的 Hydration Mismatch (伺服器與客戶端 HTML 不符)。
 * 2. isLoaded 防護：
 *    在 Hook 還沒於瀏覽器端執行初次掛載前，isLoaded 為 false，元件會先回傳佔位的 "..."，
 *    確保伺服器端渲染出的初始 HTML 與瀏覽器初次解析時保持一致，掛載後再由 Hook 更新為真實時間。
 */
export function SystemTray() {
  // 從 Hook 取得格式化好的時間字串 (如 "上午 11:45")、日期字串 (如 "2026/10/08") 與是否已掛載
  const { timeString, dateString, isLoaded } = useSystemTray();

  // 若尚未在客戶端完成初次載入，顯示輕量佔位符
  if (!isLoaded) {
    return (
      <div className="flex items-center gap-4 px-3 h-full hover:bg-white/10 rounded-md transition-colors text-xs text-gray-400">
        ...
      </div>
    );
  }

  // 渲染模擬 Windows 工作列右下角的時鐘區塊
  return (
    <div className="flex items-center h-full px-2 text-gray-800 dark:text-white">
      {/* 
        點擊區塊：
        - flex flex-col: 垂直排列兩行文字
        - items-end: 文字靠右對齊
        - hover:bg-black/5 dark:hover:bg-white/10: 滑鼠懸停時微亮反白效果
      */}
      <div className="flex flex-col items-end justify-center px-3 h-full hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer text-xs">
        {/* 上方：時間 (例如 11:45 AM) */}
        <span>{timeString}</span>
        {/* 下方：日期 (例如 2026/10/08) */}
        <span>{dateString}</span>
      </div>
    </div>
  );
}
