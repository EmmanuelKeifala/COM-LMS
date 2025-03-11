import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Chapter, Course, UserProgress } from '@prisma/client';
import { db } from '@/lib/db';
import { CourseProgress } from '@/components/course-progress';
import { CourseSidebarItem } from './CourseSidebarItem';
import dynamic from 'next/dynamic';

// Lazy load the Unenroll button to improve performance
const CourseUnEnrollButton = dynamic(
  () => import('../chapters/[chapterId]/_components/course-unenroll-button'),
  { ssr: false }
);

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseSidebar = async ({
  course,
  progressCount,
}: CourseSidebarProps) => {
  const { userId } = await auth();

  if (!userId) return redirect('/');

  // Fetch purchase and level data in parallel and cache results
  const [purchase, levelData] = await Promise.all([
    db.joined.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
    }),
    db.level.findUnique({
      where: { id: course.levelId! },
    }),
  ]);

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm dark:bg-black dark:text-white">
      {/* Course Header */}
      <div className="p-6 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        <h1 className="font-light text-gray-500 text-sm mt-2">
          {levelData?.name}
        </h1>

        {/* Progress Bar & Unenroll Button */}
        {purchase && (
          <div className="mt-3">
            <CourseProgress value={progressCount} />
            <div className="mt-4">
              <CourseUnEnrollButton courseId={course.id} courseName={course.title} />
            </div>
          </div>
        )}
      </div>

      {/* Instant Tab Switching */}
      <CourseSidebarTabs course={course} purchase={!!purchase} />
    </div>
  );
};

// Client Component for Instant Tabs
const CourseSidebarTabs = ({ course, purchase }: { course: CourseSidebarProps['course']; purchase: boolean }) => {

  return (
    <div className="flex flex-col w-full">
      {course.chapters.map((chapter) => (
        <CourseSidebarItem
          key={chapter.id}
          id={chapter.id}
          label={chapter.title}
          isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
          courseId={course.id}
          isLocked={!chapter.isFree && !purchase}
        />
      ))}
    </div>
  );
};
