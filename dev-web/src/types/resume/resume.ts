/**
 * ==============================================================================
 * 【初學者筆記：前端資料領域模型 (Domain Model)】
 * 
 * 1. 什麼是資料模型介面？
 *    - 當前端需要處理業務資料 (如履歷、商品、會員資料) 時，通常會在 `types/` 目錄下建立介面。
 *    - 這樣做能確保「後端 API 回傳的資料結構」、「React 狀態中的資料」以及「畫面元件接收的 Props」
 *      三者都遵循完全一致的規格，避免打錯欄位名稱 (例如把 description 誤打成 desc)。
 * 
 * 2. 關於 Date 型別與 JSON 傳輸的注意事項：
 *    - 透過 HTTP API 傳輸的 JSON 本身只支援字串、數字、布林值、陣列和物件，並不支援原生 `Date` 物件。
 *    - 通常後端會以 ISO 8601 格式字串 (例如 "2023-07-10") 傳遞，前端收下後再以 `new Date(str)` 轉為 JavaScript Date 物件，
 *      方便後續比對前後時間或透過 `toLocaleDateString()` 格式化輸出。
 * ==============================================================================
 */

/**
 * 工作經歷 / 職涯紀錄 (Employment) 資料結構介面
 */
export interface Employment {
  /**
   * 經歷記錄唯一識別碼 (可選)
   * 為什麼是 `number | string`？
   * - 關聯式資料庫 (如 PostgreSQL/MySQL) 常使用數字流水號 (id: 1, 2, 3)。
   * - NoSQL 或微服務架構常使用字串識別碼 (如 UUID 或 MongoDB ObjectID "60c72b2f...")。
   * - 聯合型別 (Union Type) 能讓前端彈性適應不同後端實作。
   */
  id?: number | string;

  /** 任職公司或組織名稱 (例如: '叡揚資訊') */
  company: string;

  /** 擔任職稱或角色 (例如: '軟體工程師') */
  role: string;

  /** 負責產品名稱或專案名稱 (例如: 'Radar 人資系統') */
  product: string;

  /** 到職或開始日期 (JavaScript Date 物件) */
  startDate: Date;

  /**
   * 離職或結束日期 (可選或為 null)
   * - 若此人「仍在職中 (Present)」，則值為 null 或 undefined。
   * - 畫面渲染時即可判斷 `endDate ? formatDate(endDate) : '迄今'`。
   */
  endDate?: Date | null;

  /** 工作詳細內容、成就或專案職責說明 */
  description: string;
}