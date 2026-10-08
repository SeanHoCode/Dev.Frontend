// "use client" 指示詞：此元件內部使用了 useState hook 來控制「展開/收合」詳細說明的互動狀態，因此必須宣告為客戶端元件
'use client';

// 引入 React 的核心 Hook: useState 用於在元件中建立本地狀態
import { useState } from 'react';

// 引入自定義的日期格式化工具函式 (將 startDate 與 endDate 轉換為人類易讀的文字，例如 "2023/07 ~ 2023/08")
import { formatPeriod } from '@/lib/format';

// 引入經歷資料的 TypeScript 介面定義
import type { Employment } from '@/types/resume/resume';

// 引入 UI 基礎元件 (基於 shadcn/ui 封裝之 Accessible 元件)
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * 單筆工作/實習經歷展示卡片 (EmploymentArea)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是履歷模組中用來呈現「單一筆職涯經歷」的卡片視圖 (Presentation Component)，負責：
 * 1. 接收與格式化單筆經歷資料：接收 `Employment` 物件屬性（公司、角色、產品、起訖日期、詳細描述），並調用 `formatPeriod` 格式化時間區間。
 * 2. 展開／收合互動狀態管理：透過本地 `useState` 維護 `isExpanded` 狀態，讓使用者可自主切換是否顯示冗長的工作細節。
 * 3. 複合標籤與卡片視覺排版：利用 shadcn/ui 的 `Card`、`Badge` 與 `Button` 呈現職稱、在職狀態與專案產品。
 * 
 * 【初學者觀念 - Props 解構與條件渲染 (Conditional Rendering)】：
 * 1. 函式參數 ({ company, role, product, startDate, endDate, description }: Employment)：
 *    使用 JavaScript 的物件解構賦值 (Destructuring)，直接將傳入的 Props 物件拆成獨立變數使用。
 * 2. useState(false)：
 *    建立一個名叫 isExpanded 的布林值狀態，預設為 false (收合)。
 *    當使用者點擊按鈕時，呼叫 setIsExpanded(!isExpanded) 反轉該值。
 * 3. 條件渲染 {isExpanded && ( ... )}：
 *    在 JSX 中，利用邏輯 AND (&&) 運算子。當 isExpanded 為 true 時，右側的 HTML 才會被渲染到畫面上。
 */
export default function EmploymentArea({ 
  company, 
  role, 
  product, 
  startDate, 
  endDate, 
  description 
}: Employment) {
  // 本地狀態：記錄目前卡片是否處於「展開」狀態
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    // Card: 外層白底/深底卡片容器 (mb-4: 下方留出 16px 外距)
    <Card className="mb-4">
      {/* CardHeader: 卡片標頭區塊 (pb-3: 底部內距 12px) */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {/* 公司名稱與職稱 */}
          <CardTitle className="text-xl">{company} - {role}</CardTitle>
          {/* Badge (徽章)：顯示任職期間，樣式為次要灰色/淡藍色 */}
          <Badge variant="secondary">{formatPeriod(startDate, endDate)}</Badge>
        </div>
        {/* 負責產品/專案名稱 */}
        <CardDescription className="text-base text-muted-foreground">
          負責產品：{product}
        </CardDescription>
      </CardHeader>

      {/* CardContent: 卡片主要內容區塊 */}
      <CardContent>
        {/*
          展開/收合切換按鈕：
          - onClick: 點擊時執行 setIsExpanded(!isExpanded) 切換開關狀態
          - 三元運算子 {isExpanded ? '隱藏詳細內容' : '查看詳細內容'}：依據開關動態變更按鈕文字
        */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-start text-muted-foreground hover:text-foreground mb-2"
        >
          {isExpanded ? '隱藏詳細內容' : '查看詳細內容'}
        </Button>

        {/* 條件渲染：只有當 isExpanded === true 時才會顯示詳細工作描述 */}
        {isExpanded && (
          // whitespace-pre-wrap: 保留文字中的換行符號 (\n)，讓排版更自然
          <div className="mt-2 p-4 rounded-md bg-muted text-sm leading-relaxed text-foreground">
            <p className="m-0 whitespace-pre-wrap">{description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}