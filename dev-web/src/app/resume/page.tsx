import { redirect } from 'next/navigation';

/**
 * 履歷模組根路由轉址 (Route: "/resume")
 * 
 * 【主要作用與職責 (Core Purpose)】：
 * 當使用者直接在網址列造訪 `/resume` 時，自動轉址至預設的「工作與實習經歷」頁面 (`/resume/employment`)。
 */
export default function ResumePage() {
  redirect('/resume/employment');
}
