'use client';

import { Suspense, lazy } from 'react';
import { Category, Course, Level } from '@prisma/client';
import { CourseCardSkeleton } from './course-skeleton';
import Link from 'next/link';

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
  level?: Level | null;
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

// Lazy load the CourseCard component
const CourseCard = lazy(() => import('@/components/course-card'));

const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <Suspense key={item.id} fallback={<CourseCardSkeleton />}>
            <CourseCard
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl!}
              chaptersLength={item.chapters.length}
              price={item.price!}
              progress={item.progress!}
              category={item?.category?.name!}
              level={item?.level?.name!}
            />
          </Suspense>
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found. Go to the{' '}
          <Link href="/search" className="text-bold underline">
            browse
          </Link>{' '}
          tab to enroll in courses
          <br />
          <span className="text-center text-sm text-muted-foreground italic">
            Make sure you select your class
          </span>
        </div>
      )}
    </div>
  );
};

export default CoursesList