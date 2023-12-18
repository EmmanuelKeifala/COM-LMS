import {NextResponse} from 'next/server';
import {TbChevronCompactLeft} from 'react-icons/tb';
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (body.messages && body.messages.length > 0) {
      const latestQuestion = body.messages[body.messages.length - 1].content;
      const response = await fetch(
        // 'https://flowiseai-railway-production-1572.up.railway.app/api/v1/prediction/feef2628-4ec8-4699-b105-26cb2b7748cd',
        'https://flowiseai-railway-production-1572.up.railway.app/api/v1/prediction/97f0ecf7-0b26-4ffc-8e20-745ed9343b21',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({question: latestQuestion}),
        },
      );
      const result = await response.json();
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
