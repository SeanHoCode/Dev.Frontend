import React, { ComponentType } from 'react';
import { AboutMeApp } from '@/components/apps/AboutMeApp';

/**
 * 應用程式元件註冊表
 * 負責將 API 或設定檔中的 component 識別碼字串對應至實際的 React 元件
 */
export const APP_REGISTRY: Record<string, ComponentType<any>> = {
  AboutMeApp: AboutMeApp,
  about_me: AboutMeApp,
  // 未來的新應用程式可在此擴充：
  // ProjectsApp: ProjectsApp,
  // SettingsApp: SettingsApp,
};

/**
 * 透過元件識別碼取得對應的 React 元件
 */
export function getAppComponent(componentNameOrId?: string): ComponentType<any> | null {
  if (!componentNameOrId) return null;
  return APP_REGISTRY[componentNameOrId] || null;
}

/**
 * 提供動態註冊新元件的方法
 */
export function registerAppComponent(name: string, component: ComponentType<any>): void {
  APP_REGISTRY[name] = component;
}
