"use client";

import React from 'react';
import { startMenuItems } from '@/data/desktopConfig';
import { User, ChevronRight } from 'lucide-react';
import { MenuItem } from './MenuItem';

export interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 開始功能表展示元件 (Presentation Component)
 * 檔名 StartMenu.tsx 與元件名稱一致
 */
export function StartMenu({ isOpen, onClose }: StartMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-14 left-2 w-80 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
      {/* 樹狀功能清單 */}
      <div className="p-4 flex-1 max-h-[60vh] overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 px-2 uppercase tracking-wider">功能選單</h3>
        <div className="flex flex-col gap-1 w-full">
          {startMenuItems.map((item) => (
            <MenuItem key={item.id} item={item} onClose={onClose} />
          ))}
        </div>
      </div>

      {/* 登入與使用者狀態區塊 */}
      <div className="bg-white/40 dark:bg-zinc-800/50 p-4 flex items-center justify-between border-t border-white/20 dark:border-white/10 cursor-pointer hover:bg-white/60 dark:hover:bg-zinc-800 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 shadow-sm border border-white dark:border-zinc-700">
            <User size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Guest</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">點擊登入 (未來擴充)</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-400" />
      </div>
    </div>
  );
}
