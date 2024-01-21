import {db} from '@/lib/db';

export const getProgress = async (
  userId: string,
  courseId: string,
): Promise<number> => {
  try {
    const isEnrolled = await db.joined.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
      cacheStrategy: {swr: 60, ttl: 60},
    });

    if (!isEnrolled) {
      return -1;
    }
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
      cacheStrategy: {swr: 60, ttl: 60},
    });

    const publishedChapterIds = publishedChapters.map(chapter => chapter.id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedChapters / publishedChapterIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log('[GET_PROGRESS]', error);
    return 0;
  }
};
