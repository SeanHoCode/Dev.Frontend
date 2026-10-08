import { Employment } from '@/types/resume/resume';
import { initialEmployments } from '@/data/resumeData';
import { apiClient } from '@/lib/apiClient';

/**
 * 取得履歷經歷資料服務
 * 對接外部後端 API，並在 API 尚未連線時以 src/data/resumeData 作為 Mock 備援資料
 */
export async function fetchEmployments(): Promise<Employment[]> {
  try {
    // 【未來對接外部後端 API 範例】
    // return await apiClient<Employment[]>('/api/employments');

    // 模擬非同步取得資料
    return Promise.resolve(initialEmployments);
  } catch (error) {
    console.error('[resumeService] fetchEmployments 發生錯誤:', error);
    // 備援：返回靜態模擬資料
    return initialEmployments;
  }
}
