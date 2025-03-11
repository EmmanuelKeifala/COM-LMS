import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { Suspense } from 'react';

import { db } from '@/lib/db';
import { getProgress } from '@/actions/get-progress';
import { CourseNavbar } from './_components/CourseNavbar';
import { CourseSidebar } from './_components/CourseSidebar';
import { CourseCardSkeleton } from '@/components/course-skeleton';
import { Loader2 } from 'lucide-react';
import { CourseNavbarSkeleton } from './_components/CourseNeverbarSkeleton';

// Cache immutable data for performance
const getCachedCourse = cache(async (courseId: string, userId: string) => {
  return db.course.findUnique({
    where: { id: courseId },
    include: {
      level: true,
      chapters: {
        where: { isPublished: true },
        include: {
          userProgress: { where: { userId } },
        },
        orderBy: { position: 'asc' },
      },
    },
  });
});

const CourseLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { courseId: string };
}) => {
  // Move auth check to Edge runtime
  const authData = await auth();
  if (!authData?.userId) return redirect('/');

  const { userId } = authData;

  // Fetch course & progress in parallel
  const [course, progressCount] = await Promise.all([
    getCachedCourse(params.courseId, userId),
    getProgress(userId, params.courseId),
  ]);

  if (!course) return redirect('/');

  return (
    <div className="h-full">
      {/* Stream navbar and sidebar for better performance */}
      <Suspense fallback={
        <CourseNavbarSkeleton />
      }>
        <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
          <CourseNavbar course={course} progressCount={progressCount} />
        </div>

      </Suspense>

      <Suspense fallback={<div className='mx-auto h-full w-full'><Loader2 size={30} /></div>}>
        <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
          <CourseSidebar course={course} progressCount={progressCount} />
        </div>
      </Suspense>

      {/* Stream course content */}
      <main className="md:pl-80 pt-[80px] h-full">
        <Suspense fallback={<CourseCardSkeleton />}>{children}</Suspense>
      </main>
    </div>
  );
};

export default CourseLayout;
