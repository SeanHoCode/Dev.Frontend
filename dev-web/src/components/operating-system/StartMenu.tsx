// "use client" 指示詞：開始功能表屬於浮動快顯視窗 (Popup)，依賴客戶端開關狀態 (isOpen) 進行條件渲染
"use client";

import React from 'react';
// 引入靜態預設的開始功能表樹狀資料清單
import { startMenuItems } from '@/data/desktopConfig';
// 引入使用者圖示與向右箭頭圖示
import { User, ChevronRight } from 'lucide-react';
// 引入單一選單項目元件
import { MenuItem } from './MenuItem';

/**
 * StartMenu 元件的 Props 介面定義
 */
export interface StartMenuProps {
  isOpen: boolean;       // 開始功能表目前是否開啟
  onClose: () => void;   // 關閉開始功能表的回呼函式
}

/**
 * 開始功能表元件 (StartMenu - Presentation Component)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是類作業系統的浮動開始功能表視圖 (Start Menu Popup Component)，負責：
 * 1. 條件彈窗渲染 (Conditional Popup)：受 `isOpen` 屬性控制，未開啟時直接回傳 `null` 卸載 DOM 節點，開啟時觸發滑入淡入動畫。
 * 2. 樹狀選單迭代整合：讀取 `startMenuItems` 樹狀資料，透過 `<MenuItem />` 迴圈展開各層功能選項。
 * 3. 系統身分資訊與快速捷徑：在選單底部固定呈現個人頭像、姓名、職稱與常用捷徑 (如履歷直達鈕)。
 * 4. 頂層視覺層疊 (Visual Elevation)：利用 `backdrop-blur-xl` 毛玻璃特效與 `z-50` 最高圖層保證不被底層桌面視窗遮蔽。
 * 
 * 【初學者觀念 - 絕對定位 (Absolute Positioning) 與毛玻璃效果 (Backdrop Blur)】：
 * 1. 條件中斷渲染：
 *    if (!isOpen) return null; -> 當選單未開啟時，直接回傳 null，React 不會在 DOM 樹中產生任何 HTML 元素，節省記憶體與效能。
 * 2. Tailwind 排版亮點：
 *    - absolute bottom-14 left-2: 絕對定位釘在螢幕左下角 (位於 48px 工作列的上方 56px 處)。
 *    - w-80: 寬度固定 320px。
 *    - bg-white/80 backdrop-blur-xl: 80% 半透明白色背景加上強效背景模糊 (Backdrop Blur)，創造 Windows 11 的 Fluent Design 質感。
 *    - z-50: 將圖層提升至最上層，確保彈出選單不會被其他視窗遮擋。
 *    - animate-in slide-in-from-bottom-2 fade-in: Tailwind Animate 進場動畫 (由下往上滑入並淡入)。
 */
export function StartMenu({ isOpen, onClose }: StartMenuProps) {
  // 若未開啟，直接結束不渲染
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-14 left-2 w-80 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
      
      {/* 
        樹狀功能清單可滾動區域：
        - flex-1: 佔據垂直彈性空間
        - max-h-[60vh]: 最大高度不超過瀏覽器高度的 60%
        - overflow-y-auto: 內容過長時自動產生垂直滾動條
      */}
      <div className="p-4 flex-1 max-h-[60vh] overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 px-2 uppercase tracking-wider">
          功能選單
        </h3>
        
        {/* 遍歷根目錄的所有選單項目 */}
        <div className="flex flex-col gap-1 w-full">
          {startMenuItems.map((item) => (
            <MenuItem key={item.id} item={item} onClose={onClose} />
          ))}
        </div>
      </div>

      {/* 
        底部使用者狀態區塊 (固定在彈出視窗的最下方)：
        模擬 Windows 11 開始功能表底部的使用者頭像與帳號設定
      */}
      <div className="bg-white/40 dark:bg-zinc-800/50 p-4 flex items-center justify-between border-t border-white/20 dark:border-white/10 cursor-pointer hover:bg-white/60 dark:hover:bg-zinc-800 transition-colors">
        <div className="flex items-center gap-3">
          {/* 圓形頭像 */}
          <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 shadow-sm border border-white dark:border-zinc-700">
            <User size={18} />
          </div>
          {/* 使用者名稱與狀態提示 */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Guest</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">點擊登入 (未來擴充)</span>
          </div>
        </div>
        {/* 箭頭圖示 */}
        <ChevronRight size={16} className="text-gray-400" />
      </div>
    </div>
  );
}
