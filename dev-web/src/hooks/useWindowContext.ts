"use client";

import { useContext } from 'react';
import { WindowContext } from '@/components/operating-system/WindowProvider';
import type { WindowContextType } from '@/types/operating-system/window';

/**
 * 取得作業系統視窗狀態與操作的自訂 Hook (Script 邏輯抽離)
 */
export function useWindowContext(): WindowContextType {
  const context = useContext(WindowContext);
  if (context === undefined) {
    throw new Error('useWindowContext must be used within a WindowProvider');
  }
  return context;
}
