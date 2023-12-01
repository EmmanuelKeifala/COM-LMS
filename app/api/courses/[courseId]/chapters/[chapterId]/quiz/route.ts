import {db} from '@/lib/db';
import {isUploader} from '@/lib/uploader';
import {auth} from '@clerk/nextjs';
import {NextResponse} from 'next/server';

export async function POST(
  req: Request,
  {params}: {params: {courseId: string; chapterId: string}},
) {
  try {
    const {userId} = auth();
    const {url} = await req.json();

    if (!userId || !isUploader) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const chapterOwner = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });

    if (!chapterOwner) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const chapterQiuz = await db.chapterQuiz.create({
      data: {
        quizUrl: url,
        chapterId: params.chapterId,
      },
    });

    return NextResponse.json(chapterQiuz);
  } catch (error) {
    console.error('[QUIZ]', error);
    return new NextResponse('Internal server error', {status: 500});
  }
}
