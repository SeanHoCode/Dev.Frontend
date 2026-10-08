import React, { ComponentType } from 'react';
// 引入具體的 App 元件
import { AboutMeApp } from '@/components/operating-system/apps/AboutMeApp';

/**
 * 應用程式元件註冊表 (APP_REGISTRY)
 * 
 * 【初學者觀念 - 註冊表模式 (Registry Pattern) 與資料驅動】：
 * 1. 為什麼需要註冊表？
 *    當後端 API 回傳 JSON 資料時，裡面只能傳遞字串 (例如: { "component": "AboutMeApp" })，
 *    瀏覽器無法直接將字串轉為可執行的 React JSX 元件。
 * 2. 註冊表就像一張「名稱對照表」：
 *    前端預先將合法的元件登记在 APP_REGISTRY 中，當桌面收到開啟指令時，
 *    拿字串向註冊表索取對應的 React 元件實體進行渲染，達成完全動態且解耦的視窗載入。
 */
export const APP_REGISTRY: Record<string, ComponentType<Record<string, unknown>>> = {
  AboutMeApp: AboutMeApp as ComponentType<Record<string, unknown>>,
  about_me: AboutMeApp as ComponentType<Record<string, unknown>>, // 支援以小寫 id 查詢
  // 未來的新應用程式開發完成後在此擴充登记：
  // ProjectsApp: ProjectsApp,
  // SettingsApp: SettingsApp,
};

/**
 * 依據元件名稱或 App ID 獲取對應的 React 元件
 *
 * @param componentNameOrId 元件識別名稱或 App ID (例如 "AboutMeApp" 或 "about_me")
 * @returns React 元件，若未找到則回傳 null
 */
export function getAppComponent(componentNameOrId?: string): ComponentType<Record<string, unknown>> | null {
  if (!componentNameOrId) return null;
  return APP_REGISTRY[componentNameOrId] || null;
}

/**
 * 提供執行時期動態註冊新元件的方法 (擴活用)
 *
 * @param name 註冊的名稱代碼
 * @param component 要掛載的 React 元件
 */
export function registerAppComponent(name: string, component: ComponentType<Record<string, unknown>>): void {
  APP_REGISTRY[name] = component;
}
