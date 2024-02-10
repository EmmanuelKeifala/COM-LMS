import {Category, Chapter, Course, Level} from '@prisma/client';
import cron from 'node-cron';

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
    const websiteUrl = 'https://flowise-3tb2.onrender.com/';
    cron.schedule('*/8 * * * *', async () => {
      try {
        const response = await fetch(websiteUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          console.log(
            `Cron job ran successfully at ${new Date().toLocaleTimeString()}`,
          );
        } else {
          console.error(
            `Error in cron job at ${new Date().toLocaleTimeString()}: ${response.statusText}`,
          );
        }
      } catch (error: any) {
        console.error(
          `Error in cron job at ${new Date().toLocaleTimeString()}: ${error.message}`,
        );
      }
    });

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

    for (let course of courses) {
      const progress = await getProgress(userId, course.id);
      course['progress'] = progress;
    }

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
