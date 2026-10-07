"use client";

import { useState, useRef, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';

interface WindowProps {
  title: string;
  isOpen: boolean;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onClose: () => void;
  children: React.ReactNode;
}

export function Window({ title, isOpen, isMinimized = false, onMinimize, onClose, children }: WindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number, startY: number, initialX: number, initialY: number } | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsMaximized(false);
    } else {
      // 在視窗開啟時將其置中
      if (typeof window !== 'undefined') {
        setPosition({
          x: Math.max(0, window.innerWidth / 2 - 300),
          y: Math.max(0, window.innerHeight / 2 - 250)
        });
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current || isMaximized) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isMaximized]);

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };
  };

  const windowStyle = isMaximized 
    ? { top: 0, left: 0, right: 0, bottom: '3rem', width: '100%', height: 'calc(100% - 3rem)' }
    : { top: position.y, left: position.x, width: '600px', height: '500px', maxWidth: '100vw', maxHeight: 'calc(100vh - 3rem)' };

  return (
    <div 
      className={`absolute z-30 flex flex-col bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 pointer-events-auto ${isMaximized ? '' : 'rounded-lg'} ${isMinimized ? 'hidden' : ''}`}
      style={windowStyle}
    >
      {/* 標題列 (Top Bar) */}
      <div 
        className={`h-10 bg-gray-100 dark:bg-zinc-800 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 select-none ${isMaximized ? '' : 'cursor-move'}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => setIsMaximized(!isMaximized)}
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
            onClick={() => setIsMaximized(!isMaximized)}
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
