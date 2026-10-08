import React from 'react';
// 引入 Lucide React 的所有可能用到的圖示元件與型別
import {
  User,
  Folder,
  FileText,
  Settings,
  LayoutGrid,
  Moon,
  Sun,
  AppWindow,
  Terminal,
  Globe,
  Code,
  Briefcase,
  Layers,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

/**
 * 圖示名稱查表字典 (ICON_MAP)
 * 
 * 【初學者觀念 - 鍵值對查表 (Dictionary Lookup)】：
 * 1. Record<string, LucideIcon> 是 TypeScript 工具型別，代表這是一個「鍵 (Key) 為字串、值 (Value) 為 Lucide 圖示元件」的物件。
 * 2. 當後端 API 回傳 JSON 資料包含 "icon": "User" 時，
 *    我們可以直接透過 ICON_MAP["User"] 取得對應的 User SVG 元件，避免寫出長串的 switch/case 或 if/else。
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  User,
  Folder,
  FileText,
  Settings,
  LayoutGrid,
  Moon,
  Sun,
  AppWindow,
  Terminal,
  Globe,
  Code,
  Briefcase,
  Layers,
  HelpCircle,
};

/**
 * 動態解析圖示函式 (resolveIcon)
 * 
 * 【初學者觀念 - 防禦性設計與兜底預設值 (Fallback)】：
 * - 情境 1: 若傳入空值 (undefined / null) -> 回傳預設應用程式圖示 AppWindow。
 * - 情境 2: 若傳入的已經是 React 元件 (typeof !== 'string') -> 直接回傳該元件。
 * - 情境 3: 若傳入的是字串 (例如 "Folder") -> 從 ICON_MAP 中查詢，若找不到則回傳 AppWindow 作為預設備援，確保畫面絕不崩潰。
 *
 * @param icon 字串圖示名稱、React 元件或未定義
 * @returns 可直接在 JSX 中渲染的 React 元件
 */
export function resolveIcon(icon: string | React.ElementType | undefined): React.ElementType {
  // 沒有傳入圖示時的預設值
  if (!icon) return AppWindow;
  
  // 如果已經是 React 元件，直接原樣回傳
  if (typeof icon !== 'string') return icon;
  
  // 從字典中查找，若字典中未定義此名稱，回傳預設的 AppWindow
  return ICON_MAP[icon] || AppWindow;
}
