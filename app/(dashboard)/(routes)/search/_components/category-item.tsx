'use client';

import qs from 'query-string';
import { IconType } from 'react-icons';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import { cn } from '@/lib/utils';

interface CategoryItemProps {
  label: string;
  value?: string;
  icon?: IconType;
}

// Separate the interactive component logic
const CategoryItemContent = ({ label, value, icon: Icon }: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get('categoryId');
  const currentTitle = searchParams.get('title');

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );

    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition',
        isSelected && 'border-sky-700 bg-sky-200/20 text-sky-800'
      )}
      type="button"
    >
      {Icon && <Icon size={20} />}
      <div className="truncate">{label}</div>
    </button>
  );
};

// Loading state component
const CategoryItemSkeleton = () => {
  return (
    <div className="py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 animate-pulse bg-slate-100">
      <div className="w-20 h-4 bg-slate-200 rounded"></div>
    </div>
  );
};

// Main component with Suspense wrapper
export const CategoryItem = (props: CategoryItemProps) => {
  return (
    <Suspense fallback={<CategoryItemSkeleton />}>
      <CategoryItemContent {...props} />
    </Suspense>
  );
};