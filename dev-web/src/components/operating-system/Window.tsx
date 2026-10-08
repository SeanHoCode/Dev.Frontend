// "use client" 指示詞：視窗元件包含滑鼠拖曳、雙擊最大化、縮小與關閉按鈕，屬於客戶端互動元件
"use client";

import React from 'react';
// 引入視窗控制按鈕圖示：關閉 (X)、最小化 (Minus)、最大化/還原 (Square)
import { X, Minus, Square } from 'lucide-react';
// 引入封裝了滑鼠拖曳、視窗置中計算、最大化狀態的 Custom Hook
import { useWindow } from '@/hooks/useWindow';

/**
 * Window 元件的 Props 介面定義
 */
export interface WindowProps {
  title: string;                 // 視窗標題列文字 (例如 "關於我 (About Me)")
  isOpen: boolean;               // 視窗目前是否開啟
  isMinimized?: boolean;         // 視窗是否處於最小化隱藏狀態 (選填，預設 false)
  onMinimize?: () => void;       // 點擊最小化按鈕時的回呼函式 (選填)
  onClose: () => void;           // 點擊關閉按鈕時的回呼函式
  children: React.ReactNode;     // 視窗內容插槽 (傳入具體的 App 元件，如 <AboutMeApp />)
}

/**
 * 視窗純展示元件 (Window - Presentation Component)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是桌面環境的視窗外殼容器 (Window Shell Component)，負責：
 * 1. 擬真視窗外觀呈現：建立具備標題列、外框陰影、毛玻璃質感與右上角三鍵控制項 (最小化、最大化、關閉) 的擬真視窗。
 * 2. 應用內容插槽承載 (Slot Host)：透過 `children` 容納具體 App 畫面 (如 `AboutMeApp`)，並配置 `overflow-y-auto` 支援內部獨立捲動。
 * 3. 委派動態座標運算：透過 `useWindow` Hook 取得即時動態定位樣式 (`windowStyle`) 與滑鼠拖曳監聽 (`handleMouseDown`)。
 * 4. 狀態聯動響應：依據 `isMinimized` 屬性即時切換 `hidden` 隱藏或還原顯示，並將關閉行為轉發給 `onClose`。
 * 
 * 【初學者觀念 - 職責分離 (Presentation / Hook 分離)】：
 * 1. 過去在一個檔案寫完整個視窗時，往往需要 130 行以上 (包含座標計算、滑鼠移動監聽、視窗邊界限制等)。
 * 2. 透過 useWindow Hook，將所有計算與監聽邏輯全部移至 hooks/useWindow.ts。
 * 3. Window.tsx 成為純粹的「視覺外殼」：
 *    - 標題列 (Top Bar)：負責顯示標題、接收 handleMouseDown 拖曳事件、提供視窗按鈕。
 *    - 內容區 (Content Area)：具備 overflow-y-auto，當 App 內容超出視窗高度時自動出現垂直捲軸。
 */
export function Window({ 
  title, 
  isOpen, 
  isMinimized = false, 
  onMinimize, 
  onClose, 
  children 
}: WindowProps) {
  // 從 Hook 取得計算後的樣式 (定位 top/left/width/height)、最大化狀態、與滑鼠點擊拖曳監聽事件
  const { isMaximized, toggleMaximize, windowStyle, handleMouseDown } = useWindow({ isOpen });

  // 若視窗未開啟，直接回傳 null (不佔據任何 DOM 節點)
  if (!isOpen) return null;

  return (
    // 視窗外框容器：
    // - absolute z-30: 絕對定位，圖層高度 30
    // - style={windowStyle}: 動態套用 Hook 計算出的座標 (x, y) 或最大化 100% 寬高
    // - rounded-lg: 未最大化時有圓角，最大化時填滿直角
    // - isMinimized ? 'hidden' : '': 最小化時套用 CSS display: none 隱藏，但保留在 DOM 中維持內部狀態
    <div 
      className={`absolute z-30 flex flex-col bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 pointer-events-auto ${
        isMaximized ? '' : 'rounded-lg'
      } ${isMinimized ? 'hidden' : ''}`}
      style={windowStyle}
    >
      {/* 
        視窗標題列 (Top Bar)：
        - h-10: 高度 40px
        - select-none: 防止拖曳視窗時選取到標題文字
        - onMouseDown={handleMouseDown}: 按下滑鼠左鍵時觸發拖曳追蹤
        - onDoubleClick={toggleMaximize}: 雙擊標題列自動切換「最大化 / 還原」
        - cursor-move: 滑鼠游標顯示為十字移動游標 (最大化時改為預設游標)
      */}
      <div 
        className={`h-10 bg-gray-100 dark:bg-zinc-800 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 select-none ${
          isMaximized ? '' : 'cursor-move'
        }`}
        onMouseDown={handleMouseDown}
        onDoubleClick={toggleMaximize}
      >
        {/* 視窗名稱 */}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
        
        {/* 右上角視窗控制按鈕組 (最小化、最大化/還原、關閉) */}
        <div className="flex items-center gap-2">
          {/* 最小化按鈕 */}
          {onMinimize && (
            <button 
              onClick={onMinimize}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 transition-colors"
              title="最小化"
            >
              <Minus size={14} />
            </button>
          )}

          {/* 放大/還原按鈕 */}
          <button 
            onClick={toggleMaximize}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 transition-colors"
            title={isMaximized ? "還原" : "最大化"}
          >
            <Square size={12} />
          </button>

          {/* 關閉按鈕 (Hover 時呈現醒目的紅底白字) */}
          <button 
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500 hover:text-white text-gray-500 transition-colors"
            title="關閉"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 
        視窗主要內容區塊：
        - flex-1: 佔滿標題列下方的所有可用空間
        - overflow-y-auto: 內容高度超出視窗時自動出現滾動條
        - p-6: 內距 24px
      */}
      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-zinc-900">
        {children}
      </div>
    </div>
  );
}
