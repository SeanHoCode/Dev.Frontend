/**
 * 經歷任職期間格式化工具 (formatPeriod)
 * 
 * 【初學者觀念 - 純函式 (Pure Function) 與可選參數 (Optional Parameters)】：
 * 1. 什麼是純函式？
 *    給定相同的輸入 (startDate, endDate)，永遠回傳相同的字串輸出，且不依賴/不改變外部環境變數。
 *    非常適合放在 src/lib/ 作為跨元件共用的工具。
 * 2. endDate?: Date | null (可選參數與聯合型別)：
 *    問號 (?) 代表此參數可以不傳 (即 undefined)；| null 代表可傳入 null。
 *    在履歷資料中，在職中的工作 endDate 通常為 null。
 * 3. Date.prototype.toLocaleDateString()：
 *    JavaScript 內建依據語系格式化日期的強大 API。
 *    { year: 'numeric', month: 'long' } 會將日期轉換為例如 "2023年7月" 或 "2023/07"。
 * 
 * @param startDate 任職開始日期 (Date 物件)
 * @param endDate 任職結束日期 (Date 物件，若仍在職則為 null 或 undefined)
 * @returns 格式化後的文字 (例如 "2023年7月 - 2024年8月" 或 "2024年1月 - 至今")
 */
export function formatPeriod(startDate: Date, endDate?: Date | null): string {
  // 將開始日期格式化為繁體中文年月字串
  const start = startDate.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });

  // 檢查是否有結束日期：若在職中 (endDate 為 null 或 undefined)，顯示 "至今"
  const end = endDate
    ? endDate.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })
    : '至今';

  // 使用 ES6 樣板字面值 (Template Literals) 拼接字串
  return `${start} - ${end}`;
}