import {auth} from '@clerk/nextjs';
import {NextResponse} from 'next/server';

import {db} from '@/lib/db';

export async function POST(
  req: Request,
  {params}: {params: {courseId: string; chapterId: string}},
) {
  try {
    const {userId} = auth();
    const {...values} = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    // Check if the user has already rated the video
    const existingRating = await db.videoRating.findUnique({
      where: {
        videoId_userId: {
          videoId: values.videoId,
          userId,
        },
      },
    });

    if (existingRating) {
      // User has already rated the video, update the existing rating
      const updatedRating = await db.videoRating.update({
        where: {
          id: existingRating.id,
        },
        data: {
          value: values.value,
        },
      });

      return NextResponse.json(updatedRating);
    } else {
      const newRating = await db.videoRating.create({
        data: {
          videoId: values.videoId,
          userId,
          value: values.value,
        },
      });

      return NextResponse.json(newRating);
    }
  } catch (error) {
    console.log('[VIDEO RATING]', error);
    return new NextResponse('Internal Error', {status: 500});
  }
}

export async function GET(
  req: Request,
  {params}: {params: {courseId: string; chapterId: string}},
) {
  try {
    const {userId} = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', {status: 401});
    }
    // Fetch ratings for a particular videoId
    const videoRatings = await db.videoRating.findMany();

    return NextResponse.json(videoRatings);
  } catch (error) {
    console.log('[VIDEO RATING GETTING]', error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
