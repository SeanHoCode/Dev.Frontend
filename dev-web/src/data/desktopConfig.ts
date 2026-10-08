import { DesktopApp, StartMenuItem } from '@/types/operating-system/desktop';
import { FileText, User, Settings, LayoutGrid, Moon } from 'lucide-react';

/**
 * ==============================================================================
 * 【初學者筆記：前端資料層 (Data Layer) 與資料驅動 UI (Data-Driven UI)】
 * 
 * 1. 什麼是 src/data/ 目錄？
 *    - 依據專案架構規範，`src/data/` 專門存放「模擬 API 回傳結果的假資料 (Mock Data)」或「初始靜態設定檔」。
 *    - 在前後端分離開發時，若後端 API 還沒寫好，前端可以先依據型別介面 (Types) 定義好這份假資料。
 *    - 當 API 連線失敗或離線運行時，`services/` 也會自動拿這份資料當做「備援 (Fallback)」，確保畫面能正常展示而不當機。
 * 
 * 2. 什麼是「資料驅動 UI」(Data-Driven UI)？
 *    - 傳統寫法：想在桌面上多放一個圖示，初學者可能會去 HTML/JSX 複製貼上一個 `<button>`。
 *    - 現代 React 做法：UI 是由資料驅動的。若要增加一個新功能，只需在底下的陣列新增一筆物件！
 *      桌面元件會自動讀取陣列並用 `.map()` 渲染出對應的圖示與行為，這讓系統具備極高的擴充性。
 * ==============================================================================
 */

/**
 * 桌面應用程式預設資料清單 (initialDesktopApps)
 * 提供作業系統開機時的初始應用程式，並作為 API 離線時的備援資料。
 */
export const initialDesktopApps: DesktopApp[] = [
  { 
    id: 'about_me', 
    title: '關於我 (About Me)', 
    label: '關於我', 
    icon: 'User',                 // 儲存 Lucide 圖示名稱字串，易於後端 API 序列化 JSON 傳遞
    component: 'AboutMeApp',      // 對應 appRegistry 內註冊的元件名稱
    windowId: 'about_me',
    description: '個人簡介與專業技能',
    isPinned: true                // 釘選至開始功能表常用/釘選清單
  },
  // 【擴充範例】：未來若有新的 Side Projects 想要放到桌面上，解開下方註解即可：
  // { 
  //   id: 'projects', 
  //   title: 'Side Projects (作品集)', 
  //   label: 'Side Projects', 
  //   icon: 'Folder', 
  //   component: 'ProjectsApp', 
  //   windowId: 'projects',
  //   description: '專案作品展示',
  //   isPinned: true
  // },
];

/**
 * 向後相容別名 (Alias Export)
 * 若有舊程式碼引用了 `desktopApps`，可直接導向 `initialDesktopApps`，避免破壞性變更 (Breaking Change)。
 */
export const desktopApps = initialDesktopApps;

/**
 * 開始功能表 (Start Menu) 樹狀選單資料清單 (startMenuItems)
 * 示範了「樹狀結構 (Tree Structure)」的資料組織方式：
 * - 單純項目：只有 id, label, icon, href (點擊後直接跳轉網頁)
 * - 分組/父選單：帶有 `children` 陣列，內部包含子選單項目 (MenuItem 會遞迴渲染)
 * - 系統功能項目：帶有 `action` (例如觸發設定彈窗或深淺色主題切換)
 */
export const startMenuItems: StartMenuItem[] = [
  { 
    id: 'home', 
    label: '首頁', 
    icon: LayoutGrid, 
    href: '/',
	isPinned: true,
    keywords: ['首頁', 'home', 'desktop', '桌面', '主頁']
  },
  {
    id: 'resume',
    label: '履歷',
    icon: User,
    keywords: ['履歷', 'resume'],
    // children 陣列代表子選單，滑鼠懸停或點擊展開時顯示
    children: [
      { 
        id: 'employment', 
        label: '經歷', 
        icon: FileText, 
        href: '/resume/employment',
        isPinned: true,           // 釘選至開始功能表常用清單 (支援頁面捷徑)
        keywords: ['經歷', '技能', '工作經驗', 'employment', 'experience', 'skill']
      },
      // { id: 'projects', label: 'Side Projects', icon: Folder, href: '/projects' },
    ]
  },
  { 
    id: 'system',
    label: '系統與帳號',
    icon: Settings,
    keywords: ['系統', '帳號', 'system', 'account', '設定'],
    children: [
      // action 表示點擊後不是跳轉網址，而是執行某個作業系統指令
      { 
        id: 'settings', 
        label: '系統設定', 
        icon: Settings, 
        action: 'open_settings',
        keywords: ['系統設定', '設定', 'settings', 'config', '偏好設定'] 
      },
      { 
        id: 'theme', 
        label: '切換深淺色模式', 
        icon: Moon, 
        action: 'toggle_theme',
        keywords: ['主題', '深色', '淺色', '深色模式', '淺色模式', 'theme', 'dark', 'light', '夜間模式']
      },
    ]
  }
];

