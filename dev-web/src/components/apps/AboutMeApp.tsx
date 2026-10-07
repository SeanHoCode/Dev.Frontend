export function AboutMeApp() {
  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-200">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900 rounded-full flex flex-shrink-0 items-center justify-center text-blue-600 dark:text-blue-300 text-3xl font-bold">
          S
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">seanhocode</h1>
          <p className="text-gray-600 dark:text-gray-400">Backend Developer / 系統工程師</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2">關於我</h2>
        <p className="leading-relaxed">
          嗨！我是一名熱愛技術的後端工程師。專注於系統架構設計、API 開發，以及自動化部署流程。
          我喜歡將複雜的業務邏輯轉化為乾淨、易維護的程式碼，並對學習新技術充滿熱忱。
        </p>
        
        <h2 className="text-lg font-semibold border-b border-gray-200 dark:border-gray-700 pb-2 mt-4">主要技能</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>C# / .NET Core / ASP.NET</li>
          <li>Node.js / TypeScript</li>
          <li>SQL Server / PostgreSQL / Redis</li>
          <li>Docker / CI/CD (GitHub Actions)</li>
          <li>系統架構設計與效能優化</li>
        </ul>
      </div>
    </div>
  );
}
