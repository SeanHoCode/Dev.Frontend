import { Employment } from '@/types/resume/resume';

/**
 * ==============================================================================
 * 【初學者筆記：履歷模擬資料 (Resume Mock Data)】
 * 
 * 1. 為什麼要抽離到獨立的資料檔？
 *    - 關注點分離 (Separation of Concerns)：畫面元件 (`ResumeView.tsx`) 只負責「如何把資料美美地印在畫面上」，
 *      而不應該在元件內部把資料寫死。
 *    - 未來若串接真正的資料庫與後端 API，畫面元件完全不用改動，只需替換掉 `services/resume/resumeService.ts`
 *      的抓取來源即可。
 * 
 * 2. 關於 Date 物件與 `endDate: null`：
 *    - `startDate: new Date('2023-07-10')`: 建立標準 JS 時間物件，方便元件進行時間排序或計算在職月數。
 *    - `endDate: null`: 代表該職務「仍在職中 (迄今)」。UI 元件在渲染時若偵測到 `endDate` 為 null 或 undefined，
 *      會顯示「迄今」或「Present」，而非空白。
 * ==============================================================================
 */

/**
 * 預設工作經歷清單 (initialEmployments)
 * 模擬後端回傳的歷史職涯記錄，同時作為履歷服務 (resumeService) 的備援資料。
 */
export const initialEmployments: Employment[] = [
  {
    id: 1,
    company: '叡揚資訊',
    role: '實習生-新進人員',
    product: '無',
    startDate: new Date('2023-07-10'),
    endDate: new Date('2023-08-30'),
    description: '學習 MVC、SQL 等基礎',
  },
  {
    id: 2,
    company: '叡揚資訊',
    role: '實習生-助理工程師',
    product: 'Radar 人資系統',
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-08-04'),
    description: '學習、了解產品並熟悉業務',
  },
  {
    id: 3,
    company: '叡揚資訊',
    role: '軟體工程師',
    product: 'Radar 人資系統',
    startDate: new Date('2024-01-13'),
    // endDate 為 null 代表目前仍在職中
    endDate: null,
    description: '維護、開發客製功能並執行更版作業(台新集團、永豐銀行、信鼎、板信銀行)，將產品佈署至客戶端(凱基銀行、凱基金控、信鼎、板信銀行)，將新版產品更新同步至客戶分支並處理衝突',
  },
];

