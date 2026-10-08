/**
 * ==============================================================================
 * 【初學者筆記：視窗狀態管理型別 (Window State Types)】
 * 
 * 1. 為什麼需要定義 WindowData？
 *    - 在類桌面作業系統 (Web OS) 的架構中，「哪些視窗被打開了」以及「視窗是否被最小化」是全域共用的核心狀態。
 *    - 透過陣列 `WindowData[]` 來紀錄所有開啟中的視窗，方便工作列 (Taskbar) 和桌面環境 (DesktopEnvironment)
 *      同時進行同步與渲染。
 * 
 * 2. type 與 interface 的差別？
 *    - `interface` (介面)：通常用於定義物件的結構契約，易於擴充 (extends)，多用於 Context、Props 或物件模型。
 *    - `type` (型別別名 Type Alias)：用途更廣泛，可用於物件、聯合型別 (Union 如 `A | B`)、元組 (Tuple) 等。
 * ==============================================================================
 */

/**
 * 單一開啟中視窗的資料狀態
 */
export type WindowData = {
  /** 視窗唯一識別碼 (對應 App 的 id，例如 'about_me') */
  id: string;

  /** 是否處於最小化狀態 (true: 隱藏在桌面上但仍存在於工作列；false: 正常顯示) */
  minimized: boolean;
};

/**
 * 視窗全域 Context 的狀態與控制器函式型別 (WindowContextType)
 * 任何元件只要透過 `useWindowContext()` 就能取得這些資料與操作方法。
 */
export interface WindowContextType {
  /** 目前開啟的所有視窗清單 */
  windows: WindowData[];

  /**
   * 開啟指定 ID 的視窗
   * 若視窗尚未開啟則新增至清單；若已開啟且最小化則自動還原顯示
   */
  openWindow: (id: string) => void;

  /**
   * 關閉指定 ID 的視窗
   * 將該視窗自清單中完全移除，釋放資源
   */
  closeWindow: (id: string) => void;

  /**
   * 切換指定 ID 視窗的最小化狀態
   * 若原本為正常顯示則縮小，若原本最小化則還原至前景
   */
  toggleMinimize: (id: string) => void;

  /**
   * 關閉所有開啟中的視窗
   * 清空 windows 陣列 (例如「顯示桌面」或重置系統時使用)
   */
  closeAllWindows: () => void;
}

