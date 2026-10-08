/**
 * 【初學者觀念 - cn (ClassNames) 工具函式】：
 * 1. 在使用 Tailwind CSS 時，我們常需要動態組合 class 名稱，
 *    例如：cn('p-4', isExpanded ? 'bg-blue-500' : 'bg-gray-200')。
 * 2. 這裡匯出的 cn 函式內部結合了 clsx (條件式類別組合) 與 tailwind-merge (衝突樣式合併覆蓋)，
 *    能防止例如 "px-2 px-4" 同時存在時產生的 CSS 特異性衝突問題。
 */
export { cn } from "cn"
