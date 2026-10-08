/**
 * 統一的 API Client 工具函式 (apiClient)
 * 依據 NextJs_Architecture_Frontend.md 規範設計
 * 
 * 【初學者觀念 - 泛型函式 (Generic Functions) 與 Fetch 封裝】：
 * 1. 什麼是泛型 <T>？
 *    當你呼叫 apiClient<Employment[]>('/api/employments') 時，
 *    TypeScript 就會知道回傳值 Promise<T> 會被自動推導為 Employment[] 陣列，
 *    讓你享有自動補全與型別防呆，不用寫一堆手動轉型。
 * 2. 環境變數 process.env.NEXT_PUBLIC_*：
 *    在 Next.js 純前端專案中，只有以 "NEXT_PUBLIC_" 開頭命名的環境變數才會被編譯打包進瀏覽器端 JS 程式碼中。
 *    這讓我們能依據開發 (Development) 或生產 (Production) 環境指向不同的後端 API 伺服器網址。
 * 3. JWT 身份驗證 Header 注入：
 *    在純前端靜態匯出 (SPA) 模式下，登入成功後的 Token 通常儲存在瀏覽器的 localStorage。
 *    此函式會在每次發送 HTTP 請求時，自動在 Headers 加入 Authorization: Bearer <Token>。
 *
 * @param endpoint API 相對路徑 (例如 "/api/apps")
 * @param options 原生 fetch 的設定選項 (如 method: 'POST', body 等)
 * @returns Promise<T> 解析後的 JSON 資料
 */
export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // 取得後端 API 基礎網址 (若未設定則預設為空字串，發送相對路徑)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const url = `${baseUrl}${endpoint}`;

  // 靜態 SPA 模式下，從客戶端 localStorage 取得 JWT Token (需先檢查 window 是否存在以防 SSR 報錯)
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  // 組合預設 Header 與外部自訂 Header
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // 發送瀏覽器原生 fetch 網路請求
  const response = await fetch(url, { ...options, headers });
  
  // 檢查 HTTP 狀態碼：若不在 200-299 範圍內 (response.ok 為 false)，主動拋出例外
  if (!response.ok) {
    throw new Error(`API Error [${response.status}]: ${response.statusText}`);
  }

  // 自動解析 JSON 格式回傳
  return response.json();
}
