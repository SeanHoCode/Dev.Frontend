import { FileText, Folder, User, Settings, LayoutGrid, Moon } from 'lucide-react';

export const desktopApps = [
  { id: 'about_me', label: '關於我', icon: User, windowId: 'about_me' },
  // 預留給未來的 Projects
  // { id: 'projects', label: 'Side Projects', icon: Folder, windowId: 'projects' },
];

export const startMenuItems = [
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
