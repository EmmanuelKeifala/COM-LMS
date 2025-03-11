'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';

interface SidebarItemProps {
  icon: LucideIcon | any;
  label: string;
  href: string;
}

const SidebarItem = React.memo(({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  // Memoize the active state calculation
  const isActive = useMemo(
    () =>
      (pathname === '/' && href === '/') ||
      pathname === href ||
      pathname?.startsWith(`${href}/`),
    [pathname, href]
  );

  // Memoize the onClick handler
  const onClick = useCallback(() => {
    router.push(href);
  }, [router, href]);

  // Prefetch the linked page on hover
  const onMouseEnter = useCallback(() => {
    router.prefetch(href);
  }, [router, href]);

  // Memoize class names to avoid redundant calculations
  const buttonClassName = useMemo(
    () =>
      cn(
        'flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
        isActive && 'text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700'
      ),
    [isActive]
  );

  const iconClassName = useMemo(
    () => cn('text-slate-500', isActive && 'text-sky-700'),
    [isActive]
  );

  const borderClassName = useMemo(
    () =>
      cn(
        'ml-auto opacity-0 border-2 border-sky-700 h-full transition-all',
        isActive && 'opacity-100'
      ),
    [isActive]
  );

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      type="button"
      className={buttonClassName}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon size={22} className={iconClassName} />
        <span>{label}</span>
      </div>
      <div className={borderClassName} />
    </button>
  );
});

SidebarItem.displayName = 'SidebarItem'; // for debugging

export default SidebarItem;