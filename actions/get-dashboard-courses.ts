import {Category, Chapter, Course, Level} from '@prisma/client';
import {db} from '@/lib/db';
import {getProgress} from '@/actions/get-progress';

type CourseWithProgressWithCategory = Course & {
  category: Category;
  chapters: Chapter[];
  progress: number | null;
  level: Level | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
  userId: string,
): Promise<DashboardCourses> => {
  try {
    const purchasedCourses = await db.joined.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            level: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    const courseIds = purchasedCourses.map(purchase => purchase.course.id);

    const progressPromises = courseIds.map(courseId =>
      getProgress(userId, courseId),
    );
    const progressResults = await Promise.all(progressPromises);

    const coursesWithProgress: any = purchasedCourses.map(
      (purchase, index) => ({
        ...purchase.course,
        progress: progressResults[index],
      }),
    );

    const completedCourses = coursesWithProgress.filter(
      (course: {progress: number}) => course.progress === 100,
    );
    const coursesInProgress = coursesWithProgress.filter(
      (course: {progress: any}) => (course.progress ?? 0) < 100,
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.error('[GET_DASHBOARD_COURSES]', error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
