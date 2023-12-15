import {auth} from '@clerk/nextjs';
import {Chapter, Course, Level, UserProgress} from '@prisma/client';
import {redirect} from 'next/navigation';

import {db} from '@/lib/db';
import {CourseProgress} from '@/components/course-progress';
import {CourseSidebarItem} from './CourseSidebarItem';

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
  const {userId} = auth();

  if (!userId) {
    return redirect('/');
  }

  const purchase = await db.joined.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  const levelData = await db.level.findUnique({
    where: {
      id: course?.levelId!,
    },
  });

  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
      <div className="p-8 flex flex-col border-b">
        <h1 className="font-semibold">{course.title}</h1>
        <h1 className=" font-light text-gray-500 text-sm mt-3">
          {levelData?.name!}
        </h1>
        {purchase && (
          <div className="mt-3">
            <CourseProgress value={progressCount} />
          </div>
        )}
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map(chapter => (
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
    </div>
  );
};
