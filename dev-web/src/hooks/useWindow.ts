// "use client" 指示詞：此 Hook 處理滑鼠拖曳、視窗置中計算與 DOM 全域事件監聽，屬於客戶端行為
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * useWindow 的傳入參數介面
 */
export interface UseWindowOptions {
  isOpen: boolean;                               // 視窗是否開啟
  defaultPosition?: { x: number; y: number };    // 預設出現的座標 (選填，預設 { x: 100, y: 100 })
}

/**
 * 視窗拖曳與大小控制 Hook (useWindow)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本 Hook 是單一視窗動態行為的物理運算引擎 (Window Dynamics Engine Hook)，負責：
 * 1. 視窗初次智慧置中：視窗開啟瞬間根據瀏覽器可用視窗寬高自動計算置中像素座標。
 * 2. 標題列滑鼠拖曳運算 (Drag Physics)：註冊全域 `mousemove` 與 `mouseup`，配合 `useRef` 低開銷地計算滑鼠相對位移量。
 * 3. 最大化／還原切換：維護 `isMaximized` 布林狀態，在全螢幕佈局與自由浮動位置之間切換。
 * 4. 動態 CSS 樣式產出：整合產生即時的 `windowStyle` (含 top, left, width, height)，供 `Window.tsx` 元件直接綁定。
 */
export function useWindow({ isOpen, defaultPosition = { x: 100, y: 100 } }: UseWindowOptions) {
  // 輔助函式：計算螢幕中央座標 (避免初次繪製時出現在非預期位置再跳動)
  const calculateCenterPosition = useCallback(() => {
    if (typeof window !== 'undefined') {
      return {
        x: Math.max(0, Math.round((window.innerWidth - 600) / 2)),
        y: Math.max(0, Math.round((window.innerHeight - 500) / 2)),
      };
    }
    return defaultPosition;
  }, [defaultPosition]);

  // isMaximized: 視窗是否最大化 (填滿全螢幕)
  const [isMaximized, setIsMaximized] = useState(false);
  // position: 視窗當前的左上角像素座標 { x, y } (利用惰性初始化，初次渲染即精準置中，徹底消除位置跳動)
  const [position, setPosition] = useState<{ x: number; y: number }>(() => calculateCenterPosition());
  // isDragging: 當前是否正在被使用者拖曳中
  const [isDragging, setIsDragging] = useState(false);

  // dragRef: 暫存拖曳開始瞬間的座標基準點
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  // 記錄前一次的 isOpen 狀態，避免在元件初次掛載時發起多餘的非同步重設
  const prevOpenRef = useRef(isOpen);

  // 【生命週期 1：視窗開啟狀態變化時的重設處理】
  useEffect(() => {
    if (!isOpen) {
      // 關閉視窗時，重設最大化狀態
      setIsMaximized(false);
    } else if (!prevOpenRef.current && isOpen) {
      // 視窗由關閉狀態重新開啟時，重新置中
      setPosition(calculateCenterPosition());
    }
    prevOpenRef.current = isOpen;
  }, [isOpen, calculateCenterPosition]);

  // 【生命週期 2：監聽螢幕尺寸變更，避免縮小瀏覽器時視窗飄出視線外】
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, Math.max(0, window.innerWidth - 300)),
        y: Math.min(prev.y, Math.max(0, window.innerHeight - 200)),
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 【生命週期 3：拖曳時監聽全螢幕滑鼠移動與放開】
  useEffect(() => {
    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      // 若沒有在拖曳中，或視窗目前最大化中，則忽略滑鼠移動
      if (!isDragging || !dragRef.current || isMaximized) return;
      
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const nextX = dragRef.current.initialX + dx;
      const nextY = dragRef.current.initialY + dy;

      // 使用 requestAnimationFrame 節流更新，使位置計算與螢幕更新率同步（避免高頻滑鼠事件造成卡頓）
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(() => {
        setPosition({
          x: nextX,
          y: nextY,
        });
      });
    };

    // 放開滑鼠時結束拖曳
    const handleMouseUp = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      setIsDragging(false);
    };

    // 只有在 isDragging === true 時才向 document 註冊監聽器
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    // 清理函式：拖曳結束或元件卸載時移除事件
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isMaximized]);

  // 按下滑鼠標題列時觸發：開始拖曳
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return; // 最大化狀態下不允許拖曳移動
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  }, [isMaximized, position]);

  // 切換最大化與還原
  const toggleMaximize = useCallback(() => {
    setIsMaximized((prev) => !prev);
  }, []);

  // 動態計算視窗 CSS 樣式物件 (直接套用在 Window 外框上)
  const windowStyle: React.CSSProperties = isMaximized
    ? { 
        // 最大化狀態：四邊貼合，底部預留 3rem (48px) 工作列空間
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: '3rem', 
        width: '100%', 
        height: 'calc(100% - 3rem)' 
      }
    : { 
        // 一般視窗狀態：套用絕對定位 (top, left) 與固定預設寬高 (600x500)
        top: position.y, 
        left: position.x, 
        width: '600px', 
        height: '500px', 
        maxWidth: '100vw', 
        maxHeight: 'calc(100vh - 3rem)' 
      };

  return {
    isMaximized,
    position,
    isDragging,
    windowStyle,
    toggleMaximize,
    handleMouseDown,
  };
}
