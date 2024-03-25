import {db} from '@/lib/db';

export const getProgress = async (
  userId: string,
  courseId: string,
): Promise<number> => {
  try {
    // Check if the user is enrolled in the course
    const isEnrolled = await db.joined.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!isEnrolled) {
      return -1; // User not enrolled, return -1 as progress
    }

    // Fetch all published chapter IDs for the course
    const publishedChapterIds = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    // Fetch count of completed chapters for the user
    const validCompletedChaptersCount = await db.userProgress.count({
      where: {
        userId,
        chapterId: {
          in: publishedChapterIds.map(chapter => chapter.id),
        },
        isCompleted: true,
      },
    });

    // Calculate progress percentage
    const progressPercentage =
      (validCompletedChaptersCount / publishedChapterIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.error('[GET_PROGRESS]', error);
    return 0; // Return 0 in case of errors
  }
};
