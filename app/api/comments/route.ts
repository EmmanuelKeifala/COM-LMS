import {client} from '@/sanity/lib/client';
import {NextResponse} from 'next/server';

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const {content, username, id, userimage} = body;

    if (!username)
      return new NextResponse('No username Please reload', {status: 404});
    await client.create({
      _type: 'Comment',
      content,
      username,

      likes: [],
      replies: [],
      userimage,
      post: {
        _type: 'reference',
        _ref: id,
      },
    });
    return new NextResponse('Success', {status: 200});
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal server error', {status: 500});
  }
}
