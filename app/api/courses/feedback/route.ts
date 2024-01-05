import {db} from '@/lib/db';
import {auth} from '@clerk/nextjs';
import {NextResponse} from 'next/server';

export async function POST(req: Request) {
  try {
    const {userId} = auth();
    const {formData} = await req.json();

    if (!userId) return new NextResponse('Unauthorized', {status: 401});

    const feedback = await db.feedback.create({
      data: {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        feedbackType: formData.feedbackType,
        rate: formData.rate,
      },
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.log('[FEEDBACK]', error);
    return new NextResponse('Internal Error', {status: 500});
  }
}
