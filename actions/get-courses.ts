import {Category, Course, Level} from '@prisma/client';
import {getProgress} from '@/actions/get-progress';
import {db} from '@/lib/db';
import axios from 'axios';

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: {id: string}[];
  progress: number | null;
  level: Level | null;
};

type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId,
}: GetCourses): Promise<{
  coursesWithProgress: CourseWithProgressWithCategory[];
  userClass: string;
}> => {
  try {
    // Fetch user data
    const userResponse = await fetchUserDetails(userId);
    const userClass = userResponse?.public_metadata?.userClass;

    // Check if userClass is available
    if (!userClass) {
      console.log('No userClass');
      return {coursesWithProgress: [], userClass: ''};
    }

    // Find the Level based on userClass
    const level = await db.level.findUnique({
      where: {
        name: userClass,
      },
    });

    // Check if the level is found
    if (!level) {
      console.log('No Level');
      return {coursesWithProgress: [], userClass: ''};
    }

    // Fetch courses based on levelId
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
          mode: 'insensitive',
        },
        categoryId,
        levelId: level.id,
      },
      include: {
        category: true,
        level: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Fetch progress for each course
    const coursesWithProgress: CourseWithProgressWithCategory[] =
      await Promise.all(
        courses.map(async course => {
          const progressPercentage = await getProgress(userId, course.id);
          return {
            ...course,
            progress: progressPercentage,
          };
        }),
      );
    return {coursesWithProgress, userClass};
  } catch (error) {
    console.error('[GET_COURSES]', error);
    return {coursesWithProgress: [], userClass: ''};
  }
};

// Fetch user details from the API
const fetchUserDetails = async (userId: string) => {
  try {
    const response = await axios.get(
      `https://api.clerk.com/v1/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          Accept: 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};
