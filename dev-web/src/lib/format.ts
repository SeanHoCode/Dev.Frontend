// 匯出純函式，處理傳入的開始與結束日期字串
export function formatPeriod(startDate: Date, endDate?: Date | null): string {
    const start = startDate.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' });
    // JavaScript 的 Truthy/Falsy 特性，只要 endDate 是 null 或 undefined，這裡的 if 判斷都會是 false
    const end = endDate
        ? endDate.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })
        : '至今';

    return `${start} - ${end}`;
}