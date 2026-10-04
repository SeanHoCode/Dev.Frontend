// 出現「不是模組 (is not a module)」的錯誤，是因為 TypeScript 認定該檔案為全域腳本，而非獨立模組。在 TypeScript 中，檔案內部必須包含至少一個 export 或 import 語句，才會被視為模組
export interface Employment {
    company: string;
    role: string;
    product: string;
    startDate: Date;
    endDate?: Date | null;
    description: string;
}