import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">個人開發與實驗平台</h1>
        <p className="text-lg text-gray-600">紀錄系統開發經驗、前端實驗與 Side Projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <Link href="/resume" className="block p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">關於我 & 履歷 &rarr;</h2>
          <p className="text-gray-600">查看工作經歷、技術棧與詳細簡歷。</p>
        </Link>

        {/* <Link href="/projects" className="block p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-2">Side Projects &rarr;</h2>
          <p className="text-gray-600">包含前端架構實驗、自動化工具與系統開發專案。</p>
        </Link> */}
      </div>
    </main>
  );
}