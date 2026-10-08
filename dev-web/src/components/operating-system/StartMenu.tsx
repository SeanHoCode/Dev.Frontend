// "use client" 指示詞：開始功能表屬於浮動快顯視窗 (Popup)，依賴客戶端開關狀態 (isOpen) 進行條件渲染
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { User, ChevronRight, X, Search, Sparkles } from 'lucide-react';

// 引入全域桌面 App 與視窗操作 Hook
import { useDesktopApps } from '@/hooks/useDesktopApps';
import { useWindowContext } from '@/hooks/useWindowContext';

// 引入靜態預設的開始功能表樹狀資料清單
import { startMenuItems } from '@/data/desktopConfig';
import { StartMenuItem } from '@/types/operating-system/desktop';

// 引入 shadcn / cmdk Command 相關元件
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { InputGroupAddon } from '@/components/ui/input-group';
import { Badge } from '@/components/ui/badge';

// 引入個別子元件
import { MenuItem } from './MenuItem';
import { AppIcon } from './AppIcon';

/**
 * StartMenu 元件的 Props 介面定義
 */
export interface StartMenuProps {
  isOpen: boolean;       // 開始功能表目前是否開啟
  onClose: () => void;   // 關閉開始功能表的回呼函式
}

/**
 * 扁平化搜尋項目規格 (內部使用)
 */
interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string | React.ElementType;
  category: 'apps' | 'pages' | 'actions';
  categoryLabel: string;
  badge: string;
  keywords: string[];
  onSelect: () => void;
}

/**
 * 常用與釘選項目規格 (內部使用，支援 App 與 Page 頁面)
 */
interface PinnedItem {
  id: string;
  label: string;
  icon: string | React.ElementType;
  type: 'app' | 'page' | 'action';
  typeLabel: string;
  onClick: () => void;
}

/**
 * 開始功能表元件 (StartMenu - Presentation Component with shadcn Command Search)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是類作業系統的浮動開始功能表視圖 (Start Menu Component)，負責：
 * 1. 條件快顯渲染 (Conditional Popup)：受 `isOpen` 控制，未開啟時回傳 `null`，開啟時帶有滑入淡入動畫。
 * 2. 整合 shadcn Command 智慧搜尋：
 *    - 頂部常駐搜尋輸入列 (`CommandInput`)，支援輸入關鍵字即時比對。
 *    - 搜尋時自動切換至 `CommandList` 視圖，支援鍵盤上下鍵 (↑ / ↓) 導航與 Enter 鍵直接啟動。
 *    - 智慧比對應用程式 (Apps)、頁面捷徑 (Pages)、系統功能 (Settings)，並提供分類分組與標籤。
 * 3. 雙軌呈現模式 (Dual-Mode Presentation)：
 *    - 未搜尋時 (預設)：呈現「常用應用程式 (Quick Apps)」與「可階層折疊功能選單 (Tree Menu)」。
 *    - 搜尋時：呈現 Command Palette 搜尋結果與 `CommandEmpty` 空狀態。
 * 4. 底部系統身分狀態：固定呈現 Guest 頭像、身分與設定快捷鍵。
 * 
 * 【初學者觀念 - Command Palette 與 cmdk 原理】：
 * - shadcn 的 Command 元件底層由 cmdk 驅動，具備無障礙 (Accessibility, WAI-ARIA) 與極速模糊比對引擎。
 * - 透過 `value` 與 `keywords` 屬性，使用者輸入中文 (如「履歷」、「設定」) 或英文 (如「resume」、「theme」)
 *   皆能精準比對出項目，大幅提升作業系統的使用者體驗。
 */
