import {db} from '@/lib/db';
import {
  Attachment,
  Chapter,
  ChapterAttachment,
  ChapterQuiz,
  VideoUrl,
} from '@prisma/client';

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const isEnrolled = await db.joined?.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      cacheStrategy: {swr: 60, ttl: 60},
    });

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      },
      cacheStrategy: {swr: 60, ttl: 60},
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
      cacheStrategy: {swr: 60, ttl: 60},
    });

    if (!chapter || !course) {
      throw new Error('Chapter or course not found');
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;
    let chapterAttachment: ChapterAttachment[] = [];
    let videoUrls: VideoUrl[] = [];
    let quizUrls: ChapterQuiz[] = [];

    if (isEnrolled) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
        cacheStrategy: {swr: 60, ttl: 60},
      });
    }
    if (isEnrolled) {
      chapterAttachment = await db.chapterAttachment.findMany({
        where: {
          chapterId: chapterId,
        },
        cacheStrategy: {swr: 60, ttl: 60},
      });
    }
    if (isEnrolled) {
      videoUrls = await db.videoUrl.findMany({
        where: {
          chapterId: chapterId,
        },
        cacheStrategy: {swr: 60, ttl: 60},
      });
    }
    if (isEnrolled) {
      quizUrls = await db.chapterQuiz.findMany({
        where: {
          chapterId: chapterId,
        },
        cacheStrategy: {swr: 60, ttl: 60},
      });
    }

    if (chapter.isFree || isEnrolled) {
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: 'asc',
        },
        cacheStrategy: {swr: 60, ttl: 60},
      });
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      cacheStrategy: {swr: 60, ttl: 60},
    });

    return {
      chapter,
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      isEnrolled,
      chapterAttachment,
      videoUrls,
      quizUrls,
    };
  } catch (error) {
    console.log('[GET_CHAPTER]', error);
    return {
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      isEnrolled: null,
      chapterAttachment: [],
      videoUrls: [],
      quizUrls: [],
    };
  }
};
