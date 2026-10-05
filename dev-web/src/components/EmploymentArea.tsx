'use client'; // 宣告為 Client Component，允許使用 React Hooks 與互動事件
import { useState } from 'react';
import { formatPeriod } from '../libs/format';
import type { Employment } from '../types/resume';

// 引入 shadcn 元件 (請根據你專案實際的 alias 路徑調整，通常為 @/components/ui/...)
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function EmploymentArea({ company, role, product, startDate, endDate, description }: Employment) {
    // 定義狀態：isExpanded 紀錄目前是否展開，預設為 false (隱藏)
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className="mb-4">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{company} - {role}</CardTitle>
                    {/* 使用 Badge 呈現期間，取代原本單純的 p 標籤 */}
                    <Badge variant="secondary">{formatPeriod(startDate, endDate)}</Badge>
                </div>
                <CardDescription className="text-base text-muted-foreground">
                    負責產品：{product}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* 使用 shadcn 的 Button 替換原生 button，移除原生 style 屬性[cite: 1] */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full justify-start text-muted-foreground hover:text-foreground mb-2"
                >
                    {isExpanded ? '隱藏詳細內容' : '查看詳細內容'}
                </Button>

                {/* 條件渲染：當 isExpanded 為 true 時，才渲染這個區塊[cite: 1] */}
                {isExpanded && (
                    // 使用 bg-muted 自動處理深淺色的背景切換，替代原有的 #f2f2f2[cite: 1]
                    <div className="mt-2 p-4 rounded-md bg-muted text-sm leading-relaxed text-foreground">
                        <p className="m-0 whitespace-pre-wrap">{description}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}