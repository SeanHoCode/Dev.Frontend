import { DesktopApp, StartMenuItem } from '@/types/operating-system/desktop';
import { FileText, Folder, User, Settings, LayoutGrid, Moon } from 'lucide-react';

/**
 * 桌面 Apps 預設資料 (類似 startMenuItems 結構化清單)
 * 提供初始值並作為 API 尚未連線或備援時的資料來源
 */
export const initialDesktopApps: DesktopApp[] = [
  { 
    id: 'about_me', 
    title: '關於我 (About Me)', 
    label: '關於我', 
    icon: 'User', 
    component: 'AboutMeApp', 
    windowId: 'about_me',
    description: '個人簡介與專業技能' 
  },
  // 預留給未來的 Projects，動態新增即可直接生效：
  // { 
  //   id: 'projects', 
  //   title: 'Side Projects (作品集)', 
  //   label: 'Side Projects', 
  //   icon: 'Folder', 
  //   component: 'ProjectsApp', 
  //   windowId: 'projects',
  //   description: '專案作品展示' 
  // },
];

// 向後相容既有參照
export const desktopApps = initialDesktopApps;

export const startMenuItems: StartMenuItem[] = [
  { 
    id: 'home', 
    label: '首頁 (Desktop)', 
    icon: LayoutGrid, 
    href: '/' 
  },
  {
    id: 'portfolio',
    label: '作品與經歷',
    icon: User,
    children: [
      { id: 'resume', label: '關於我 & 履歷', icon: FileText, href: '/resume' },
      // { id: 'projects', label: 'Side Projects', icon: Folder, href: '/projects' },
    ]
  },
  { 
    id: 'system',
    label: '系統與帳號',
    icon: Settings,
    children: [
      { id: 'settings', label: '系統設定', icon: Settings, action: 'open_settings' },
      { id: 'theme', label: '切換深淺色模式', icon: Moon, action: 'toggle_theme' },
    ]
  }
];
