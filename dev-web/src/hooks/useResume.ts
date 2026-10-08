"use client";

import { useState, useEffect } from 'react';
import { Employment } from '@/types/resume/resume';
import { fetchEmployments } from '@/services/resume/resumeService';

/**
 * 處理履歷資料非同步獲取、載入狀態與錯誤處理的 Custom Hook
 */
export function useResume() {
  const [employments, setEmployments] = useState<Employment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchEmployments();
        if (isMounted) {
          setEmployments(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    employments,
    isLoading,
    error,
  };
}
