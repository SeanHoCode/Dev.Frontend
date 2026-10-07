"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type WindowData = {
  id: string;
  minimized: boolean;
};

interface WindowContextType {
  windows: WindowData[];
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  toggleMinimize: (id: string) => void;
  closeAllWindows: () => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export function WindowProvider({ children }: { children: React.ReactNode }) {
  const [windows, setWindows] = useState<WindowData[]>([]);

  const openWindow = (id: string) => {
    setWindows((prev) => {
      const exists = prev.find((w) => w.id === id);
      if (exists) {
        // 如果已經存在，確保它沒有被最小化
        return prev.map((w) => w.id === id ? { ...w, minimized: false } : w);
      }
      return [...prev, { id, minimized: false }];
    });
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  };

  const toggleMinimize = (id: string) => {
    setWindows((prev) => prev.map((w) => 
      w.id === id ? { ...w, minimized: !w.minimized } : w
    ));
  };

  const closeAllWindows = () => {
    setWindows([]);
  };

  return (
    <WindowContext.Provider value={{ windows, openWindow, closeWindow, toggleMinimize, closeAllWindows }}>
      {children}
    </WindowContext.Provider>
  );
}

export function useWindowContext() {
  const context = useContext(WindowContext);
  if (context === undefined) {
    throw new Error('useWindowContext must be used within a WindowProvider');
  }
  return context;
}
