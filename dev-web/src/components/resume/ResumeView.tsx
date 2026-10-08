"use client";

import React from 'react';
import EmploymentArea from '@/components/resume/EmploymentArea';
import { useResume } from '@/hooks/useResume';

/**
 * 履歷列表客戶端容器元件 (Client Component)
 * 負責呼叫 useResume Hook 並依據載入、錯誤與資料狀態渲染畫面
 */
export function ResumeView() {
  const { employments, isLoading, error } = useResume();

  if (isLoading) {
    return (
      <div className="p-6 text-center text-muted-foreground text-sm">
        履歷資料載入中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500 text-sm">
        無法載入履歷資料，請稍後再試。
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {employments.map((exp) => (
        <EmploymentArea
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
