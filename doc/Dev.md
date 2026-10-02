# 開發環境
## 建立 Next.js 專案
- 於主資料夾路徑下輸入指令: `npx create-next-app@latest dev-web`

## 建置並啟動專案
- 於 Dev.Frontend/dev-web 路徑下輸入指令: `npm run dev`

# Next.js
## App Router
- 檔案目錄即路由 (File-based Routing)
    - 不需要額外設定路由表
    - 在 app/ 底下建立資料夾與 page.tsx（例如 app/employees/page.tsx），系統就會自動生成 /employees 的網址

## 模組化設計與全域設定
- 頁面與版面分離
    - `page.tsx`: 僅負責當前路由頁面的 UI 內容與狀態
    - `layout.tsx`: 管理共用版面（如導覽列）以及 HTML 的 `<head>` 標籤資訊（如網頁標題 `metadata`）。所有子頁面都會自動套用此版面
- 樣式與靜態資源管理
    - `globals.css`: 控制全域樣式（如網頁背景）。若要清除預設樣式，須保留檔案最上方的三行 `@tailwind` 指令（若有啟用 Tailwind CSS），其餘皆可刪除
    - `favicon.ico`: 瀏覽器分頁標籤圖示，直接替換該檔案即可更新全站圖示