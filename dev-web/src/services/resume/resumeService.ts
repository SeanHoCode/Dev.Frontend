// 引入經歷項目型別定義
import { Employment } from '@/types/resume/resume';
// 引入本地 Mock 備援資料
import { initialEmployments } from '@/data/resumeData';
// 引入統一 API Client
import { apiClient } from '@/lib/apiClient';

/**
 * 取得工作經歷資料服務 (fetchEmployments)
 * 
 * 【初學者觀念 - 外部後端串接與非同步 Promise】：
 * 1. async / await 與 Promise：
 *    網路請求需要時間等待伺服器回應，因此回傳值型別宣告為 Promise<Employment[]>。
 *    在 JavaScript 中，async 函式永遠會回傳一個 Promise。
 * 2. 獨立後端對接架構：
 *    本專案為靜態前端架構，因此不使用 Next.js 的本地 Route Handlers (route.ts)，
 *    而是直接向獨立運行的外部後端服務 (如 http://localhost:5000 或生產環境 API 域名) 發送請求。
 *
 * @returns Promise<Employment[]> 經歷資料陣列
 */
export async function fetchEmployments(): Promise<Employment[]> {
  try {
    // 【未來對接外部後端 API 時啟用此行】：
    // return await apiClient<Employment[]>('/api/employments');

    // 模擬非同步取得資料 (回傳已解決的 Promise 物件)
    return Promise.resolve(initialEmployments);
  } catch (error) {
    console.error('[resumeService] fetchEmployments 發生錯誤:', error);
    // 網路異常或服務未啟動時的靜態備援資料
    return initialEmployments;
  }
}
