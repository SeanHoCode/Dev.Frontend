# Next.js 專案架構與開發規範手冊 (ARCHITECTURE.md)

本文件為本專案的標準架構指南，基於 **Next.js (App Router)** 的現代 React 開發標準制定。無論是新增畫面、拆分元件或處理資料流，請遵循本規範以確保專案的可維護性、效能與架構清晰度。

---

## 1. 核心觀念：Server vs. Client Components

Next.js App Router 預設所有元件皆為 **Server Components (伺服器元件)**。在開發時，必須明確區分這兩者的邊界：

| 特性 / 考量點 | Server Components (預設) | Client Components (`"use client"`) |
| :--- | :--- | :--- |
| **宣告方式** | 預設，無需宣告 | 必須在檔案頂部加上 `"use client";` |
| **主要職責** | 獲取後端資料、直接訪問資料庫、保護敏感資訊（API Keys）、靜態渲染。 | 處理使用者互動（`onClick`）、使用 React Hooks (`useState`, `useEffect`)、使用瀏覽器 API。 |
| **效能優勢** | 減少傳遞到前端的 JavaScript 體積，提升初始載入速度（SEO 友善）。 | 提供豐富的動態互動體驗。 |
| **規範禁忌** | **禁止**使用 React State/LifeCycle Hooks；**禁止**綁定 DOM 事件。 | **避免**將大體積的套件或純資料獲取邏輯放在此處，以免增加 Client Bundle 大小。 |

**📌 黃金法則**：盡可能將元件保持為 Server Components，將 Client Components 推到元件樹的「葉子節點」（最末端）。

---

## 2. 專案目錄結構 (Directory Structure)

專案統一使用 `src/` 目錄，將路由與業務邏輯清晰分離：

```text
src/
├── app/            # 路由層 (Next.js App Router 專屬)
├── components/     # UI 元件層 (共用與業務元件)
├── hooks/          # 自定義 React Hooks (僅供 Client Components 使用)
├── lib/            # 共用工具、純函式、第三方庫初始化
├── services/       # API 串接與外部資料請求
├── types/          # 全域 TypeScript 型別定義
└── actions/        # (可選) Server Actions，處理表單提交與資料變更
```

---

## 3. 各層級規範與落檔原則

### 3.1 路由層 (`src/app/`)
- **核心職責**：定義頁面 URL、Layout 版面配置與 API 路由。
- **檔案命名約定**（Next.js 保留字）：
  - `page.tsx`：該路由的 UI 進入點。
  - `layout.tsx`：該路由及其子路由的共用外觀（如導覽列、側邊欄）。
  - `loading.tsx`：資料載入時的佔位 UI（Suspense Fallback）。
  - `error.tsx`：錯誤捕捉邊界（必須是 Client Component）。
  - `route.ts`：後端 API 路由（Route Handlers），不可與 `page.tsx` 同層。
- **規範**：
  1. `page.tsx` 應優先作為 **Server Component**，負責獲取該頁面所需的初始資料，然後將資料作為 Props 傳遞給下方的 Client Components。
  2. 路由目錄應具備語意，動態路由使用中括號，例如 `src/app/products/[id]/page.tsx`。

### 3.2 元件層 (`src/components/`)
- **核心職責**：可重複使用的 UI 模塊。
- **目錄分類**：
  - `components/ui/`：通用的無商業邏輯基礎元件（按鈕、彈窗、表單輸入框）。
  - `components/{domain}/`：特定業務邏輯元件（例如 `components/products/ProductCard.tsx`）。
- **規範**：
  1. **檔案命名**：使用 `PascalCase`（例如 `UserProfile.tsx`），檔案名稱與 `export` 的元件名稱必須一致。
  2. **元件粒度彈性**：一個檔案內應只有一個「主要導出元件」。但**允許**在同一個檔案內部定義僅供該主要元件使用的「微型輔助元件」（Helper Components），不強制為所有微小 UI 另開檔案，避免檔案過度碎片化。
  3. **動態載入**：若 Client Component 包含龐大套件（如圖表庫 Recharts、大型富文本編輯器），請在父元件使用 `next/dynamic` 進行懶加載，避免拖慢初始畫面。

