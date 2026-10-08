import React from 'react';
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
 * 圖示名稱對應表，供 API 傳入字串識別碼時動態解析
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
 * 解析圖示：支援字串圖示名稱或直接傳入的 React 元件
 */
export function resolveIcon(icon: string | React.ElementType | undefined): React.ElementType {
  if (!icon) return AppWindow;
  if (typeof icon !== 'string') return icon;
  return ICON_MAP[icon] || AppWindow;
}
