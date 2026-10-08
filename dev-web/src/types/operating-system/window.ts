/**
 * 視窗資料與作業系統視窗狀態型別定義
 */
export type WindowData = {
  id: string;          // 視窗唯一識別碼 (對應 App ID)
  minimized: boolean;  // 是否處於最小化狀態
};

export interface WindowContextType {
  windows: WindowData[];
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  closeAllWindows: () => void;
}
