import {auth} from '@clerk/nextjs';
import {NextResponse} from 'next/server';

import {db} from '@/lib/db';

export async function DELETE(
  req: Request,
  {params}: {params: {feedbackId: string}},
) {
  try {
    const {userId} = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', {status: 401});
    }

    // Delete the attachment
    const deletedFeedback = await db.feedback.delete({
      where: {
        id: params.feedbackId,
      },
    });

    return NextResponse.json(deletedFeedback);
  } catch (error) {
    console.log('[FEEDBACK_DELETE]', error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