### 3.3 資料與邏輯層 (`src/lib/` 與 `src/services/`)
- **`src/lib/` (純邏輯與工具)**：
  - 放置與 React 無關的通用輔助函式（純函式）。例如：日期格式化 (`formatDate.ts`)、字串處理、常數設定。
  - 命名格式：`camelCase.ts`。
- **`src/services/` (資料請求)**：
  - 封裝 `fetch` 或第三方 API 請求。
  - 需處理基本的錯誤捕捉（`try...catch`）並回傳清楚的資料結構。
- **`src/actions/` (Server Actions - 現代狀態變更)**：
  - 專門放置 Next.js 的 Server Actions，用於表單提交與資料庫寫入。
  - 檔案頂端必須宣告 `"use server";`。

### 3.4 狀態與行為層 (`src/hooks/`)
- **核心職責**：將 Client Components 的複雜 UI 邏輯與狀態抽離。
- **規範**：
  1. 檔案命名：`useCamelCase.ts`（例如 `useToggle.ts`, `useAuth.ts`）。
  2. 當一個 Client Component 內的 `useState` 與 `useEffect` 邏輯超過 30-50 行，導致畫面難以閱讀時，應將其抽離為 Custom Hook，讓 UI 元件專注於渲染 JSX。

### 3.5 型別與介面層 (`src/types/`)
- **核心職責**：集中管理 TypeScript 型別，確保資料結構一致性。
- **分類原則**：
  - **全域/共用模型**：跨檔案的資料庫 Model、API Response、Context 型別，**必須**放在 `src/types/` 下（例如 `src/types/product.ts`）。
  - **元件專屬 Props**：僅供單一元件自用、不會被外部重複利用的 `Props`，可以直接寫在該元件的 `.tsx` 檔案頂端即可，不需要硬性抽離到 `types/`。
- **嚴格禁令**：**全專案禁止使用 `any`**。若真的無法確定型別，請使用 `unknown` 並進行型別檢查（Type Narrowing）。

---

## 4. 新增功能標準開發流程 (Standard Workflow)

當您要新增一個功能（例如：建立「商品詳情頁」）時，請參考以下思考步驟：

1. **定義資料結構 (`src/types/`)**
   先決定您的資料長什麼樣子（例如定義 `Product` 介面）。
2. **處理資料來源 (`src/services/` 或 直接在 `page.tsx` fetch)**
   撰寫獲取資料的非同步函式。
3. **建立 Server Component 頁面 (`src/app/products/[id]/page.tsx`)**
   在伺服器端呼叫 API，獲取 `Product` 資料。
4. **建立 Client Component 互動 UI (`src/components/products/ProductGallery.tsx`)**
   如果商品圖片需要「點擊放大」或「輪播」功能，建立一個加上 `"use client"` 的元件來處理這些互動，並在 `page.tsx` 中引入它。
5. **資料變更 (`src/actions/`)**
   如果頁面上有「加入購物車」按鈕，撰寫一個 Server Action 來處理後端寫入。

---

## 5. 常見反模式 (Anti-Patterns to Avoid)

1. ❌ **過度使用 `"use client"`**：
   - 錯誤：在最頂層的 `layout.tsx` 或根目錄 `page.tsx` 直接加上 `"use client"`，導致底下的所有子元件都被迫成為 Client Component，失去 Next.js 伺服器渲染的效能優勢。
   - 正確：只在需要 `onClick`、`useState` 的按鈕或區塊上加 `"use client"`，並將其抽成獨立元件。
2. ❌ **在 Server Component 使用 Hook**：
   - 錯誤：在未標示 `"use client"` 的 `page.tsx` 中使用 `useEffect` 來 fetch 資料。
   - 正確：Server Component 可直接宣告為 `async function` 並使用 `await fetch()` 獲取資料。
3. ❌ **將敏感邏輯洩漏到 Client**：
   - 錯誤：在 Client Component 中直接使用 `process.env.DATABASE_URL`。
   - 正確：資料庫連線與 API 金鑰只能在 Server Components、Route Handlers 或 Server Actions 中被存取。Next.js 規定只有 `NEXT_PUBLIC_` 開頭的環境變數才能在客戶端讀取。