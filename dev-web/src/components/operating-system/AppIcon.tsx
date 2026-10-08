import React from 'react';
import type { LucideProps } from 'lucide-react';
import { resolveIcon } from '@/lib/icons';

export interface AppIconProps extends LucideProps {
  icon: string | React.ElementType;
}

/**
 * 通用 App 圖示元件 (檔名與元件名稱一致)
 */
export function AppIcon({ icon, ...props }: AppIconProps) {
  const Component = resolveIcon(icon);
  return <Component {...props} />;
}
