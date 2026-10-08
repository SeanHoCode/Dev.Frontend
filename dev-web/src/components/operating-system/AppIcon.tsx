import React from 'react';
// 引入 Lucide 圖示的原生 Props 型別 (包含 size, color, className 等屬性)
import type { LucideProps } from 'lucide-react';
// 引入圖示解析函式 (支援傳入字串如 'User' 或直接傳入 React 元件)
import { resolveIcon } from '@/lib/icons';

/**
 * AppIcon 元件的 Props 介面定義
 * 
 * 【初學者觀念 - 型別繼承 (Interface Extends)】：
 * - extends LucideProps：代表 AppIcon 除了自己定義的 icon 屬性外，
 *   還能直接使用 Lucide 圖示支援的所有屬性 (例如 size={24}, className="text-blue-500")。
 * - icon: string | React.ElementType：聯合型別 (Union Type)，
 *   代表圖示可以是純文字字串 (例如來自後端 JSON API 的 "User")，也可以是前端直接傳入的 React 元件。
 */
export interface AppIconProps extends LucideProps {
  icon: string | React.ElementType;
}

/**
 * 通用 App 圖示元件 (AppIcon)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是桌面環境的通用圖示渲染適配器 (Icon Adapter Component)，負責：
 * 1. 跨格式圖示解析 (Icon Resolution)：同時相容「後端 API 回傳之圖示名稱字串 (如 'User')」與「前端程式碼直接傳入之 React 元件」，透過 `resolveIcon` 統一解析。
 * 2. 樣式繼承與屬性透傳 (Props Forwarding)：繼承 `LucideProps`，將大小 (`size`)、自訂顏色與 Tailwind 類別透明傳遞至底層 SVG 圖示。
 * 3. 異常防禦 (Fallback Protection)：若遭遇不存在的圖示名稱，底層會自動降級渲染預設圖示，確保桌面或選單不破版。
 * 
 * 【初學者觀念 - 動態元件解析與 JSX】：
 * 1. 為什麼不能直接 <icon />？
 *    因為後端 API 回傳的資料是 JSON 字串 (如 "User")，JSX 無法直接渲染字串為 SVG 圖示。
 * 2. 透過 resolveIcon(icon) 將字串反查出對應的 Lucide SVG 元件，指派給大寫變數 Component。
 * 3. 在 JSX 中，只有「首字母大寫」的標籤才會被 React 視為自訂元件解析 (<Component ... />)。
 * 4. 物件其餘屬性展開運算子 (...props)：將剩餘的 size, className 等屬性自動透傳給圖示元件。
 */
export function AppIcon({ icon, ...props }: AppIconProps) {
  // 將字串或元件解析成可直接執行的 React 元件
  const Component = resolveIcon(icon);
  
  // 動態渲染圖示並帶入所有外部屬性
  return <Component {...props} />;
}
