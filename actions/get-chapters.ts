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
    const cacheStrategy = {swr: 60, ttl: 60};

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
        where: {courseId, isPublished: true, position: {gt: chapter?.position}},
        orderBy: {position: 'asc'},
      });
    }

    return {
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
