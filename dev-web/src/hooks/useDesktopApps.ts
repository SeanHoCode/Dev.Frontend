// "use client" 指示詞：此 Hook 呼叫了 useContext，必須在客戶端元件中使用
"use client";

// 引入 React 的 useContext Hook，用於跨層級讀取 Context 中的值
import { useContext } from 'react';
// 引入桌面 App 的 Context 物件
import { DesktopAppsContext } from '@/components/operating-system/DesktopAppsProvider';
// 引入 Context 的 TypeScript 型別介面
import type { DesktopAppsContextType } from '@/types/operating-system/desktop';

/**
 * 取得桌面應用程式清單與狀態的自訂 Hook (useDesktopApps)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本 Hook 是存取桌面應用程式 Context 的專用存取器 (Context Consumer Hook)，負責：
 * 1. 簡化狀態取用：封裝 `useContext(DesktopAppsContext)`，為所有子元件提供最便捷的單行調用介面。
 * 2. 型別安全導出：回傳強型別規格的 `DesktopAppsContextType` 物件 (`apps`, `isLoading`, `error`, `getAppById`, `refreshApps`)。
 * 3. 邊界防禦保護 (Defensive Guard)：在執行時期檢查 context 是否為 `undefined`，若在 Provider 之外誤用會立即拋出自訂錯誤警告，加速除錯。
 * 
 * 【初學者觀念 - 自訂 Context Hook 與防禦性檢查】：
 * 1. 為什麼不直接在元件裡寫 useContext(DesktopAppsContext)？
 *    - 封裝性：簡化子元件的引入程式碼，只需一行 const { apps } = useDesktopApps()。
 *    - 安全防護：如果開發者不小心在沒有被 <DesktopAppsProvider> 包裹的外層元件中呼叫了此 Hook，
 *      context 的值會是 undefined。此處主動 throw new Error 可以立刻警告開發者，提供清楚的除錯指引，
 *      避免後續存取 context.apps 時噴出難以理解的 "Cannot read properties of undefined"。
 *
 * @returns DesktopAppsContextType 包含 apps 清單、isLoading、error、getAppById 與 refreshApps
 */
export function useDesktopApps(): DesktopAppsContextType {
  // 從 Context 讀取值
  const context = useContext(DesktopAppsContext);
  
  // 若未在 Provider 範圍內使用，主動拋出例外提示開發者
  if (context === undefined) {
    throw new Error('useDesktopApps must be used within a DesktopAppsProvider');
  }
  
  return context;
}
