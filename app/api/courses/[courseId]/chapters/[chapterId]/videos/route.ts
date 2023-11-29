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
    const {title} = await req.json();

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
    const lastVideo = await db.videoUrl.findFirst({
      where: {
        chapterId: params.chapterId,
      },
      orderBy: {
        position: 'desc',
      },
    });
    const newPosition = lastVideo ? lastVideo?.position + 1 : 1;

    const chapterVideo = await db.videoUrl.create({
      data: {
        videoUrl: title,
        chapterId: params.chapterId,
        position: newPosition,
      },
    });

    return NextResponse.json(chapterVideo);
  } catch (error) {
    console.error('[VIDEO]', error);
    return new NextResponse('Internal server error', {status: 500});
  }
}
