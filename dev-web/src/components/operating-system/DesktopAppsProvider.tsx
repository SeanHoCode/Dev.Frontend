// "use client" 指示詞：Context Provider 需管理 React 本地狀態並處理非同步生命週期，必須在客戶端執行
"use client";

import React, { createContext, useState, useEffect, useCallback } from 'react';
// 引入桌面 App 的相關型別
import { DesktopApp, DesktopAppsContextType } from '@/types/operating-system/desktop';
// 引入靜態預設 App 資料 (做為 API 尚未連線時的初始值與備援)
import { initialDesktopApps } from '@/data/desktopConfig';
// 引入外部 API 請求函式
import { fetchDesktopApps } from '@/services/operating-system/appService';

/**
 * 建立 React Context (狀態容器)
 * 
 * 【初學者觀念 - React Context API】：
 * 1. createContext 用於建立跨元件共享的資料通道。
 * 2. 初始值設為 undefined，當有子元件在未被 Provider 包裹的情況下誤用時，自訂 Hook 能拋出明確的錯誤訊息。
 */
export const DesktopAppsContext = createContext<DesktopAppsContextType | undefined>(undefined);

/**
 * 桌面應用程式資料提供者元件 (DesktopAppsProvider)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件核心定位 =>「取得並管理 App 相關 Data、Method 與讀取狀態，並跨層級提供給所有子元件使用」：
 * 1. 資料管理 (Data)：負責向服務層 (appService) 取得最新桌面 App 清單 (`apps`)，並以靜態設定檔 (`initialDesktopApps`) 作為初始與離線備援。
 * 2. 讀取狀態 (State)：集中維護請求過程的載入狀態 (`isLoading`) 與錯誤物件 (`error`)，供子元件呈現 Loading 骨架或錯誤畫面。
 * 3. 操作方法 (Methods)：封裝並提供查詢特定 App 的方法 (`getAppById`) 以及重新整理／重試請求的方法 (`refreshApps`)。
 * 4. 跨層級共享 (Provider)：透過 Context API 廣播給所有子元件 (如 DesktopEnvironment、Taskbar、StartMenu)，
 *    任何子元件只要呼叫 `useDesktopApps()` 即可直接取得上述資源，免去層層傳遞 Props (解決 Props Drilling 問題)。
 * 
 * 【初學者觀念 - useCallback 與 Dependency Array】：
 * 1. useState: 管理可用的 apps 清單、loading 狀態與錯誤狀態。
 * 2. useCallback: 
 *    在 React 中，元件每次重新渲染時，內部的一般函式都會被「重新建立」一次新的記憶體位址。
 *    useCallback 會將函式快取起來，只有當相依陣列 (Dependency Array) 中的變數改變時才會重建函式。
 *    這能防止把此函式傳給子元件或放在 useEffect 的相依陣列時，引發無限重複執行的死循環。
 * 3. useEffect 的生命週期：
 *    當元件首次掛載 (Mount) 時，執行 refreshApps() 向後端或服務層請求最新的 Apps 清單。
 */
export function DesktopAppsProvider({ 
  children, 
  initialApps = initialDesktopApps 
}: { 
  children: React.ReactNode;
  initialApps?: DesktopApp[];
}) {
  // apps 狀態：當前桌面擁有的應用程式清單資料 (Data)
  const [apps, setApps] = useState<DesktopApp[]>(initialApps);
  // isLoading 狀態：是否正在向 API 更新清單 (Loading State)
  const [isLoading, setIsLoading] = useState(false);
  // error 狀態：儲存非同步請求時發生的錯誤 (Error State)
  const [error, setError] = useState<Error | null>(null);

  // 重新載入 App 清單的方法 (Method) (使用 useCallback 快取)
  const refreshApps = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDesktopApps();
      setApps(data);
    } catch (err: unknown) {
      // 型別保護 (Type Narrowing)：確保 error 物件具備標準 Error 結構
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 元件掛載時觸發一次初次載入
  useEffect(() => {
    refreshApps();
  }, [refreshApps]);

  // 輔助查詢方法 (Method)：輸入視窗 ID 或 App ID，從清單中反查出該 App 的完整設定物件
  const getAppById = useCallback((id: string) => {
    return apps.find((app) => app.id === id || app.windowId === id);
  }, [apps]);

  return (
    // 透過 Provider 的 value 屬性，將資料 (apps)、讀取狀態 (isLoading, error) 與方法 (getAppById, refreshApps) 廣播給所有子元件
    // 【注意】：內部的 setIsLoading 與 setError 為私有 setter，刻意不放進 value，確保單一數據源與狀態封裝性
    <DesktopAppsContext.Provider value={{ apps, isLoading, error, getAppById, refreshApps }}>
      {children}
    </DesktopAppsContext.Provider>
  );
}

// 重新匯出 Hook 以相容既有引用
export { useDesktopApps } from '@/hooks/useDesktopApps';
