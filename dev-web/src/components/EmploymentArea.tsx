'use client'; // 宣告為 Client Component，允許使用 React Hooks 與互動事件
import { formatPeriod } from '../libs/format';
import { useState } from 'react';

import type { Employment } from '../types/resume'

export default function EmploymentArea({ company, role, product, startDate, endDate, description }: Employment) {
    // 定義狀態：isExpanded 紀錄目前是否展開，預設為 false (隱藏)
    // setIsExpanded 是用來更新這個狀態的函式
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
            <h2>{company} - {role}</h2>
            <p>負責產品：{product}</p>
            {/* Date 物件無法直接作為 React 子節點渲染，必須轉換為字串 */}
            <p>期間：{formatPeriod(startDate, endDate)}</p>

            {/* 按鈕綁定 onClick 事件，點擊時將狀態反轉 (true 變 false，false 變 true) */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ cursor: 'pointer', padding: '5px 10px', marginTop: '5px' }}
            >
                {isExpanded ? '隱藏詳細內容' : '查看詳細內容'}
            </button>

            {/* 條件渲染：當 isExpanded 為 true 時，才渲染這個區塊 */}
            {isExpanded && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f2f2f2' }}>
                    <p style={{ margin: 0 }}>{description}</p>
                </div>
            )}
        </div>
    );
}