// 引入 App 資料模型規格型別
import { DesktopApp } from '@/types/operating-system/desktop';
// 引入本地 Mock 備援資料
import { initialDesktopApps } from '@/data/desktopConfig';
// 引入統一封裝的 API Client (處理 JWT Token 與 Base URL)
import { apiClient } from '@/lib/apiClient';

/**
 * 取得桌面 Apps 清單服務 (fetchDesktopApps)
 * 
 * 【初學者觀念 - 服務層 (Service Layer) 與備援機制 (Fallback)】：
 * 1. 為什麼要把 API 請求抽成 Service 函式？
 *    - 關注點分離：UI 元件只管呼叫 fetchDesktopApps() 拿到資料，不需要知道 API 網址是什麼、怎麼組裝 Header。
 *    - 易於更換後端：未來當 C# / .NET 或 Node.js 後端 API 開發完成時，只需在此處解開 apiClient 呼叫，
 *      全站所有用到此資料的桌面與工作列元件完全不必改動任何一行程式碼。
 * 2. 備援保護 (Graceful Degradation)：
 *    當網路斷線或後端掛掉時，catch 區塊會捕捉錯誤並回傳本地的 initialDesktopApps，
 *    防止整個作業系統桌面因為 API 報錯而變成空白當機畫面。
 *
 * @returns Promise<DesktopApp[]> 應用程式設定陣列
 */
export async function fetchDesktopApps(): Promise<DesktopApp[]> {
  try {
    // 【未來對接外部後端 API 時只需啟用此行】：
    // return await apiClient<DesktopApp[]>('/api/apps');

    // 目前階段：使用 Promise.resolve 模擬非同步網路請求回傳資料
    return Promise.resolve(initialDesktopApps);
  } catch (error) {
    // 在主控台記錄詳細錯誤資訊供除錯
    console.error('[appService] fetchDesktopApps 發生錯誤:', error);
    
    // 安全備援：返回靜態模擬資料，維持基本可用性
    return initialDesktopApps;
  }
}
