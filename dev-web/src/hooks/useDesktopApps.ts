"use client";

import { useContext } from 'react';
import { DesktopAppsContext } from '@/components/operating-system/DesktopAppsProvider';
import type { DesktopAppsContextType } from '@/types/operating-system/desktop';

/**
 * 取得桌面應用程式清單與狀態的自訂 Hook (Script 邏輯抽離)
 */
export function useDesktopApps(): DesktopAppsContextType {
  const context = useContext(DesktopAppsContext);
  if (context === undefined) {
    throw new Error('useDesktopApps must be used within a DesktopAppsProvider');
  }
  return context;
}
