import EmploymentArea from '../components/EmploymentArea';

export default function Home() {
  // 模擬從 API 或資料庫取得的 JSON 資料
  const employments = [
    {
      id: 1,
      company: '叡揚資訊',
      role: '實習生-新進人員',
      product: '無',
      startDate: new Date('2023-07-10'),
      endDate: new Date('2023-08-30'),
      descryption: '學習 MVC、SQL 等基礎'
    },
    {
      id: 2,
      company: '叡揚資訊',
      role: '實習生-助理工程師',
      product: 'Radar 人資系統',
      startDate: new Date('2023-09-01'),
      endDate: new Date('2024-08-04'),
      descryption: '學習、了解產品並熟悉業務'
    },
    {
      id: 3,
      company: '叡揚資訊',
      role: '軟體工程師',
      product: 'Radar 人資系統',
      startDate: new Date('2024-01-13'),
      endDate: null,
      descryption: '維護、開發客製功能並執行更版作業(台新集團、永豐銀行、信鼎、板信銀行)，將產品佈署至客戶端(凱基銀行、凱基金控、信鼎、板信銀行)，將新版產品更新同步至客戶分支並處理衝突'
    },
  ];

  return (
    <main>
      <h1>個人履歷</h1>
      <section>
        {/* 使用 JavaScript 的 .map() 將 JSON 格式資料轉換為元件 */}
        {employments.map((exp) => (
          <EmploymentArea 
            key={exp.id} // 在 React 中渲染陣列必須加上唯一的 key
            company={exp.company}
            role={exp.role}
            product={exp.product}
            startDate={exp.startDate}
            endDate={exp.endDate}
            description={exp.descryption}
          />
        ))}
      </section>
    </main>
  );
}