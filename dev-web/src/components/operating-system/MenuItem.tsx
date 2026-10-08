// "use client" 指示詞：選單項目包含展開收合狀態 (useState) 與主題切換等互動
"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
// 引入箭頭圖示 (用於指示展開或收合狀態)
import { ChevronRight, ChevronDown } from 'lucide-react';
// 引入 next-themes 的 Hook，用於讀取目前主題與切換主題
import { useTheme } from 'next-themes';
// 引入選單項目的型別定義
import { StartMenuItem } from '@/types/operating-system/desktop';
// 引入通用圖示元件
import { AppIcon } from './AppIcon';

/**
 * MenuItem 元件的 Props 介面定義
 */
export interface MenuItemProps {
  item: StartMenuItem;    // 選單資料物件 (包含 label, icon, href, action, children 等)
  onClose: () => void;    // 關閉整個開始功能表的回呼函式
  depth?: number;         // 遞迴深度層級 (預設為 0，用於計算子選單向右縮排距離)
}

/**
 * 樹狀選單項目元件 (MenuItem)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是開始功能表 (StartMenu) 內部的單元遞迴節點 (Recursive Tree Item)，負責：
 * 1. 遞迴階層渲染 (Recursive Rendering)：支援多層次樹狀子選單，內部自我調用 `<MenuItem depth={depth + 1} />` 並依層級動態推進縮排。
 * 2. 多重行為路由分流 (Action & Route Routing)：
 *    - 折疊分組 (有 children)：點擊切換展開／收合狀態。
 *    - 導航連結 (有 href)：調用 Next.js `<Link>` 進行頁面跳轉並自動關閉選單 (`onClose`)。
 *    - 系統指令 (有 action)：分派執行特定操作 (例如透過 `useTheme` 切換深淺色或彈出視窗)。
 * 3. 階層箭頭指示：依據當前展開狀態動態顯示 `ChevronRight` 或 `ChevronDown` 箭頭圖示。
 * 
 * 【初學者觀念 - 遞迴元件 (Recursive Component)】：
 * 1. 什麼是遞迴元件？
 *    當資料結構具有無限層級的樹狀嵌套 (例如 children 底下還有 children) 時，
 *    MenuItem 元件會在自己的 JSX 內部「再次呼叫渲染自己」：<MenuItem ... depth={depth + 1} />。
 * 2. 深度縮排計算：
 *    透過 style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}，
 *    每一層子選單都會依據 depth 自動向右推進 1.5rem 的縮排，呈現直觀的樹狀階層視覺。
 * 3. 動作分流 (Action Handling)：
 *    - 若有子選單 (hasChildren)：點擊時展開/收合子列表。
 *    - 若為連結 (item.href)：點擊後關閉開始功能表並進行頁面跳轉。
 *    - 若為自訂動作 (item.action)：例如切換主題模式 (toggle_theme) 或彈出設定視窗。
 */
export function MenuItem({ item, onClose, depth = 0 }: MenuItemProps) {
  // 本地狀態：子選單是否展開
  const [isOpen, setIsOpen] = useState(false);
  // 是否包含子選單陣列
  const hasChildren = Boolean(item.children && item.children.length > 0);
  // 透過 next-themes hook 控制全站深淺色切換
  const { theme, setTheme } = useTheme();

  // 點擊事件處理
  const handleClick = useCallback(() => {
    if (hasChildren) {
      // 若有子項目，反轉展開狀態
      setIsOpen((prev) => !prev);
    } else if (item.href) {
      // 若為普通連結，點擊後自動收起開始功能表
      onClose();
    } else {
      // 處理自訂 Action 動作
      if (item.action === 'toggle_theme') {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      } else if (item.action === 'open_settings') {
        alert('系統設定介面即將推出！\n這是一個透過 Action 呼叫的範例。');
      }
      onClose();
    }
  }, [hasChildren, item.href, item.action, onClose, theme, setTheme]);

  // 單一選單項目的視覺內容
  const content = (
    <div 
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-gray-700 dark:text-gray-200 w-full"
      style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
      onClick={handleClick}
    >
      {/* 圖示外框 */}
      <div className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded shadow-sm shrink-0">
        <AppIcon icon={item.icon} size={16} />
      </div>
      
      {/* 選單標題文字 */}
      <span className="text-sm flex-1 text-left">{item.label}</span>
      
      {/* 展開/收合箭頭提示 (僅在擁有子選單時顯示) */}
      {hasChildren && (
        isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />
      )}
    </div>
  );

  return (
    <div className="w-full">
      {/* 若是超連結且無子選單，使用 Next.js Link 元件包裹 */}
      {item.href && !hasChildren ? (
        <Link href={item.href} onClick={onClose} className="block w-full">
          {content}
        </Link>
      ) : (
        content
      )}
      
      {/* 
        【遞迴渲染子選單】：
        當包含子項目且使用者已展開 (isOpen === true) 時，遍歷 children 並再次渲染 <MenuItem />
      */}
      {hasChildren && isOpen && (
        <div className="mt-1 flex flex-col gap-1 w-full">
          {item.children?.map((child: StartMenuItem) => (
            <MenuItem key={child.id} item={child} onClose={onClose} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
