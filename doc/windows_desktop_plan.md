### 🏁 目標

設計一個模仿 Windows 作業系統風格的網站起始頁面 (/)。主要功能包含：

1. Desktop (桌面)：放置常用功能的應用程式圖示 (App Icons)，作為前往網站主要頁面的快速連結。
2. Taskbar (工作列)：固定在畫面底部的長條，包含開始按鈕與系統匣 (時鐘等)。
3. Start Menu (開始選單)：點擊開始按鈕後彈出的選單，作為網站的全局功能導覽。
4. 高擴充性：透過模組化元件與獨立的設定檔，未來只要修改資料檔即可輕鬆新增桌面 App 或開始選單項目。  


### 🎨 設計細節

1. **導覽模式分離**：
   - **開始選單 (Start Menu)**：採用 **一般跳轉 (Page Routing)**。點擊後會透過 Next.js 的機制切換到其他獨立頁面（例如 `/resume`）。
   - **桌面圖示 (Desktop Apps)**：採用 **視窗彈窗 (Window Mode)**。點擊後會在當前桌面上彈出一個仿作業系統的視窗。
   - **視窗內容架構設計**：由於桌面視窗不需要獨立的 URL，且與 Next.js 的 Server Component 路由機制不完全吻合，最簡潔的做法是將視窗內容寫成 **獨立的 React Client Components** (放置於 `src/components/apps/` 目錄中)，並由桌面環境統一透過 State 來控制視窗的開啟與關閉。
2. **視覺風格**：採用 Windows 11 UI (圓角、現代化) 搭配 Windows 10 佈局 (工作列與開始按鈕靠左)。


### 🏗 預計修改與新增的檔案 (模組化架構)

1. 資料層 (Config)  
   • [新增] src/data/desktopConfig.ts: 將桌面 App 與開始選單項目抽象化，集中管理。未來只要加一行字就能新增 App。
2. 元件層 (Components) - 全部位於 src/components/desktop/  
   • [新增] DesktopIcon.tsx: 單個桌面圖示元件 (含 Hover 效果)。
   • [新增] StartMenu.tsx: 點擊開始按鈕後彈出的選單。上方功能清單採「樹狀結構」(Tree View) 呈現，下方 User 區塊則作為未來登入入口及登入後狀態顯示。
   • [新增] Taskbar.tsx: 畫面底部的工作列，包含左側的開始按鈕。
   • [新增] SystemTray.tsx: 位於工作列右側的系統匣。為求實用性而非純粹模仿，僅保留顯示當前時間功能，移除無實際作用的網路/音量/電池圖示。  
   • [新增] DesktopEnvironment.tsx: 主要的桌面容器，負責組合上述所有元件並載入背景圖片 (不再包含 Taskbar)。
3. 頁面層與排版層 (Pages & Layout)  
   • [修改] src/app/page.tsx: 替換原本的程式碼，改為匯入並渲染 DesktopEnvironment。
   • [新增/修改] src/components/layout/MainLayoutWrapper.tsx: 將 `Taskbar` 放在全域排版層級，使其(與開始選單) 在網站的所有頁面 (包含 `/resume` 等) 都能常駐於畫面底部，隨時可使用功能選單。
   • [移除] 移除了原本的 `app-sidebar.tsx` 以及其在排版中的引用，全面改以 Windows 開始選單作為網站的主力導覽系統，避免功能重疊與視覺衝突。
