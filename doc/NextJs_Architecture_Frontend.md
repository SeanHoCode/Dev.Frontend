# Next.js 純前端專案架構與開發規範 (Static Export / SPA 模式)

本規範針對採用 Next.js 靜態匯出 (`output: 'export'`) 的純前端架構所制定。此模式下，Next.js 僅作為建置與打包工具，最終產出純 HTML/CSS/JS 靜態檔案，無 Node.js 伺服器環境。所有動態資料、API 路由與資料庫連線，皆由外部獨立的後端服務負責處理。

---

## 1. 核心觀念：Build-Time Server vs. Run-Time Client

在此架構中，必須重新定義 Server Components 的作用，因為它們只在**編譯階段 (Build Time)** 執行，無法處理執行階段 (Run Time) 的動態請求。

| 特性 / 考量點 | Server Components (編譯期靜態渲染) | Client Components (`"use client"`) |
| :--- | :--- | :--- |
| **主要職責** | 渲染純靜態無狀態頁面、建構共用 Layout、SEO 靜態標籤。 | **專案核心**。負責所有動態資料獲取、單頁應用程式 (SPA) 的使用者互動、狀態管理與身分驗證。 |
| **資料獲取** | 僅限於建置時固定不變的公開資料。 | 所有與使用者狀態相關的動態資料（例如依賴 JSON Web Token (JWT) 驗證的 API 請求）。 |
| **規範禁忌** | **絕對禁止**在此依賴 Request headers (如 Cookies, Authorization)、URL 查詢參數 (`searchParams`) 進行動態渲染。 | 避免在單一元件內混雜過多非同步狀態邏輯，應善用 Custom Hooks 或狀態管理套件。 |

---

## 2. 專案目錄結構 (Directory Structure)

移除所有伺服器端專屬目錄（如 `actions/`），並強化外部服務串接層：

```text
src/
├── app/            # 路由層 (僅定義靜態路由與靜態頁面外殼)
├── components/     # UI 元件層 (拆分靜態展示與動態互動元件)
├── hooks/          # 自定義 React Hooks (處理狀態、API 請求封裝)
├── lib/            # 共用工具、API Client 實例 (如 Axios 攔截器)
├── services/       # 外部 API 串接層 (嚴格對接外部後端服務)
└── types/          # 全域 TypeScript 型別定義 (需與後端 API 結構對齊)
```

---

## 3. 各層級規範與落檔原則

### 3.1 路由層 (`src/app/`)
- **核心職責**：定義頁面結構與路由。
- **規範**：
  1. `page.tsx` 僅作為頁面外殼 (Shell)。若頁面需要根據登入者身分顯示不同內容，`page.tsx` 應維持為純靜態的 Server Component，內部直接引入帶有 `"use client"` 的容器元件 (Container Component) 來處理動態邏輯。
  2. **嚴格禁用** `route.ts` (Route Handlers)。純前端架構不允許在 Next.js 中建立任何後端 API 節點。

### 3.2 狀態與資料請求層 (`src/hooks/` 與 `src/services/`)
- **`src/services/` (外部 API 串接)**：
  - 統一管理對外部後端發出的 HTTP 請求。
  - 需實作統一的 API Client，集中處理跨域資源共用 (CORS)、JWT 攔截器 (Interceptor) 邏輯，確保每個需要授權的請求都能自動攜帶 Token。
- **`src/hooks/` (資料狀態管理)**：
  - 建議引入 SWR 或 React Query 等非同步狀態管理工具。
  - 將 `services/` 的純請求函數包裝成 Custom Hook（例如 `useUserData()`），以處理 loading、error 與資料快取狀態，避免在元件內大量撰寫 `useEffect` 與 `useState`。

### 3.3 型別層 (`src/types/`)
- **核心職責**：前端介面與後端資料庫模型 / DTO 的對接點。
- **規範**：定義 API Response 的型別時，必須與外部後端系統保持絕對一致，確保前端解讀正確。全專案禁止使用 `any`。

---

## 4. 新增動態功能標準開發流程 (Standard SPA Workflow)

以新增「需要登入權限的使用者個人資料頁」為例：

1. **定義資料結構 (`src/types/`)**
   定義後端 API 回傳的 `UserProfile` 型別。
2. **實作 API 請求函式 (`src/services/user.ts`)**
   撰寫呼叫外部 API 的函式，確保 Headers 正確夾帶 JWT 等驗證資訊。
3. **封裝資料獲取 Hook (`src/hooks/useUser.ts`)**
   封裝請求並處理載入狀態。
4. **建立 Client Component (`src/components/user/ProfileView.tsx`)**
   標記 `"use client"`，呼叫 `useUser` Hook，並根據回傳的資料與狀態渲染畫面。
5. **整合至路由頁面 (`src/app/profile/page.tsx`)**
   在靜態的 `page.tsx` 中直接引入 `<ProfileView/>`。

---

## 5. 常見反模式 (Anti-Patterns to Avoid)

1. ❌ **誤用 Next.js 伺服器專屬功能**：
   - 錯誤：使用 `next/headers` (如 `cookies()`)、宣告 `"use server"` (Server Actions) 或依賴內建的 Image Optimization (若未配置自訂 Loader)。
   - 正確：將狀態保存在客戶端 (Local Storage, Session Storage)，圖片依賴外部 CDN 或後端處理。
2. ❌ **在 Server Component 存取動態 API**：
   - 錯誤：在 `page.tsx` 直接呼叫 `await fetch('https://api.example.com/user/me')`。靜態匯出時，這只會在「編譯當下」執行一次，導致所有使用者看到相同的編譯期資料。
   - 正確：將動態 API 請求移至 Client Component，在客戶端瀏覽器載入時觸發。
3. ❌ **前端處理業務邏輯**：
   - 錯誤：將複雜的資料運算、權限校驗或機敏資料處理放在前端。
   - 正確：前端僅負責單頁應用的畫面渲染與 API 請求發送，所有涉及商業邏輯與資料安全性的檢驗，必須交由外部後端系統執行。