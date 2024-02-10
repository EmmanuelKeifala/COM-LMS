import {db} from '@/lib/db';
import {isUploader} from '@/lib/uploader';
import {auth} from '@clerk/nextjs';
import {NextResponse} from 'next/server';
import cron from 'node-cron';
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
    const {videoId, url: newUrl} = await req.json();

    if (!userId || !isUploader) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    // Retrieve the existing video URL
    const existingVideo = await db.videoUrl.findUnique({
      where: {
        id: videoId,
      },
    });

    if (!existingVideo) {
      return new NextResponse('Video not found', {status: 404});
    }

    const oldUrl = existingVideo.videoUrl;

    // Check if the new URL is different from the old URL
    if (oldUrl === newUrl) {
      return NextResponse.json(
        {message: 'New URL must be different from the old URL'},
        {
          status: 400,
        },
      );
    }

    // Update VideoUrl with the new URL
    const updatedVideoUrl = await db.videoUrl.update({
      where: {
        id: videoId,
      },
      data: {
        videoUrl: newUrl,
      },
    });

    // Set isReviewed to true for all related VideoRating records
    await db.videoRating.updateMany({
      where: {
        videoId,
      },
      data: {
        isReviewed: true,
      },
    });

    return NextResponse.json(updatedVideoUrl);
  } catch (error) {
    console.error('[VIDEO]', error);
    return new NextResponse('Internal server error', {status: 500});
  }
}

const websiteUrl = 'https://flowise-3tb2.onrender.com/';
cron.schedule('*/1 * * * *', async () => {
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
