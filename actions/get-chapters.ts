import {db} from '@/lib/db';
import {
  Attachment,
  Chapter,
  ChapterAttachment,
  ChapterQuiz,
  VideoUrl,
} from '@prisma/client';

// Cache object to store frequently accessed data
const cache: {[key: string]: any} = {};

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
    const cacheKey = `${userId}_${courseId}_${chapterId}`;
    const cachedResult = cache[cacheKey];

    if (cachedResult) {
      return cachedResult;
    }

    // Fetch data from database
    const [isEnrolled, course, chapter, userProgress] = await Promise.all([
      db.joined?.findUnique({
        where: {userId_courseId: {userId, courseId}},
      }),
      db.course.findUnique({
        where: {isPublished: true, id: courseId},
      }),
      db.chapter.findUnique({
        where: {id: chapterId, isPublished: true},
      }),
      db.userProgress.findUnique({
        where: {userId_chapterId: {userId, chapterId}},
      }),
    ]);

    if (!chapter || !course) {
      throw new Error('Chapter or course not found');
    }

    let attachments: Attachment[] = [];
    let chapterAttachment: ChapterAttachment[] = [];
    let videoUrls: VideoUrl[] = [];
    let quizUrls: ChapterQuiz[] = [];
    let nextChapter: Chapter | null = null;

    if (isEnrolled) {
      const [attachmentData, chapterAttachmentData, videoUrlData, quizUrlData] =
        await Promise.all([
          db.attachment.findMany({where: {courseId}}),
          db.chapterAttachment.findMany({where: {chapterId}}),
          db.videoUrl.findMany({where: {chapterId}}),
          db.chapterQuiz.findMany({where: {chapterId}}),
        ]);

      attachments = attachmentData;
      chapterAttachment = chapterAttachmentData;
      videoUrls = videoUrlData;
      quizUrls = quizUrlData;
    }

    if (chapter.isFree || isEnrolled) {
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {gt: chapter?.position},
        },
        orderBy: {position: 'asc'},
      });
    }

    const result = {
      chapter,
      course,
      attachments,
      nextChapter,
      userProgress,
      isEnrolled,
      chapterAttachment,
      videoUrls,
      quizUrls,
    };

    // Cache the result
    cache[cacheKey] = result;

    return result;
  } catch (error) {
    console.log('[GET_CHAPTER]', error);
    return {
      chapter: null,
      course: null,
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
