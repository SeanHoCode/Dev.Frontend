// "use client" 指示詞：此 Hook 涉及瀏覽器定時器 (setInterval) 與客戶端狀態，必須在客戶端執行
"use client";

import { useState, useEffect } from 'react';

/**
 * 系統匣時鐘與計時器 Hook (useSystemTray)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本 Hook 是系統匣時鐘與日期的定時運算控制器 (Clock Timer Controller Hook)，負責：
 * 1. 驅動週期性時鐘輪詢：在客戶端掛載時建立每 60 秒執行一次的 `setInterval` 定時器，驅動 `time` 狀態自動刷新。
 * 2. 格式化日期與時間字串：將標準 Date 物件轉換為在地化易讀的 `timeString` (如「上午 11:45」) 與 `dateString` (如「2026/10/08」)。
 * 3. SSR 水和保護 (Hydration Protection)：初始時間設為 `null` 並回傳 `isLoaded` 旗標，防止伺服器預渲染時間與瀏覽器時間不符引發的 Hydration 報錯。
 * 4. 定時器生命週期清理：在元件卸載時主動呼叫 `clearInterval`，防止背景計時器持續消耗效能。
 * 
 * 【初學者觀念 - 定時器與清理 (setInterval & clearInterval)】：
 * 1. 為什麼不能只用全域變數存時間？
 *    React 元件只會在「狀態 (State) 或 Props 改變」時才重新繪製畫面。
 *    因此必須使用 useState(new Date())，每當 setTime 被呼叫時，React 才會更新畫面上的時間字串。
 * 2. clearInterval 的重要性：
 *    每當建立 setInterval 計時器，瀏覽器會在背景不斷排程執行。
 *    若在 useEffect 清理函式中不呼叫 clearInterval(timer)，每次元件重新渲染或卸載時，舊的計時器就會持續留在記憶體中，
 *    導致多個計時器同時在背景偷跑，消耗瀏覽器效能 (記憶體洩漏)。
 */
export function useSystemTray() {
  // 記錄當前時間物件，初始為 null 避免 SSR 時區/時間差異造成的 Hydration 錯誤
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // 元件於瀏覽器端完成掛載時，立即記錄當前正確時間
    setTime(new Date());

    // 每 60,000 毫秒 (1 分鐘) 更新一次時間狀態
    const timer = setInterval(() => {
      setTime(new Date());
    }, 60000);

    // 清理函式：元件卸載時清除定時器
    return () => clearInterval(timer);
  }, []);

  // 格式化時間：例如 "上午 11:45" (hour12: true 為 12 小時制)
  const timeString = time
    ? time.toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : '';

  // 格式化日期：例如 "2026/10/08"
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
    // isLoaded: 用於告知 UI 是否已經取得客戶端時間 (避免 SSR 初始渲染閃爍)
    isLoaded: Boolean(time),
  };
}
