import {db} from '@/lib/db';
import {isUploader} from '@/lib/uploader';
import {auth} from '@clerk/nextjs';
import {NextResponse} from 'next/server';

export async function POST(req: Request) {
  try {
    const {userId} = auth();
    const {title} = await req.json();

    if (!userId || !isUploader)
      return new NextResponse('Unauthorized', {status: 401});

    const course = await db.course.create({
      data: {userId, title},
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log('[COURSES]', error);
    return new NextResponse('Internal Error', {status: 500});
  }
}

export async function PATCH(
  req: Request,
  {params}: {params: {courseId: string; chapterId: string}},
) {
  try {
    const {userId} = auth();
    const {videoId, url} = await req.json();
    

    if (!userId || !isUploader) {
      return new NextResponse('Unauthorized', {status: 401});
    }
    const chapterVideo = await db.videoUrl.update({
      where: {
        id: videoId,
      },
      data: {
        videoUrl: url,
      },
    });

    return NextResponse.json(chapterVideo);
  } catch (error) {
    console.error('[VIDEO]', error);
    return new NextResponse('Internal server error', {status: 500});
  }
}
