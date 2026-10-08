// "use client" 指示詞：工作列包含開始按鈕點擊開關、點擊外部自動收起與最小化還原等即時互動
"use client";

import React from 'react';
// 引入九宮格圖示 (做為 Windows 開始按鈕)
import { LayoutGrid } from 'lucide-react';
// 引入開始功能表元件
import { StartMenu } from './StartMenu';
// 引入系統匣元件 (右下角時鐘)
import { SystemTray } from './SystemTray';
// 引入通用圖示元件
import { AppIcon } from './AppIcon';
// 引入工作列的狀態與邏輯 Hook (Click-outside, 開關狀態等)
import { useTaskbar } from '@/hooks/useTaskbar';

/**
 * 底部工作列展示元件 (Taskbar - Presentation Component)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是類作業系統常駐螢幕底部的導航與任務調度核心 (Taskbar Shell Component)，負責：
 * 1. 開始選單觸發中樞 (Start Menu Launcher)：左側提供九宮格「開始」按鈕，控制 `<StartMenu />` 的彈出與關閉。
 * 2. 執行中視窗任務欄 (Running Window Tasks)：中央動態遍歷 `windows` 陣列，為開啟中的 App 建立工作列按鈕，點擊可快速切換最小化／還原。
 * 3. 系統狀態與時間托盤 (System Tray Host)：右側掛載 `<SystemTray />` 呈現即時系統時間與日期。
 * 4. 常駐螢幕置頂定位：使用 `fixed bottom-0` 與高圖層 `z-50` 確保在所有頁面固定常駐且不被桌面視窗遮擋。
 * 
 * 【初學者觀念 - 固定定位 (Fixed Positioning) 與工作列狀態連動】：
 * 1. 樣式解說：
 *    - fixed bottom-0 left-0 right-0: 使用 Fixed 定位死死固定在瀏覽器最下方，寬度 100%。
 *    - h-12: 高度固定為 48px (3rem)。
 *    - bg-white/70 dark:bg-black/40 backdrop-blur-md: 半透明白底/黑底與毛玻璃效果。
 *    - z-50: 確保層級高於桌面上的任何視窗，不被視窗蓋住。
 *    - select-none: 防止使用者快速點擊工作列按鈕時不小心反白選取了文字。
 * 2. 視窗縮圖按鈕與 minimized 狀態：
 *    當使用者在桌面開啟了視窗，工作列中央會自動長出對應的按鈕。
 *    點擊該按鈕時，呼叫 toggleMinimize(w.id)，實現「最小化收合」或「還原視窗至前景」。
 */
export function Taskbar() {
  // 從自訂 Hook 中取得工作列所需的所有狀態與操作方法
  const {
    isStartMenuOpen,  // 開始功能表是否處於開啟狀態
    toggleStartMenu,  // 切換開始功能表開關
    closeStartMenu,   // 強制關閉開始功能表
    taskbarRef,       // DOM 節點參考 (供 Hook 監聽點擊工作列外部時自動收合選單)
    pathname,         // 目前所在的網址路徑 (例如 "/")
    windows,          // 目前在桌面開啟中的視窗陣列
    toggleMinimize,   // 最小化/還原視窗的方法
    getAppById,       // 根據 ID 反查 App 詳細名稱與圖示的方法
  } = useTaskbar();

  return (
    // 工作列容器 (帶入 taskbarRef 供 Hook 進行 click-outside 比對)
    <div 
      ref={taskbarRef} 
      className="fixed bottom-0 left-0 right-0 h-12 bg-white/70 dark:bg-black/40 backdrop-blur-md border-t border-gray-200 dark:border-white/10 flex items-center justify-between z-50 select-none"
    >
      {/* 
        開始功能表彈出視窗 (Popup)：
        雖然寫在 JSX 內部，但因為 StartMenu 使用了 absolute 定位，
        它會以絕對位置飄浮在工作列的上方 
      */}
      <StartMenu isOpen={isStartMenuOpen} onClose={closeStartMenu} />

      {/* 工作列左側區域 (開始按鈕 + 正在運行的 App 縮圖) */}
      <div className="flex items-center h-full px-2 gap-1">
        {/* 開始按鈕 (Windows Start Button) */}
        <button
          onClick={toggleStartMenu}
          className={`h-10 w-10 flex items-center justify-center rounded-md transition-colors ${
            // 若開始功能表打開中，按鈕保持淺灰高亮狀態，否則僅在 hover 時反灰
            isStartMenuOpen ? 'bg-black/10 dark:bg-white/20' : 'hover:bg-black/5 dark:hover:bg-white/10'
          }`}
          title="開始"
        >
          <LayoutGrid size={22} className="text-blue-600 dark:text-blue-400" />
        </button>
        
        {/* 
          動態顯示開啟中的 App 縮圖：
          - 支援全站所有頁面！只要目前有開啟中的視窗 (windows.length > 0) 即可切換最小化/還原
        */}
        {windows.length > 0 && (
          <>
            {/* 垂直分隔線 */}
            <div className="w-px h-6 bg-gray-300 dark:bg-white/20 mx-1"></div>
            
            {/* 渲染正在開啟的視窗按鈕列表 */}
            <div className="flex items-center gap-1">
              {windows.map((w) => {
                // 拿視窗 ID 反查 App 的標籤與圖示
                const appInfo = getAppById(w.id);
                if (!appInfo) return null;
                
                return (
                  <button
                    key={w.id}
                    // 點擊縮圖切換最小化/還原
                    onClick={() => toggleMinimize(w.id)}
                    className={`h-10 px-3 flex items-center gap-2 rounded-md transition-colors ${
                      // 若未最小化 (前景運作中)，底部帶有藍色橫線 (border-b-2 border-blue-500)
                      w.minimized 
                        ? 'hover:bg-black/5 dark:hover:bg-white/10' 
                        : 'bg-black/10 dark:bg-white/20 border-b-2 border-blue-500'
                    }`}
                    title={appInfo.title || appInfo.label}
                  >
                    {/* App 小圖示 */}
                    <AppIcon icon={appInfo.icon} size={16} className="text-blue-600 dark:text-blue-300" />
                    {/* App 標籤文字 (max-w-[100px] truncate: 超過寬度自動截斷為 "...") */}
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

      {/* 工作列右側區域 (系統匣時鐘與小工具) */}
      <SystemTray />
    </div>
  );
}
