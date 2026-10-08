"use client";

import { useState, useRef, useEffect, useCallback } from 'react';

export interface UseWindowOptions {
  isOpen: boolean;
  defaultPosition?: { x: number; y: number };
}

/**
 * 處理視窗拖曳、置中、最大化等操作邏輯 (Script 邏輯抽離)
 */
export function useWindow({ isOpen, defaultPosition = { x: 100, y: 100 } }: UseWindowOptions) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  // 視窗開啟時將其置中，關閉時重設最大化狀態
  useEffect(() => {
    if (!isOpen) {
      setIsMaximized(false);
    } else {
      if (typeof window !== 'undefined') {
        setPosition({
          x: Math.max(0, window.innerWidth / 2 - 300),
          y: Math.max(0, window.innerHeight / 2 - 250),
        });
      }
    }
  }, [isOpen]);

  // 滑鼠拖曳視窗移動與釋放
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current || isMaximized) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.initialX + dx,
        y: dragRef.current.initialY + dy,
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

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  }, [isMaximized, position]);

  const toggleMaximize = useCallback(() => {
    setIsMaximized((prev) => !prev);
  }, []);

  const windowStyle: React.CSSProperties = isMaximized
    ? { top: 0, left: 0, right: 0, bottom: '3rem', width: '100%', height: 'calc(100% - 3rem)' }
    : { top: position.y, left: position.x, width: '600px', height: '500px', maxWidth: '100vw', maxHeight: 'calc(100vh - 3rem)' };

  return {
    isMaximized,
    position,
    isDragging,
    windowStyle,
    toggleMaximize,
    handleMouseDown,
  };
}
