import type { ElementType } from 'react';

/**
 * 桌面應用程式設定規格
 * 支援從靜態設定檔或後端 API 取得
 */
export interface DesktopApp {
  id: string;                      // 唯一識別碼 (例如: 'about_me')
  title: string;                   // 視窗標題列文字 (例如: '關於我 (About Me)')
  label: string;                   // 桌面圖示與工作列顯示標籤 (例如: '關於我')
  icon: string | ElementType;      // 圖示名稱 (字串如 'User'，支援 API 傳遞) 或 React 元件
  component: string;               // 對應註冊之元件識別碼 (例如: 'AboutMeApp')
  windowId?: string;               // 視窗 ID (預設為同 id)
  href?: string;                   // 外部或路由連結 (可選，點擊直接跳轉)
  description?: string;            // 描述資訊 (可選)
  defaultWidth?: number;           // 預設寬度 (可選)
  defaultHeight?: number;          // 預設高度 (可選)
}

/**
 * 桌面應用程式 Context 狀態與操作型別
 */
export interface DesktopAppsContextType {
  apps: DesktopApp[];
  isLoading: boolean;
  error: Error | null;
  getAppById: (id: string) => DesktopApp | undefined;
  refreshApps: () => Promise<void>;
}

/**
 * 開始功能表樹狀選單項目型別規格
 */
export interface StartMenuItem {
  id: string;
  label: string;
  icon: string | ElementType;
  href?: string;
  action?: string;
  children?: StartMenuItem[];
}
