"use client";

import { useState } from 'react';
import { startMenuItems } from '@/data/desktopConfig';
import Link from 'next/link';
import { User, ChevronRight, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

// 遞迴渲染樹狀選單項目
function MenuItem({ item, onClose, depth = 0 }: { item: any; onClose: () => void; depth?: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  
  // 透過 next-themes 的 hook 來獲取並設定主題
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else if (item.href) {
      onClose();
    } else {
      // 處理自訂功能 Action
      if (item.action === 'toggle_theme') {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      } else if (item.action === 'open_settings') {
        alert('系統設定介面即將推出！\n這是一個透過 Action 呼叫的範例。');
      } else {
        console.log(`未知的 Action: ${item.action}`);
      }
      onClose();
    }
  };

  const content = (
    <div 
      className={`flex items-center gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer text-gray-700 w-full`}
      style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }}
      onClick={handleClick}
    >
      <div className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded shadow-sm shrink-0">
        <item.icon size={16} />
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
      
      {/* 子選單 */}
      {hasChildren && isOpen && (
        <div className="mt-1 flex flex-col gap-1 w-full">
          {item.children.map((child: any) => (
            <MenuItem key={child.id} item={child} onClose={onClose} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function StartMenu({ isOpen, onClose }: StartMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute bottom-14 left-2 w-80 bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden flex flex-col z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
      {/* 樹狀功能清單 */}
      <div className="p-4 flex-1 max-h-[60vh] overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wider">功能選單</h3>
        <div className="flex flex-col gap-1 w-full">
          {startMenuItems.map((item) => (
            <MenuItem key={item.id} item={item} onClose={onClose} />
          ))}
        </div>
      </div>

      {/* 登入與使用者狀態區塊 */}
      <div className="bg-white/40 p-4 flex items-center justify-between border-t border-white/20 cursor-pointer hover:bg-white/60 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-blue-700 shadow-sm border border-white">
            <User size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">Guest</span>
            <span className="text-xs text-gray-500">點擊登入 (未來擴充)</span>
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-400" />
      </div>
    </div>
  );
}
