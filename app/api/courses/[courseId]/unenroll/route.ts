// API
import {NextResponse} from 'next/server';
import {currentUser} from '@clerk/nextjs';
import {db} from '@/lib/db';

export async function POST(
  req: Request,
  {params}: {params: {courseId: string; chapterId: string}},
) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return new NextResponse('Course not found', {status: 404});
    }

    const purchase = await db.joined.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      await db.joined.delete({
        where: {
          userId_courseId: {
            courseId: params.courseId,
            userId: user.id,
          },
        },
      });

      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/?success=1`,
      });
    } else {
      return new NextResponse('User is not enrolled in the course', {
        status: 400,
      });
    }
  } catch (error) {
    console.error('[COURSE_UNENROLL]', error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
