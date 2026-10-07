"use client";

import { useState, useEffect } from 'react';

export function SystemTray() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time
    setTime(new Date());

    // Update time every minute
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return <div className="flex items-center gap-4 px-3 h-full hover:bg-white/10 rounded-md transition-colors">...</div>;
  }

  const timeString = time.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const dateString = time.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return (
    <div className="flex items-center h-full px-2 text-gray-800 dark:text-white">
      <div className="flex flex-col items-end justify-center px-3 h-full hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors cursor-pointer text-xs">
        <span>{timeString}</span>
        <span>{dateString}</span>
      </div>
    </div>
  );
}
