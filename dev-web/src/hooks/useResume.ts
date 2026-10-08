// "use client" 指示詞：此 Hook 管理客戶端非同步網路請求狀態 (useState, useEffect)，屬於 SPA 核心邏輯
"use client";

import { useState, useEffect } from 'react';
// 引入經歷項目型別
import { Employment } from '@/types/resume/resume';
// 引入履歷外部 API 服務函式
import { fetchEmployments } from '@/services/resume/resumeService';

/**
 * 履歷資料非同步獲取 Hook (useResume)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本 Hook 是履歷頁面的資料獲取控制器 (Data Fetching Controller Hook)，負責：
 * 1. 驅動非同步請求：在元件掛載時向服務層 `fetchEmployments` 發起資料請求。
 * 2. 集中維護狀態機：管理並回傳 `employments` (經歷資料)、`isLoading` (載入狀態) 與 `error` (錯誤物件) 三種視圖狀態。
 * 3. 競態防禦與卸載安全 (Race Condition Guard)：利用 `isMounted` 變數確保非同步結果只在元件維持掛載時寫入狀態，防止記憶體洩漏。
 * 
 * 【初學者觀念 - 非同步資料請求與競態防護 (Race Condition Prevention)】：
 * 1. 為什麼需要 isMounted 變數？
 *    當使用者進入 /resume 頁面，API 正在背景獲取資料時，若使用者在 API 回應前就快速切換到其他頁面 (元件已卸載)，
 *    若不加防護直接呼叫 setEmployments(...)，React 會拋出警告，甚至造成非預期的記憶體洩漏。
 *    透過宣告 let isMounted = true，並在清理函式中設定 isMounted = false，
 *    能確保只有在元件「仍然掛載在畫面上」時，才去更新 React 狀態。
 * 2. try...catch...finally 結構：
 *    - try: 執行非同步請求並存入狀態。
 *    - catch: 捕捉網路錯誤並存入 error 狀態。
 *    - finally: 無論成功或失敗，必定將 isLoading 設為 false，關閉載入中動畫。
 */
export function useResume() {
  // employments: 儲存從 API 取得的經歷陣列
  const [employments, setEmployments] = useState<Employment[]>([]);
  // isLoading: 記錄是否正在向後端載入資料 (預設 true)
  const [isLoading, setIsLoading] = useState(true);
  // error: 儲存網路或 API 拋出的錯誤物件
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 追蹤當前元件是否仍然掛載
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        
        // 呼叫外部 API 服務層
        const data = await fetchEmployments();
        
        // 只有在元件未被卸載時才更新狀態
        if (isMounted) {
          setEmployments(data);
        }
      } catch (err: unknown) {
        // 型別檢查：確保錯誤能被正確轉為 Error 實體
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        // 結束載入狀態
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    // 清理函式：當使用者離開此頁面時，將 isMounted 設為 false
    return () => {
      isMounted = false;
    };
  }, []); // [] 空陣列代表初次載入執行一次

  // 回傳狀態供 UI 元件 (ResumeView.tsx) 綁定
  return {
    employments,
    isLoading,
    error,
  };
}
