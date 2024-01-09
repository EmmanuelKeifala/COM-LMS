import {NextResponse} from 'next/server';
import axios from 'axios';
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.messages && body.messages.length > 0) {
      const latestQuestion = body.messages[body.messages.length - 1].content;
      const response = await axios.post(
        'https://flowiseai-railway-production-1572.up.railway.app/api/v1/prediction/97f0ecf7-0b26-4ffc-8e20-745ed9343b21',
        {
          question: latestQuestion,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const result = await response.data;
      const formattedText = result.text.replace(/\n/g, '<br />');

      return NextResponse.json(formattedText.replace(/"/g, ' '));
    } else {
      return NextResponse.json('Please ask a question');
    }
  } catch (error) {
    console.log('[CHATS_ERROR]', error);
    return new NextResponse('Internal Sever error', {status: 500});
  }
}
