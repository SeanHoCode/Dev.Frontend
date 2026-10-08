import type { ElementType } from 'react';

/**
 * ==============================================================================
 * 【初學者筆記：TypeScript 型別定義與介面 (Interface)】
 * 
 * 1. 什麼是 interface (介面)？
 *    - 介面就像是一份「規格契約書」或「藍圖」。它規範了一個物件「必須具備哪些欄位」以及「這些欄位是什麼型別」。
 *    - 開發階段若有物件少了欄位或型別不符，TypeScript 編譯器會立刻畫紅線警告，能大幅降低前端 runtime (執行時期) 的低級錯誤。
 * 
 * 2. 什麼是 import type？
 *    - `import type { ElementType } from 'react'` 代表只將型別引入供編譯器檢查，打包編譯為原生 JavaScript 時會被完全移除，
 *      不會增加任何最終打包檔案大小 (Bundle Size)。
 * ==============================================================================
 */

/**
 * 桌面應用程式設定規格 (DesktopApp)
 * 定義一個 App 放在桌面上時需要的所有屬性。
 * 此介面同時支援「靜態寫死設定檔」以及「從後端 API 取得 JSON 格式資料」。
 */
export interface DesktopApp {
  /**
   * App 的唯一識別字串 (ID)
   * 例如: 'about_me'。在整個作業系統中不可重複，用來作為 Key、比對開啟的視窗等。
   */
  id: string;

  /**
   * 視窗頂部標題列 (Title Bar) 顯示的完整文字
   * 例如: '關於我 (About Me)'
   */
  title: string;

  /**
   * 桌面圖示下方或工作列按鈕上顯示的精簡標籤
   * 例如: '關於我'
   */
  label: string;

  /**
   * 圖示來源 (Union Type 聯合型別: string | ElementType)
   * - 為什麼支援兩種？
   *   a. string: 若從後端 API 回傳 JSON，不能傳遞 React 元件程式碼，只能傳字串 (如 'User')，前端再動態查找 Lucide 圖示。
   *   b. ElementType: 若在前端程式碼中直接宣告，可直接傳入 Lucide 元件 (如 `<User />`)。
   */
  icon: string | ElementType;

  /**
   * 對應的 React 元件註冊名稱 (Component Registry Key)
   * 例如: 'AboutMeApp'。前端會透過 appRegistry 查表，動態載入渲染該視窗內的畫面內容。
   */
  component: string;

  /**
   * 視窗 ID (可選欄位，後方帶問號 `?` 代表非必填)
   * 預設通常與 id 相同，若不填寫系統會自動以 id 代替。
   */
  windowId?: string;

  /**
   * 外部或路由連結 (可選)
   * 若提供此欄位 (如 '/resume/employment' 或 'https://...'):
   * 點擊圖示時不會開啟桌面視窗，而是直接導航或新開分頁。
   */
  href?: string;

  /**
   * 應用程式簡介或滑鼠懸停 (Tooltip) 提示說明 (可選)
   */
  description?: string;

  /**
   * 視窗開啟時的預設寬度 (像素 px) (可選)
   * 例如: 600 代表 600px
   */
  defaultWidth?: number;

  /**
   * 視窗開啟時的預設高度 (像素 px) (可選)
   * 例如: 400 代表 400px
   */
  defaultHeight?: number;

  /**
   * 是否釘選至開始功能表常用/釘選清單 (可選，若未設定則依系統預設或不釘選)
   */
  isPinned?: boolean;
}

/**
 * 桌面應用程式全域 Context 的狀態與操作函式型別 (DesktopAppsContextType)
 * 定義了 React Context 提供者 (Provider) 必須共享給子元件的資料與功能。
 */
export interface DesktopAppsContextType {
  /** 目前所有已載入的桌面應用程式清單陣列 */
  apps: DesktopApp[];

  /** 是否正在從後端 API 或非同步來源載入資料中 (供畫面顯示載入骨架或動畫) */
  isLoading: boolean;

  /** 若載入失敗儲存的錯誤物件，成功時為 null */
  error: Error | null;

  /**
   * 根據 ID 查詢特定 App 的輔助函式
   * 回傳值為 `DesktopApp | undefined`：若找不到對應 ID 則會回傳 undefined
   */
  getAppById: (id: string) => DesktopApp | undefined;

  /**
   * 重新整理/重新抓取 App 清單的非同步函式
   * `Promise<void>` 表示這是一個 async 函式，完成後不回傳特定值。
   */
  refreshApps: () => Promise<void>;
}

/**
 * 開始功能表 (Start Menu) 樹狀選單項目型別規格 (StartMenuItem)
 * 【初學者注意：遞迴型別 (Recursive Type)】
 * 一個選單項目可能包含子選單 (children)，而子選單裡的每一個項目也是 StartMenuItem，
 * 這種自己引用自己的結構稱為遞迴結構，可用來呈現無限層級的樹狀選單！
 */
export interface StartMenuItem {
  /** 項目唯一識別碼 */
  id: string;

  /** 選單顯示文字名稱 */
  label: string;

  /** 顯示圖示 (可為 Lucide 圖示名稱字串，或 React 元件) */
  icon: string | ElementType;

  /** 頁面路由路徑 (點擊後直接跳轉，如 '/resume/employment') (可選) */
  href?: string;

  /** 自訂動作指令 (例如 'open_settings'、'toggle_theme') (可選) */
  action?: string;

  /** 自訂搜尋關鍵字 (例如 ['履歷', 'resume', 'cv']) (可選) */
  keywords?: string[];

  /** 是否釘選至開始功能表的「常用/釘選清單」 (可選，預設為 false) */
  isPinned?: boolean;

  /** 子選單陣列 (遞迴結構，若有值代表此項目為可展開的父選單) (可選) */
  children?: StartMenuItem[];
}