export function StartMenu({ isOpen, onClose }: StartMenuProps) {
  // 搜尋字串狀態
  const [search, setSearch] = useState('');
  
  // Next.js 路由與路徑感知
  const router = useRouter();
  const pathname = usePathname();
  
  // 全站深淺色主題切換
  const { theme, setTheme } = useTheme();
  
  // 取得已註冊之桌面應用程式與視窗操控函式
  const { apps } = useDesktopApps();
  const { openWindow } = useWindowContext();

  // 當選單關閉時，清空搜尋文字，維持下次開啟時的乾淨狀態
  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  // 開啟應用程式的方法 (支援全域所有頁面直接開啟視窗)
  const handleOpenApp = useCallback(
    (appId: string, href?: string) => {
      if (href) {
        router.push(href);
      } else {
        openWindow(appId);
      }
      onClose();
    },
    [router, openWindow, onClose]
  );

  // 執行系統指令 (Action)
  const handleAction = useCallback(
    (action?: string) => {
      if (action === 'toggle_theme') {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      } else if (action === 'open_settings') {
        alert('系統設定介面即將推出！\n這是一個透過 Action 呼叫的範例。');
      }
      onClose();
    },
    [theme, setTheme, onClose]
  );

  // 頁面跳轉
  const handleNavigate = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose]
  );

  // 鍵盤 Escape 鍵處理：有搜尋文字時先清除文字，無搜尋文字時關閉選單
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (search) {
          setSearch('');
          e.stopPropagation();
        } else {
          onClose();
        }
      }
    },
    [search, onClose]
  );

  // 構建可搜尋的桌面應用程式清單
  const searchableApps = useMemo(() => {
    return apps.map((app) => ({
      id: `app-${app.id}`,
      title: app.title || app.label,
      subtitle: app.description || '桌面應用程式',
      icon: app.icon,
      category: 'apps' as const,
      categoryLabel: '應用程式',
      badge: 'App',
      keywords: [
        app.label,
        app.title,
        app.description || '',
        'app',
        '應用程式',
        '視窗',
      ],
      onSelect: () => handleOpenApp(app.windowId || app.id, app.href),
    }));
  }, [apps, handleOpenApp]);

  // 遞迴扁平化 startMenuItems，構建頁面捷徑與系統功能之可搜尋清單
  const { pageItems, actionItems } = useMemo(() => {
    const pages: SearchItem[] = [];
    const actions: SearchItem[] = [];

    const traverse = (items: StartMenuItem[], parentTitle?: string) => {
      for (const item of items) {
        if (item.children && item.children.length > 0) {
          traverse(item.children, item.label);
        } else if (item.href) {
          pages.push({
            id: `page-${item.id}`,
            title: item.label,
            subtitle: parentTitle ? `${parentTitle} > ${item.label}` : '頁面連結',
            icon: item.icon,
            category: 'pages',
            categoryLabel: '頁面導覽',
            badge: '頁面',
            keywords: [
              item.label,
              parentTitle || '',
              ...(item.keywords || []),
              '頁面',
              'page',
              'link',
            ],
            onSelect: () => handleNavigate(item.href!),
          });
        } else if (item.action) {
          actions.push({
            id: `action-${item.id}`,
            title: item.label,
            subtitle: parentTitle ? `${parentTitle} > ${item.label}` : '系統指令',
            icon: item.icon,
            category: 'actions',
            categoryLabel: '系統功能',
            badge: '系統',
            keywords: [
              item.label,
              parentTitle || '',
              ...(item.keywords || []),
              '設定',
              '系統',
              'action',
            ],
            onSelect: () => handleAction(item.action),
          });
        }
      }
    };

    traverse(startMenuItems);
    return { pageItems: pages, actionItems: actions };
  }, [handleNavigate, handleAction]);

  // 構建常用與釘選清單 (支援 DesktopApp 應用程式 與 StartMenuItem 頁面捷徑)
  const pinnedItems = useMemo(() => {
    const list: PinnedItem[] = [];

    // 1. 釘選的應用程式 (優先取 isPinned: true 的 App；若都未設定則以初始前 3 個 App 為備援)
    const hasAnyPinnedApp = apps.some((app) => app.isPinned);
    const targetApps = hasAnyPinnedApp ? apps.filter((app) => app.isPinned) : apps.slice(0, 3);
    for (const app of targetApps) {
      list.push({
        id: `pinned-app-${app.id}`,
        label: app.label,
        icon: app.icon,
        type: 'app',
        typeLabel: 'App',
        onClick: () => handleOpenApp(app.windowId || app.id, app.href),
      });
    }

    // 2. 釘選的頁面捷徑與功能 (遍歷 startMenuItems 中 isPinned: true 的項目)
    const traversePinned = (items: StartMenuItem[]) => {
      for (const item of items) {
        if (item.isPinned) {
          if (item.href) {
            list.push({
              id: `pinned-page-${item.id}`,
              label: item.label,
              icon: item.icon,
              type: 'page',
              typeLabel: '頁面',
              onClick: () => handleNavigate(item.href!),
            });
          } else if (item.action) {
            list.push({
              id: `pinned-action-${item.id}`,
              label: item.label,
              icon: item.icon,
              type: 'action',
              typeLabel: '功能',
              onClick: () => handleAction(item.action),
            });
          }
        }
        if (item.children && item.children.length > 0) {
          traversePinned(item.children);
        }
      }
    };
    traversePinned(startMenuItems);

    return list;
  }, [apps, handleOpenApp, handleNavigate, handleAction]);

  // 若未開啟，直接結束不渲染
  if (!isOpen) return null;

  return (
    <div 
      className="absolute bottom-14 left-2 w-84 sm:w-96 h-[520px] max-h-[calc(100vh-4.5rem)] bg-white/85 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50 animate-in slide-in-from-bottom-2 fade-in duration-200"
      onKeyDown={handleKeyDown}
    >
      {/* 
        利用 shadcn Command 作為主控核心：
        - bg-transparent: 融入外層毛玻璃 Fluent Design 容器
        - loop: 鍵盤上下鍵支援循環滾動
      */}
      <Command 
        className="bg-transparent text-foreground rounded-none p-0 flex flex-col h-full border-0 shadow-none overflow-hidden"
        loop
      >
        {/* 頂部搜尋列 (Windows 11 擬真搜尋框) */}
        <div className="p-3 pb-2 border-b border-black/5 dark:border-white/10 shrink-0">
          <CommandInput
            placeholder="搜尋應用程式、設定或功能..."
            value={search}
            onValueChange={setSearch}
            autoFocus
          >
            {search ? (
              <InputGroupAddon align="inline-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearch('');
                  }}
                  className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="清除搜尋 (Esc)"
                >
                  <X size={14} />
                </button>
              </InputGroupAddon>
            ) : (
              <InputGroupAddon align="inline-end">
                <span className="text-[10px] text-muted-foreground/60 px-1.5 py-0.5 rounded border border-border/40 font-mono select-none">
                  ESC
                </span>
              </InputGroupAddon>
            )}
          </CommandInput>
        </div>

        {/* 中間滾動內容區域 */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {search.trim() ? (
            /* 
              搜尋狀態：由 shadcn / cmdk 提供智慧模糊篩選與鍵盤上下鍵導航
            */
            <CommandList className="max-h-none p-2 space-y-2">
              <CommandEmpty className="py-10 text-center text-sm text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                  <Search size={28} className="text-muted-foreground/50" />
                  <p className="font-medium">找不到與「{search}」相符的結果</p>
                  <p className="text-xs text-muted-foreground/80">請嘗試搜尋「關於我」、「履歷」或「主題」</p>
                </div>
              </CommandEmpty>

              {/* 應用程式搜尋結果 */}
              <CommandGroup heading="應用程式 (Apps)">
                {searchableApps.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.title} ${item.subtitle} ${item.keywords.join(' ')}`}
                    keywords={item.keywords}
                    onSelect={item.onSelect}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 data-[selected=true]:bg-black/5 dark:data-[selected=true]:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0 shadow-sm">
                        <AppIcon icon={item.icon} size={18} />
                      </div>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
                        <span className="text-xs text-muted-foreground truncate">{item.subtitle}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0 border-blue-500/30 text-blue-600 dark:text-blue-400">
                      {item.badge}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>

              {/* 頁面導覽搜尋結果 */}
              <CommandGroup heading="頁面導覽 (Pages)">
                {pageItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.title} ${item.subtitle} ${item.keywords.join(' ')}`}
                    keywords={item.keywords}
                    onSelect={item.onSelect}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 data-[selected=true]:bg-black/5 dark:data-[selected=true]:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-sm">
                        <AppIcon icon={item.icon} size={18} />
                      </div>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
                        <span className="text-xs text-muted-foreground truncate">{item.subtitle}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                      {item.badge}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>

              {/* 系統設定搜尋結果 */}
              <CommandGroup heading="系統設定 (Settings)">
                {actionItems.map((item) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.title} ${item.subtitle} ${item.keywords.join(' ')}`}
                    keywords={item.keywords}
                    onSelect={item.onSelect}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 data-[selected=true]:bg-black/5 dark:data-[selected=true]:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0 shadow-sm">
                        <AppIcon icon={item.icon} size={18} />
                      </div>
                      <div className="flex flex-col min-w-0 text-left">
                        <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
                        <span className="text-xs text-muted-foreground truncate">{item.subtitle}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0 border-purple-500/30 text-purple-600 dark:text-purple-400">
                      {item.badge}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          ) : (
            /* 
              預設未搜尋狀態：展示「常用應用程式」網格與「完整功能選單」階層列表
            */
            <div className="p-3 space-y-4">
              {/* 常用與釘選項目 (支援 App 應用程式 與 Page 頁面捷徑) */}
              {pinnedItems.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={13} className="text-blue-500" />
                      常用與釘選項目
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">快速存取</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {pinnedItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={item.onClick}
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all text-center group cursor-pointer relative"
                        title={item.label}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 shadow-sm group-hover:scale-105 transition-transform ${
                            item.type === 'app'
                              ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'
                              : 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300'
                          }`}
                        >
                          <AppIcon icon={item.icon} size={20} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate w-full">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 完整功能選單 (階層樹狀結構) */}
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    功能選單
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">點擊展開</span>
                </div>
                
                <div className="flex flex-col gap-1 w-full">
                  {startMenuItems.map((item) => (
                    <MenuItem key={item.id} item={item} onClose={onClose} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 
          底部使用者狀態區塊 (固定在彈出視窗的最下方)：
          模擬 Windows 11 開始功能表底部的使用者頭像與帳號設定
        */}
        <div className="bg-white/40 dark:bg-zinc-800/50 p-3.5 flex items-center justify-between border-t border-white/20 dark:border-white/10 cursor-pointer hover:bg-white/60 dark:hover:bg-zinc-800 transition-colors shrink-0">
          <div className="flex items-center gap-3">
            {/* 圓形頭像 */}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 shadow-sm border border-white dark:border-zinc-700">
              <User size={16} />
            </div>
            {/* 使用者名稱與狀態提示 */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Guest</span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">點擊登入 (未來擴充)</span>
            </div>
          </div>
          {/* 箭頭圖示 */}
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </Command>
    </div>
  );
}
