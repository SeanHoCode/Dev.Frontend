// "use client" 指示詞：此元件是純前端 SPA 模式下的容器元件，需在瀏覽器端發送 API 請求並即時更新載入狀態
"use client";

import React from 'react';
// 引入經歷單項卡片元件
import EmploymentCard from '@/components/resume/EmploymentCard';
// 引入封裝了 API 請求與載入中/錯誤狀態的 Custom Hook
import { useEmployment } from '@/hooks/useEmployment';

/**
 * 經歷列表客戶端容器元件 (EmploymentView - Container Component)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是經歷模組的業務容器元件 (Container Component)，負責：
 * 1. 驅動資料獲取生命週期：調用 `useEmployment` 自訂 Hook 向服務層請求工作經歷資料。
 * 2. 狀態機三態畫面流轉：根據 Hook 回傳的 `isLoading`、`error` 與 `employments`，精準切換載入提示、錯誤警示或成功清單。
 * 3. 陣列迴圈渲染：將收到的 `employments` 陣列透過 `.map()` 動態迭代為多張 `<EmploymentCard />` 卡片並綁定唯一 key。
 * 
 * 【初學者觀念 - 三態畫面處理 (Loading / Error / Success)】：
 * 1. 任何非同步網路請求 (Async Request) 在前端通常有三個生命週期階段：
 *    - Loading (載入中)：向後端請求中，尚未收到資料 -> 顯示骨架或提示文字，提升使用者體驗。
 *    - Error (發生錯誤)：網路斷線或 API 伺服器報報錯 -> 顯示友善的錯誤提示，防止頁面當機白畫面。
 *    - Success (成功取得資料)：透過陣列的 .map() 逐筆將 JSON 資料轉成對應的 React 元件。
 * 2. 列表渲染時 key 的重要性：
 *    在 React 渲染迴圈陣列時，必須給每個根項目唯一的 `key` 屬性 (例如 key={exp.id})。
 *    React 的 Virtual DOM 比對機制仰賴 key 來辨識哪些元素被新增、刪除或移動，避免重新繪製整個列表。
 */
export function EmploymentView() {
  // 從自訂 Hook 中取得資料狀態、是否正在載入，以及是否有錯誤
  const { employments, isLoading, error } = useEmployment();

  // 【階段 1：載入中狀態】
  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground text-sm">
        經歷資料載入中...
      </div>
    );
  }

  // 【階段 2：錯誤狀態】
  if (error) {
    return (
      <div className="p-6 text-center text-red-500 text-sm">
        無法載入經歷資料，請稍後再試。
      </div>
    );
  }

  // 【階段 3：成功渲染列表】
  return (
    <section className="space-y-4">
      {/* 
        使用 Array.prototype.map() 進行列表渲染：
        遍歷 employments 陣列中的每一筆經歷資料 (exp)，並回傳一個 <EmploymentCard /> 元件 
      */}
      {employments.map((exp) => (
        <EmploymentCard
          // 提供唯一 key (優先使用資料庫 ID，若無則以公司名稱與職稱拼接做為備援)
          key={exp.id || `${exp.company}-${exp.role}`}
          company={exp.company}
          role={exp.role}
          product={exp.product}
          startDate={exp.startDate}
          endDate={exp.endDate}
          description={exp.description}
        />
      ))}
    </section>
  );
}
