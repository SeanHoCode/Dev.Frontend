"use client";

import React from 'react';
import { X, Minus, Square } from 'lucide-react';
import { useWindow } from '@/hooks/useWindow';

export interface WindowProps {
  title: string;
  isOpen: boolean;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * 視窗純展示元件 (Presentation Component)
 * 內部操作與拖曳邏輯已拆分至 useWindow hook
 */
export function Window({ 
  title, 
  isOpen, 
  isMinimized = false, 
  onMinimize, 
  onClose, 
  children 
}: WindowProps) {
  const { isMaximized, toggleMaximize, windowStyle, handleMouseDown } = useWindow({ isOpen });

  if (!isOpen) return null;

  return (
    <div 
      className={`absolute z-30 flex flex-col bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 pointer-events-auto ${
        isMaximized ? '' : 'rounded-lg'
      } ${isMinimized ? 'hidden' : ''}`}
      style={windowStyle}
    >
      {/* 標題列 (Top Bar) */}
      <div 
        className={`h-10 bg-gray-100 dark:bg-zinc-800 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 select-none ${
          isMaximized ? '' : 'cursor-move'
        }`}
        onMouseDown={handleMouseDown}
        onDoubleClick={toggleMaximize}
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
        <div className="flex items-center gap-2">
          {/* 最小化按鈕 */}
          {onMinimize && (
            <button 
              onClick={onMinimize}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 transition-colors"
              title="最小化"
            >
              <Minus size={14} />
            </button>
          )}
          {/* 放大/還原按鈕 */}
          <button 
            onClick={toggleMaximize}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 transition-colors"
            title={isMaximized ? "還原" : "最大化"}
          >
            <Square size={12} />
          </button>
          {/* 關閉按鈕 */}
          <button 
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500 hover:text-white text-gray-500 transition-colors"
            title="關閉"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* 內容區塊 */}
      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-zinc-900">
        {children}
      </div>
    </div>
  );
}
