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

    const courses = purchasedCourses.map(
      (purchase: any) => purchase.course,
    ) as CourseWithProgressWithCategory[];

    // Use Promise.all to parallelize getProgress calls
    const progressPromises = courses.map(course =>
      getProgress(userId, course.id),
    );
    const progressResults = await Promise.all(progressPromises);

    courses.forEach((course, index) => {
      course['progress'] = progressResults[index];
    });

    const completedCourses = courses.filter(course => course.progress === 100);
    const coursesInProgress = courses.filter(
      course => (course.progress ?? 0) < 100,
    );

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log('[GET_DASHBOARD_COURSES]', error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};
