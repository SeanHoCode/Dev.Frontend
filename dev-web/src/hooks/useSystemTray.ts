"use client";

import { useState, useEffect } from 'react';

/**
 * 處理系統匣時鐘與計時器邏輯 (Script 邏輯抽離)
 */
export function useSystemTray() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // 初次掛載設定目前時間
    setTime(new Date());

    // 每分鐘更新一次時間
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const timeString = time
    ? time.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : '';

  const dateString = time
    ? time.toLocaleDateString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : '';

  return {
    time,
    timeString,
    dateString,
    isLoaded: Boolean(time),
  };
}
