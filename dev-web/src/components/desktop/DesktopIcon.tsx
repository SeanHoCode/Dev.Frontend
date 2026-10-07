"use client";

import Link from 'next/link';

interface DesktopIconProps {
  app: {
    id: string;
    label: string;
    icon: React.ElementType;
    href?: string;
    windowId?: string;
  };
  onOpenWindow?: (windowId: string) => void;
}

export function DesktopIcon({ app, onOpenWindow }: DesktopIconProps) {
  const content = (
    <div className="flex flex-col items-center justify-start w-24 h-24 p-2 rounded hover:bg-black/10 dark:hover:bg-white/20 text-gray-800 dark:text-white transition-colors cursor-pointer group">
      <app.icon size={40} className="mb-2 drop-shadow-md text-blue-600 dark:text-blue-100 group-hover:text-blue-800 dark:group-hover:text-white transition-colors" />
      <span className="text-xs text-center drop-shadow-md leading-tight font-medium">
        {app.label}
      </span>
    </div>
  );

  if (app.href) {
    return (
      <Link href={app.href}>
        {content}
      </Link>
    );
  }

  return (
    <div onClick={() => app.windowId && onOpenWindow?.(app.windowId)}>
      {content}
    </div>
  );
}
