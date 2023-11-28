import {auth} from '@clerk/nextjs';
import {NextResponse} from 'next/server';

import {db} from '@/lib/db';

export async function DELETE(
  req: Request,
  {params}: {params: {courseId: string; attachmentId: string}},
) {
  try {
    const {userId} = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    // Check if the attachment exists
    const existingAttachment = await db.chapterAttachment.findUnique({
      where: {
        id: params.attachmentId,
      },
    });

    if (!existingAttachment) {
      return new NextResponse('Attachment not found', {status: 404});
    }

    // Delete the attachment
    const deletedAttachment = await db.chapterAttachment.delete({
      where: {
        id: params.attachmentId,
      },
    });

    return NextResponse.json(deletedAttachment);
  } catch (error) {
    console.log('ATTACHMENT_ID', error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
