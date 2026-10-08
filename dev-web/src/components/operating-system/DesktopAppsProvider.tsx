"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { DesktopApp, DesktopAppsContextType } from '@/types/operating-system/desktop';
import { initialDesktopApps } from '@/data/desktopConfig';
import { fetchDesktopApps } from '@/services/operating-system/appService';

export const DesktopAppsContext = createContext<DesktopAppsContextType | undefined>(undefined);

/**
 * 桌面應用程式資料提供者元件 (Provider Component)
 * 檔名 DesktopAppsProvider.tsx 與元件名稱一致
 */
export function DesktopAppsProvider({ 
  children, 
  initialApps = initialDesktopApps 
}: { 
  children: React.ReactNode;
  initialApps?: DesktopApp[];
}) {
  const [apps, setApps] = useState<DesktopApp[]>(initialApps);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshApps = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDesktopApps();
      setApps(data);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshApps();
  }, [refreshApps]);

  const getAppById = useCallback((id: string) => {
    return apps.find((app) => app.id === id || app.windowId === id);
  }, [apps]);

  return (
    <DesktopAppsContext.Provider value={{ apps, isLoading, error, getAppById, refreshApps }}>
      {children}
    </DesktopAppsContext.Provider>
  );
}

// 重新匯出 Hook 以相容既有引用
export { useDesktopApps } from '@/hooks/useDesktopApps';
