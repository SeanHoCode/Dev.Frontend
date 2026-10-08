// "use client" 指示詞：
// 告訴 Next.js 這個元件是「客戶端元件 (Client Component)」。
// 因為這個元件使用了 React Hook (usePathname) 來取得當前網址路徑，並提供 Context 給子元件，
// 涉及瀏覽器端的狀態互動，因此必須加上 "use client"。
"use client";

// 引入 Next.js 路由 Hook，用於讀取當前的 URL 路徑 (例如 "/" 或 "/resume/employment")
import { usePathname } from 'next/navigation';

// 引入底部工作列元件
import { Taskbar } from '@/components/operating-system/Taskbar';

// 引入全域視窗宿主元件 (負責在所有頁面浮動渲染開啟中的 App 視窗)
import { WindowHost } from '@/components/operating-system/WindowHost';

// 引入視窗狀態提供者 (管理視窗的開啟、關閉、最小化狀態)
import { WindowProvider } from '@/components/operating-system/WindowProvider';

// 引入應用程式資料提供者 (管理全站可用的 App 清單、取得 App 資訊)
import { DesktopAppsProvider } from '@/components/operating-system/DesktopAppsProvider';

/**
 * 主版面包裝元件 (MainLayoutWrapper)
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 本元件是全站頁面的中樞版面調度器 (Layout Dispatcher)，負責：
 * 1. 注入全域狀態容器 (Providers Injection)：統一裝載 `DesktopAppsProvider` 與 `WindowProvider`，讓全站任意子元件皆可存取桌面 App 與視窗狀態。
 * 2. 路由分支動態排版 (Route-based Layout)：透過 `usePathname()` 偵測當前網址，針對首頁桌面模式 (`/`) 與一般內容模式 (`/resume/employment` 等) 提供最佳化的容器邊距與捲軸設定。
 * 3. 常駐作業系統工作列 (Persistent Taskbar)：在所有頁面底部持續釘選 `<Taskbar />`，維持作業系統般的一致性操作體驗。
 * 
 * 【初學者觀念 - Context Provider 與版面切換】：
 * 1. React Context (如 DesktopAppsProvider, WindowProvider) 類似於「全域廣播系統」，
 *    只要被它們包在裡面的所有子元件 (children)，都可以隨時透過對應的 Hook 取用狀態，不需要一層層傳遞 Props (避免 Prop Drilling)。
 * 2. 透過 usePathname() 判斷當前所在頁面：
 *    - 若在首頁 ("/")：代表模擬的 Windows 桌面，讓內容全螢幕撐滿。
 *    - 若在其他頁面 (如 "/resume/employment")：提供標準的網頁版面 (含頂部 Header、內容限制寬度、底部保留工作列間距)。
 *
 * @param children 子層頁面內容 (由 app/layout.tsx 傳入)
 */
export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  // 取得當前的路徑字串 (例如 "/" 代表首頁)
  const pathname = usePathname();

  return (
    // 注入 App 狀態管理器 (讓桌面、工作列皆可存取 App 資料)
    <DesktopAppsProvider>
      {/* 注入視窗狀態管理器 (讓工作列與桌面可控制視窗開關) */}
      <WindowProvider>
        {pathname === '/' ? (
          // 【情境 A：首頁】Windows 桌面模式，不需要上方導覽列，直接全螢幕顯示桌面內容
          children
        ) : (
          // 【情境 B：其他專頁 (例如 /resume/employment)】標準文章或內容檢視模式
          // - flex-1 flex flex-col: 使用 Flexbox 彈性排版，垂直方向排列
          // - min-h-screen: 最低高度佔滿視窗
          // - pb-12: 底部留出 48px (3rem) 的內距，避免內容被固定的底部 Taskbar 遮擋
          <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden pb-12 bg-background">
            {/* 簡易頂部導覽列 (Sticky 黏性定位，捲動時固定在頂部) */}
            <div className="p-4 flex items-center border-b bg-white dark:bg-zinc-950 sticky top-0 z-10">
              <span className="font-bold text-blue-600">seanhocode</span>
            </div>
            
            {/* 頁面主要內容注入點 (max-w-5xl 限制最大寬度，mx-auto 自動水平置中) */}
            <div className="p-6 md:p-8 lg:p-12 w-full max-w-5xl mx-auto flex-grow">
              {children}
            </div>
          </main>
        )}

        {/* 全域視窗宿主層 (浮動於全站所有頁面之上，支援跨頁面開啟與多工操作) */}
        <WindowHost />

        {/* 全域底部工作列 (Windows Taskbar，固定釘在螢幕底部最下緣) */}
        <Taskbar />
      </WindowProvider>
    </DesktopAppsProvider>
  );
}
