// "use client" 指示詞：此 Hook 呼叫了 useContext，必須在客戶端元件中使用
"use client";

// 引入 React 的 useContext Hook
import { useContext } from 'react';
// 引入視窗狀態的 Context 物件
import { WindowContext } from '@/components/operating-system/WindowProvider';
// 引入視窗 Context 的 TypeScript 型別介面
import type { WindowContextType } from '@/types/operating-system/window';

/**
 * 取得作業系統視窗狀態與操作的自訂 Hook (useWindowContext)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本 Hook 是存取視窗管理 Context 的專用存取器 (Window Context Consumer Hook)，負責：
 * 1. 簡化狀態取用：封裝 `useContext(WindowContext)`，讓工作列、桌面畫布等子元件一行程式碼即可取得全域視窗操控能力。
 * 2. 型別安全導出：回傳強型別規格的 `WindowContextType` 物件 (`windows`, `openWindow`, `closeWindow`, `toggleMinimize`, `closeAllWindows`)。
 * 3. 邊界防禦與除錯防呆：檢查 Context 是否為 `undefined`，若在 `WindowProvider` 外部調用時立即拋出明確錯誤提示。
 * 
 * 【初學者觀念 - 跨元件狀態操作】：
 * 任何被 <WindowProvider> 包裹的子元件 (例如 Taskbar、DesktopEnvironment)，
 * 只要呼叫此 Hook，就能直接取得：
 * - windows: 當前桌面開著的所有視窗列表
 * - openWindow(id): 打開某個視窗
 * - closeWindow(id): 關閉某個視窗
 * - toggleMinimize(id): 切換最小化
 * - closeAllWindows(): 關閉全部視窗
 * 
 * 若未在 <WindowProvider> 範圍內調用，會主動拋出例外防呆。
 *
 * @returns WindowContextType
 */
export function useWindowContext(): WindowContextType {
  const context = useContext(WindowContext);
  
  // 若未在 WindowProvider 內使用，及早報錯避免非預期的空值存取
  if (context === undefined) {
    throw new Error('useWindowContext must be used within a WindowProvider');
  }
  
  return context;
}
