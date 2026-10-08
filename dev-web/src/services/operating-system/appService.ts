import { DesktopApp } from '@/types/operating-system/desktop';
import { initialDesktopApps } from '@/data/desktopConfig';
import { apiClient } from '@/lib/apiClient';

/**
 * 取得桌面 Apps 清單服務
 * 對接外部後端 API，並在 API 尚未連線時以 src/data/desktopConfig 作為 Mock 備援資料
 */
export async function fetchDesktopApps(): Promise<DesktopApp[]> {
  try {
    // 【未來對接外部後端 API 範例】
    // return await apiClient<DesktopApp[]>('/api/apps');

    // 模擬非同步取得資料
    return Promise.resolve(initialDesktopApps);
  } catch (error) {
    console.error('[appService] fetchDesktopApps 發生錯誤:', error);
    // 備援：返回靜態模擬資料，確保桌面環境不崩潰
    return initialDesktopApps;
  }
}
