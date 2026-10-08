import { ResumeView } from '@/components/resume/ResumeView';

/**
 * 履歷頁面靜態外殼 (Static Page Shell)
 * 符合純前端 SPA 架構，內部引入 Client Component 處理資料與互動
 */
export default function ResumePage() {
  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">個人履歷</h1>
      <ResumeView />
    </main>
  );
}