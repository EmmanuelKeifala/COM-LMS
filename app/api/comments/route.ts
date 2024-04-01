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

// {
//   "_id": "drafts.22141859-4c05-4419-b4d4-b358abd73fed",
//   "_type": "Comment",
//   "likes": 0,
//   "replies": [],
//   "post": {
//     "_type": "reference",
//     "_ref": "83372029-e1bf-42ac-8385-da76f82990e2"
//   },
//   "_rev": "55e6d3f8-66eb-4280-b8dc-5abc4a1354f8",
//   "_updatedAt": "2024-03-30T18:00:25.307Z"
// }
