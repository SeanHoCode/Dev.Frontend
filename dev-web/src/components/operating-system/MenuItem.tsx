"use client";

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { StartMenuItem } from '@/types/operating-system/desktop';
import { AppIcon } from './AppIcon';

export interface MenuItemProps {
  item: StartMenuItem;
  onClose: () => void;
  depth?: number;
}

/**
 * 樹狀選單項目元件
 */
export function MenuItem({ item, onClose, depth = 0 }: MenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const { theme, setTheme } = useTheme();

  const handleClick = useCallback(() => {
    if (hasChildren) {
      setIsOpen((prev) => !prev);
    } else if (item.href) {
      onClose();
    } else {
      if (item.action === 'toggle_theme') {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      } else if (item.action === 'open_settings') {
        alert('系統設定介面即將推出！\n這是一個透過 Action 呼叫的範例。');
      }
      onClose();
    }
  }, [hasChildren, item.href, item.action, onClose, theme, setTheme]);

  const content = (
    <div 
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-gray-700 dark:text-gray-200 w-full"
      style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
      onClick={handleClick}
    >
      <div className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 rounded shadow-sm shrink-0">
        <AppIcon icon={item.icon} size={16} />
      </div>
      <span className="text-sm flex-1 text-left">{item.label}</span>
      {hasChildren && (
        isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />
      )}
    </div>
  );

  return (
    <div className="w-full">
      {item.href && !hasChildren ? (
        <Link href={item.href} onClick={onClose} className="block w-full">
          {content}
        </Link>
      ) : (
        content
      )}
      
      {/* 遞迴子選單 */}
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
